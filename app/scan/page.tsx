'use client';

import { Scanner } from '@yudiel/react-qr-scanner';
import { useState } from 'react';

export default function QRScannerPage() {
  const [data, setData] = useState<string>('Chưa có dữ liệu');

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h1>Quét mã QR</h1>

      <div
        style={{
          border: '2px solid #ccc',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <Scanner
          onScan={(result) => {
            if (result && result.length > 0) {
              setData(result[0].rawValue);
            }
          }}
          onError={(error) => console.log(error)}
        />
      </div>

      <div
        style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}
      >
        <strong>Kết quả:</strong> {data}
      </div>
    </div>
  );
}
