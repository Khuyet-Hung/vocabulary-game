import { ref, set, get, push, serverTimestamp, onValue, Unsubscribe, query, orderByChild, equalTo, update, remove } from 'firebase/database';
import { database } from '../../firebase/config';
import { CreateGame, CreatePlayer, CreateRoom, Game, Player, Room } from '../../types';
import { generateRoomCode } from '../../utils/idGenerator';

async function listGames(
): Promise<Game[] | null> {
    try {
        const gamesRef = ref(database, `games`);
        const snapshot = await get(gamesRef);
        if (!snapshot.exists()) return null;
        const gamesData = snapshot.val();
        const games: Game[] = Object.keys(gamesData).map((key) => ({
            id: key,
            ...gamesData[key],
        }));
        return games;
    } catch (error) {
        console.error('Error listing games from Firebase:', error);
        throw error;
    }
}

async function getGame(
    gameId: string
): Promise<Game | null> {
    try {
        const gameRef = ref(database, `games/${gameId}`);
        const snapshot = await get(gameRef);
        if (!snapshot.exists()) return null;
        return {
            id: gameId,
            ...snapshot.val(),
        };
    } catch (error) {
        console.error('Error getting game data from Firebase:', error);
        throw error;
    }
}

async function createGame(
    gamePayload: CreateGame
): Promise<string> {
    try {
        const gameRef = push(ref(database, `games`));
        await set(gameRef, gamePayload);
        return gameRef.key!;
    } catch (error) {
        console.error('Error creating game in Firebase:', error);
        throw error;
    }
}

async function updateGame(
    gamePayload: Partial<Game>
): Promise<string> {
    try {
        const { id: gameId } = gamePayload;
        const gameRef = ref(database, `games/${gameId}`);
        await update(gameRef, gamePayload);
        return gameId!;
    } catch (error) {
        console.error('Error updating game in Firebase:', error);
        throw error;
    }
}

async function deleteGame(
    gameId: string
): Promise<string> {
    try {
        const gameRef = ref(database, `games/${gameId}`);
        await remove(gameRef);
        return gameId!;
    } catch (error) {
        console.error('Error deleting game in Firebase:', error);
        throw error;
    }
}


const gameService = {
    getGame,
    createGame,
    updateGame,
    deleteGame,
    listGames,
};

export default gameService;