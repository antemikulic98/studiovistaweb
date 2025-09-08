'use client';

import { ChevronRight } from 'lucide-react';
import { Translations } from '../types/translations';

interface HeaderProps {
  language: 'hr' | 'en';
  setLanguage: (lang: 'hr' | 'en') => void;
  translations: Translations;
  openModal: () => void;
}

export default function Header({
  language,
  setLanguage,
  translations: t,
  openModal,
}: HeaderProps) {
  return (
    <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          <div className='flex items-center'>
            <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>
              Studio Vista
            </h1>
          </div>
          <div className='hidden md:flex items-center space-x-8'>
            <a
              href='#products'
              className='text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200'
            >
              {t.nav.products}
            </a>
            <a
              href='#how-it-works'
              className='text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200'
            >
              {t.nav.process}
            </a>
            <a
              href='#about'
              className='text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200'
            >
              {t.nav.about}
            </a>

            {/* Language Switcher */}
            <div className='flex items-center bg-gray-100 rounded-full p-1'>
              <button
                onClick={() => setLanguage('hr')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  language === 'hr'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇭🇷 HR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            <button
              onClick={() => openModal()}
              className='bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2'
            >
              {t.nav.getStarted}
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Mobile Menu - Only Language Switcher */}
          <div className='md:hidden flex items-center'>
            <div className='flex items-center bg-gray-100 rounded-full p-1'>
              <button
                onClick={() => setLanguage('hr')}
                className={`px-2 py-1 text-xs font-medium transition-all rounded-full ${
                  language === 'hr'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                HR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs font-medium transition-all rounded-full ${
                  language === 'en'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
