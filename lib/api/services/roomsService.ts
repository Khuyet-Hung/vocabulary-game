import { ref, set, get, push, serverTimestamp, onValue, Unsubscribe, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../firebase/config';
import { CreateRoom, GameSettings, Room } from '../../types';
import { generateRoomCode } from '../../utils/idGenerator';

/**
 * Get room data from Firebase Realtime Database by roomId
 */
async function getRoomData(
    roomId: string
): Promise<Room | null> {
    try {
        const roomRef = ref(database, `rooms/${roomId}`);
        const snapshot = await get(roomRef);
        if (!snapshot.exists()) return null;
        return {
            id: roomId,
            ...snapshot.val(),
        };
    } catch (error) {
        console.error('Error getting room data from Firebase:', error);
        throw error;
    }
}

/**
 * Get room data from Firebase Realtime Database by hostId
 */
async function getRoomByHostId(
    hostId: string
): Promise<Room | null> {
    try {
        const roomsRef = ref(database, 'rooms');
        const roomQuery = query(roomsRef, orderByChild('hostId'), equalTo(hostId));
        const snapshot = await get(roomQuery);

        if (!snapshot.exists()) return null;

        // Get first room (most recent one) if multiple exist
        const rooms = snapshot.val();
        const firstRoomKey = Object.keys(rooms)[0];

        return {
            id: firstRoomKey,
            ...rooms[firstRoomKey],
        };
    } catch (error) {
        console.error('Error getting room by hostId from Firebase:', error);
        throw error;
    }
}

/**
 * Subscribe to real-time room data updates
 */
function subscribeToRoom(
    roomId: string,
    callback: (room: Room | null) => void
): Unsubscribe {
    const roomRef = ref(database, `rooms/${roomId}`);

    return onValue(roomRef, (snapshot) => {
        if (!snapshot.exists()) {
            callback(null);
            return;
        }

        const data = {
            id: roomId,
            ...snapshot.val(),
        };
        callback(data);
    });
}

/**
 * Create a new room
 */
async function createRoom(
    roomPayload: CreateRoom
): Promise<string> {
    try {
        const roomId = generateRoomCode();
        const roomRef = ref(database, `rooms/${roomId}`);
        const roomData: CreateRoom = {
            ...roomPayload,
            createdAt: serverTimestamp(),
        };

        await set(roomRef, roomData);
        return roomId;
    } catch (error) {
        console.error('Error creating room in Firebase:', error);
        throw error;
    }
}

/**
 * Check if a room exists in Firebase Realtime Database
 */
async function checkRoomInFirebase(
    roomId: string
): Promise<string> {
    try {
        const roomRef = ref(database, `rooms/${roomId}`);
        const snapshot = await get(roomRef);
        return snapshot.exists() ? roomId : '';
    } catch (error) {
        console.error('Error checking room in Firebase:', error);
        throw error;
    }
}

const roomsService = {
    getRoomData,
    getRoomByHostId,
    subscribeToRoom,
    createRoom,
    checkRoomInFirebase,
};

export default roomsService;