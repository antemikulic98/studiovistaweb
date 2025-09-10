import React from 'react';
import Image from 'next/image';
import { X, Truck, Shield, Award } from 'lucide-react';

interface CartItem {
  id: string;
  imageFile: File;
  previewUrl: string;
  printType: 'canvas' | 'framed' | 'sticker';
  size: string;
  frameColor: 'black' | 'silver';
  quantity: number;
  price: number;
}

interface CartSummaryProps {
  cartItems: CartItem[];
  removeFromCart: (itemId: string) => void;
  sizeOptions: {
    [key: string]: {
      name: string;
      canvas: number;
      framed: number;
      sticker: number;
      dimensions: { width: number; height: number };
    };
  };
  compact?: boolean;
}

export default function CartSummary({
  cartItems,
  removeFromCart,
  sizeOptions,
  compact = false,
}: CartSummaryProps) {
  if (cartItems.length === 0) {
    return (
      <div className='text-center text-gray-500 py-8'>
        <p>Košarica je prazna</p>
      </div>
    );
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const vat = subtotal * 0.25; // 25% PDV
  const total = subtotal + vat;

  return (
    <div className='bg-white rounded-xl p-6 shadow-sm'>
      <h4 className='font-bold text-gray-900 mb-4'>
        Stavke narudžbe ({cartItems.length})
      </h4>

      <div className={`space-y-3 ${compact ? 'max-h-60 overflow-y-auto' : ''}`}>
        {cartItems.map((item, index) => (
          <div key={item.id} className='border rounded-lg p-3 bg-gray-50'>
            <div className='flex gap-3'>
              <Image
                src={item.previewUrl}
                alt={`Stavka ${index + 1}`}
                width={48}
                height={48}
                className='w-12 h-12 rounded-lg object-cover'
              />
              <div className='flex-1 min-w-0'>
                <div className='flex justify-between items-start mb-1'>
                  <div>
                    <p className='font-medium text-gray-900 text-sm'>
                      {item.printType === 'canvas'
                        ? 'Canvas Print'
                        : item.printType === 'framed'
                        ? 'Uokvirena slika'
                        : 'Zidna naljepnica'}
                    </p>
                    <p className='text-xs text-gray-600'>
                      {sizeOptions[item.size as keyof typeof sizeOptions]?.name}
                      {item.printType === 'framed' &&
                        ` • ${
                          item.frameColor === 'black' ? 'Crna' : 'Srebrna'
                        }`}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className='text-red-500 hover:text-red-700 p-1 transition-colors'
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className='flex justify-between items-center text-xs'>
                  <span className='text-gray-600'>
                    {item.quantity} kom × €
                    {(item.price / item.quantity).toFixed(2)}
                  </span>
                  <span className='font-bold text-gray-900'>
                    €{item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Summary with VAT */}
      <div className='mt-6 pt-4 border-t border-gray-200 space-y-2'>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>Ukupno bez PDV-a:</span>
          <span className='font-medium'>€{subtotal.toFixed(2)}</span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-gray-600'>PDV (25%):</span>
          <span className='font-medium'>€{vat.toFixed(2)}</span>
        </div>
        <div className='flex justify-between text-lg font-bold pt-2 border-t border-gray-200'>
          <span>Ukupno s PDV-om:</span>
          <span className='text-blue-600'>€{total.toFixed(2)}</span>
        </div>
      </div>

      {/* Delivery Information */}
      <div className='bg-blue-50 rounded-lg p-4 space-y-2 mt-4'>
        <h5 className='font-semibold text-gray-900 mb-3'>
          Informacije o dostavi
        </h5>
        <div className='space-y-2 text-sm text-gray-700'>
          <p className='flex items-center gap-2'>
            <Truck size={14} className='text-blue-600' />
            Dostava 3-7 radnih dana
          </p>
          <p className='flex items-center gap-2'>
            <Shield size={14} className='text-green-600' />
            100% zadovoljstvo ili povrat novca
          </p>
          <p className='flex items-center gap-2'>
            <Award size={14} className='text-purple-600' />
            Premium kvaliteta materijala
          </p>
        </div>
      </div>
    </div>
  );
}
