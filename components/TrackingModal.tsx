'use client';

import { useState } from 'react';
import { X, Package, CheckCircle, Truck, MapPin, Calendar } from 'lucide-react';
import { Translations } from '../types/translations';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  translations: Translations;
}

interface OrderStatus {
  _id: string;
  orderNumber: string;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  printData: {
    totalPrice: number;
    items: Array<{
      printType: string;
      size: string;
      quantity: number;
    }>;
  };
}

export default function TrackingModal({
  isOpen,
  onClose,
  translations: t,
}: TrackingModalProps) {
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrackOrder = async () => {
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError(null);
    setOrderStatus(null);

    try {
      const response = await fetch(
        `/api/orders?id=${encodeURIComponent(orderNumber)}`
      );
      const data = await response.json();

      console.log('🎯 Tracking response:', data);
      console.log('🎯 Order status received:', data.data?.status);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch order');
      }

      setOrderStatus(data.data);
    } catch (error) {
      console.error('Error tracking order:', error);
      setError(t.tracking.notFound);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOrderNumber('');
    setOrderStatus(null);
    setError(null);
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Package className='text-yellow-600' size={20} />;
      case 'paid':
        return <CheckCircle className='text-green-600' size={20} />;
      case 'processing':
        return <CheckCircle className='text-blue-600' size={20} />;
      case 'shipped':
        return <Truck className='text-green-600' size={20} />;
      case 'delivered':
        return <MapPin className='text-green-700' size={20} />;
      default:
        return <Package className='text-gray-600' size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-green-200 text-green-900 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500/75 backdrop-blur-sm transition-opacity'
          onClick={handleClose}
        />

        <div className='relative inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle'>
          {/* Header */}
          <div className='bg-white px-6 pt-6 pb-4'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-xl font-bold text-gray-900'>
                  {t.tracking.title}
                </h3>
                <p className='text-sm text-gray-600 mt-1'>
                  {t.tracking.subtitle}
                </p>
              </div>
              <button
                onClick={handleClose}
                className='rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors'
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className='px-6 pb-6'>
            {/* Order Number Input */}
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t.tracking.orderNumber}
                </label>
                <input
                  type='text'
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                  placeholder={t.tracking.orderNumberPlaceholder}
                  className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-mono text-center text-lg tracking-wider'
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
              </div>

              <button
                onClick={handleTrackOrder}
                disabled={loading || !orderNumber.trim()}
                className='w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white' />
                    {t.tracking.tracking}
                  </>
                ) : (
                  <>
                    <Package size={18} />
                    {t.tracking.trackButton}
                  </>
                )}
              </button>
            </div>

            {/* Error State */}
            {error && (
              <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-xl'>
                <div className='flex'>
                  <X className='h-5 w-5 text-red-400' />
                  <div className='ml-3'>
                    <h3 className='text-sm font-medium text-red-800'>
                      {t.tracking.notFound}
                    </h3>
                    <div className='mt-2 text-sm text-red-700'>
                      <p>{t.tracking.notFoundDesc}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Status */}
            {orderStatus && (
              <div className='mt-6 space-y-4'>
                {/* Status Header */}
                <div className='bg-gray-50 rounded-xl p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm text-gray-600'>
                        {t.tracking.details.orderDate}
                      </p>
                      <p className='font-mono font-bold text-gray-900'>
                        #{orderStatus._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className='flex items-center gap-3'>
                      {getStatusIcon(orderStatus.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          orderStatus.status
                        )}`}
                      >
                        {t.tracking.status[orderStatus.status]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className='space-y-3'>
                  <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>
                      {t.tracking.details.status}
                    </span>
                    <span className='font-semibold text-gray-900'>
                      {t.tracking.status[
                        orderStatus.status as keyof typeof t.tracking.status
                      ] || orderStatus.status}
                    </span>
                  </div>

                  <div className='flex justify-between items-center py-2 border-b border-gray-100'>
                    <span className='text-gray-600'>
                      {t.tracking.details.total}
                    </span>
                    <span className='font-bold text-green-600'>
                      €{orderStatus.printData.totalPrice.toFixed(2)}
                    </span>
                  </div>

                  <div className='py-2'>
                    <span className='text-gray-600 block mb-2'>
                      {t.tracking.details.items}
                    </span>
                    <div className='space-y-1'>
                      {orderStatus.printData.items?.map((item, index) => (
                        <div
                          key={index}
                          className='text-sm text-gray-700 bg-gray-50 rounded p-2'
                        >
                          {item.printType === 'canvas'
                            ? 'Canvas Print'
                            : item.printType === 'framed'
                            ? 'Uokvireni Print'
                            : 'Zidni Sticker'}{' '}
                          - {item.size} (x{item.quantity})
                        </div>
                      )) || (
                        <div className='text-sm text-gray-500'>
                          No item details available
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='py-2'>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <Calendar size={16} />
                      {new Date(orderStatus.createdAt).toLocaleDateString(
                        'hr-HR',
                        {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
