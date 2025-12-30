export interface Player {
    id: string;
    name: string;
    // avatar?: string;
}

export type CreatePlayer = Omit<Player, 'id'>;