import { Translations } from '../types/translations';
import { Instagram, Facebook } from 'lucide-react';
import Image from 'next/image';

interface FooterProps {
  t: Translations;
}

export default function Footer({ t }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer id='contact' className='bg-black text-white py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-2 space-y-6'>
            <div>
              <Image
                src='/img/logo-white.svg'
                alt='Studio Vista Logo'
                width={180}
                height={40}
                className='h-10 w-auto mb-6'
                priority
              />
              <p className='text-gray-400 text-lg leading-relaxed max-w-md'>
                {t.footer.tagline}
              </p>
            </div>

            <div className='flex space-x-4'>
              <a
                href='#'
                className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
              >
                <span className='sr-only'>Instagram</span>
                <Instagram className='w-5 h-5' />
              </a>
              <a
                href='#'
                className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
              >
                <span className='sr-only'>Facebook</span>
                <Facebook className='w-5 h-5' />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className='text-lg font-bold mb-4'>
              {t.footer.products.title}
            </h4>
            <ul className='space-y-3'>
              <li>
                <a
                  href='#products'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  {t.footer.products.canvas}
                </a>
              </li>
              <li>
                <a
                  href='#products'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  {t.footer.products.framed}
                </a>
              </li>
              <li>
                <a
                  href='#products'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  {t.footer.products.stickers}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h5 className='text-lg font-bold mb-3'>
              {t.footer.contact.support}
            </h5>
            <div className='space-y-2 text-sm text-gray-400'>
              <div>{t.footer.contact.businessHours}</div>
              <a
                href='#'
                className='block hover:text-white transition-colors duration-300'
              >
                Praćenje narudžbe
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-gray-800 mt-16 pt-8'>
          <div className='flex flex-col lg:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-center lg:text-left'>
              © {currentYear} Studio Vista. Sva prava zadržana. Izrađeno s
              preciznošću i strašću.
            </p>
            <div className='flex gap-6 text-sm text-gray-400'>
              <a
                href='#'
                className='hover:text-white transition-colors duration-300'
              >
                {t.footer.legal.privacy}
              </a>
              <a
                href='#'
                className='hover:text-white transition-colors duration-300'
              >
                {t.footer.legal.terms}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
