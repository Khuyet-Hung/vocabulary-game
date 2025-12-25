import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import React from 'react';
import roomsService from '../services/roomsService';
import { Room, Player, CreateRoom } from '../../types';

// Query keys factory
export const roomKeys = {
    all: ['rooms'] as const,
    detail: (roomId: string) => [...roomKeys.all, 'detail', roomId] as const,
    byHost: (hostId: string) => [...roomKeys.all, 'byHost', hostId] as const,
};

// Hooks for room queries by roomId
export function useRoom(roomId: string | null) {
    const queryClient = useQueryClient();

    useEffect(() => {
        if (!roomId) return;

        // Subscribe to real-time updates
        const unsubscribe = roomsService.subscribeToRoom(roomId, (room) => {
            queryClient.setQueryData(roomKeys.detail(roomId), room);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [roomId, queryClient]);

    return useQuery<Room | null, Error>({
        queryKey: roomKeys.detail(roomId || ''),
        queryFn: async () => {
            if (!roomId) return null;
            return await roomsService.getRoomData(roomId);
        },
        enabled: !!roomId,
        staleTime: Infinity, // Don't refetch since we have real-time updates
    });
}

export function useCreateRoom() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roomPayload: CreateRoom) => {
            return await roomsService.createRoom(roomPayload);
        },
        onSuccess: (roomId) => {
            queryClient.invalidateQueries({
                queryKey: roomKeys.detail(roomId)
            });
        },
    });
}

// export function useJoinRoom() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({
//             roomId,
//             player,
//         }: {
//             roomId: string;
//             player: Player;
//         }) => {
//             return await roomsService.joinRoom(roomId, player);
//         },
//         onSuccess: (_, { roomId }) => {
//             queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });
//         },
//     });
// }

// export function useLeaveRoom() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({
//             roomId,
//             playerId,
//         }: {
//             roomId: string;
//             playerId: string;
//         }) => {
//             return await roomsService.removePlayerFromRoom(roomId, playerId);
//         },
//         onSuccess: (_, { roomId }) => {
//             queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });
//         },
//     });
// }

// export function useUpdatePlayerReady() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({
//             roomId,
//             playerId,
//             isReady,
//         }: {
//             roomId: string;
//             playerId: string;
//             isReady: boolean;
//         }) => {
//             return await roomsService.updatePlayerReady(roomId, playerId, isReady);
//         },
//         onSuccess: (_, { roomId }) => {
//             queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });
//         },
//     });
// }

// export function useUpdatePlayerScore() {
//     const queryClient = useQueryClient();

//     return useMutation({
//         mutationFn: async ({
//             roomId,
//             playerId,
//             points,
//         }: {
//             roomId: string;
//             playerId: string;
//             points: number;
//         }) => {
//             return await roomsService.updatePlayerScore(roomId, playerId, points);
//         },
//         onSuccess: (_, { roomId }) => {
//             queryClient.invalidateQueries({ queryKey: roomKeys.detail(roomId) });
//         },
//     });
// }
