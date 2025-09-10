'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
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
import AboutUs from '../components/AboutUs';
import Footer from '../components/Footer';
import translations from '../lib/translations';

function HomeContent() {
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<'hr' | 'en'>('hr');
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Cart system - each item has its own configuration
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

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentImage, setCurrentImage] = useState<{
    file: File;
    previewUrl: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedPrintType, setSelectedPrintType] = useState<
    'canvas' | 'framed' | 'sticker' | ''
  >('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedFrameColor, setSelectedFrameColor] = useState<
    'black' | 'silver'
  >('black');
  const [quantity, setQuantity] = useState<number>(1);
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
    if (!selectedSize || !selectedPrintType) return 0;
    const size = sizeOptions[selectedSize as keyof typeof sizeOptions];
    if (!size) return 0;
    return size[selectedPrintType as keyof typeof size] as number;
  };

  const getCurrentDimensions = () => {
    if (!selectedSize) return { width: 30, height: 20 }; // Default dimensions
    const size = sizeOptions[selectedSize as keyof typeof sizeOptions];
    return size ? size.dimensions : { width: 30, height: 20 };
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log('🔄 handleFileUpload called', event);
    const files = Array.from(event.target.files || []);
    console.log('📁 Files selected:', files.length, files);
    if (files.length === 0) {
      console.log('❌ No files selected');
      return;
    }

    // Reset previous error
    setUploadError(null);

    // Only allow one file at a time for configuration
    const file = files[0];

    setIsUploading(true);

    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error(`Datoteka ${file.name} nije slika`);
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error(
          `Slika ${file.name} je prevelika. Maksimalna veličina je 10MB`
        );
      }

      // Clean up previous image if exists
      if (currentImage) {
        URL.revokeObjectURL(currentImage.previewUrl);
      }

      // Create preview URL (no upload to server yet!)
      console.log('🖼️ Creating preview for:', file.name);
      const previewUrl = URL.createObjectURL(file);
      console.log('✅ Preview created - ready for configuration');

      setCurrentImage({
        file: file,
        previewUrl: previewUrl,
      });

      console.log('✅ Image loaded, ready for configuration');
    } catch (error) {
      console.error('❌ File selection error:', error);
      setUploadError(
        error instanceof Error ? error.message : 'File selection failed'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = (printType?: 'canvas' | 'framed' | 'sticker') => {
    if (printType) setSelectedPrintType(printType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCartItems([]);
    setCurrentImage(null);
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

    // Clean up image URLs if needed (they're already uploaded to server)
  };

  const handleAddToCart = () => {
    if (!currentImage || !selectedPrintType || !selectedSize) return;

    const cartItem: CartItem = {
      id: `${Date.now()}-${Math.random()}`,
      imageFile: currentImage.file,
      previewUrl: currentImage.previewUrl,
      printType: selectedPrintType as 'canvas' | 'framed' | 'sticker',
      size: selectedSize,
      frameColor: selectedFrameColor,
      quantity: quantity,
      price: getCurrentPrice() * quantity,
    };

    setCartItems((prev) => [...prev, cartItem]);
    console.log('🛒 Added to cart:', cartItem);

    // Reset current image and form
    setCurrentImage(null);
    setSelectedSize('');
    setSelectedPrintType('');
    setSelectedFrameColor('black');
    setQuantity(1);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleContinueOrder = () => {
    if (cartItems.length > 0) {
      setModalStep('order');
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const item = prev.find((item) => item.id === itemId);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((item) => item.id !== itemId);
    });
  };

  const handleBackToCustomize = () => {
    setModalStep('customize');
  };

  const handleCompleteOrder = async () => {
    try {
      setIsUploading(true);

      console.log('💳 Processing order - uploading images now...');

      // Upload each unique image file once and map to cart items
      const uploadedImages = new Map<File, string>();
      const finalOrders: Array<{
        customerData: {
          name: string;
          email: string;
          phone: string;
          address: string;
          city: string;
          postalCode: string;
          paymentMethod: string;
        };
        printData: {
          type: string;
          size: string;
          frameColor?: string;
          price: number;
          quantity: number;
          imageUrl: string;
        };
        status: string;
        createdAt: string;
      }> = [];

      for (const cartItem of cartItems) {
        let imageUrl: string;

        // Check if we already uploaded this file
        if (uploadedImages.has(cartItem.imageFile)) {
          imageUrl = uploadedImages.get(cartItem.imageFile)!;
          console.log('📋 Reusing already uploaded image:', imageUrl);
        } else {
          console.log('📤 Uploading to server:', cartItem.imageFile.name);
          const formData = new FormData();
          formData.append('file', cartItem.imageFile);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.error('Upload failed:', errorData);
            throw new Error(`Upload za ${cartItem.imageFile.name} neuspješan`);
          }

          const responseData = await response.json();
          console.log('📦 API Response:', responseData);

          if (!responseData.success) {
            throw new Error(
              responseData.error ||
                `Upload za ${cartItem.imageFile.name} neuspješan`
            );
          }

          const { imageUrl: uploadedUrl } = responseData;
          console.log('✅ Image uploaded successfully:', uploadedUrl);

          if (!uploadedUrl) {
            throw new Error(`Nema URL za ${cartItem.imageFile.name}`);
          }

          imageUrl = uploadedUrl;
          uploadedImages.set(cartItem.imageFile, imageUrl);
        }

        // Create order for this cart item
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
            type: cartItem.printType,
            size: sizeOptions[cartItem.size as keyof typeof sizeOptions].name,
            frameColor:
              cartItem.printType === 'framed' ? cartItem.frameColor : undefined,
            price: cartItem.price,
            quantity: cartItem.quantity,
            imageUrl: imageUrl, // Single image URL per order
          },
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        finalOrders.push(order);
      }

      console.log(
        '🔄 All images uploaded, processing',
        finalOrders.length,
        'orders'
      );

      // Process all orders
      const totalPrice = finalOrders.reduce(
        (sum, order) => sum + order.printData.price,
        0
      );

      console.log(
        '💾 Processing',
        finalOrders.length,
        'orders with total price:',
        totalPrice
      );

      // Submit all orders to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orders: finalOrders,
          totalPrice: totalPrice,
        }),
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

      // Image URLs are already processed and uploaded

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

      <AboutUs t={t} />

      <Footer t={t} />

      {/* Use ProductModal component */}
      <ProductModal
        isModalOpen={isModalOpen}
        modalStep={modalStep}
        closeModal={closeModal}
        cartItems={cartItems}
        currentImage={currentImage}
        selectedPrintType={selectedPrintType}
        selectedSize={selectedSize}
        selectedFrameColor={selectedFrameColor}
        orderData={orderData}
        isUploading={isUploading}
        uploadError={uploadError}
        removeFromCart={removeFromCart}
        handleAddToCart={handleAddToCart}
        setSelectedPrintType={setSelectedPrintType}
        setSelectedSize={setSelectedSize}
        setSelectedFrameColor={setSelectedFrameColor}
        quantity={quantity}
        setQuantity={setQuantity}
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

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-white flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4'></div>
            <p className='text-gray-600'>Loading...</p>
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
