'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';

// Extend Window interface for temporary file storage
declare global {
  interface Window {
    selectedImageFile?: File;
  }
}
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductModal from '../components/ProductModal';
import Products from '../components/Products';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import translations from '../lib/translations';

export default function Home() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<'hr' | 'en'>('hr');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPrintType, setSelectedPrintType] = useState<
    'canvas' | 'framed' | 'sticker'
  >('canvas');
  const [selectedSize, setSelectedSize] = useState<string>('30x20');
  const [selectedFrameColor, setSelectedFrameColor] = useState<
    'black' | 'silver'
  >('black');
  const [modalStep, setModalStep] = useState<
    'customize' | 'order' | 'thank-you'
  >('customize');
  // Payment success handling will show modal in thank-you step
  const [orderData, setOrderData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'stripe' as 'stripe' | 'cod' | 'bank',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = translations[language];

  // Size options with pricing (in EUR)
  const sizeOptions = {
    '20x15': {
      name: '20x15cm',
      canvas: 25,
      framed: 55,
      sticker: 15,
      dimensions: { width: 2.0, height: 1.5 },
    },
    '30x20': {
      name: '30x20cm',
      canvas: 45,
      framed: 79,
      sticker: 25,
      dimensions: { width: 3.0, height: 2.0 },
    },
    '40x30': {
      name: '40x30cm',
      canvas: 75,
      framed: 125,
      sticker: 35,
      dimensions: { width: 4.0, height: 3.0 },
    },
    '50x40': {
      name: '50x40cm',
      canvas: 110,
      framed: 180,
      sticker: 45,
      dimensions: { width: 5.0, height: 4.0 },
    },
    '60x40': {
      name: '60x40cm',
      canvas: 140,
      framed: 220,
      sticker: 55,
      dimensions: { width: 6.0, height: 4.0 },
    },
  };

  // Check for payment success on component mount
  useEffect(() => {
    const paymentSuccess = searchParams.get('payment_success');
    const sessionId = searchParams.get('session_id');

    if (paymentSuccess === 'true' && sessionId) {
      // Create order from stored data
      const createStripeOrder = async () => {
        try {
          const pendingOrderData = localStorage.getItem('pendingStripeOrder');
          if (!pendingOrderData) {
            console.error('No pending order data found');
            return;
          }

          const orderData = JSON.parse(pendingOrderData);
          console.log('💾 Creating Stripe order:', orderData);

          // Create order in database
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...orderData,
              timestamp: new Date(),
              status: 'paid', // Mark as paid since Stripe payment successful
              stripeSessionId: sessionId, // Store Stripe session ID
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Order creation failed: ${errorText}`);
          }

          const result = await response.json();
          if (!result.success) {
            throw new Error(result.error || 'Failed to create order');
          }

          console.log('✅ Stripe order created successfully:', result);

          // Clean up localStorage
          localStorage.removeItem('pendingStripeOrder');

          // Trigger confetti celebration
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });

          // Open modal in thank-you step
          setIsModalOpen(true);
          setModalStep('thank-you');
        } catch (error) {
          console.error('Error creating Stripe order:', error);
          alert('Greška pri kreiranje narudžbe. Molimo kontaktirajte podršku.');
        }
      };

      createStripeOrder();

      // Clean URL
      window.history.replaceState({}, '', '/');
    }

    const paymentCanceled = searchParams.get('payment_canceled');
    if (paymentCanceled === 'true') {
      // Clean up localStorage on cancel
      localStorage.removeItem('pendingStripeOrder');
      alert('Plaćanje je otkazano. Možete pokušati ponovno.');
      window.history.replaceState({}, '', '/');
    }
  }, [searchParams]);

  const getCurrentPrice = () => {
    const size = sizeOptions[selectedSize as keyof typeof sizeOptions];
    return size[selectedPrintType as keyof typeof size] as number;
  };

  const getCurrentDimensions = () => {
    return sizeOptions[selectedSize as keyof typeof sizeOptions].dimensions;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset previous states
    setUploadError(null);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Molimo odaberite sliku (JPG, PNG, WebP, TIFF, BMP)');
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Slika je prevelika. Maksimalna veličina je 10MB');
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Store file for later upload to DigitalOcean Spaces when order is completed
      window.selectedImageFile = file;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(
        error instanceof Error ? error.message : 'Greška pri obradi slike'
      );

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openModal = (printType?: 'canvas' | 'framed' | 'sticker') => {
    if (printType) setSelectedPrintType(printType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUploadedImage(null);
    setIsUploading(false);
    setUploadError(null);
    setSelectedSize('30x20'); // Reset to default size
    setSelectedFrameColor('black'); // Reset to default frame color
    setModalStep('customize'); // Reset to first step
    // Order state will be reset
    setOrderData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      paymentMethod: 'stripe' as 'stripe' | 'cod' | 'bank',
    });

    // Clear file input and temp file storage
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Clean up temporary file reference
    delete window.selectedImageFile;
  };

  const handleContinueOrder = () => {
    if (uploadedImage) {
      setModalStep('order');
    }
  };

  const handleBackToCustomize = () => {
    setModalStep('customize');
  };

  const handleCompleteOrder = async () => {
    try {
      setIsUploading(true);

      let finalImageUrl = uploadedImage;

      // Upload image to DigitalOcean Spaces if we have a file
      console.log('🔍 Debug info:', {
        hasSelectedImageFile: !!window.selectedImageFile,
        selectedImageFileType: window.selectedImageFile?.type,
        selectedImageFileName: window.selectedImageFile?.name,
        selectedImageFileSize: window.selectedImageFile?.size,
        uploadedImage: uploadedImage?.substring(0, 50) + '...',
        shouldUpload:
          window.selectedImageFile && !uploadedImage?.startsWith('https://'),
      });

      if (window.selectedImageFile && !uploadedImage?.startsWith('https://')) {
        console.log('📤 Uploading image to DigitalOcean Spaces...');

        try {
          const formData = new FormData();
          formData.append('file', window.selectedImageFile);
          formData.append('printSize', selectedSize);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (uploadResponse.ok) {
            const uploadResult = await uploadResponse.json();

            if (uploadResult.success) {
              finalImageUrl = uploadResult.imageUrl;
              console.log('✅ Image uploaded successfully:', finalImageUrl);
            } else {
              console.warn('⚠️ Image upload failed:', uploadResult.error);
              console.log('📝 Proceeding with order without cloud image URL');
            }
          } else {
            const errorText = await uploadResponse.text();
            console.warn('⚠️ Image upload failed:', errorText);
            console.log('📝 Proceeding with order without cloud image URL');
          }
        } catch (uploadError) {
          console.warn('⚠️ Image upload error:', uploadError);
          console.log('📝 Proceeding with order without cloud image URL');
        }
      }

      // Ensure we have some image URL (cloud URL or fallback to base64)
      if (!finalImageUrl && uploadedImage) {
        finalImageUrl = uploadedImage;
        console.log('🔄 Using base64 image data as fallback');
      }

      // Create order object
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
          imageUrl: finalImageUrl,
        },
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      console.log('💾 Saving order to database:', order);

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

      console.log('✅ Order saved successfully:', result);

      // Show thank you screen
      setModalStep('thank-you');

      // Clean up the temporary file reference
      if (window.selectedImageFile) {
        delete window.selectedImageFile;
      }

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Additional confetti burst after a short delay
      setTimeout(() => {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x: 0.25, y: 0.6 },
        });
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { x: 0.75, y: 0.6 },
        });
      }, 300);
    } catch (error) {
      console.error('❌ Error submitting order:', error);
      setUploadError(
        `Dogodila se greška pri slanju narudžbe: ${
          error instanceof Error ? error.message : 'Unknown error'
        }. Molimo pokušajte ponovno.`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      <Header
        language={language}
        setLanguage={setLanguage}
        translations={t}
        openModal={openModal}
      />

      <Hero translations={t} openModal={openModal} />

      <Products t={t} openModal={openModal} sizeOptions={sizeOptions} />

      <WhyChooseUs t={t} />

      <HowItWorks t={t} openModal={openModal} />

      <Testimonials t={t} />

      <CTASection t={t} openModal={openModal} />

      <Footer t={t} />

      {/* Use ProductModal component */}
      <ProductModal
        isModalOpen={isModalOpen}
        modalStep={modalStep}
        closeModal={closeModal}
        uploadedImage={uploadedImage}
        selectedPrintType={selectedPrintType}
        selectedSize={selectedSize}
        selectedFrameColor={selectedFrameColor}
        orderData={orderData}
        isUploading={isUploading}
        uploadError={uploadError}
        setUploadedImage={setUploadedImage}
        setSelectedPrintType={setSelectedPrintType}
        setSelectedSize={setSelectedSize}
        setSelectedFrameColor={setSelectedFrameColor}
        setOrderData={setOrderData}
        handleFileUpload={handleFileUpload}
        handleContinueOrder={handleContinueOrder}
        handleBackToCustomize={handleBackToCustomize}
        handleCompleteOrder={handleCompleteOrder}
        getCurrentPrice={getCurrentPrice}
        getCurrentDimensions={getCurrentDimensions}
        fileInputRef={fileInputRef}
        sizeOptions={sizeOptions}
      />
    </div>
  );
}
