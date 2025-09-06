import Image from 'next/image';
import { Translations } from '../types/translations';

interface WhyChooseUsProps {
  t: Translations;
}

export default function WhyChooseUs({ t }: WhyChooseUsProps) {
  return (
    <section className='py-32 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
          {/* Left Content */}
          <div className='space-y-8'>
            <div className='space-y-6'>
              <div className='inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium'>
                Why Choose Us
              </div>
              <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 leading-tight'>
                Crafted with
                <span className='block text-gray-600'>Precision & Care</span>
              </h2>
              <p className='text-xl text-gray-600 leading-relaxed'>
                Every piece we create is a testament to our commitment to
                excellence, combining cutting-edge technology with artisanal
                craftsmanship.
              </p>
            </div>

            <div className='space-y-6'>
              {/* Feature 1 */}
              <div className='flex gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300'>
                <div className='flex-shrink-0 w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center'>
                  <span className='text-blue-600 text-xl'>⚡</span>
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    Brza dostava
                  </h3>
                  <p className='text-gray-600'>
                    Brza obrada i isporuka unutar 3-5 radnih dana
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className='flex gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300'>
                <div className='flex-shrink-0 w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center'>
                  <span className='text-green-600 text-xl'>🎯</span>
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    Color-Perfect Guarantee
                  </h3>
                  <p className='text-gray-600'>
                    Advanced color calibration ensures your prints match your
                    vision exactly, every time.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className='flex gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300'>
                <div className='flex-shrink-0 w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center'>
                  <span className='text-purple-600 text-xl'>🛡️</span>
                </div>
                <div>
                  <h3 className='text-xl font-bold text-gray-900 mb-2'>
                    Vrhunska kvaliteta
                  </h3>
                  <p className='text-gray-600'>
                    Premium materijali i precizna izrada
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Quality Showcase */}
          <div className='relative'>
            <div className='relative h-[600px] rounded-3xl overflow-hidden shadow-2xl'>
              <Image
                src='https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                alt='Artisan crafting premium canvas print'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-black/20'></div>
            </div>

            {/* Quality Stats */}
            <div className='absolute -bottom-8 -left-8 bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 max-w-xs'>
              <div className='space-y-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                    <span className='text-green-600 text-lg'>✓</span>
                  </div>
                  <div>
                    <div className='font-bold text-gray-900'>99.8%</div>
                    <div className='text-sm text-gray-600'>
                      Zadovoljstvo kupaca
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                    <span className='text-blue-600 text-lg'>🏆</span>
                  </div>
                  <div>
                    <div className='font-bold text-gray-900'>50,000+</div>
                    <div className='text-sm text-gray-600'>
                      Prints Delivered
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Award Badge */}
            <div className='absolute -top-6 -right-6 bg-gray-900 text-white rounded-2xl p-6 shadow-xl'>
              <div className='text-center'>
                <div className='text-2xl mb-2'>🥇</div>
                <div className='font-bold text-sm'>Industry</div>
                <div className='font-bold text-sm'>Leader</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
