interface TestimonialsProps {
  t: {
    testimonials: {
      badge: string;
      title: string;
      subtitle: string;
      description: string;
      customers: string;
      stats: {
        satisfactionRate: string;
        supportAvailable: string;
      };
    };
  };
}

export default function Testimonials({ t }: TestimonialsProps) {
  return (
    <section className='py-32 bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-20'>
          <div className='inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium mb-6'>
            {t.testimonials.badge}
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            {t.testimonials.title}
            <span className='block text-gray-600'>
              {t.testimonials.subtitle}
            </span>
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            {t.testimonials.description}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Testimonial 1 */}
          <div className='group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:-translate-y-2'>
            <div className='flex items-center gap-1 mb-6'>
              <span className='text-yellow-400 text-lg'>★★★★★</span>
              <span className='ml-2 text-sm font-medium text-gray-600'>
                Verified Purchase
              </span>
            </div>
            <blockquote className='text-lg text-gray-700 mb-8 leading-relaxed'>
              &quot;The quality blew me away! The canvas print of our wedding
              photo has become the centerpiece of our living room. The colors
              are so vibrant and true to life.&quot;
            </blockquote>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg'>
                  S
                </div>
                <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs'>✓</span>
                </div>
              </div>
              <div>
                <h4 className='font-bold text-gray-900 text-lg'>
                  Sarah Johnson
                </h4>
                <p className='text-gray-600'>Interior Designer</p>
                <p className='text-sm text-gray-500'>San Francisco, CA</p>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className='group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:-translate-y-2'>
            <div className='flex items-center gap-1 mb-6'>
              <span className='text-yellow-400 text-lg'>★★★★★</span>
              <span className='ml-2 text-sm font-medium text-gray-600'>
                Verified Purchase
              </span>
            </div>
            <blockquote className='text-lg text-gray-700 mb-8 leading-relaxed'>
              &quot;Ordered three metal prints for my office. The process was
              seamless, delivery was super fast, and the quality is absolutely
              professional grade.&quot;
            </blockquote>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg'>
                  M
                </div>
                <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs'>✓</span>
                </div>
              </div>
              <div>
                <h4 className='font-bold text-gray-900 text-lg'>Mike Chen</h4>
                <p className='text-gray-600'>Business Owner</p>
                <p className='text-sm text-gray-500'>New York, NY</p>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className='group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:-translate-y-2'>
            <div className='flex items-center gap-1 mb-6'>
              <span className='text-yellow-400 text-lg'>★★★★★</span>
              <span className='ml-2 text-sm font-medium text-gray-600'>
                Verified Purchase
              </span>
            </div>
            <blockquote className='text-lg text-gray-700 mb-8 leading-relaxed'>
              &quot;As an art collector, I&apos;m very particular about quality.
              Studio Vista exceeded my expectations with their framing and
              attention to detail.&quot;
            </blockquote>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div className='w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg'>
                  E
                </div>
                <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs'>✓</span>
                </div>
              </div>
              <div>
                <h4 className='font-bold text-gray-900 text-lg'>
                  Emily Rodriguez
                </h4>
                <p className='text-gray-600'>Art Collector</p>
                <p className='text-sm text-gray-500'>Los Angeles, CA</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className='mt-20 text-center'>
          <div className='grid grid-cols-2 lg:grid-cols-4 gap-8'>
            <div className='bg-white rounded-2xl p-6 border border-gray-200'>
              <div className='text-3xl font-bold text-gray-900 mb-2'>
                50,000+
              </div>
              <div className='text-gray-600'>{t.testimonials.customers}</div>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-200'>
              <div className='text-3xl font-bold text-gray-900 mb-2'>4.9/5</div>
              <div className='text-gray-600'>Average Rating</div>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-200'>
              <div className='text-3xl font-bold text-gray-900 mb-2'>99.8%</div>
              <div className='text-gray-600'>
                {t.testimonials.stats.satisfactionRate}
              </div>
            </div>
            <div className='bg-white rounded-2xl p-6 border border-gray-200'>
              <div className='text-3xl font-bold text-gray-900 mb-2'>24/7</div>
              <div className='text-gray-600'>
                {t.testimonials.stats.supportAvailable}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
