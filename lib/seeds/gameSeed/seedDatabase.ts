import { database } from '../../firebase/config';
import { ref, get, set } from 'firebase/database';
import gameService from '../../api/services/gameService';
import { GAMES } from './gameSeeds';

const isSeedExitted = async (): Promise<boolean> => {
    try {
        const gameRef = ref(database, `games`);
        const snapshot = await get(gameRef);
        return snapshot.exists();
    } catch (error) {
        console.error('Error checking if games seeded:', error);
        return false;
    }
}

/**
 * Seed games to database on first run
 */
export async function seedGames(): Promise<void> {
    try {
        const exists = await isSeedExitted();
        if (exists) {
            console.log('✓ Games already seeded. Skipping seeding.');
            return;
        }
        for (const key in GAMES) {
            const gamePayload = GAMES[key];
            const gameRef = ref(database, `games/${key}`);
            await set(gameRef, gamePayload);
        }

        console.log('✓ Seed games completed!');
    } catch (error) {
        console.error('Error seeding games:', error);
    }
}
