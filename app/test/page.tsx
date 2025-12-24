'use client';

import { useEffect, useState } from 'react';
import { testFirebaseConnection } from '@/lib/firebase/test';

export default function TestPage() {
  const [status, setStatus] = useState('Testing...');

  useEffect(() => {
    testFirebaseConnection().then((success) => {
      setStatus(success ? '✅ Firebase Connected!' : '❌ Firebase Error');
    });
  }, []);

  return (
    <>
        Firebase Connection Test
        {status}    
    </>
  );
}