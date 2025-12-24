import Papa from 'papaparse';
import { Word } from '../types';

/**
 * Convert Google Sheets share URL to CSV export URL
 */
export function convertToCSVUrl(shareUrl: string): string {
  // From: https://docs.google.com/spreadsheets/d/SHEET_ID/edit#gid=0
  // To: https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0

  const sheetIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (!sheetIdMatch) {
    throw new Error('Invalid Google Sheets URL');
  }

  const sheetId = sheetIdMatch[1];
  const gidMatch = shareUrl.match(/gid=([0-9]+)/);
  const gid = gidMatch ? gidMatch[1] : '0';

  return `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
}

/**
 * Import words from Google Sheets
 */
export async function importFromGoogleSheets(
  sheetUrl: string
): Promise<Word[]> {
  try {
    const csvUrl = convertToCSVUrl(sheetUrl);

    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch Google Sheets data');
    }

    const csvText = await response.text();

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim().toLowerCase(),
        complete: (results: Papa.ParseResult<Word>) => {
          const words = results.data.filter((row) =>
            row.word && row.meaning
          );
          resolve(words);
        },
        error: (error: Error) => {
          reject(new Error(`Parse error: ${error.message}`));
        }
      });
    });
  } catch (error) {
    console.error('Error importing from Google Sheets:', error);
    throw error;
  }
}

/**
 * Validate imported words
 */
export function validateWords(words: Word[]): {
  valid: Word[];
  invalid: Array<{ row: number; reason: string }>;
} {
  const valid: Word[] = [];
  const invalid: Array<{ row: number; reason: string }> = [];

  words.forEach((word, index) => {
    if (!word.word || word.word.trim() === '') {
      invalid.push({ row: index + 2, reason: 'Missing word' });
      return;
    }

    if (!word.meaning || word.meaning.trim() === '') {
      invalid.push({ row: index + 2, reason: 'Missing meaning' });
      return;
    }
    valid.push({
      ...word,
      word: word.word.trim(),
      meaning: word.meaning.trim(),
      example: word.example?.trim(),
      category: word.category?.trim(),
      difficulty: word.difficulty || 'medium'
    });
  });

  return { valid, invalid };
}