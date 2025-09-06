'use client';

import Image from 'next/image';
import { Sparkles, Palette, ChevronRight, Eye, Truck } from 'lucide-react';
import { Translations } from '../types/translations';

interface HeroProps {
  translations: Translations;
  openModal: () => void;
}

export default function Hero({ translations: t, openModal }: HeroProps) {
  return (
    <section className='relative min-h-screen flex items-center justify-center bg-gray-50 pt-20'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
          {/* Left Content */}
          <div className='space-y-8'>
            <div className='space-y-6'>
              <div className='inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium gap-2'>
                <Sparkles size={16} />
                {t.hero.badge}
              </div>
              <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[0.9] tracking-tight'>
                {t.hero.title}
                <span className='block text-gray-600'>{t.hero.subtitle1}</span>
                <span className='block'>{t.hero.subtitle2}</span>
              </h1>
              <p className='text-xl text-gray-600 leading-relaxed max-w-lg'>
                {t.hero.description}
              </p>
            </div>

            <div className='flex flex-col sm:flex-row gap-4'>
              <button
                onClick={() => openModal()}
                className='group bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2'
              >
                <Palette size={20} />
                {t.hero.createButton}
                <ChevronRight
                  size={16}
                  className='group-hover:translate-x-1 transition-transform duration-200'
                />
              </button>
              <button className='border-2 border-gray-300 hover:border-gray-900 text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-gray-900 hover:text-white flex items-center justify-center gap-2'>
                <Eye size={20} />
                {t.hero.galleryButton}
              </button>
            </div>

            {/* Stats */}
            <div className='flex gap-8 pt-8 border-t border-gray-200'>
              <div>
                <div className='text-3xl font-bold text-gray-900'>50K+</div>
                <div className='text-sm text-gray-600'>
                  {t.hero.stats?.customers}
                </div>
              </div>
              <div>
                <div className='text-3xl font-bold text-gray-900'>4.9/5</div>
                <div className='text-sm text-gray-600'>
                  {t.hero.stats?.rating}
                </div>
              </div>
              <div>
                <div className='text-3xl font-bold text-gray-900'>100%</div>
                <div className='text-sm text-gray-600'>
                  {t.hero.stats?.satisfaction}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className='relative'>
            <div className='relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl'>
              <Image
                src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                alt='Beautiful home interior with custom framed art'
                fill
                className='object-cover'
              />
              <div className='absolute inset-0 bg-black/10'></div>
            </div>

            {/* Floating Elements */}
            <div className='absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                  <Truck className='text-green-600' size={20} />
                </div>
                <div>
                  <div className='font-semibold text-gray-900'>
                    {t.hero.floating?.shipping}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {t.hero.floating?.shippingDesc}
                  </div>
                </div>
              </div>
            </div>

            <div className='absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100'>
              <div className='flex items-center gap-3'>
                <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                  <Palette className='text-blue-600' size={20} />
                </div>
                <div>
                  <div className='font-semibold text-gray-900'>
                    {t.hero.floating?.framing}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {t.hero.floating?.framingDesc}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
