import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import React from 'react';
import roomsService from '../services/roomService';
import { Player, CreateRoom, CreatePlayer } from '../../types';
import playerService from '../services/playerService';
import { useDetailRoom } from './useRoom';

// Query keys factory
export const playerKeys = {
    all: ['player'] as const,
    detail: (playerId: string) => [...playerKeys.all, 'detail', playerId] as const,
};

// Hook to fetch player details
export function usePlayer(playerId: string | null) {
    return useQuery<Player | null, Error>({
        queryKey: playerKeys.detail(playerId || ''),
        queryFn: async () => {
            if (!playerId) return null;
            return await playerService.getPlayer(playerId);
        },
        enabled: !!playerId,
    });
}

export function useCreatePlayer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (playerPayload: CreatePlayer) => {
            return await playerService.createPlayer(playerPayload);
        },
        onSuccess: (playerId) => {
            queryClient.invalidateQueries({
                queryKey: playerKeys.detail(playerId)
            });
        },
    });
}

export function useUpdatePlayer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            playerId,
            playerPayload,
        }: {
            playerId: string;
            playerPayload: Partial<CreatePlayer>;
        }) => {
            return await playerService.updatePlayer(playerId, playerPayload);
        },
        onSuccess: (playerId) => {
            queryClient.invalidateQueries({
                queryKey: playerKeys.detail(playerId)
            });
        },
    });
}

export function useDeletePlayer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (playerId: string) => {
            return await playerService.deletePlayer(playerId);
        },
        onSuccess: (playerId) => {
            queryClient.invalidateQueries({
                queryKey: playerKeys.detail(playerId)
            });
        },
    });
}

export function useRoomAndPlayers(roomId: string | null) {
    // 1. Lấy dữ liệu phòng bằng hook useRoom đã có
    const {
        data: room,
        isLoading: isRoomLoading,
        isError: isRoomError,
        error: roomError
    } = useDetailRoom(roomId);

    // 2. Trích xuất danh sách playerIds từ dữ liệu phòng
    const playerIds = Object.keys(room?.players || {});

    // 3. Sử dụng useQueries để fetch chi tiết của tất cả người chơi song song
    //    Mỗi query con sẽ chỉ được kích hoạt nếu có playerId hợp lệ và phòng đã được tải
    const playerQueries = playerIds.map(playerId => ({
        queryKey: playerKeys.detail(playerId),
        queryFn: () => playerService.getPlayer(playerId),
        enabled: !!room && !!playerId, // Query này chỉ chạy khi phòng đã load và có playerId
        // staleTime cho người chơi:
        // - Nếu bạn có subscription real-time cho từng người chơi: Infinity
        // - Nếu không, hãy đặt một giá trị hợp lý (ví dụ: 5 phút) để cho phép cache
        staleTime: 5 * 60 * 1000, // Ví dụ: 5 phút
    }));

    const playerResults = useQueries({ queries: playerQueries });

    // 4. Tổng hợp trạng thái loading và error, và trích xuất dữ liệu người chơi
    const arePlayersLoading = playerResults.some(result => result.isLoading);
    const arePlayersError = playerResults.some(result => result.isError);
    const playersError = playerResults.find(result => result.isError)?.error;

    // Lọc ra các kết quả null/undefined và ép kiểu về Player[]
    const players = playerResults
        .map(result => result.data)
        .filter((player): player is Player => player !== null && player !== undefined);

    return {
        room,
        players,
        // Trạng thái tổng hợp
        isLoading: isRoomLoading || arePlayersLoading,
        isError: isRoomError || arePlayersError,
        error: roomError || playersError,
        // Có thể trả về các trạng thái loading/error riêng biệt nếu cần hiển thị chi tiết hơn
        isRoomLoading,
        arePlayersLoading,
        roomError,
        playersError,
    };
}
