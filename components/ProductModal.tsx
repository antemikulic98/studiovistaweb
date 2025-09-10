'use client';

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'stripe' | 'cod' | 'bank';
  specialInstructions?: string;
}

import Image from 'next/image';
import { useState, Suspense, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { TextureLoader } from 'three';
import {
  Upload,
  X,
  CreditCard,
  Building,
  Shield,
  Award,
  ChevronLeft,
  CheckCircle,
  Truck,
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
} from 'lucide-react';
// No longer need Stripe Elements for checkout flow

// Removed unused translations - success step is now handled directly in Croatian

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
        camera={{ position: [0, 1, 12], fov: 50 }}
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
            minDistance={6}
            maxDistance={20}
            maxPolarAngle={Math.PI / 2.2}
            minPolarAngle={Math.PI / 6}
            target={[0, 0, 0]}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

interface CartItem {
  id: string;
  imageFile: File;
  previewUrl: string;
  printType: 'canvas' | 'framed' | 'sticker';
  size: string;
  frameColor: 'black' | 'silver';
  quantity: number;
  price: number;
}

interface ProductModalProps {
  isModalOpen: boolean;
  modalStep: 'customize' | 'order' | 'thank-you';
  closeModal: () => void;
  cartItems: CartItem[];
  currentImage: { file: File; previewUrl: string } | null;
  selectedPrintType: 'canvas' | 'framed' | 'sticker';
  selectedSize: string;
  selectedFrameColor: 'black' | 'silver';
  quantity: number;
  orderData: OrderData;
  isUploading: boolean;
  uploadError: string | null;
  removeFromCart: (itemId: string) => void;
  handleAddToCart: () => void;
  setSelectedPrintType: (type: 'canvas' | 'framed' | 'sticker') => void;
  setSelectedSize: (size: string) => void;
  setSelectedFrameColor: (color: 'black' | 'silver') => void;
  setQuantity: (quantity: number) => void;
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
  cartItems,
  currentImage,
  selectedPrintType,
  selectedSize,
  selectedFrameColor,
  quantity,
  orderData,
  isUploading,
  uploadError,
  removeFromCart,
  handleAddToCart,
  setSelectedPrintType,
  setSelectedSize,
  setSelectedFrameColor,
  setQuantity,
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
  const [openMobileStep, setOpenMobileStep] = useState<1 | 2 | 3>(1);
  const [openOrderStep, setOpenOrderStep] = useState<1 | 2>(1);

  // Handle Stripe Checkout redirect
  const handleStripeCheckout = async () => {
    try {
      // Store order data in localStorage before redirecting to Stripe
      const orderDataForStripe = {
        customerData: {
          name: `${orderData.firstName} ${orderData.lastName}`.trim(),
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          postalCode: orderData.postalCode,
          paymentMethod: 'stripe' as const,
        },
        printData: {
          type: selectedPrintType,
          size: sizeOptions[selectedSize as keyof typeof sizeOptions].name,
          frameColor:
            selectedPrintType === 'framed' ? selectedFrameColor : undefined,
          price: getCurrentPrice(),
          quantity: quantity,
          imageUrls: cartItems.map((item) => item.previewUrl), // Will be replaced with actual URLs during checkout
        },
        status: 'paid', // Stripe payments are immediately paid
      };

      // Store in localStorage
      localStorage.setItem(
        'pendingStripeOrder',
        JSON.stringify(orderDataForStripe)
      );

      console.log('💾 Stored order data for Stripe:', orderDataForStripe);

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: cartItems.reduce((sum, item) => sum + item.price, 0),
          orderData: orderData,
          printData: {
            type: selectedPrintType,
            size: sizeOptions[selectedSize as keyof typeof sizeOptions].name,
            frameColor:
              selectedPrintType === 'framed' ? selectedFrameColor : undefined,
            quantity: quantity,
            imageUrls: cartItems.map((item) => item.previewUrl), // Will be replaced with actual URLs during checkout
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Stripe checkout error:', error);
      alert('Greška pri kreiranju plaćanja. Molimo pokušajte ponovno.');
    }
  };

  // Non-Stripe order submission
  const submitOrder = async () => {
    try {
      // Create order object for non-Stripe payments
      const order = {
        customerData: {
          name: `${orderData.firstName} ${orderData.lastName}`.trim(),
          email: orderData.email,
          phone: orderData.phone,
          address: orderData.address,
          city: orderData.city,
          postalCode: orderData.postalCode,
          paymentMethod: orderData.paymentMethod,
        },
        printData: {
          type: selectedPrintType,
          size: sizeOptions[selectedSize as keyof typeof sizeOptions].name,
          frameColor:
            selectedPrintType === 'framed' ? selectedFrameColor : undefined,
          price: getCurrentPrice(),
          quantity: quantity,
          imageUrls: cartItems.map((item) => item.previewUrl), // Will be replaced with actual URLs during checkout
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      console.log('💾 Submitting order:', order);

      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Order creation failed: ${errorText}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit order');
      }

      console.log('✅ Order submitted successfully:', result);

      // Trigger the existing complete order flow
      handleCompleteOrder();
    } catch (error) {
      console.error('❌ Order submission error:', error);
      throw error;
    }
  };

  // Auto-progress through steps on mobile
  useEffect(() => {
    if (currentImage && openMobileStep === 1) {
      setOpenMobileStep(2); // Auto-open step 2 when image is uploaded
    }
  }, [currentImage, openMobileStep]);

  if (!isModalOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md p-4 md:p-8'>
      <div className='w-full max-h-[95vh] md:max-w-6xl md:max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col relative'>
        {modalStep === 'customize' && (
          <>
            {/* Header */}
            <div className='sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 z-10'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                  Stvori print
                </h2>
                <button
                  onClick={closeModal}
                  className='p-3 md:p-2 hover:bg-gray-100 rounded-xl transition-colors touch-manipulation'
                >
                  <X size={28} className='md:w-6 md:h-6' />
                </button>
              </div>
            </div>

            {/* Content - Responsive Layout */}
            <div className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
              {/* Left Column - Controls (Mobile: full width, Desktop: 1/2) */}
              <div className='flex-1 lg:w-1/2 overflow-y-auto'>
                <div className='p-4 md:p-6 space-y-6'>
                  {/* Step 1: Upload Image */}
                  <div className='bg-gray-50 rounded-2xl overflow-hidden'>
                    <button
                      onClick={() => setOpenMobileStep(1)}
                      className='lg:pointer-events-none w-full p-4 md:p-6 flex items-center justify-between text-left lg:cursor-default hover:bg-gray-100 lg:hover:bg-transparent transition-colors'
                    >
                      <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            cartItems.length > 0
                              ? 'bg-green-600'
                              : 'bg-blue-600'
                          }`}
                        >
                          {currentImage ? (
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          ) : (
                            '1'
                          )}
                        </div>
                        Dodaj svoju sliku
                      </h3>
                      <div className='lg:hidden'>
                        {openMobileStep === 1 ? (
                          <ChevronUp size={24} className='text-gray-700' />
                        ) : (
                          <ChevronDown size={24} className='text-gray-700' />
                        )}
                      </div>
                    </button>

                    <div
                      className={`px-4 pb-4 md:px-6 md:pb-6 lg:pt-0 lg:block ${
                        openMobileStep === 1 ? 'block' : 'hidden lg:block'
                      }`}
                    >
                      {!currentImage ? (
                        <div>
                          <div
                            onClick={() => {
                              console.log(
                                '🖱️ Upload area clicked, isUploading:',
                                isUploading
                              );
                              if (!isUploading && fileInputRef.current) {
                                console.log('🔄 Triggering file input click');
                                fileInputRef.current.click();
                              } else {
                                console.log(
                                  '❌ File input not triggered - isUploading:',
                                  isUploading,
                                  'fileInputRef:',
                                  fileInputRef.current
                                );
                              }
                            }}
                            className={`border-2 border-dashed rounded-xl p-6 md:p-8 text-center transition-colors touch-manipulation ${
                              isUploading
                                ? 'border-blue-300 bg-blue-50 cursor-not-allowed'
                                : 'border-gray-300 cursor-pointer hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100'
                            }`}
                          >
                            <Upload
                              size={40}
                              className='mx-auto text-gray-700 mb-3'
                            />
                            <p className='text-base md:text-lg font-medium text-gray-900 mb-2'>
                              Dodaj svoje slike
                            </p>
                            <p className='text-sm text-gray-700 font-medium mb-1'>
                              Podržani formati: JPG, PNG, WebP, TIFF, BMP
                            </p>
                            <p className='text-xs text-gray-600'>
                              Maksimalna veličina: 10MB po slici | Maksimalno 5
                              slika
                            </p>
                          </div>

                          {uploadError && (
                            <div className='mt-3 p-3 bg-red-50 border border-red-200 rounded-lg'>
                              <p className='text-sm text-red-800 font-medium'>
                                ⚠️ {uploadError}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className='space-y-4'>
                          {/* Current Image Preview */}
                          <div className='mb-4'>
                            <div className='relative rounded-xl overflow-hidden group max-w-xs mx-auto'>
                              <Image
                                src={currentImage.previewUrl}
                                alt='Current image'
                                width={300}
                                height={200}
                                className='w-full h-48 object-cover'
                              />
                              <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                <span className='text-white text-sm font-medium'>
                                  Klikom promjeni sliku
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Add to Cart Button */}
                          <button
                            onClick={handleAddToCart}
                            className='w-full py-3 px-4 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors mb-4'
                          >
                            🛒 Dodaj u košaricu - €
                            {getCurrentPrice() * quantity}
                          </button>

                          {/* Upload Different Image */}
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className='w-full py-2 px-4 border border-blue-600 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors'
                          >
                            📷 Odaberi drugu sliku
                          </button>
                          {/* Cart Preview */}
                          {cartItems.length > 0 && (
                            <div className='bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4'>
                              <p className='text-sm text-blue-700 font-medium text-center'>
                                🛒 Košarica: {cartItems.length} proizvod
                                {cartItems.length > 1 ? 'a' : ''}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        multiple
                        onChange={handleFileUpload}
                        className='hidden'
                      />
                    </div>
                  </div>

                  {/* Step 2: Choose Type & Size */}
                  <div className='bg-gray-50 rounded-2xl overflow-hidden'>
                    <button
                      onClick={() => setOpenMobileStep(2)}
                      className='lg:pointer-events-none w-full p-4 md:p-6 flex items-center justify-between text-left lg:cursor-default hover:bg-gray-100 lg:hover:bg-transparent transition-colors'
                    >
                      <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            selectedSize && selectedPrintType
                              ? 'bg-green-600'
                              : 'bg-blue-600'
                          }`}
                        >
                          {selectedSize && selectedPrintType ? (
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          ) : (
                            '2'
                          )}
                        </div>
                        Odaberi tip i veličinu
                      </h3>
                      <div className='lg:hidden'>
                        {openMobileStep === 2 ? (
                          <ChevronUp size={24} className='text-gray-700' />
                        ) : (
                          <ChevronDown size={24} className='text-gray-700' />
                        )}
                      </div>
                    </button>

                    <div
                      className={`px-4 pb-4 md:px-6 md:pb-6 lg:pt-0 lg:block ${
                        openMobileStep === 2 ? 'block' : 'hidden lg:block'
                      }`}
                    >
                      {/* Print Type */}
                      <div className='mb-6'>
                        <h4 className='text-sm font-semibold text-gray-800 mb-3'>
                          Tip printa
                        </h4>
                        <div className='grid grid-cols-1 gap-3'>
                          <button
                            onClick={() => setSelectedPrintType('canvas')}
                            className={`w-full p-4 rounded-xl text-left transition-all duration-200 touch-manipulation ${
                              selectedPrintType === 'canvas'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                            }`}
                          >
                            <div className='font-medium'>Canvas print</div>
                            <div className='text-xs mt-1 opacity-75'>
                              Premium platno, galerijski omotan
                            </div>
                          </button>
                          <button
                            onClick={() => setSelectedPrintType('framed')}
                            className={`w-full p-4 rounded-xl text-left transition-all duration-200 touch-manipulation ${
                              selectedPrintType === 'framed'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                            }`}
                          >
                            <div className='font-medium'>Uokvireni print</div>
                            <div className='text-xs mt-1 opacity-75'>
                              S premium okvirom po izboru
                            </div>
                          </button>
                          <button
                            onClick={() => setSelectedPrintType('sticker')}
                            className={`w-full p-4 rounded-xl text-left transition-all duration-200 touch-manipulation ${
                              selectedPrintType === 'sticker'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                            }`}
                          >
                            <div className='font-medium'>Zidna naljepnica</div>
                            <div className='text-xs mt-1 opacity-75'>
                              Vodootporna, lako za nanošenje
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Size Selection */}
                      <div className='mb-4'>
                        <h4 className='text-sm font-semibold text-gray-800 mb-3'>
                          Veličina
                        </h4>
                        <div className='grid grid-cols-2 gap-3'>
                          {Object.entries(sizeOptions).map(([key, option]) => (
                            <button
                              key={key}
                              onClick={() => setSelectedSize(key)}
                              className={`p-4 rounded-xl text-center transition-all duration-200 touch-manipulation ${
                                selectedSize === key
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                              }`}
                            >
                              <div className='font-medium text-sm'>
                                {option.name}
                              </div>
                              <div className='text-lg font-bold mt-1'>
                                €{option[selectedPrintType]}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Frame Color Selection (only for framed) */}
                      {selectedPrintType === 'framed' && (
                        <div className='mt-4'>
                          <h4 className='text-sm font-semibold text-gray-800 mb-3'>
                            Boja okvira
                          </h4>
                          <div className='grid grid-cols-2 gap-3'>
                            <button
                              onClick={() => setSelectedFrameColor('black')}
                              className={`p-4 rounded-xl transition-all duration-200 flex items-center gap-3 touch-manipulation ${
                                selectedFrameColor === 'black'
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                              }`}
                            >
                              <div className='w-6 h-6 bg-gray-800 rounded border border-gray-300'></div>
                              <span className='font-medium'>Crna</span>
                            </button>
                            <button
                              onClick={() => setSelectedFrameColor('silver')}
                              className={`p-4 rounded-xl transition-all duration-200 flex items-center gap-3 touch-manipulation ${
                                selectedFrameColor === 'silver'
                                  ? 'bg-blue-600 text-white shadow-lg'
                                  : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200'
                              }`}
                            >
                              <div className='w-6 h-6 bg-gray-400 rounded border border-gray-300'></div>
                              <span className='font-medium'>Srebrna</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Quantity Selection */}
                      <div className='mt-4'>
                        <h4 className='text-sm font-semibold text-gray-800 mb-3'>
                          Količina
                        </h4>
                        <div className='flex items-center justify-center bg-white border border-gray-200 rounded-xl p-2 max-w-[140px]'>
                          <button
                            onClick={() =>
                              setQuantity(Math.max(1, quantity - 1))
                            }
                            disabled={quantity <= 1}
                            className='flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          >
                            <Minus size={16} className='text-gray-600' />
                          </button>
                          <span className='mx-4 min-w-[2rem] text-center font-semibold text-gray-900'>
                            {quantity}
                          </span>
                          <button
                            onClick={() =>
                              setQuantity(Math.min(10, quantity + 1))
                            }
                            disabled={quantity >= 10}
                            className='flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                          >
                            <Plus size={16} className='text-gray-600' />
                          </button>
                        </div>
                        <p className='text-xs text-gray-500 mt-2'>
                          Maksimalno 10 primjeraka po narudžbi
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Preview (Accordion - Mobile Only) */}
                  <div className='lg:hidden'>
                    {cartItems.length > 0 && (
                      <div className='bg-gray-50 rounded-2xl overflow-hidden'>
                        <button
                          onClick={() => setOpenMobileStep(3)}
                          className='w-full p-4 md:p-6 flex items-center justify-between text-left hover:bg-gray-100 transition-colors touch-manipulation'
                        >
                          <div className='flex items-center gap-2'>
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                                cartItems.length > 0 && openMobileStep >= 3
                                  ? 'bg-green-600'
                                  : 'bg-blue-600'
                              }`}
                            >
                              {cartItems.length > 0 && openMobileStep >= 3 ? (
                                <svg
                                  className='w-4 h-4'
                                  fill='currentColor'
                                  viewBox='0 0 20 20'
                                >
                                  <path
                                    fillRule='evenodd'
                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                    clipRule='evenodd'
                                  />
                                </svg>
                              ) : (
                                '3'
                              )}
                            </div>
                            <h3 className='text-lg font-bold text-gray-900'>
                              3D Pregled
                            </h3>
                          </div>
                          {openMobileStep === 3 ? (
                            <ChevronUp size={24} className='text-gray-700' />
                          ) : (
                            <ChevronDown size={24} className='text-gray-700' />
                          )}
                        </button>

                        {openMobileStep === 3 && (
                          <div className='border-t border-gray-200 bg-white'>
                            <div className='p-4 md:p-6'>
                              <div className='relative h-64 md:h-80 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner'>
                                <PrintPreview3D
                                  imageUrl={
                                    currentImage ? currentImage.previewUrl : ''
                                  }
                                  printType={selectedPrintType}
                                  dimensions={getCurrentDimensions()}
                                  frameColor={selectedFrameColor}
                                />
                              </div>
                              <div className='mt-4 text-center'>
                                <p className='text-sm text-gray-600'>
                                  Povuci i zavrti za pregled sa svih strana
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Spacer for better scrolling */}
                  <div className='h-8'></div>
                </div>
              </div>

              {/* Right Column - 3D Preview (Desktop Only) */}
              <div className='hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200'>
                <div className='p-6 h-full flex flex-col'>
                  <div className='flex items-center gap-2 mb-4'>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                        cartItems.length > 0 ? 'bg-green-600' : 'bg-blue-600'
                      }`}
                    >
                      {cartItems.length > 0 ? (
                        <svg
                          className='w-4 h-4'
                          fill='currentColor'
                          viewBox='0 0 20 20'
                        >
                          <path
                            fillRule='evenodd'
                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                            clipRule='evenodd'
                          />
                        </svg>
                      ) : (
                        '3'
                      )}
                    </div>
                    <h3 className='text-lg font-bold text-gray-900'>
                      3D Pregled
                    </h3>
                  </div>

                  <div className='flex-1 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner'>
                    {cartItems.length > 0 ? (
                      <PrintPreview3D
                        imageUrl={currentImage ? currentImage.previewUrl : ''}
                        printType={selectedPrintType}
                        dimensions={getCurrentDimensions()}
                        frameColor={selectedFrameColor}
                      />
                    ) : (
                      <div className='h-full flex items-center justify-center'>
                        <div className='text-center text-gray-500'>
                          <Upload size={48} className='mx-auto mb-3' />
                          <p className='text-lg font-medium mb-2'>
                            Dodaj sliku za pregled
                          </p>
                          <p className='text-sm'>
                            Vidiš kako će tvoj print izgledati na zidu
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {cartItems.length > 0 && (
                    <div className='mt-4 text-center'>
                      <p className='text-sm text-gray-600'>
                        Povuci i zavrti za pregled sa svih strana
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {modalStep === 'thank-you' && (
          <>
            <div className='flex-1 flex items-center justify-center p-4 md:p-8'>
              <div className='bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[95vh] overflow-hidden'>
                {/* Success Animation */}
                <div className='p-6 text-center space-y-6 max-h-[85vh] overflow-y-auto'>
                  <div className='w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce'>
                    <CheckCircle size={40} className='text-green-600' />
                  </div>

                  {/* Success Message */}
                  <div className='space-y-4'>
                    <h2 className='text-2xl lg:text-3xl font-bold text-gray-900'>
                      Plaćanje uspješno!
                    </h2>
                    <p className='text-gray-800 text-base lg:text-lg font-medium'>
                      Hvala vam na kupovini! Vaša narudžba je uspješno
                      zaprimljena i obrađuje se.
                    </p>
                  </div>

                  {/* Order Number */}
                  <div className='bg-blue-50 rounded-xl p-4 border border-blue-200'>
                    <div className='text-center'>
                      <p className='text-blue-700 text-sm font-semibold mb-2'>
                        BROJ NARUDŽBE
                      </p>
                      <p className='text-2xl font-mono font-bold text-blue-900 tracking-wider'>
                        #{new Date().getFullYear()}
                        {String(new Date().getMonth() + 1).padStart(2, '0')}
                        {String(new Date().getDate()).padStart(2, '0')}-
                        {String(Math.floor(Math.random() * 10000)).padStart(
                          4,
                          '0'
                        )}
                      </p>
                      <p className='text-blue-700 text-xs mt-2'>
                        Sačuvajte ovaj broj za praćenje narudžbe
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className='bg-gray-50 rounded-xl p-4 lg:p-6 text-left border border-gray-200'>
                    <h3 className='font-bold text-gray-900 mb-4 text-lg'>
                      Vaša narudžba
                    </h3>
                    <div className='space-y-3 text-sm lg:text-base'>
                      <div className='flex justify-between'>
                        <span className='text-gray-800 font-medium'>
                          {selectedPrintType === 'canvas'
                            ? 'Canvas Print'
                            : selectedPrintType === 'framed'
                            ? 'Uokvireni Print'
                            : 'Zidni Sticker'}
                        </span>
                        <span className='font-semibold text-gray-900'>
                          {
                            sizeOptions[
                              selectedSize as keyof typeof sizeOptions
                            ].name
                          }
                        </span>
                      </div>
                      {selectedPrintType === 'framed' && (
                        <div className='flex justify-between'>
                          <span className='text-gray-800 font-medium'>
                            Boja okvira
                          </span>
                          <span className='font-semibold text-gray-900'>
                            {selectedFrameColor === 'black'
                              ? 'Crni'
                              : 'Srebrni'}
                          </span>
                        </div>
                      )}
                      <div className='flex justify-between'>
                        <span className='text-gray-800 font-medium'>
                          Način plaćanja
                        </span>
                        <span className='font-semibold text-gray-900'>
                          Kreditna kartica
                        </span>
                      </div>
                      <div className='flex justify-between pt-3 border-t border-gray-300'>
                        <span className='font-bold text-gray-900'>Ukupno</span>
                        <span className='font-bold text-lg lg:text-xl text-green-600'>
                          €
                          {(
                            getCurrentPrice() *
                            quantity *
                            cartItems.length
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className='bg-green-50 rounded-xl p-4 lg:p-6 text-left border border-green-200'>
                    <h3 className='font-bold text-green-900 mb-4 text-lg'>
                      Što sada?
                    </h3>
                    <div className='space-y-3 text-sm lg:text-base text-green-800'>
                      <div className='flex items-center gap-3'>
                        <CheckCircle
                          size={18}
                          className='text-green-600 flex-shrink-0'
                        />
                        <span className='font-medium'>
                          Poslat ćemo vam email potvrdu
                        </span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <CheckCircle
                          size={18}
                          className='text-green-600 flex-shrink-0'
                        />
                        <span className='font-medium'>
                          Vaš print će biti spreman za 3-5 radnih dana
                        </span>
                      </div>
                      <div className='flex items-center gap-3'>
                        <Truck
                          size={18}
                          className='text-green-600 flex-shrink-0'
                        />
                        <span className='font-medium'>
                          Javit ćemo vam kada bude poslan
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={closeModal}
                    className='w-full bg-blue-600 text-white py-3 lg:py-4 px-8 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-base lg:text-lg'
                  >
                    Povratak na početnu
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {modalStep === 'order' && (
          <>
            {/* Header */}
            <div className='sticky top-0 bg-white border-b border-gray-200 p-4 md:p-6 z-10'>
              <div className='flex items-center justify-between'>
                <h2 className='text-xl md:text-2xl font-bold text-gray-900'>
                  Narudžba
                </h2>
                <button
                  onClick={closeModal}
                  className='p-3 md:p-2 hover:bg-gray-100 rounded-xl transition-colors touch-manipulation'
                >
                  <X size={28} className='md:w-6 md:h-6' />
                </button>
              </div>
            </div>

            {/* Content - Responsive Layout */}
            <div className='flex-1 flex flex-col lg:flex-row overflow-hidden'>
              {/* Left Column - Form (Mobile: full width, Desktop: 1/2) */}
              <div className='flex-1 lg:w-1/2 overflow-y-auto'>
                <div className='p-4 md:p-6 space-y-6'>
                  {/* Step 1: Delivery Info */}
                  <div className='bg-gray-50 rounded-2xl overflow-hidden'>
                    <button
                      onClick={() => setOpenOrderStep(1)}
                      className='lg:pointer-events-none w-full p-4 md:p-6 flex items-center justify-between text-left lg:cursor-default hover:bg-gray-100 lg:hover:bg-transparent transition-colors'
                    >
                      <h3 className='text-lg font-bold text-gray-900 flex items-center gap-2'>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                            orderData.firstName &&
                            orderData.lastName &&
                            orderData.email &&
                            orderData.address &&
                            orderData.city &&
                            orderData.postalCode
                              ? 'bg-green-600'
                              : 'bg-blue-600'
                          }`}
                        >
                          {orderData.firstName &&
                          orderData.lastName &&
                          orderData.email &&
                          orderData.address &&
                          orderData.city &&
                          orderData.postalCode ? (
                            <svg
                              className='w-4 h-4'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                clipRule='evenodd'
                              />
                            </svg>
                          ) : (
                            '1'
                          )}
                        </div>
                        Podaci za dostavu
                      </h3>
                      <div className='lg:hidden'>
                        {openOrderStep === 1 ? (
                          <ChevronUp size={24} className='text-gray-700' />
                        ) : (
                          <ChevronDown size={24} className='text-gray-700' />
                        )}
                      </div>
                    </button>

                    <div
                      className={`px-4 pb-4 md:px-6 md:pb-6 lg:pt-0 lg:block ${
                        openOrderStep === 1 ? 'block' : 'hidden lg:block'
                      }`}
                    >
                      <p className='text-gray-600 text-sm mb-6'>
                        Unesite svoje podatke za dostavu narudžbe
                      </p>

                      <div className='space-y-6'>
                        <div className='grid grid-cols-1 gap-4 md:gap-6'>
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
                                className='w-full px-4 py-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500 touch-manipulation text-base md:text-sm'
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
                                className='w-full px-4 py-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500 touch-manipulation text-base md:text-sm'
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
                              className='w-full px-4 py-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500 touch-manipulation text-base md:text-sm'
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
                              setOrderData({
                                ...orderData,
                                phone: e.target.value,
                              })
                            }
                            className='w-full px-4 py-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500 touch-manipulation text-base md:text-sm'
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
                            className='w-full px-4 py-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500 touch-manipulation text-base md:text-sm'
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
                                setOrderData({
                                  ...orderData,
                                  city: e.target.value,
                                })
                              }
                              className='w-full px-4 py-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500 touch-manipulation text-base md:text-sm'
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
                              className='w-full px-4 py-4 md:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 text-gray-900 placeholder-gray-500 touch-manipulation text-base md:text-sm'
                              placeholder='10000'
                            />
                          </div>
                        </div>

                        <div>
                          <label className='block text-sm font-semibold text-gray-900 mb-4'>
                            Odaberite način plaćanja *
                          </label>
                          <div className='space-y-3'>
                            {/* Stripe Credit Card */}
                            <div
                              className={`relative border-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                                orderData.paymentMethod === 'stripe'
                                  ? 'border-blue-500 bg-blue-50 shadow-md'
                                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
                              }`}
                            >
                              <label className='flex items-center p-5 cursor-pointer'>
                                <input
                                  type='radio'
                                  name='paymentMethod'
                                  value='stripe'
                                  checked={orderData.paymentMethod === 'stripe'}
                                  onChange={(e) =>
                                    setOrderData({
                                      ...orderData,
                                      paymentMethod: e.target.value as 'stripe',
                                    })
                                  }
                                  className='sr-only'
                                />
                                <div
                                  className={`w-5 h-5 border-2 rounded-full mr-4 flex items-center justify-center ${
                                    orderData.paymentMethod === 'stripe'
                                      ? 'border-blue-500 bg-blue-500'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {orderData.paymentMethod === 'stripe' && (
                                    <div className='w-2 h-2 bg-white rounded-full' />
                                  )}
                                </div>
                                <div className='flex items-center flex-1'>
                                  <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4'>
                                    <CreditCard
                                      size={24}
                                      className='text-white'
                                    />
                                  </div>
                                  <div className='flex-1'>
                                    <div className='flex items-center gap-2'>
                                      <span className='font-semibold text-gray-900'>
                                        Kreditna/debitna kartica
                                      </span>
                                      <div className='px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full'>
                                        Preporučeno
                                      </div>
                                    </div>
                                    <p className='text-sm text-gray-600 mt-1'>
                                      Siguran i brz Stripe
                                    </p>
                                    <div className='flex items-center gap-2 mt-2'>
                                      <div className='flex gap-1'>
                                        <div className='w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold'>
                                          VISA
                                        </div>
                                        <div className='w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold'>
                                          MC
                                        </div>
                                        <div className='w-8 h-5 bg-blue-800 rounded text-white text-xs flex items-center justify-center font-bold'>
                                          AX
                                        </div>
                                      </div>
                                      <span className='text-xs text-gray-500'>
                                        i ostalo
                                      </span>
                                    </div>
                                  </div>
                                  <div className='flex items-center gap-1 text-green-600'>
                                    <Shield size={16} />
                                    <span className='text-sm font-medium'>
                                      Sigurno
                                    </span>
                                  </div>
                                </div>
                              </label>
                            </div>

                            {/* Cash on Delivery */}
                            <div
                              className={`relative border-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                                orderData.paymentMethod === 'cod'
                                  ? 'border-orange-500 bg-orange-50 shadow-md'
                                  : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                              }`}
                            >
                              <label className='flex items-center p-5 cursor-pointer'>
                                <input
                                  type='radio'
                                  name='paymentMethod'
                                  value='cod'
                                  checked={orderData.paymentMethod === 'cod'}
                                  onChange={(e) =>
                                    setOrderData({
                                      ...orderData,
                                      paymentMethod: e.target.value as 'cod',
                                    })
                                  }
                                  className='sr-only'
                                />
                                <div
                                  className={`w-5 h-5 border-2 rounded-full mr-4 flex items-center justify-center ${
                                    orderData.paymentMethod === 'cod'
                                      ? 'border-orange-500 bg-orange-500'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {orderData.paymentMethod === 'cod' && (
                                    <div className='w-2 h-2 bg-white rounded-full' />
                                  )}
                                </div>
                                <div className='flex items-center flex-1'>
                                  <div className='w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mr-4'>
                                    <Truck size={24} className='text-white' />
                                  </div>
                                  <div className='flex-1'>
                                    <span className='font-semibold text-gray-900'>
                                      Pouzeće
                                    </span>
                                    <p className='text-sm text-gray-600 mt-1'>
                                      Plaćanje gotovinom pri dostavi
                                    </p>
                                    <p className='text-xs text-orange-600 mt-1'>
                                      + €2.50 manipulativni troškovi
                                    </p>
                                  </div>
                                  <div className='text-right'>
                                    <div className='text-sm font-medium text-gray-900'>
                                      2-3 dana
                                    </div>
                                    <div className='text-xs text-gray-500'>
                                      dostava
                                    </div>
                                  </div>
                                </div>
                              </label>
                            </div>

                            {/* Bank Transfer */}
                            <div
                              className={`relative border-2 rounded-2xl transition-all duration-200 cursor-pointer ${
                                orderData.paymentMethod === 'bank'
                                  ? 'border-green-500 bg-green-50 shadow-md'
                                  : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-sm'
                              }`}
                            >
                              <label className='flex items-center p-5 cursor-pointer'>
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
                                  className='sr-only'
                                />
                                <div
                                  className={`w-5 h-5 border-2 rounded-full mr-4 flex items-center justify-center ${
                                    orderData.paymentMethod === 'bank'
                                      ? 'border-green-500 bg-green-500'
                                      : 'border-gray-300'
                                  }`}
                                >
                                  {orderData.paymentMethod === 'bank' && (
                                    <div className='w-2 h-2 bg-white rounded-full' />
                                  )}
                                </div>
                                <div className='flex items-center flex-1'>
                                  <div className='w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-4'>
                                    <Building
                                      size={24}
                                      className='text-white'
                                    />
                                  </div>
                                  <div className='flex-1'>
                                    <span className='font-semibold text-gray-900'>
                                      Bankovni transfer
                                    </span>
                                    <p className='text-sm text-gray-600 mt-1'>
                                      Direktan transfer na račun
                                    </p>
                                    <p className='text-xs text-green-600 mt-1'>
                                      Bez dodatnih troškova
                                    </p>
                                  </div>
                                  <div className='text-right'>
                                    <div className='text-sm font-medium text-gray-900'>
                                      1-2 dana
                                    </div>
                                    <div className='text-xs text-gray-500'>
                                      obradi
                                    </div>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>

                          {/* Stripe Checkout Information - Show when Stripe is selected */}
                          {orderData.paymentMethod === 'stripe' && (
                            <div className='mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl'>
                              <div className='flex items-start gap-4'>
                                <div className='w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0'>
                                  <CreditCard
                                    size={24}
                                    className='text-white'
                                  />
                                </div>
                                <div className='flex-1'>
                                  <h4 className='font-semibold text-gray-900 mb-2'>
                                    Sigurno plaćanje preko Stripe
                                  </h4>
                                  <p className='text-sm text-gray-700 mb-3'>
                                    Bit ćete preusmjereni na sigurnu Stripe
                                    stranicu za unos podataka o kartici.
                                  </p>
                                  <div className='flex items-center gap-4 text-sm text-gray-600'>
                                    <div className='flex items-center gap-1'>
                                      <Shield
                                        size={16}
                                        className='text-green-600'
                                      />
                                      <span>SSL sigurno</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                      <CheckCircle
                                        size={16}
                                        className='text-green-600'
                                      />
                                      <span>PCI DSS</span>
                                    </div>
                                    <div className='flex items-center gap-1'>
                                      <Award
                                        size={16}
                                        className='text-green-600'
                                      />
                                      <span>Stripe zaštićeno</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Information for other payment methods */}
                          {orderData.paymentMethod === 'cod' && (
                            <div className='mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl'>
                              <div className='flex items-start gap-3'>
                                <Truck
                                  size={20}
                                  className='text-orange-600 mt-1'
                                />
                                <div>
                                  <h4 className='font-semibold text-gray-900 mb-2'>
                                    Plaćanje pouzeće
                                  </h4>
                                  <ul className='text-sm text-gray-700 space-y-1'>
                                    <li>
                                      • Plaćate gotovinom kuriru pri dostavi
                                    </li>
                                    <li>
                                      • Dodatnih €2.50 manipulativnih troškova
                                    </li>
                                    <li>• Dostava 2-3 radna dana</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          {orderData.paymentMethod === 'bank' && (
                            <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-xl'>
                              <div className='flex items-start gap-3'>
                                <Building
                                  size={20}
                                  className='text-green-600 mt-1'
                                />
                                <div>
                                  <h4 className='font-semibold text-gray-900 mb-2'>
                                    Bankovni transfer
                                  </h4>
                                  <div className='text-sm text-gray-700 space-y-2'>
                                    <p>
                                      Molimo izvršite transfer na sljedeći
                                      račun:
                                    </p>
                                    <div className='bg-white p-3 rounded border font-mono text-xs'>
                                      <div className='grid grid-cols-1 gap-1'>
                                        <span>
                                          <strong>Banka:</strong> Zagrebačka
                                          banka d.d.
                                        </span>
                                        <span>
                                          <strong>IBAN:</strong>{' '}
                                          HR1234567890123456789
                                        </span>
                                        <span>
                                          <strong>SWIFT:</strong> ZABAHR2X
                                        </span>
                                        <span>
                                          <strong>Iznos:</strong> €
                                          {getCurrentPrice()}
                                        </span>
                                      </div>
                                    </div>
                                    <p className='text-xs text-gray-600'>
                                      Vaša narudžba će biti obrađena nakon
                                      potvrde uplate (1-2 radna dana).
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Order Summary (Accordion - Mobile Only) */}
                  <div className='lg:hidden'>
                    <div className='bg-gray-50 rounded-2xl overflow-hidden'>
                      <button
                        onClick={() => setOpenOrderStep(2)}
                        className='w-full p-4 md:p-6 flex items-center justify-between text-left hover:bg-gray-100 transition-colors touch-manipulation'
                      >
                        <div className='flex items-center gap-2'>
                          <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                            2
                          </div>
                          <h3 className='text-lg font-bold text-gray-900'>
                            Sažetak narudžbe
                          </h3>
                        </div>
                        {openOrderStep === 2 ? (
                          <ChevronUp size={24} className='text-gray-700' />
                        ) : (
                          <ChevronDown size={24} className='text-gray-700' />
                        )}
                      </button>

                      {openOrderStep === 2 && (
                        <div className='border-t border-gray-200 bg-white p-4 md:p-6'>
                          {currentImage && (
                            <div className='bg-white rounded-xl p-6 mb-6 shadow-sm'>
                              <div className='flex items-center gap-4 mb-4'>
                                <Image
                                  src={cartItems[0]?.previewUrl || ''}
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
                                    €
                                    {(
                                      getCurrentPrice() *
                                      quantity *
                                      cartItems.length
                                    ).toFixed(2)}
                                  </span>
                                  {(quantity > 1 || cartItems.length > 1) && (
                                    <div className='text-xs text-gray-500'>
                                      €{getCurrentPrice()} × {quantity}
                                      {cartItems.length > 1
                                        ? ` × ${cartItems.length} slika`
                                        : ''}
                                    </div>
                                  )}
                                </div>
                                <div className='flex justify-between text-sm text-gray-800'>
                                  <span>Dostava:</span>
                                  <span className='text-green-600 font-medium'>
                                    Besplatno
                                  </span>
                                </div>
                                <div className='flex justify-between font-bold text-lg pt-2 border-t text-gray-900'>
                                  <span>Ukupno:</span>
                                  <span>
                                    €{(getCurrentPrice() * quantity).toFixed(2)}
                                  </span>
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
                      )}
                    </div>
                  </div>

                  {/* Spacer for better scrolling */}
                  <div className='h-8'></div>
                </div>
              </div>

              {/* Right Column - Order Summary (Desktop Only) */}
              <div className='hidden lg:block lg:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 border-l border-gray-200'>
                <div className='p-6 h-full flex flex-col'>
                  <div className='flex items-center gap-2 mb-4'>
                    <div className='w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                      2
                    </div>
                    <h3 className='text-lg font-bold text-gray-900'>
                      Sažetak narudžbe
                    </h3>
                  </div>

                  <div className='flex-1 space-y-6'>
                    {cartItems.length > 0 && (
                      <div className='bg-white rounded-xl p-6 shadow-sm'>
                        <div className='flex items-center gap-4 mb-4'>
                          <Image
                            src={cartItems[0]?.previewUrl || ''}
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
                              €
                              {(
                                getCurrentPrice() *
                                quantity *
                                cartItems.length
                              ).toFixed(2)}
                            </span>
                            {(quantity > 1 || cartItems.length > 1) && (
                              <div className='text-xs text-gray-500'>
                                €{getCurrentPrice()} × {quantity}
                                {cartItems.length > 1
                                  ? ` × ${cartItems.length} slika`
                                  : ''}
                              </div>
                            )}
                          </div>
                          <div className='flex justify-between text-sm text-gray-800'>
                            <span>Dostava:</span>
                            <span className='text-green-600 font-medium'>
                              Besplatno
                            </span>
                          </div>
                          <div className='flex justify-between font-bold text-lg pt-2 border-t text-gray-900'>
                            <span>Ukupno:</span>
                            <span>
                              €{(getCurrentPrice() * quantity).toFixed(2)}
                            </span>
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
              </div>
            </div>
          </>
        )}

        {/* Modal Footer */}
        {modalStep === 'customize' && (
          <div className='sticky bottom-0 bg-white border-t border-gray-200 p-4 lg:p-4 z-10'>
            <div className='max-w-6xl mx-auto'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-6 gap-4'>
                {/* Price Info */}
                <div className='flex-1 lg:flex lg:items-center lg:gap-4'>
                  {cartItems.length > 0 ? (
                    <div className='bg-gray-50 lg:bg-transparent rounded-xl p-4 lg:p-0 lg:flex lg:items-center lg:gap-4'>
                      <div className='flex justify-between lg:justify-start lg:gap-2 items-center mb-2 lg:mb-0'>
                        <span className='text-sm text-gray-600'>Cijena:</span>
                        <span className='text-2xl lg:text-xl font-bold text-gray-900'>
                          €
                          {(
                            getCurrentPrice() *
                            quantity *
                            cartItems.length
                          ).toFixed(2)}
                        </span>
                        {(quantity > 1 || cartItems.length > 1) && (
                          <span className='text-sm text-gray-600 ml-2'>
                            (€{getCurrentPrice()} × {quantity}
                            {cartItems.length > 1
                              ? ` × ${cartItems.length} slika`
                              : ''}
                            )
                          </span>
                        )}
                      </div>
                      <div className='flex justify-between lg:justify-start lg:gap-4 items-center text-sm text-gray-600'>
                        <span>
                          {sizeOptions[selectedSize]?.name} •{' '}
                          {selectedPrintType === 'canvas'
                            ? 'Canvas'
                            : selectedPrintType === 'framed'
                            ? 'Uokvireni'
                            : 'Sticker'}
                        </span>
                        <span className='lg:border-l lg:border-gray-300 lg:pl-4'>
                          Dostava{' '}
                          {selectedPrintType === 'framed'
                            ? '5-7'
                            : selectedPrintType === 'sticker'
                            ? '2-3'
                            : '3-5'}{' '}
                          dana
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className='text-gray-500 text-center lg:text-left lg:py-2'>
                      Dodaj sliku da vidiš cijenu
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row gap-3 lg:flex-row lg:gap-3 lg:flex-shrink-0'>
                  <button
                    onClick={closeModal}
                    className='flex-1 lg:flex-initial px-6 py-4 lg:py-2 lg:px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors touch-manipulation lg:whitespace-nowrap'
                  >
                    Odustani
                  </button>
                  <button
                    onClick={handleContinueOrder}
                    disabled={cartItems.length === 0}
                    className='flex-1 lg:flex-initial px-6 py-4 lg:py-2 lg:px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed touch-manipulation lg:whitespace-nowrap'
                  >
                    Nastavi narudžbu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {modalStep === 'order' && (
          <div className='sticky bottom-0 bg-white border-t border-gray-200 p-4 lg:p-4 z-10'>
            <div className='max-w-6xl mx-auto'>
              <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6'>
                <button
                  onClick={handleBackToCustomize}
                  className='flex items-center justify-center lg:justify-start gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors lg:order-1'
                >
                  <ChevronLeft size={20} />
                  Nazad na uređivanje
                </button>

                <div className='flex flex-col sm:flex-row gap-3 lg:flex-row lg:gap-3 lg:flex-shrink-0 lg:order-2'>
                  <button
                    onClick={closeModal}
                    className='flex-1 lg:flex-initial px-6 py-4 lg:py-2 lg:px-4 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors touch-manipulation lg:whitespace-nowrap'
                  >
                    Odustani
                  </button>
                  {/* Submit button for all payment methods */}
                  <button
                    onClick={() => {
                      if (orderData.paymentMethod === 'stripe') {
                        handleStripeCheckout();
                      } else {
                        submitOrder();
                      }
                    }}
                    disabled={
                      !orderData.firstName ||
                      !orderData.lastName ||
                      !orderData.email ||
                      !orderData.address ||
                      !orderData.city ||
                      !orderData.postalCode ||
                      !orderData.paymentMethod
                    }
                    className='flex-1 lg:flex-initial px-6 py-4 lg:py-2 lg:px-4 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed touch-manipulation lg:whitespace-nowrap'
                  >
                    <span className='lg:hidden'>
                      {orderData.paymentMethod === 'stripe'
                        ? 'Završi plaćanje'
                        : orderData.paymentMethod === 'cod'
                        ? 'Naruči pouzeće'
                        : orderData.paymentMethod === 'bank'
                        ? 'Potvrdi narudžbu'
                        : 'Završi narudžbu'}
                    </span>
                    <span className='hidden lg:inline'>
                      {orderData.paymentMethod === 'stripe'
                        ? 'Završi plaćanje'
                        : orderData.paymentMethod === 'cod'
                        ? 'Naruči pouzeće'
                        : orderData.paymentMethod === 'bank'
                        ? 'Potvrdi narudžbu'
                        : 'Završi narudžbu'}{' '}
                      • €{getCurrentPrice()}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
