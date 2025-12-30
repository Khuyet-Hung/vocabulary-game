'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Camera } from 'lucide-react';

export default function QRScannerPage() {
  const router = useRouter();
  const [cameraError, setCameraError] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleScan = (result: any) => {
    if (!result || result.length === 0 || isProcessing) return;

    const scannedValue = result[0].rawValue;

    // Kiểm tra xem có phải link hợp lệ không
    if (!isValidUrl(scannedValue)) {
      toast.error('Mã QR không hợp lệ', {
        description: 'Vui lòng quét lại một mã QR chứa link hợp lệ',
      });
      return;
    }

    setIsProcessing(true);
    toast.success('Quét thành công!');

    router.push(scannedValue);
  };

  const handleScanError = (error: any) => {
    console.error('Scanner error:', error);

    // Xử lý lỗi camera
    if (error?.name === 'NotAllowedError') {
      setCameraError(
        'Không được phép truy cập camera. Vui lòng kiểm tra quyền truy cập.'
      );
      toast.error('Camera bị từ chối', {
        description: 'Vui lòng cấp quyền truy cập camera trong cài đặt',
      });
    } else if (error?.name === 'NotFoundError') {
      setCameraError('Không tìm thấy camera trên thiết bị của bạn.');
      toast.error('Không có camera', {
        description: 'Thiết bị của bạn không có camera',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      <Header />

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quét mã QR</h1>
          <p className="text-gray-600">Đặt mã QR vào khung để quét</p>
        </div>

        {/* Error State */}
        {cameraError ? (
          <Card className="bg-red-50 border-red-200 shadow-md p-6 mb-6">
            <div className="flex gap-3">
              <AlertCircle
                className="text-red-600 flex-shrink-0 mt-1"
                size={24}
              />
              <div>
                <p className="font-semibold text-red-800 mb-1">Lỗi camera</p>
                <p className="text-red-700 text-sm">{cameraError}</p>
              </div>
            </div>
          </Card>
        ) : (
          <>
            {/* Scanner Card */}
            <Card className="overflow-hidden shadow-lg mb-6 border-2 border-blue-200">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-square">
                <Scanner onScan={handleScan} onError={handleScanError} />
              </div>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200 p-4 flex gap-3">
              <Camera className="text-blue-600 flex-shrink-0" size={20} />
              <p className="text-sm text-blue-800">
                Vui lòng không di chuyển quá nhanh. Chúng tôi sẽ tự động chuyển
                hướng sau khi quét thành công.
              </p>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
