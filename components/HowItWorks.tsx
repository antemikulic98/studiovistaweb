interface HowItWorksProps {
  t: {
    process: {
      badge: string;
      title: string;
      subtitle: string;
      steps: {
        upload: {
          title: string;
          description: string;
        };
        customize: {
          title: string;
          description: string;
        };
        receive: {
          title: string;
          description: string;
        };
      };
      cta: string;
    };
  };
  openModal: () => void;
}

export default function HowItWorks({ t, openModal }: HowItWorksProps) {
  return (
    <section id='how-it-works' className='py-32 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-20'>
          <div className='inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6'>
            {t.process.badge}
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            {t.process.title}
            <span className='block text-gray-600'>{t.process.subtitle}</span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            {t.process.description}
          </p>
        </div>

        <div className='relative'>
          {/* Connection Line */}
          <div className='hidden lg:block absolute top-24 left-0 right-0 h-px bg-gray-300 z-0'></div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10'>
            {/* Step 1 */}
            <div className='group text-center'>
              <div className='relative mb-8'>
                <div className='w-24 h-24 mx-auto bg-gray-900 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300'>
                  01
                </div>
                <div className='absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm'>📤</span>
                </div>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                {t.process.step2.heading}
              </h3>
              <p className='text-gray-600 leading-relaxed mb-6'>
                {t.process.step2.description}
              </p>
              <div className='bg-gray-50 rounded-2xl p-4 border border-gray-200'>
                <div className='text-sm text-gray-500 mb-2'>
                  {t.quality.formats.title}
                </div>
                <div className='text-sm font-medium text-gray-900'>
                  {t.quality.formats.supported}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className='group text-center'>
              <div className='relative mb-8'>
                <div className='w-24 h-24 mx-auto bg-gray-900 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300'>
                  02
                </div>
                <div className='absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm'>🎨</span>
                </div>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                {t.process.step3.heading}
              </h3>
              <p className='text-gray-600 leading-relaxed mb-6'>
                {t.process.step3.description}
              </p>
              <div className='bg-gray-50 rounded-2xl p-4 border border-gray-200'>
                <div className='text-sm text-gray-500 mb-2'>
                  {t.quality.check}
                </div>
                <div className='text-sm font-medium text-gray-900'>
                  {t.quality.preview}
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className='group text-center'>
              <div className='relative mb-8'>
                <div className='w-24 h-24 mx-auto bg-gray-900 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300'>
                  03
                </div>
                <div className='absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-sm'>🚚</span>
                </div>
              </div>
              <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                Craft & Deliver
              </h3>
              <p className='text-gray-600 leading-relaxed mb-6'>
                Our artisans carefully craft your print using premium materials,
                then package and ship it with protective care to your door.
              </p>
              <div className='bg-gray-50 rounded-2xl p-4 border border-gray-200'>
                <div className='text-sm text-gray-500 mb-2'>Delivery time:</div>
                <div className='text-sm font-medium text-gray-900'>
                  3-7 business days
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='text-center mt-16'>
          <button
            onClick={() => openModal()}
            className='bg-gray-900 hover:bg-gray-800 text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl'
          >
            {t.process.cta}
            <span className='ml-2'>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
