interface CTASectionProps {
  t: {
    testimonials: {
      cta: {
        ready: string;
        title: string;
        subtitle: string;
        pricing: string;
      };
    };
    process: {
      cta: string;
    };
    footer: {
      features: {
        turnaround: string;
        turnaroundDesc: string;
        quality: string;
        qualityDesc: string;
        shipping: string;
        shippingDesc: string;
      };
    };
  };
  openModal: () => void;
}

export default function CTASection({ t, openModal }: CTASectionProps) {
  return (
    <section className='py-32 bg-gray-900 text-white relative overflow-hidden'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20c0 0 0-8.95 0-10h10c0 1.05 0 10 0 10H20z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      {/* Frame Effect */}
      <div className='absolute inset-8 border-2 border-white/10 rounded-3xl'></div>
      <div className='absolute inset-12 border border-white/5 rounded-2xl'></div>

      <div className='relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white'>
        <div className='space-y-8'>
          <div className='inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium'>
            {t.testimonials.cta.ready}
          </div>
          <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight'>
            {t.testimonials.cta.title}
          </h2>
          <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
            {t.testimonials.cta.subtitle}
          </p>

          <div className='flex flex-col sm:flex-row gap-6 justify-center pt-8'>
            <button
              onClick={() => openModal()}
              className='group bg-white hover:bg-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl'
            >
              {t.process.cta}
              <span className='ml-2 group-hover:translate-x-1 transition-transform duration-200'>
                →
              </span>
            </button>
            <button className='border-2 border-white/30 hover:border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm'>
              {t.testimonials.cta.pricing}
            </button>
          </div>

          {/* Quick Benefits */}
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 text-center'>
            <div className='space-y-2'>
              <div className='text-3xl mb-3'>⚡</div>
              <div className='font-semibold'>
                {t.footer.features.turnaround}
              </div>
              <div className='text-gray-400 text-sm'>
                {t.footer.features.turnaroundDesc}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-3xl mb-3'>🛡️</div>
              <div className='font-semibold'>{t.footer.features.quality}</div>
              <div className='text-gray-400 text-sm'>
                {t.footer.features.qualityDesc}
              </div>
            </div>
            <div className='space-y-2'>
              <div className='text-3xl mb-3'>🚚</div>
              <div className='font-semibold'>{t.footer.features.shipping}</div>
              <div className='text-gray-400 text-sm'>
                {t.footer.features.shippingDesc}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
