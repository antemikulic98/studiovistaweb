'use client';

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'card' | 'paypal' | 'bank';
  specialInstructions?: string;
}

import Image from 'next/image';
import { useState, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { TextureLoader } from 'three';
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

const translations = {
  hr: {
    thankYou: {
      title: 'Hvala vam na narudžbi!',
      subtitle: 'Vaša narudžba je uspješno zaprimljena',
      orderNumber: 'Broj narudžbe:',
      description:
        'Poslat ćemo vam e-mail s potvrdom i detaljima o vašoj narudžbi. Možete koristiti broj narudžbe za praćenje statusa.',
      tracking: 'Koristite ovaj broj za praćenje vaše narudžbe',
      processing:
        'Vaša narudžba se trenutno obrađuje i uskoro ćete primiti ažuriranje.',
      closeButton: 'Zatvori',
      newOrderButton: 'Nova narudžba',
    },
  },
  en: {
    thankYou: {
      title: 'Thank You for Your Order!',
      subtitle: 'Your order has been successfully received',
      orderNumber: 'Order Number:',
      description:
        "We'll send you an email confirmation with your order details. You can use the order number to track your status.",
      tracking: 'Use this number to track your order',
      processing:
        'Your order is currently being processed and you will receive an update soon.',
      closeButton: 'Close',
      newOrderButton: 'New Order',
    },
  },
};

// 3D Canvas Component
interface Canvas3DProps {
  imageUrl: string;
  printType: 'canvas' | 'framed' | 'sticker';
  dimensions: { width: number; height: number };
  frameColor?: 'black' | 'silver';
}

function Canvas3D({
  imageUrl,
  printType,
  dimensions,
  frameColor = 'black',
}: Canvas3DProps) {
  const texture = useLoader(TextureLoader, imageUrl);
  const { width, height } = dimensions;

  const frameColors = {
    black: { color: '#2a2a2a', metalness: 0.7, roughness: 0.2 },
    silver: { color: '#c0c0c0', metalness: 0.3, roughness: 0.6 },
  };

  return (
    <group>
      {/* Main Wall Background - clean white wall */}
      <mesh position={[0, 0, -3]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial
          color='#faf9f7'
          roughness={0.9}
          metalness={0.02}
        />
      </mesh>

      {/* Wall texture pattern - vertical subtle lines */}
      <mesh position={[0, 0, -2.998]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial
          transparent
          opacity={0.08}
          color='#e8e6e3'
          roughness={1.0}
        />
      </mesh>

      {/* Subtle wall panel lines for depth */}
      <mesh position={[-6, 0, -2.997]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 12, 0.005]} />
        <meshStandardMaterial color='#ebe9e6' roughness={0.8} />
      </mesh>
      <mesh position={[6, 0, -2.997]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.02, 12, 0.005]} />
        <meshStandardMaterial color='#ebe9e6' roughness={0.8} />
      </mesh>

      {/* Crown molding at top */}
      <mesh position={[0, 6.5, -2.95]} rotation={[0, 0, 0]}>
        <boxGeometry args={[20, 0.3, 0.1]} />
        <meshStandardMaterial color='#f8f6f3' roughness={0.7} />
      </mesh>

      {/* Hardwood Floor with planks */}
      <mesh
        position={[0, -6, -1]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color='#c4a577' roughness={0.6} metalness={0.1} />
      </mesh>

      {/* Floor wood plank lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh
          key={`plank-${i}`}
          position={[0, -5.99, -8 + i * 2]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <boxGeometry args={[20, 0.02, 0.005]} />
          <meshStandardMaterial color='#a68b5b' roughness={0.8} />
        </mesh>
      ))}

      {/* Baseboard molding */}
      <mesh position={[0, -5.7, -2.85]} rotation={[0, 0, 0]}>
        <boxGeometry args={[20, 0.3, 0.15]} />
        <meshStandardMaterial color='#f2f0ed' roughness={0.6} />
      </mesh>

      {/* Baseboard shadow line */}
      <mesh position={[0, -5.8, -2.84]} rotation={[0, 0, 0]}>
        <boxGeometry args={[20, 0.05, 0.01]} />
        <meshStandardMaterial color='#ddd8d2' roughness={0.9} />
      </mesh>

      {/* Soft gradient shadow from floor lighting */}
      <mesh position={[0, -3, -2.985]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 4]} />
        <meshStandardMaterial transparent opacity={0.02} color='#d4c1a8' />
      </mesh>

      {/* Upper wall subtle highlight */}
      <mesh position={[0, 3, -2.985]} rotation={[0, 0, 0]}>
        <planeGeometry args={[20, 4]} />
        <meshStandardMaterial transparent opacity={0.03} color='#ffffff' />
      </mesh>

      {/* Canvas Print */}
      {printType === 'canvas' && (
        <>
          {/* Simple shadow on wall behind canvas */}
          <mesh rotation={[0, 0, 0]} position={[0.03, -0.03, -2.98]}>
            <planeGeometry args={[width + 0.02, height + 0.02]} />
            <meshBasicMaterial transparent opacity={0.08} color='#000000' />
          </mesh>

          {/* Main canvas with image - edge to edge */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, -2.94]} castShadow>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.7}
              bumpScale={0.03}
            />
          </mesh>

          {/* Canvas texture overlay */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, -2.93]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              transparent
              opacity={0.1}
              color='#ffffff'
              roughness={1.0}
              bumpScale={0.04}
            />
          </mesh>

          {/* Canvas wrapped edges with image continuation */}
          <mesh
            position={[width / 2 + 0.01, 0, -2.97]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <planeGeometry args={[0.06, height]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.8}
              color='#f0f0f0'
            />
          </mesh>
          <mesh
            position={[-width / 2 - 0.01, 0, -2.97]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[0.06, height]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.8}
              color='#f0f0f0'
            />
          </mesh>
          <mesh
            position={[0, height / 2 + 0.01, -2.97]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[width, 0.06]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.8}
              color='#f0f0f0'
            />
          </mesh>
          <mesh
            position={[0, -height / 2 - 0.01, -2.97]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[width, 0.06]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.8}
              color='#f0f0f0'
            />
          </mesh>

          {/* Wooden stretcher bars - right at the edges */}
          {/* Top bar */}
          <mesh position={[0, height / 2 - 0.05, -2.99]} rotation={[0, 0, 0]}>
            <boxGeometry args={[width, 0.1, 0.08]} />
            <meshStandardMaterial color='#8B4513' roughness={0.9} />
          </mesh>
          {/* Bottom bar */}
          <mesh position={[0, -height / 2 + 0.05, -2.99]} rotation={[0, 0, 0]}>
            <boxGeometry args={[width, 0.1, 0.08]} />
            <meshStandardMaterial color='#8B4513' roughness={0.9} />
          </mesh>
          {/* Left bar */}
          <mesh position={[-width / 2 + 0.05, 0, -2.99]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.1, height, 0.08]} />
            <meshStandardMaterial color='#8B4513' roughness={0.9} />
          </mesh>
          {/* Right bar */}
          <mesh position={[width / 2 - 0.05, 0, -2.99]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.1, height, 0.08]} />
            <meshStandardMaterial color='#8B4513' roughness={0.9} />
          </mesh>
        </>
      )}

      {/* Framed Print */}
      {printType === 'framed' && (
        <>
          {/* Simple shadow on wall behind frame */}
          <mesh rotation={[0, 0, 0]} position={[0.04, -0.04, -2.985]}>
            <planeGeometry args={[width + 0.16, height + 0.16]} />
            <meshBasicMaterial transparent opacity={0.1} color='#000000' />
          </mesh>

          {/* Thin Metal Frame with Proper Mitered Corners */}
          <group>
            {/* Left frame - full height (render first to be behind corners) */}
            <mesh position={[-width / 2 - 0.03, 0, -2.95]} castShadow>
              <boxGeometry args={[0.06, height + 0.12, 0.04]} />
              <meshStandardMaterial
                color={frameColors[frameColor].color}
                metalness={frameColors[frameColor].metalness}
                roughness={frameColors[frameColor].roughness}
              />
            </mesh>
            {/* Right frame - full height (render first to be behind corners) */}
            <mesh position={[width / 2 + 0.03, 0, -2.95]} castShadow>
              <boxGeometry args={[0.06, height + 0.12, 0.04]} />
              <meshStandardMaterial
                color={frameColors[frameColor].color}
                metalness={frameColors[frameColor].metalness}
                roughness={frameColors[frameColor].roughness}
              />
            </mesh>

            {/* Top frame - full width to overlap side frames */}
            <mesh position={[0, height / 2 + 0.03, -2.949]} castShadow>
              <boxGeometry args={[width + 0.12, 0.06, 0.041]} />
              <meshStandardMaterial
                color={frameColors[frameColor].color}
                metalness={frameColors[frameColor].metalness}
                roughness={frameColors[frameColor].roughness}
              />
            </mesh>
            {/* Bottom frame - full width to overlap side frames */}
            <mesh position={[0, -height / 2 - 0.03, -2.949]} castShadow>
              <boxGeometry args={[width + 0.12, 0.06, 0.041]} />
              <meshStandardMaterial
                color={frameColors[frameColor].color}
                metalness={frameColors[frameColor].metalness}
                roughness={frameColors[frameColor].roughness}
              />
            </mesh>
          </group>

          {/* Minimal white matting */}
          <mesh position={[0, 0, -2.91]}>
            <planeGeometry args={[width + 0.04, height + 0.04]} />
            <meshStandardMaterial color='#ffffff' roughness={0.9} />
          </mesh>

          {/* Image - much larger */}
          <mesh position={[0, 0, -2.9]} castShadow>
            <planeGeometry args={[width * 0.95, height * 0.95]} />
            <meshStandardMaterial map={texture} />
          </mesh>

          {/* Glass effect */}
          <mesh position={[0, 0, -2.89]}>
            <planeGeometry args={[width + 0.02, height + 0.02]} />
            <meshStandardMaterial
              transparent
              opacity={0.03}
              color='#ffffff'
              roughness={0}
              metalness={0}
            />
          </mesh>
        </>
      )}

      {/* Wall Sticker */}
      {printType === 'sticker' && (
        <>
          {/* Main sticker - flat against wall, no shadow */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, -2.99]}>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.3}
              metalness={0}
              transparent={false}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

// 3D Scene Component
interface PrintPreview3DProps {
  imageUrl: string | null;
  printType: 'canvas' | 'framed' | 'sticker';
  dimensions: { width: number; height: number };
  frameColor?: 'black' | 'silver';
}

function PrintPreview3D({
  imageUrl,
  printType,
  dimensions,
  frameColor = 'black',
}: PrintPreview3DProps) {
  return (
    <div className='w-full h-full'>
      <Canvas
        camera={{ position: [0, 1, 8], fov: 45 }}
        style={{
          background:
            'linear-gradient(to bottom, #f5f3f0 0%, #ebe8e4 50%, #e2ddd7 100%)',
        }}
        shadows
      >
        <Suspense fallback={null}>
          <Environment preset='apartment' />
          <ambientLight intensity={0.6} />

          {/* Main window light from upper right */}
          <directionalLight
            position={[8, 6, 4]}
            intensity={0.7}
            color='#fff8f0'
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0001}
          />

          {/* Warm ceiling light */}
          <spotLight
            position={[0, 7, 0]}
            angle={0.8}
            penumbra={0.6}
            intensity={0.4}
            color='#fff2e6'
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-bias={-0.0001}
          />

          {/* Dedicated shadow-casting light for wall prints */}
          <directionalLight
            position={[3, 4, 2]}
            intensity={0.3}
            color='#ffffff'
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={20}
            shadow-camera-left={-5}
            shadow-camera-right={5}
            shadow-camera-top={5}
            shadow-camera-bottom={-5}
            shadow-bias={-0.0001}
          />

          {/* Soft fill from left side */}
          <pointLight position={[-6, 2, 1]} intensity={0.2} color='#f5f0ea' />

          {/* Floor bounce light */}
          <pointLight position={[0, -4, -2]} intensity={0.15} color='#e6d4c1' />

          {imageUrl && (
            <Canvas3D
              imageUrl={imageUrl}
              printType={printType}
              dimensions={dimensions}
              frameColor={frameColor}
            />
          )}

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface ProductModalProps {
  isModalOpen: boolean;
  modalStep: 'customize' | 'order' | 'thank-you';
  closeModal: () => void;
  uploadedImage: string | null;
  selectedPrintType: 'canvas' | 'framed' | 'sticker';
  selectedSize: string;
  selectedFrameColor: 'black' | 'silver';
  orderData: OrderData;
  completedOrderId: string;
  isUploading: boolean;
  uploadError: string | null;
  setUploadedImage: (image: string | null) => void;
  setSelectedPrintType: (type: 'canvas' | 'framed' | 'sticker') => void;
  setSelectedSize: (size: string) => void;
  setSelectedFrameColor: (color: 'black' | 'silver') => void;
  setOrderData: (data: OrderData) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContinueOrder: () => void;
  handleBackToCustomize: () => void;
  handleCompleteOrder: () => void;
  getCurrentPrice: () => number;
  getCurrentDimensions: () => { width: number; height: number };
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  sizeOptions: {
    [key: string]: {
      name: string;
      canvas: number;
      framed: number;
      sticker: number;
      dimensions: { width: number; height: number };
    };
  };
}

export default function ProductModal({
  isModalOpen,
  modalStep,
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
  const [language] = useState<'hr' | 'en'>('hr');
  const t = translations[language];

  if (!isModalOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md'>
      <div className='w-full max-w-6xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex relative'>
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
                          className='mx-auto text-gray-700 mb-4'
                        />
                        <p className='text-lg font-medium text-gray-900 mb-2'>
                          Dodaj svoju sliku
                        </p>
                        <p className='text-sm text-gray-700 font-medium'>
                          Podržani formati: JPG, PNG, WebP, TIFF, BMP
                        </p>
                        <p className='text-xs text-gray-700 mt-1'>
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
                  <button
                    onClick={() => setSelectedPrintType('canvas')}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                      selectedPrintType === 'canvas'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className='font-medium'>Canvas print</div>
                  </button>
                  <button
                    onClick={() => setSelectedPrintType('framed')}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                      selectedPrintType === 'framed'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className='font-medium'>Uokvireni print</div>
                  </button>
                  <button
                    onClick={() => setSelectedPrintType('sticker')}
                    className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                      selectedPrintType === 'sticker'
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    <div className='font-medium'>Zidna naljepnica</div>
                  </button>
                </div>
              </div>

              {/* Size Selection */}
              <div className='mb-6'>
                <h4 className='text-md font-bold text-gray-900 mb-3'>
                  Veličina
                </h4>
                <div className='grid grid-cols-2 gap-2'>
                  {Object.entries(sizeOptions).map(([key, option]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedSize(key)}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        selectedSize === key
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className='font-medium text-sm'>{option.name}</div>
                      <div className='text-xs mt-1'>
                        €{option[selectedPrintType]}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frame Color Selection (only for framed) */}
              {selectedPrintType === 'framed' && (
                <div className='mb-6'>
                  <h4 className='text-md font-bold text-gray-900 mb-3'>
                    Boja okvira
                  </h4>
                  <div className='flex gap-3'>
                    <button
                      onClick={() => setSelectedFrameColor('black')}
                      className={`flex-1 p-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                        selectedFrameColor === 'black'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className='w-4 h-4 bg-gray-800 rounded-sm border border-gray-300'></div>
                      <span className='text-sm font-medium'>Crna</span>
                    </button>
                    <button
                      onClick={() => setSelectedFrameColor('silver')}
                      className={`flex-1 p-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${
                        selectedFrameColor === 'silver'
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                    >
                      <div className='w-4 h-4 bg-gray-400 rounded-sm border border-gray-300'></div>
                      <span className='text-sm font-medium'>Srebrna</span>
                    </button>
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
                  <PrintPreview3D
                    imageUrl={uploadedImage}
                    printType={selectedPrintType}
                    dimensions={getCurrentDimensions()}
                    frameColor={selectedFrameColor}
                  />
                ) : (
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <div className='text-center text-gray-800'>
                      <ImageIcon
                        size={48}
                        className='mx-auto mb-3 text-gray-700'
                      />
                      <p className='text-lg font-medium mb-2 text-gray-800'>
                        Dodaj sliku za pregled
                      </p>
                      <p className='text-sm text-gray-800'>
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
                  <p className='text-lg text-gray-700 mb-6'>
                    {t.thankYou.subtitle}
                  </p>
                </div>

                <div className='bg-gray-50 rounded-2xl p-6 mb-6'>
                  <p className='text-sm text-gray-700 mb-2'>
                    {t.thankYou.orderNumber}
                  </p>
                  <p className='text-2xl font-mono font-bold text-gray-900 mb-4'>
                    #{completedOrderId}
                  </p>
                  <p className='text-sm text-gray-800'>{t.thankYou.tracking}</p>
                </div>

                <div className='space-y-4 mb-8'>
                  <p className='text-gray-700'>{t.thankYou.description}</p>
                  <p className='text-sm text-gray-700'>
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
            <div className='flex flex-1'>
              {/* Left Side - Customer Info Form */}
              <div className='w-1/2 p-8 overflow-y-auto'>
                <div className='max-w-2xl mx-auto'>
                  <div className='mb-8'>
                    <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                      Podaci za dostavu
                    </h2>
                    <p className='text-gray-800'>
                      Unesite svoje podatke za dostavu narudžbe
                    </p>
                  </div>

                  <div className='space-y-8 bg-gray-50 p-8 rounded-2xl shadow-sm'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-semibold text-gray-900 mb-2'>
                            Ime *
                          </label>
                          <input
                            type='text'
                            value={orderData.firstName}
                            onChange={(e) =>
                              setOrderData({
                                ...orderData,
                                firstName: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500'
                            placeholder='Vaše ime'
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-semibold text-gray-900 mb-2'>
                            Prezime *
                          </label>
                          <input
                            type='text'
                            value={orderData.lastName}
                            onChange={(e) =>
                              setOrderData({
                                ...orderData,
                                lastName: e.target.value,
                              })
                            }
                            className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500'
                            placeholder='Vaše prezime'
                          />
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-semibold text-gray-900 mb-2'>
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
                          className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500'
                          placeholder='vas.email@primjer.com'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
                        Broj telefona
                      </label>
                      <input
                        type='tel'
                        value={orderData.phone}
                        onChange={(e) =>
                          setOrderData({ ...orderData, phone: e.target.value })
                        }
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500'
                        placeholder='+385 xx xxx xxxx'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-2'>
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
                        className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500'
                        placeholder='Ulica i kućni broj'
                      />
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='block text-sm font-semibold text-gray-900 mb-2'>
                          Grad *
                        </label>
                        <input
                          type='text'
                          value={orderData.city}
                          onChange={(e) =>
                            setOrderData({ ...orderData, city: e.target.value })
                          }
                          className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500'
                          placeholder='Zagreb'
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-semibold text-gray-900 mb-2'>
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
                          className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500'
                          placeholder='10000'
                        />
                      </div>
                    </div>

                    <div>
                      <label className='block text-sm font-semibold text-gray-900 mb-3'>
                        Način plaćanja *
                      </label>
                      <div className='space-y-3'>
                        <label className='flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md'>
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
                          <span className='font-semibold text-gray-900'>
                            Kreditna/debitna kartica
                          </span>
                        </label>
                        <label className='flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md'>
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
                          <span className='font-semibold text-gray-900'>
                            PayPal
                          </span>
                        </label>
                        <label className='flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md'>
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
                          <span className='font-semibold text-gray-900'>
                            Bankovni transfer
                          </span>
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
                        <p className='text-sm text-gray-700'>
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
                        <span className='font-semibold text-gray-900'>
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
          <div className='max-w-6xl mx-auto flex items-center justify-between'>
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
                      !orderData.firstName ||
                      !orderData.lastName ||
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
