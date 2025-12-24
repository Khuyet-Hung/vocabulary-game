'use client';

import { useState } from 'react';
import {
  importFromGoogleSheets,
  validateWords,
} from '@/lib/utils/sheetsImport';
import {
  saveWordsToFirebase,
  getWordsFromFirebase,
} from '@/lib/firebase/wordsService';
// import { Button } from '@/components/ui/Button';
import { Word } from '@/lib/types';

export default function TestServicesPage() {
  const [sheetUrl, setSheetUrl] = useState('');
  const [status, setStatus] = useState('');
  const [words, setWords] = useState<Word[]>([]);

  const handleImport = async () => {
    try {
      setStatus('Importing...');
      const importedWords = await importFromGoogleSheets(sheetUrl);
      const { valid, invalid } = validateWords(importedWords);

      setStatus(`Imported ${valid.length} words, ${invalid.length} invalid`);
      setWords(valid);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleSaveToFirebase = async () => {
    try {
      setStatus('Saving to Firebase...');
      await saveWordsToFirebase(words);
      setStatus('✅ Saved to Firebase!');
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const handleLoadFromFirebase = async () => {
    try {
      setStatus('Loading from Firebase...');
      const loadedWords = await getWordsFromFirebase();
      setWords(loadedWords);
      setStatus(`✅ Loaded ${loadedWords.length} words from Firebase`);
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <>
      Test Services Google Sheets URL:
      <input
        type="text"
        value={sheetUrl}
        onChange={(e) => setSheetUrl(e.target.value)}
        placeholder="https://docs.google.com/spreadsheets/d/..."
        className="w-full px-4 py-2 border rounded-lg"
      />
      <button
        onClick={handleImport}
        className="m-2 p-2 bg-blue-500 text-white rounded"
      >
        Import from Google Sheets
      </button>
      <button
        onClick={handleSaveToFirebase}
        className="m-2 p-2 bg-green-500 text-white rounded"
      >
        Save to Firebase
      </button>
      <button
        onClick={handleLoadFromFirebase}
        className="m-2 p-2 bg-yellow-500 text-white rounded"
      >
        Load from Firebase
      </button>
      {status && <div>{status}</div>}
      {words.length > 0 && (
        <>
          Words ({words.length}):
          {words.map((word, i) => (
            <div key={i}>
              {word.word} - {word.meaning}
              {word.example && <> (e.g., {word.example})</>}
            </div>
          ))}
        </>
      )}
    </>
  );
}
