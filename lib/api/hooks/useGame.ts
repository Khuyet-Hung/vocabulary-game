import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Game, CreateGame } from '../../types';
import gameService from '../services/gameService';

// Query keys factory
export const gameKeys = {
    all: ['game'] as const,
    list: () => [...gameKeys.all, 'list'] as const,
    detail: (gameId: string) => [...gameKeys.all, 'detail', gameId] as const,
};

export function useListGame() {
    return useQuery<Game[], Error>({
        queryKey: gameKeys.list(),
        queryFn: async () => {
            const games = await gameService.listGames();
            return games || [];
        },
    });
}

export function useDetailGame(gameId: string | null) {
    return useQuery<Game | null, Error>({
        queryKey: gameKeys.detail(gameId || ''),
        queryFn: async () => {
            if (!gameId) return null;
            return await gameService.getGame(gameId);
        },
        enabled: !!gameId,
    });
}

export function useCreateGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (gamePayload: CreateGame) => {
            return await gameService.createGame(gamePayload);
        },
        onSuccess: (gameId) => {
            queryClient.invalidateQueries({
                queryKey: gameKeys.detail(gameId)
            });
        },
    });
}

export function useUpdateGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (gamePayload: Partial<Game>) => {
            return await gameService.updateGame(gamePayload);
        },
        onSuccess: (gameId) => {
            queryClient.invalidateQueries({
                queryKey: gameKeys.detail(gameId)
            });
        },
    });
}

export function useDeleteGame() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (gameId: string) => {
            return await gameService.deleteGame(gameId);
        },
        onSuccess: (gameId) => {
            queryClient.invalidateQueries({
                queryKey: gameKeys.detail(gameId)
            });
        },
    });
}

