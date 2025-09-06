'use client';

import Image from 'next/image';
import { useState, useRef, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { TextureLoader } from 'three';
import confetti from 'canvas-confetti';
import {
  Upload,
  X,
  ImageIcon,
  CreditCard,
  Wallet,
  Building,
  Shield,
  Award,
  ChevronLeft,
  CheckCircle,
  Eye,
  Truck,
} from 'lucide-react';

// 3D Print Preview Component
function PrintPreview3D({
  imageUrl,
  printType,
  dimensions,
  frameColor,
}: {
  imageUrl: string;
  printType: 'canvas' | 'framed' | 'sticker';
  dimensions: { width: number; height: number; depth: number };
  frameColor: 'black' | 'silver';
}) {
  const texture = useLoader(TextureLoader, imageUrl);

  const frameColors = {
    black: { color: '#1a1a1a', metalness: 0.1, roughness: 0.2 },
    silver: { color: '#c0c0c0', metalness: 0.8, roughness: 0.1 },
  };

  const width = dimensions.width / 50; // Scale for 3D
  const height = dimensions.height / 50;

  return (
    <>
      {/* Lighting setup */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />

      {/* Wall background */}
      <mesh position={[0, 0, -3]} receiveShadow>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial
          color='#f8f9fa'
          roughness={0.95}
          metalness={0.02}
        />
      </mesh>

      {/* Canvas Print */}
      {printType === 'canvas' && (
        <>
          {/* Main canvas with image - edge to edge */}
          <mesh position={[0, 0, -2.95]} castShadow>
            <boxGeometry args={[width, height, 0.05]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.7}
              bumpScale={0.03}
            />
          </mesh>

          {/* Canvas wrapped edges with image continuation */}
          <mesh
            position={[width / 2 + 0.01, 0, -2.97]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[0.05, height]} />
            <meshStandardMaterial map={texture} roughness={0.8} />
          </mesh>
          <mesh
            position={[-width / 2 - 0.01, 0, -2.97]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[0.05, height]} />
            <meshStandardMaterial map={texture} roughness={0.8} />
          </mesh>
        </>
      )}

      {/* Framed Print */}
      {printType === 'framed' && (
        <>
          <mesh position={[0, 0, -2.95]} castShadow>
            <boxGeometry args={[width + 0.2, height + 0.2, 0.08]} />
            <meshStandardMaterial
              color={frameColors[frameColor].color}
              metalness={frameColors[frameColor].metalness}
              roughness={frameColors[frameColor].roughness}
            />
          </mesh>
          <mesh position={[0, 0, -2.91]} castShadow>
            <planeGeometry args={[width - 0.1, height - 0.1]} />
            <meshStandardMaterial map={texture} />
          </mesh>
        </>
      )}

      {/* Wall Sticker */}
      {printType === 'sticker' && (
        <mesh position={[0, 0, -2.99]} castShadow>
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.3}
            metalness={0}
            transparent={false}
          />
        </mesh>
      )}
    </>
  );
}

interface ProductModalProps {
  isModalOpen: boolean;
  modalStep: 'customize' | 'order' | 'thank-you';
  translations: any;
  closeModal: () => void;
  uploadedImage: string | null;
  selectedPrintType: 'canvas' | 'framed' | 'sticker';
  selectedSize: string;
  selectedFrameColor: 'black' | 'silver';
  orderData: any;
  completedOrderId: string;
  isUploading: boolean;
  uploadError: string | null;
  setUploadedImage: (image: string | null) => void;
  setUploadedImageUrl: (url: string | null) => void;
  setSelectedPrintType: (type: 'canvas' | 'framed' | 'sticker') => void;
  setSelectedSize: (size: string) => void;
  setSelectedFrameColor: (color: 'black' | 'silver') => void;
  setOrderData: (data: any) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContinueOrder: () => void;
  handleBackToCustomize: () => void;
  handleCompleteOrder: () => void;
  getCurrentPrice: () => number;
  getCurrentDimensions: () => { width: number; height: number; depth: number };
  fileInputRef: React.RefObject<HTMLInputElement>;
  sizeOptions: any;
}

export default function ProductModal({
  isModalOpen,
  modalStep,
  translations: t,
  closeModal,
  uploadedImage,
  selectedPrintType,
  selectedSize,
  selectedFrameColor,
  orderData,
  completedOrderId,
  isUploading,
  uploadError,
  setUploadedImage,
  setUploadedImageUrl,
  setSelectedPrintType,
  setSelectedSize,
  setSelectedFrameColor,
  setOrderData,
  handleFileUpload,
  handleContinueOrder,
  handleBackToCustomize,
  handleCompleteOrder,
  getCurrentPrice,
  getCurrentDimensions,
  fileInputRef,
  sizeOptions,
}: ProductModalProps) {
  if (!isModalOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md'>
      <div className='w-full max-w-5xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex relative'>
        {modalStep === 'customize' && (
          <>
            {/* Left Panel - Controls */}
            <div className='w-1/3 p-6 border-r border-gray-200 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
              {/* Close Button */}
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-2xl font-bold text-gray-900'>
                  Stvori print
                </h2>
                <button
                  onClick={closeModal}
                  className='p-2 hover:bg-gray-100 rounded-xl transition-colors'
                >
                  <X size={24} />
                </button>
              </div>

              {/* Upload Section */}
              <div className='mb-6'>
                {!uploadedImage ? (
                  <div>
                    <div
                      onClick={() =>
                        !isUploading && fileInputRef.current?.click()
                      }
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                        isUploading
                          ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                          : 'border-gray-300 cursor-pointer hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <Upload
                          size={48}
                          className='mx-auto text-gray-500 mb-4'
                        />
                        <p className='text-lg font-medium text-gray-900 mb-2'>
                          Dodaj svoju sliku
                        </p>
                        <p className='text-sm text-gray-700 font-medium'>
                          Podržani formati: JPG, PNG, WebP, TIFF, BMP
                        </p>
                        <p className='text-xs text-gray-500 mt-1'>
                          Maksimalna veličina: 10MB
                        </p>
                      </div>
                    </div>

                    {/* Upload Error */}
                    {uploadError && (
                      <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg'>
                        <p className='text-sm text-red-800 font-medium'>
                          ⚠️ {uploadError}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='relative rounded-xl overflow-hidden'>
                    <Image
                      src={uploadedImage}
                      alt='Uploaded'
                      width={400}
                      height={250}
                      className='w-full h-48 object-cover'
                    />
                    <div className='absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm'>
                      ✓ Slika dodana
                    </div>
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedImageUrl(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className='absolute bottom-2 right-2 bg-white/90 hover:bg-white text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors'
                    >
                      Promijeni sliku
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleFileUpload}
                  className='hidden'
                />
              </div>

              {/* Print Type Selection */}
              <div className='mb-6'>
                <h4 className='text-md font-bold text-gray-900 mb-3'>
                  Tip printa
                </h4>
                <div className='space-y-2'>
                  {['canvas', 'framed', 'sticker'].map((type) => (
                    <label
                      key={type}
                      className='flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer'
                    >
                      <input
                        type='radio'
                        name='printType'
                        value={type}
                        checked={selectedPrintType === type}
                        onChange={(e) =>
                          setSelectedPrintType(e.target.value as any)
                        }
                        className='mr-3'
                      />
                      <span className='font-medium capitalize'>
                        {type === 'canvas'
                          ? 'Canvas Print'
                          : type === 'framed'
                          ? 'Uokvireni Print'
                          : 'Zidni Sticker'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className='mb-6'>
                <h4 className='text-md font-bold text-gray-900 mb-3'>
                  Veličina
                </h4>
                <div className='grid grid-cols-2 gap-2'>
                  {Object.entries(sizeOptions).map(
                    ([key, option]: [string, any]) => (
                      <label
                        key={key}
                        className='flex flex-col items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer'
                      >
                        <input
                          type='radio'
                          name='size'
                          value={key}
                          checked={selectedSize === key}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className='mb-2'
                        />
                        <span className='text-sm font-medium'>
                          {option.name}
                        </span>
                        <span className='text-xs text-gray-600'>
                          €{option[selectedPrintType]}
                        </span>
                      </label>
                    )
                  )}
                </div>
              </div>

              {/* Frame Color Selection (only for framed) */}
              {selectedPrintType === 'framed' && (
                <div className='mb-6'>
                  <h4 className='text-md font-bold text-gray-900 mb-3'>
                    Boja okvira
                  </h4>
                  <div className='flex gap-3'>
                    <label className='flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer'>
                      <input
                        type='radio'
                        name='frameColor'
                        value='black'
                        checked={selectedFrameColor === 'black'}
                        onChange={(e) =>
                          setSelectedFrameColor(e.target.value as any)
                        }
                        className='mr-3'
                      />
                      <div className='w-6 h-6 bg-black rounded mr-2'></div>
                      <span className='font-medium'>Crna</span>
                    </label>
                    <label className='flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer'>
                      <input
                        type='radio'
                        name='frameColor'
                        value='silver'
                        checked={selectedFrameColor === 'silver'}
                        onChange={(e) =>
                          setSelectedFrameColor(e.target.value as any)
                        }
                        className='mr-3'
                      />
                      <div className='w-6 h-6 bg-gray-400 rounded mr-2'></div>
                      <span className='font-medium'>Srebrna</span>
                    </label>
                  </div>
                </div>
              )}

              {/* Spacer for better scrolling */}
              <div className='h-4'></div>
            </div>

            {/* Right Panel - 3D Preview */}
            <div className='w-2/3 p-6 bg-gradient-to-br from-gray-50 to-gray-100'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-bold text-gray-900'>Pregled</h3>
                <div className='flex items-center gap-2 text-sm text-gray-700 font-medium'>
                  <Eye size={16} className='text-blue-600' />
                  3D pregled
                </div>
              </div>
              <div className='relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner'>
                {uploadedImage ? (
                  <Canvas
                    camera={{ position: [0, 1, 8], fov: 45 }}
                    style={{
                      background:
                        'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                    }}
                    shadows
                  >
                    <Suspense fallback={null}>
                      <PrintPreview3D
                        imageUrl={uploadedImage}
                        printType={selectedPrintType}
                        dimensions={getCurrentDimensions()}
                        frameColor={selectedFrameColor}
                      />
                      <OrbitControls
                        enableZoom={true}
                        enablePan={false}
                        minDistance={5}
                        maxDistance={15}
                        maxPolarAngle={Math.PI / 2.2}
                        minPolarAngle={Math.PI / 6}
                        target={[0, 0, 0]}
                      />
                      <Environment preset='studio' />
                    </Suspense>
                  </Canvas>
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center text-gray-600'>
                      <ImageIcon
                        size={48}
                        className='mx-auto mb-3 text-gray-400'
                      />
                      <p className='text-lg font-medium mb-2 text-gray-700'>
                        Dodaj sliku za pregled
                      </p>
                      <p className='text-sm text-gray-700'>
                        Vidiš kako će tvoj print izgledati na zidu
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {modalStep === 'thank-you' && (
          <>
            <div className='flex-1 flex items-center justify-center p-8'>
              <div className='text-center max-w-md mx-auto'>
                <div className='mb-8'>
                  <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <CheckCircle size={40} className='text-green-600' />
                  </div>
                  <h2 className='text-3xl font-bold text-gray-900 mb-2'>
                    {t.thankYou.title}
                  </h2>
                  <p className='text-lg text-gray-600 mb-6'>
                    {t.thankYou.subtitle}
                  </p>
                </div>

                <div className='bg-gray-50 rounded-2xl p-6 mb-6'>
                  <p className='text-sm text-gray-500 mb-2'>
                    {t.thankYou.orderNumber}
                  </p>
                  <p className='text-2xl font-mono font-bold text-gray-900 mb-4'>
                    #{completedOrderId}
                  </p>
                  <p className='text-sm text-gray-600'>{t.thankYou.tracking}</p>
                </div>

                <div className='space-y-4 mb-8'>
                  <p className='text-gray-600'>{t.thankYou.description}</p>
                  <p className='text-sm text-gray-500'>
                    {t.thankYou.processing}
                  </p>
                </div>

                <div className='flex gap-3 justify-center'>
                  <button
                    onClick={closeModal}
                    className='px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors'
                  >
                    {t.thankYou.closeButton}
                  </button>
                  <button
                    onClick={() => {
                      closeModal();
                      setTimeout(() => {
                        // This will be handled by the parent component
                      }, 100);
                    }}
                    className='px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors'
                  >
                    {t.thankYou.newOrderButton}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {modalStep === 'order' && (
          <>
            {/* Order Step - Split Layout */}
            <div className='flex flex-1'>
              {/* Left Side - Customer Info Form */}
              <div className='w-1/2 p-8 overflow-y-auto'>
                <div className='max-w-xl mx-auto'>
                  <div className='mb-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                      Podaci za dostavu
                    </h2>
                    <p className='text-gray-600'>
                      Unesite svoje podatke za dostavu narudžbe
                    </p>
                  </div>

                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Ime i prezime *
                        </label>
                        <input
                          type='text'
                          value={orderData.name}
                          onChange={(e) =>
                            setOrderData({ ...orderData, name: e.target.value })
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                          placeholder='Vaše ime i prezime'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Email adresa *
                        </label>
                        <input
                          type='email'
                          value={orderData.email}
                          onChange={(e) =>
                            setOrderData({
                              ...orderData,
                              email: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                          placeholder='vas.email@primjer.com'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Broj telefona
                      </label>
                      <input
                        type='tel'
                        value={orderData.phone}
                        onChange={(e) =>
                          setOrderData({ ...orderData, phone: e.target.value })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='+385 xx xxx xxxx'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Adresa *
                      </label>
                      <input
                        type='text'
                        value={orderData.address}
                        onChange={(e) =>
                          setOrderData({
                            ...orderData,
                            address: e.target.value,
                          })
                        }
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                        placeholder='Ulica i kućni broj'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Grad *
                        </label>
                        <input
                          type='text'
                          value={orderData.city}
                          onChange={(e) =>
                            setOrderData({ ...orderData, city: e.target.value })
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                          placeholder='Zagreb'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Poštanski broj *
                        </label>
                        <input
                          type='text'
                          value={orderData.postalCode}
                          onChange={(e) =>
                            setOrderData({
                              ...orderData,
                              postalCode: e.target.value,
                            })
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                          placeholder='10000'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-3'>
                        Način plaćanja *
                      </label>
                      <div className='space-y-2'>
                        <label className='flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'>
                          <input
                            type='radio'
                            name='paymentMethod'
                            value='card'
                            checked={orderData.paymentMethod === 'card'}
                            onChange={(e) =>
                              setOrderData({
                                ...orderData,
                                paymentMethod: e.target.value as 'card',
                              })
                            }
                            className='mr-3'
                          />
                          <CreditCard
                            size={20}
                            className='mr-3 text-blue-600'
                          />
                          <span className='font-medium'>
                            Kreditna/debitna kartica
                          </span>
                        </label>
                        <label className='flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'>
                          <input
                            type='radio'
                            name='paymentMethod'
                            value='paypal'
                            checked={orderData.paymentMethod === 'paypal'}
                            onChange={(e) =>
                              setOrderData({
                                ...orderData,
                                paymentMethod: e.target.value as 'paypal',
                              })
                            }
                            className='mr-3'
                          />
                          <Wallet size={20} className='mr-3 text-orange-600' />
                          <span className='font-medium'>PayPal</span>
                        </label>
                        <label className='flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer'>
                          <input
                            type='radio'
                            name='paymentMethod'
                            value='bank'
                            checked={orderData.paymentMethod === 'bank'}
                            onChange={(e) =>
                              setOrderData({
                                ...orderData,
                                paymentMethod: e.target.value as 'bank',
                              })
                            }
                            className='mr-3'
                          />
                          <Building size={20} className='mr-3 text-green-600' />
                          <span className='font-medium'>Bankovni transfer</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Order Summary */}
              <div className='w-1/2 p-8 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200'>
                <h3 className='text-lg font-bold text-gray-900 mb-6'>
                  Sažetak narudžbe
                </h3>

                {uploadedImage && (
                  <div className='bg-white rounded-xl p-6 mb-6 shadow-sm'>
                    <div className='flex items-center gap-4 mb-4'>
                      <Image
                        src={uploadedImage}
                        alt='Preview'
                        width={64}
                        height={64}
                        className='w-16 h-16 rounded-lg object-cover'
                      />
                      <div>
                        <h4 className='font-semibold text-gray-900'>
                          {selectedPrintType === 'canvas'
                            ? 'Canvas Print'
                            : selectedPrintType === 'framed'
                            ? 'Uokvireni Print'
                            : 'Zidni Sticker'}
                        </h4>
                        <p className='text-sm text-gray-600'>
                          {sizeOptions[selectedSize]?.name}
                          {selectedPrintType === 'framed' &&
                            ` • ${
                              selectedFrameColor === 'black'
                                ? 'Crni'
                                : 'Srebrni'
                            } okvir`}
                        </p>
                      </div>
                    </div>

                    <div className='border-t pt-4 space-y-2'>
                      <div className='flex justify-between text-sm text-gray-800'>
                        <span>Cijena proizvoda:</span>
                        <span className='font-medium'>
                          €{getCurrentPrice()}
                        </span>
                      </div>
                      <div className='flex justify-between text-sm text-gray-800'>
                        <span>Dostava:</span>
                        <span className='text-green-600 font-medium'>
                          Besplatno
                        </span>
                      </div>
                      <div className='flex justify-between font-bold text-lg pt-2 border-t text-gray-900'>
                        <span>Ukupno:</span>
                        <span>€{getCurrentPrice()}</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className='bg-white rounded-xl p-6 shadow-sm'>
                  <h4 className='font-bold text-gray-900 mb-4'>
                    Informacije o dostavi
                  </h4>
                  <div className='space-y-2 text-sm text-gray-700'>
                    <p className='flex items-center gap-2'>
                      <Truck size={16} className='text-blue-600' />
                      Dostava{' '}
                      {selectedPrintType === 'framed'
                        ? '5-7'
                        : selectedPrintType === 'sticker'
                        ? '2-3'
                        : '3-5'}{' '}
                      radnih dana
                    </p>
                    <p className='flex items-center gap-2'>
                      <Shield size={16} className='text-green-600' />
                      100% zadovoljstvo ili povrat novca
                    </p>
                    <p className='flex items-center gap-2'>
                      <Award size={16} className='text-purple-600' />
                      Premium kvaliteta materijala
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal Footer */}
        <div className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6'>
          <div className='max-w-5xl mx-auto flex items-center justify-between'>
            {modalStep === 'customize' && (
              <>
                <div className='text-sm text-gray-700 font-medium'>
                  {uploadedImage
                    ? `€${getCurrentPrice()} • ${
                        sizeOptions[selectedSize]?.name
                      } • Dostava ${
                        selectedPrintType === 'framed'
                          ? '5-7'
                          : selectedPrintType === 'sticker'
                          ? '2-3'
                          : '3-5'
                      } dana`
                    : 'Dodaj sliku da vidiš cijenu'}
                </div>
                <div className='flex gap-3'>
                  <button
                    onClick={closeModal}
                    className='px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors'
                  >
                    Odustani
                  </button>
                  <button
                    onClick={handleContinueOrder}
                    disabled={!uploadedImage}
                    className='px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
                  >
                    Nastavi narudžbu
                  </button>
                </div>
              </>
            )}
            {modalStep === 'thank-you' && (
              <>
                {/* Thank you footer - hidden */}
                <div className='hidden'></div>
              </>
            )}
            {modalStep === 'order' && (
              <>
                <button
                  onClick={handleBackToCustomize}
                  className='flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors'
                >
                  <ChevronLeft size={20} />
                  Nazad na uređivanje
                </button>
                <div className='flex gap-3'>
                  <button
                    onClick={closeModal}
                    className='px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors'
                  >
                    Odustani
                  </button>
                  <button
                    onClick={handleCompleteOrder}
                    disabled={
                      !orderData.name ||
                      !orderData.email ||
                      !orderData.address ||
                      !orderData.city ||
                      !orderData.postalCode
                    }
                    className='px-8 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed'
                  >
                    Završi narudžbu • €{getCurrentPrice()}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
