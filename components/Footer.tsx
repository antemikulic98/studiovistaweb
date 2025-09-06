interface FooterProps {
  t: {
    footer: {
      tagline: string;
      products: {
        title: string;
        canvas: string;
        stickers: string;
      };
      contact: {
        title: string;
        businessHours: string;
        support: string;
      };
      copyright: string;
      legal: {
        privacy: string;
        terms: string;
      };
    };
  };
}

export default function Footer({ t }: FooterProps) {
  return (
    <footer id='contact' className='bg-black text-white py-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
          {/* Brand Section */}
          <div className='lg:col-span-2 space-y-6'>
            <div>
              <h3 className='text-3xl font-bold mb-4'>Studio Vista</h3>
              <p className='text-gray-400 text-lg leading-relaxed max-w-md'>
                {t.footer.tagline}
              </p>
            </div>

            <div className='flex space-x-6'>
              <a
                href='#'
                className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
              >
                <span className='sr-only'>Facebook</span>
                <span className='text-xl'>📘</span>
              </a>
              <a
                href='#'
                className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
              >
                <span className='sr-only'>Instagram</span>
                <span className='text-xl'>📷</span>
              </a>
              <a
                href='#'
                className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
              >
                <span className='sr-only'>Twitter</span>
                <span className='text-xl'>🐦</span>
              </a>
              <a
                href='#'
                className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
              >
                <span className='sr-only'>Pinterest</span>
                <span className='text-xl'>📌</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className='text-lg font-bold mb-6'>
              {t.footer.products.title}
            </h4>
            <ul className='space-y-4'>
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
                  Framed Prints
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
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  Photo Books
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='text-gray-400 hover:text-white transition-colors duration-300'
                >
                  Wall Collages
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className='text-lg font-bold mb-6'>{t.footer.contact.title}</h4>
            <div className='space-y-4 text-gray-400'>
              <div className='flex items-center gap-3'>
                <span className='text-lg'>📍</span>
                <span>
                  123 Art Street
                  <br />
                  Creative City, CA 90210
                </span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-lg'>📞</span>
                <span>(555) 123-4567</span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-lg'>✉️</span>
                <span>hello@studiovista.com</span>
              </div>
              <div className='flex items-center gap-3'>
                <span className='text-lg'>🕒</span>
                <span>{t.footer.contact.businessHours}</span>
              </div>
            </div>

            <div className='mt-8'>
              <h5 className='font-semibold mb-3'>{t.footer.contact.support}</h5>
              <div className='space-y-2 text-sm text-gray-400'>
                <div>
                  <a
                    href='#'
                    className='hover:text-white transition-colors duration-300'
                  >
                    Help Center
                  </a>
                </div>
                <div>
                  <a
                    href='#'
                    className='hover:text-white transition-colors duration-300'
                  >
                    Track Your Order
                  </a>
                </div>
                <div>
                  <a
                    href='#'
                    className='hover:text-white transition-colors duration-300'
                  >
                    Returns & Exchanges
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className='border-t border-gray-800 mt-16 pt-8'>
          <div className='flex flex-col lg:flex-row justify-between items-center gap-4'>
            <p className='text-gray-400 text-center lg:text-left'>
              {t.footer.copyright}
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
              <a
                href='#'
                className='hover:text-white transition-colors duration-300'
              >
                Shipping Info
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
