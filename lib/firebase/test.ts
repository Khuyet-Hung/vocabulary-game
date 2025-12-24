import { ref, set, get } from 'firebase/database';
import { database } from './config';

export async function testFirebaseConnection() {
  try {
    const testRef = ref(database, 'test');
    await set(testRef, { 
      message: 'Hello from Firebase!',
      timestamp: Date.now()
    });
    
    const snapshot = await get(testRef);
    console.log('Firebase test:', snapshot.val());
    return true;
  } catch (error) {
    console.error('Firebase error:', error);
    return false;
  }
}