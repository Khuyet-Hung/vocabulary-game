'use client';

import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Clock,
  MessageSquare,
} from 'lucide-react';

export default function ComponentTestPage() {
  // 1. Default Toast
  const handleDefault = () => {
    toast('Đây là thông báo mặc định', {
      description: 'Mô tả chi tiết cho thông báo',
    });
  };

  // 2. Success Toast
  const handleSuccess = () => {
    toast.success('Thành công!', {
      description: 'Hoạt động đã được hoàn thành thành công',
      duration: 4000,
    });
  };

  // 3. Error Toast
  const handleError = () => {
    toast.error('Đã xảy ra lỗi!', {
      description: 'Vui lòng thử lại hoặc liên hệ với hỗ trợ',
      duration: 5000,
    });
  };

  // 4. Loading Toast
  const handleLoading = () => {
    toast.loading('Đang tải...', {
      description: 'Vui lòng chờ',
    });
  };

  // 5. Info Toast
  const handleInfo = () => {
    toast.info('Thông tin quan trọng', {
      description: 'Đây là một thông báo thông tin',
    });
  };

  // 6. Warning Toast
  const handleWarning = () => {
    toast.warning('Cảnh báo!', {
      description: 'Bạn cần chú ý điều này',
    });
  };

  // 7. Toast with Action
  const handleWithAction = () => {
    toast('Bạn có chắc không?', {
      description: 'Hành động này không thể hoàn tác',
      action: {
        label: 'Xác nhận',
        onClick: () => {
          toast.success('Đã xác nhận');
        },
      },
    });
  };

  // 8. Toast with Cancel
  const handleWithCancel = () => {
    toast('Thông báo với nút hủy', {
      description: 'Bạn có thể hủy hành động này',
      cancel: {
        label: 'Hủy',
        onClick: () => {
          toast.info('Đã hủy');
        },
      },
    });
  };

  // 9. Promise Toast
  const handlePromise = () => {
    const myPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve('Hoàn thành!');
      }, 2000);
    });

    toast.promise(myPromise, {
      loading: 'Đang xử lý...',
      success: 'Hoàn thành thành công!',
      error: 'Có lỗi xảy ra',
    });
  };

  // 10. Custom Position (Top)
  const handlePositionTop = () => {
    toast('Thông báo ở phía trên', {
      position: 'top-center',
    });
  };

  // 11. Custom Position (Bottom)
  const handlePositionBottom = () => {
    toast('Thông báo ở phía dưới', {
      position: 'bottom-center',
    });
  };

  // 12. Long Duration
  const handleLongDuration = () => {
    toast('Thông báo lâu dài', {
      description: 'Thông báo này sẽ hiển thị lâu hơn',
      duration: 10000,
    });
  };

  // 13. Dismissible
  const handleDismissible = () => {
    toast('Bạn có thể đóng thông báo này', {
      action: {
        label: 'Đóng',
        onClick: () => {},
      },
    });
  };

  // 14. Custom Icon
  const handleCustomIcon = () => {
    toast('Thông báo tùy chỉnh', {
      icon: '🎉',
      description: 'Với emoji tùy chỉnh',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-20">
      <Header />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Test Sonner Toast
          </h1>
          <p className="text-gray-600">
            Nhấn các nút dưới để test từng loại thông báo
          </p>
        </div>

        {/* Basic Toasts */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MessageSquare size={24} className="text-blue-600" />
            Thông báo cơ bản
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleDefault}
              variant="outline"
              className="w-full"
            >
              Default
            </Button>
            <Button
              onClick={handleSuccess}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Success
            </Button>
            <Button
              onClick={handleError}
              variant="outline"
              className="w-full border-red-500 text-red-600 hover:bg-red-50"
            >
              Error
            </Button>
            <Button
              onClick={handleLoading}
              variant="outline"
              className="w-full"
            >
              Loading
            </Button>
            <Button onClick={handleInfo} variant="outline" className="w-full">
              Info
            </Button>
            <Button
              onClick={handleWarning}
              variant="outline"
              className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
            >
              Warning
            </Button>
          </div>
        </Card>

        {/* Toasts with Actions */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle size={24} className="text-green-600" />
            Thông báo với hành động
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWithAction}
              variant="outline"
              className="w-full"
            >
              Với Action
            </Button>
            <Button
              onClick={handleWithCancel}
              variant="outline"
              className="w-full"
            >
              Với Cancel
            </Button>
            <Button
              onClick={handlePromise}
              variant="outline"
              className="w-full"
            >
              Promise
            </Button>
            <Button
              onClick={handleCustomIcon}
              variant="outline"
              className="w-full"
            >
              Custom Icon
            </Button>
          </div>
        </Card>

        {/* Position Tests */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <AlertCircle size={24} className="text-yellow-600" />
            Vị trí thông báo
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handlePositionTop}
              variant="outline"
              className="w-full"
            >
              Trên cùng
            </Button>
            <Button
              onClick={handlePositionBottom}
              variant="outline"
              className="w-full"
            >
              Dưới cùng
            </Button>
          </div>
        </Card>

        {/* Duration Tests */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Clock size={24} className="text-purple-600" />
            Thời gian hiển thị
          </h2>
          <div className="grid grid-cols-1 gap-3">
            <Button
              onClick={handleLongDuration}
              variant="outline"
              className="w-full"
            >
              Hiển thị lâu (10 giây)
            </Button>
            <Button
              onClick={handleDismissible}
              variant="outline"
              className="w-full"
            >
              Có nút đóng
            </Button>
          </div>
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200 p-4">
          <p className="text-sm text-blue-800">
            <strong>Mẹo:</strong> Bạn có thể kết hợp các tùy chọn khác nhau để
            tạo ra các thông báo tùy chỉnh phù hợp với nhu cầu của ứng dụng.
          </p>
        </Card>
      </div>
    </div>
  );
}
