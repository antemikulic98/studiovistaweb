import { useState } from 'react';
import { Building2, FileText, Landmark, Mail, Phone } from 'lucide-react';
import { Translations } from '../types/translations';

interface AboutUsProps {
  t: Translations;
}

export default function AboutUs({ t }: AboutUsProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus('idle'), 5000);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id='about' className='py-32 bg-white'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-20'>
          <div className='inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium mb-6'>
            {t.about.badge}
          </div>
          <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
            {t.about.title}
          </h2>
          <p className='text-xl text-gray-600 leading-relaxed'>
            {t.about.subtitle}
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Left Column: Company Story + Details */}
          <div className='space-y-12'>
            {/* Company Story */}
            <div className='space-y-6'>
              <div className='space-y-4'>
                <h3 className='text-3xl font-bold text-gray-900 leading-tight'>
                  Tri desetljeća strasti
                  <span className='block text-2xl font-medium text-gray-600 mt-2'>
                    za savršene printove
                  </span>
                </h3>
                <div className='w-16 h-0.5 bg-gray-900'></div>
              </div>
              <p className='text-gray-700 leading-relaxed text-lg text-justify'>
                {t.about.story}
              </p>
              <p className='text-gray-700 leading-relaxed text-lg text-justify'>
                {t.about.experience}
              </p>
            </div>

            {/* Divider */}
            <div className='w-12 h-px bg-gray-300'></div>

            {/* Company Details */}
            <div className='space-y-6'>
              <h3 className='text-2xl font-bold text-gray-900 mb-6'>
                {t.about.company.title}
              </h3>
              <div className='space-y-4'>
                <div className='flex items-start gap-4'>
                  <Building2 className='w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0' />
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {t.about.company.name}
                    </div>
                    <div className='text-gray-600'>
                      {t.about.company.address}
                    </div>
                  </div>
                </div>
                <div className='flex items-center gap-4'>
                  <FileText className='w-5 h-5 text-gray-600 flex-shrink-0' />
                  <span className='text-gray-700'>{t.about.company.oib}</span>
                </div>
                <div className='flex items-center gap-4'>
                  <Landmark className='w-5 h-5 text-gray-600 flex-shrink-0' />
                  <span className='font-mono text-sm text-gray-700'>
                    {t.about.company.iban}
                  </span>
                </div>
                <div className='flex items-center gap-4'>
                  <Mail className='w-5 h-5 text-gray-600 flex-shrink-0' />
                  <a
                    href={`mailto:${t.about.company.email}`}
                    className='text-gray-700 hover:text-gray-900 transition-colors'
                  >
                    {t.about.company.email}
                  </a>
                </div>
                <div className='flex items-center gap-4'>
                  <Phone className='w-5 h-5 text-gray-600 flex-shrink-0' />
                  <a
                    href={`tel:${t.about.company.phone}`}
                    className='text-gray-700 hover:text-gray-900 transition-colors'
                  >
                    {t.about.company.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className='space-y-8'>
            <div className='space-y-4'>
              <h3 className='text-3xl font-bold text-gray-900'>
                {t.about.contact.title}
              </h3>
              <p className='text-gray-600 text-lg'>
                {t.about.contact.subtitle}
              </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t.about.contact.form.firstName}
                  </label>
                  <input
                    type='text'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200'
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    {t.about.contact.form.lastName}
                  </label>
                  <input
                    type='text'
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200'
                  />
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t.about.contact.form.email}
                </label>
                <input
                  type='email'
                  name='email'
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t.about.contact.form.phone}
                </label>
                <input
                  type='tel'
                  name='phone'
                  value={formData.phone}
                  onChange={handleInputChange}
                  className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  {t.about.contact.form.message}
                </label>
                <textarea
                  name='message'
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className='w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 resize-none'
                />
              </div>

              <div>
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='w-full bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isSubmitting
                    ? t.about.contact.form.sending
                    : t.about.contact.form.send}
                </button>

                {submitStatus === 'success' && (
                  <div className='mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg'>
                    {t.about.contact.form.success}
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className='mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg'>
                    {t.about.contact.form.error}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
