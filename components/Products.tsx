import Image from 'next/image';
import { Palette } from 'lucide-react';

interface ProductsProps {
  t: {
    products: {
      badge: string;
      title: string;
      subtitle: string;
      canvas: {
        name: string;
        description: string;
      };
      framed: {
        name: string;
        description: string;
      };
      sticker: {
        name: string;
        description: string;
      };
    };
  };
  openModal: (printType?: 'canvas' | 'framed' | 'sticker') => void;
  sizeOptions: {
    [key: string]: {
      name: string;
      price: number;
      dimensions: string;
    }[];
  };
}

export default function Products({ t, openModal, sizeOptions }: ProductsProps) {
  return (
    <section id='products' className='py-32 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-20'>
          <div className='inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6'>
            {t.products.badge}
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            {t.products.title}
            <span className='block text-gray-600'>{t.products.subtitle}</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            {t.products.description}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Premium Canvas Card */}
          <div className='group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>
            <div className='relative h-80 overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                alt='Premium canvas print in modern living space'
                fill
                className='object-cover group-hover:scale-110 transition-transform duration-700'
              />
              <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900'>
                {t.products.canvas.popular}
              </div>
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
            </div>
            <div className='p-8'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center'>
                  <Palette className='text-blue-600' size={24} />
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    {t.products.canvas.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {t.products.canvas.subtitle}
                  </p>
                </div>
              </div>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                {t.products.canvas.description}
              </p>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <span className='text-3xl font-bold text-gray-900'>
                    €
                    {Math.min(
                      ...Object.values(sizeOptions).map((s) =>
                        Math.min(...s.map((opt) => opt.price))
                      )
                    )}
                  </span>
                  <span className='text-gray-500 ml-1'>
                    {t.products.canvas.from.toLowerCase()}
                  </span>
                </div>
                <div className='text-right'>
                  <div className='text-sm text-gray-500'>
                    {t.products.canvas.shipping}
                  </div>
                  <div className='font-semibold text-gray-900'>
                    {t.products.canvas.days}
                  </div>
                </div>
              </div>
              <button
                onClick={() => openModal('canvas')}
                className='w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl group-hover:scale-105 flex items-center justify-center gap-2'
              >
                <Palette size={18} />
                {t.products.canvas.button}
              </button>
            </div>
          </div>

          {/* Professional Framing Card */}
          <div className='group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>
            <div className='relative h-80 overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                alt='Elegant framed prints in sophisticated interior'
                fill
                className='object-cover group-hover:scale-110 transition-transform duration-700'
              />
              <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900'>
                {t.products.framed.premium}
              </div>
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
            </div>
            <div className='p-8'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center'>
                  <span className='text-green-600 text-xl'>🖼️</span>
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    {t.products.framed.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {t.products.framed.subtitle}
                  </p>
                </div>
              </div>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                {t.products.framed.description}
              </p>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <span className='text-3xl font-bold text-gray-900'>
                    €
                    {Math.min(
                      ...Object.values(sizeOptions).map((s) =>
                        Math.min(...s.map((opt) => opt.price))
                      )
                    )}
                  </span>
                  <span className='text-gray-500 ml-1'>starting</span>
                </div>
                <div className='text-right'>
                  <div className='text-sm text-gray-500'>Ships in</div>
                  <div className='font-semibold text-gray-900'>5-7 days</div>
                </div>
              </div>
              <button
                onClick={() => openModal('framed')}
                className='w-full border-2 border-gray-300 hover:border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl group-hover:scale-105'
              >
                {t.products.framed.button}
              </button>
            </div>
          </div>

          {/* Wall Sticker Card */}
          <div className='group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>
            <div className='relative h-80 overflow-hidden'>
              <Image
                src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                alt='Wall sticker application in modern interior'
                fill
                className='object-cover group-hover:scale-110 transition-transform duration-700'
              />
              <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900'>
                {t.products.sticker.modern}
              </div>
              <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
            </div>
            <div className='p-8'>
              <div className='flex items-center gap-3 mb-4'>
                <div className='w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center'>
                  <span className='text-green-600 text-xl'>🏷️</span>
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-gray-900'>
                    {t.products.sticker.title}
                  </h3>
                  <p className='text-sm text-gray-500'>
                    {t.products.sticker.subtitle}
                  </p>
                </div>
              </div>
              <p className='text-gray-600 mb-6 leading-relaxed'>
                {t.products.sticker.description}
              </p>
              <div className='flex items-center justify-between mb-6'>
                <div>
                  <span className='text-3xl font-bold text-gray-900'>
                    €
                    {Math.min(
                      ...Object.values(sizeOptions).map((s) =>
                        Math.min(...s.map((opt) => opt.price))
                      )
                    )}
                  </span>
                  <span className='text-gray-500 ml-1'>
                    {t.products.sticker.from.toLowerCase()}
                  </span>
                </div>
                <div className='text-right'>
                  <div className='text-sm text-gray-500'>
                    {t.products.sticker.shipping}
                  </div>
                  <div className='font-semibold text-gray-900'>
                    {t.products.sticker.days}
                  </div>
                </div>
              </div>
              <button
                onClick={() => openModal('sticker')}
                className='w-full border-2 border-gray-300 hover:border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl group-hover:scale-105'
              >
                {t.products.sticker.button}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
