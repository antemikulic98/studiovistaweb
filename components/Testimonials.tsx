import React from 'react';
import { Translations } from '../types/translations';

interface TestimonialsProps {
  t: Translations;
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
          {t.testimonials.reviews.map((review, index) => (
            <div
              key={index}
              className='group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:-translate-y-2'
            >
              <div className='flex items-center gap-1 mb-6'>
                <span className='text-yellow-400 text-lg'>{review.stars}</span>
                <span className='ml-2 text-sm font-medium text-gray-600'>
                  {t.testimonials.verifiedPurchase}
                </span>
              </div>
              <blockquote className='text-lg text-gray-700 mb-8 leading-relaxed'>
                &quot;{review.quote}&quot;
              </blockquote>
              <div className='flex items-center gap-4'>
                <div className='relative'>
                  <div
                    className={`w-14 h-14 ${review.bgColor} rounded-2xl flex items-center justify-center text-white font-bold text-lg`}
                  >
                    {review.initial}
                  </div>
                  <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-xs'>✓</span>
                  </div>
                </div>
                <div>
                  <h4 className='font-bold text-gray-900 text-lg'>
                    {review.name}
                  </h4>
                  <p className='text-gray-600'>{review.profession}</p>
                  <p className='text-sm text-gray-500'>{review.location}</p>
                </div>
              </div>
            </div>
          ))}
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
              <div className='text-gray-600'>
                {t.testimonials.averageRating}
              </div>
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
