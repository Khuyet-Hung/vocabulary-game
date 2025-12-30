import { Word, Question } from '../types';

/**
 * Generate multiple choice question
 */
export function generateMultipleChoiceQuestion(
  targetWord: Word,
  allWords: Word[]
): Question {
  // Get 3 random wrong answers
  const wrongWords = allWords
    .filter((w) => w.id !== targetWord.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  // Combine with correct answer
  const options = [
    targetWord.meaning,
    ...wrongWords.map((w) => w.meaning)
  ];

  // Shuffle options
  const shuffledOptions = options.sort(() => Math.random() - 0.5);

  return {
    id: `q_${targetWord.id}`,
    word: targetWord,
    options: shuffledOptions,
    correctAnswer: targetWord.meaning,
    type: 'multiple-choice'
  };
}

/**
 * Generate fill in the blank question
 */
export function generateFillBlankQuestion(word: Word): Question {
  const sentence = word.example || `Use the word "${word.word}" in a sentence.`;
  const blankedSentence = sentence.replace(
    new RegExp(word.word, 'gi'),
    '______'
  );

  return {
    id: `q_${word.id}`,
    word: { ...word, example: blankedSentence },
    options: [],
    correctAnswer: word.word,
    type: 'fill-blank'
  };
}

/**
 * Generate flashcard
 */
export function generateFlashcard(word: Word): Question {
  return {
    id: `q_${word.id}`,
    word,
    options: [],
    correctAnswer: word.meaning,
    type: 'flashcard'
  };
}

/**
 * Generate questions based on game mode
 */
export function generateQuestions(
  words: Word[],
  gameCode: string,
  count: number
): Question[] {
  const selectedWords = words.slice(0, count);

  switch (gameCode) {
    case 'multiple-choice':
      return selectedWords.map((word) =>
        generateMultipleChoiceQuestion(word, words)
      );

    case 'fill-blank':
      return selectedWords
        .filter((word) => word.example)
        .map((word) => generateFillBlankQuestion(word));

    case 'flashcard':
      return selectedWords.map((word) => generateFlashcard(word));

    default:
      return [];
  }
}