'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store user data in localStorage for client-side access
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', data.user.email);
        localStorage.setItem('adminName', data.user.name);
        localStorage.setItem('adminRole', data.user.role);

        // Redirect to admin panel
        router.push('/admin');
      } else {
        setError(data.error || 'Greška pri prijavi');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Greška pri povezivanju. Molimo pokušajte ponovno.');
    }

    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4'>
      <div className='w-full max-w-md'>
        {/* Logo/Header */}
        <div className='text-center mb-8'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-4'>
            <Lock size={32} className='text-white' />
          </div>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Studio Vista
          </h1>
          <p className='text-gray-600'>Admin prijava</p>
        </div>

        {/* Login Form */}
        <div className='bg-white rounded-2xl shadow-xl p-8'>
          <form onSubmit={handleLogin} className='space-y-6'>
            {/* Email Input */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Email adresa
              </label>
              <div className='relative'>
                <User
                  size={20}
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                />
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400'
                  placeholder='ante@studiovista.hr'
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Lozinka
              </label>
              <div className='relative'>
                <Lock
                  size={20}
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-400'
                  placeholder='Unesite lozinku'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm'>
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type='submit'
              disabled={loading}
              className='w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {loading ? 'Prijavljivanje...' : 'Prijavi se'}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className='text-center mt-6'>
          <a
            href='/'
            className='text-gray-600 hover:text-gray-900 text-sm font-medium'
          >
            ← Nazad na početnu
          </a>
        </div>
      </div>
    </div>
  );
}
