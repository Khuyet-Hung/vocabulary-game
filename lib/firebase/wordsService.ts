import { ref, set, get, push } from 'firebase/database';
import { database } from './config';
import { Word } from '../types';

/**
 * Save words to Firebase
 */
export async function saveWordsToFirebase(
  words: Word[],
  category: string = 'default'
): Promise<void> {
  try {
    const wordsRef = ref(database, `words/${category}`);

    // Convert to Word format with IDs
    const wordsData: Record<string, Word> = {};
    words.forEach((word) => {
      const id = `word_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      wordsData[id] = {
        id,
        word: word.word,
        meaning: word.meaning,
        example: word.example,
        category: word.category || category,
        difficulty: word.difficulty || 'medium'
      };
    });

    await set(wordsRef, wordsData);
  } catch (error) {
    console.error('Error saving words to Firebase:', error);
    throw error;
  }
}

/**
 * Get words from Firebase
 */
export async function getWordsFromFirebase(
  category: string = 'default'
): Promise<Word[]> {
  try {
    const wordsRef = ref(database, `words/${category}`);
    const snapshot = await get(wordsRef);

    if (!snapshot.exists()) {
      return [];
    }

    const wordsData = snapshot.val();
    return Object.values(wordsData);
  } catch (error) {
    console.error('Error getting words from Firebase:', error);
    throw error;
  }
}

/**
 * Get words by difficulty
 */
export async function getWordsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard',
  category: string = 'default'
): Promise<Word[]> {
  const allWords = await getWordsFromFirebase(category);
  return allWords.filter((word) => word.difficulty === difficulty);
}

/**
 * Get random words
 */
export function getRandomWords(words: Word[], count: number): Word[] {
  const shuffled = [...words].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}