import { ref, set, get, push, serverTimestamp, onValue, Unsubscribe, query, orderByChild, equalTo, update, remove } from 'firebase/database';
import { database } from '../../firebase/config';
import { CreatePlayer, CreateRoom, Player, Room } from '../../types';
import { generateRoomCode } from '../../utils/idGenerator';

/**
 * Get room data from Firebase Realtime Database by roomId
 */
async function getPlayer(
    playerId: string
): Promise<Player | null> {
    try {
        const playerRef = ref(database, `players/${playerId}`);
        const snapshot = await get(playerRef);
        if (!snapshot.exists()) return null;
        return {
            id: playerId,
            ...snapshot.val(),
        };
    } catch (error) {
        console.error('Error getting player data from Firebase:', error);
        throw error;
    }
}

/**
 * Get room data from Firebase Realtime Database by hostId
 */
// async function getRoomByHostId(
//     hostId: string
// ): Promise<Room | null> {
//     try {
//         const roomsRef = ref(database, 'rooms');
//         const roomQuery = query(roomsRef, orderByChild('hostId'), equalTo(hostId));
//         const snapshot = await get(roomQuery);

//         if (!snapshot.exists()) return null;

//         // Get first room (most recent one) if multiple exist
//         const rooms = snapshot.val();
//         const firstRoomKey = Object.keys(rooms)[0];

//         return {
//             id: firstRoomKey,
//             ...rooms[firstRoomKey],
//         };
//     } catch (error) {
//         console.error('Error getting room by hostId from Firebase:', error);
//         throw error;
//     }
// }

/**
 * Subscribe to real-time room data updates
 */
// function subscribeToRoom(
//     roomId: string,
//     callback: (room: Room | null) => void
// ): Unsubscribe {
//     const roomRef = ref(database, `rooms/${roomId}`);

//     return onValue(roomRef, (snapshot) => {
//         if (!snapshot.exists()) {
//             callback(null);
//             return;
//         }

//         const data = {
//             id: roomId,
//             ...snapshot.val(),
//         };
//         callback(data);
//     });
// }

/**
 * Create a new room
 */
async function createPlayer(
    playerPayload: CreatePlayer
): Promise<string> {
    console.log('🚀 ~ createPlayer ~ playerPayload:', playerPayload)
    try {
        const playerRef = push(ref(database, `players`));
        await set(playerRef, playerPayload);
        return playerRef.key!;
    } catch (error) {
        console.error('Error creating player in Firebase:', error);
        throw error;
    }
}

async function updatePlayer(
    playerId: string,
    playerPayload: Partial<CreatePlayer>
): Promise<string> {
    try {
        const playerRef = ref(database, `players/${playerId}`);
        await update(playerRef, playerPayload);
        return playerId!;
    } catch (error) {
        console.error('Error creating player in Firebase:', error);
        throw error;
    }
}

async function deletePlayer(
    playerId: string
): Promise<string> {
    try {
        const playerRef = ref(database, `players/${playerId}`);
        await remove(playerRef);
        return playerId!;
    } catch (error) {
        console.error('Error creating player in Firebase:', error);
        throw error;
    }
}

/**
 * Check if a room exists in Firebase Realtime Database
 */
// async function checkRoomInFirebase(
//     roomId: string
// ): Promise<string> {
//     try {
//         const roomRef = ref(database, `rooms/${roomId}`);
//         const snapshot = await get(roomRef);
//         return snapshot.exists() ? roomId : '';
//     } catch (error) {
//         console.error('Error checking room in Firebase:', error);
//         throw error;
//     }
// }

/**
 * Update room
 */
// async function updateRoom(
//     roomPayload: Room
// ): Promise<string> {
//     try {
//         const roomRef = ref(database, `rooms/${roomPayload.id}`);
//         await set(roomRef, roomPayload);
//         return roomPayload.id;
//     } catch (error) {
//         console.error('Error updating room in Firebase:', error);
//         throw error;
//     }
// }

/**
 * Join room
 */
// async function joinRoom(
//     roomId: string,
//     playerPayload: Player
// ): Promise<string> {
//     try {
//         const { id, ...playerNoId } = playerPayload;
//         const roomRef = ref(database, `rooms/${roomId}/players/${id}`);
//         await set(roomRef, playerNoId);
//         return playerPayload.id;
//     } catch (error) {
//         console.error('Error updating room in Firebase:', error);
//         throw error;
//     }
// }


const playerService = {
    getPlayer,
    createPlayer,
    updatePlayer,
    deletePlayer
};

export default playerService;