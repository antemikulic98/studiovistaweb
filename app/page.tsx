'use client';

import { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import Header from '../components/Header';
import Hero from '../components/Hero';
import ProductModal from '../components/ProductModal';
import Products from '../components/Products';
import WhyChooseUs from '../components/WhyChooseUs';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';

const translations = {
  hr: {
    nav: {
      products: 'Proizvodi',
      process: 'Postupak',
      about: 'O nama',
      getStarted: 'Naruči sliku',
    },
    hero: {
      badge: 'Jamstvo vrhunske kvalitete',
      title: 'Pretvori',
      subtitle1: 'Svoj Prostor',
      subtitle2: 'U Umjetnost',
      description:
        'Profesionalni printovi na platnu i okviri po mjeri koji pretvaraju vaše najdraže uspomene u muzejsku kvalitetu zidne umjetnosti.',
      createButton: 'Stvori print',
      galleryButton: 'Pogledaj galeriju',
      stats: {
        customers: 'Zadovoljni kupci',
        rating: 'Ocjena',
        satisfaction: 'Zadovoljstvo',
      },
      floating: {
        shipping: 'Besplatna dostava',
        shippingDesc: 'Za narudžbe iznad 75€',
        framing: 'Okviri po mjeri',
        framingDesc: 'Profesionalna kvaliteta',
      },
    },
    products: {
      badge: 'Naši proizvodi',
      title: 'Odaberite svoj savršeni',
      subtitle: 'Stil printanja',
      description:
        'Od intimnih obiteljskih trenutaka do zadivljujućih krajolika, pretvaramo vaše uspomene u zapanjujuće zidne umjetnosti s tri različite premium opcije.',
      canvas: {
        popular: 'Najpopularniji',
        title: 'Canvas printovi',
        subtitle: 'Galerijska savršenost',
        description:
          'Premium pamučno platno s živopisnim, postojanim bojama. Galerijski omatani rubovi za profesionalni muzejski izgled.',
        from: 'Od',
        shipping: 'Dostava za',
        days: '3-5 dana',
        button: 'Prilagodi canvas',
      },
      framed: {
        premium: 'Premium izbor',
        title: 'Uokvireni printovi',
        subtitle: 'Luksuzna prezentacija',
        description:
          'Muzejska kvaliteta printova s premium podlogom i vašim izborom ručno izrađenih okvira u različitim završecima.',
        from: 'Od',
        shipping: 'Dostava za',
        days: '5-7 dana',
        button: 'Odaberi okvir',
      },
      sticker: {
        modern: 'Praktična opcija',
        title: 'Zidni sticker',
        subtitle: 'Brza aplikacija',
        description:
          'Vodootporna vinyl naljepnica visoke kvalitete koja se lako nanosi na bilo koju glatku površinu. Idealna za brzu dekoraciju.',
        from: 'Od',
        shipping: 'Dostava za',
        days: '2-3 dana',
        button: 'Odaberi sticker',
      },
    },
    process: {
      badge: 'Jednostavan postupak',
      title: 'Od uploada do',
      subtitle: 'zidne umjetnosti',
      description:
        'Naš optimizirani proces osigurava da vaše uspomene postanu prekrasne zidne umjetnosti s minimalnim naporom i maksimalnim utjecajem.',
      step1: {
        title: 'Pošaljite sliku',
        desc: 'Uploadajte svoju omiljenu fotografiju',
      },
      step2: {
        title: 'Prilagodite',
        desc: 'Odaberite veličinu i stil',
        description:
          'Uploadajte svoju sliku visoke rezolucije i odaberite željeni stil printa, veličinu i opcije završetka iz naše premium kolekcije.',
        heading: 'Upload i Odabir',
      },
      step3: {
        title: 'Primite',
        desc: 'Brza dostava na vaš prag',
        description:
          'Vidite točno kako će vaš print izgledati s našim naprednim sustavom pregleda. Prilagodite obrezivanje, boje i pozicioniranje dok ne bude savršeno.',
        heading: 'Pregled i Usavršavanje',
      },
      cta: 'Počnite stvarati sada',
    },
    quality: {
      title: 'Doživotna garancija kvalitete',
      subtitle: 'Premium materijali koji traju',
      satisfaction: 'Zadovoljstvo kupaca',
      check: 'Provjera kvalitete:',
      description:
        'UV-otporni, postojani materijali potkrijepljeni našim bezuvjetnim jamstvom zadovoljstva.',
      preview: 'Pretpregled pogodan za boje',
      turnaround: {
        title: 'Brzina izrade',
        description:
          'Većinu narudžbi obrađujemo i šaljemo u roku od 24-48 sati',
      },
      formats: {
        title: 'Podržani formati:',
        supported: 'JPG, PNG, TIFF, RAW',
      },
    },
    testimonials: {
      badge: 'Priče kupaca',
      title: 'Što kažu naši',
      subtitle: 'zadovoljni kupci',
      customers: 'Zadovoljni kupci',
      description:
        'Pridružite se tisućama zadovoljnih kupaca koji su transformirali svoje prostore našim premium printovima.',
      cta: {
        title: 'Transformirajte svoje prostore još danas',
        subtitle:
          'Pridružite se tisućama kupaca koji su transformirali svoje prostore. Uploadajte svoju fotografiju danas i vidite čarobnost na djelu.',
        ready: 'Spremni za početak?',
        pricing: 'Pogledaj cijene',
      },
      stats: {
        satisfactionRate: 'Zadovoljstvo korisnika',
        supportAvailable: 'Podrška dostupna',
      },
    },
    footer: {
      tagline:
        'Stvaramo premium canvas printove i okvire po mjeri koji pretvaraju vaše uspomene u vrhunsnu zidnu umjetnost.',
      products: {
        title: 'Proizvodi',
        canvas: 'Canvas printovi',
        framed: 'Uokvireni printovi',
        stickers: 'Zidni stickeri',
      },
      contact: {
        title: 'Stupite u kontakt',
        support: 'Korisnička podrška',
        hours: 'Pon-Pet 9:00-17:00',
        businessHours: 'Pon-Pet: 9:00-18:00',
      },
      features: {
        shipping: 'Besplatna dostava',
        shippingDesc: 'Narudžbe iznad 75€',
        quality: 'Garancija kvalitete',
        qualityDesc: '100% zadovoljstvo',
        support: 'Podrška 24/7',
        supportDesc: 'Uvijek tu za vas',
        turnaround: 'Brza izrada',
        turnaroundDesc: 'Dostava za 3-5 dana',
      },
      legal: {
        privacy: 'Pravila privatnosti',
        terms: 'Uvjeti korištenja',
      },
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
      copyright:
        '© 2024 Studio Vista. Sva prava zadržana. Izrađeno s preciznošću i strašću.',
    },
  },
  en: {
    nav: {
      products: 'Products',
      process: 'Process',
      about: 'About',
      getStarted: 'Get Started',
    },
    hero: {
      badge: 'Premium Quality Guaranteed',
      title: 'Transform',
      subtitle1: 'Your Space',
      subtitle2: 'Into Art',
      description:
        'Professional canvas prints and custom framing that turn your cherished memories into museum-quality wall art.',
      createButton: 'Create Your Print',
      galleryButton: 'View Gallery',
      stats: {
        customers: 'Happy Customers',
        rating: 'Rating',
        satisfaction: 'Satisfaction',
      },
      floating: {
        shipping: 'Free Shipping',
        shippingDesc: 'On orders over €75',
        framing: 'Custom Framing',
        framingDesc: 'Professional quality',
      },
    },
    products: {
      badge: 'Our Products',
      title: 'Choose Your Perfect',
      subtitle: 'Print Style',
      description:
        'From intimate family moments to breathtaking landscapes, we transform your memories into stunning wall art with three distinct premium options.',
      canvas: {
        popular: 'Most Popular',
        title: 'Canvas Prints',
        subtitle: 'Gallery-wrapped perfection',
        description:
          'Premium cotton canvas with vibrant, fade-resistant inks. Gallery-wrapped edges for a professional museum look.',
        from: 'From',
        shipping: 'Ships in',
        days: '3-5 days',
        button: 'Customize Canvas',
      },
      framed: {
        premium: 'Premium Choice',
        title: 'Framed Prints',
        subtitle: 'Luxury presentation',
        description:
          'Museum-quality prints with premium matting and your choice of handcrafted frames in various finishes.',
        from: 'From',
        shipping: 'Ships in',
        days: '5-7 days',
        button: 'Choose Frame',
      },
      sticker: {
        modern: 'Practical Option',
        title: 'Wall Sticker',
        subtitle: 'Quick application',
        description:
          'High-quality waterproof vinyl sticker that easily applies to any smooth surface. Perfect for quick decoration.',
        from: 'From',
        shipping: 'Ships in',
        days: '2-3 days',
        button: 'Choose Sticker',
      },
    },
    process: {
      badge: 'Simple Process',
      title: 'From Upload to',
      subtitle: 'Wall Art',
      description:
        'Our streamlined process ensures your memories become beautiful wall art with minimal effort and maximum impact.',
      step1: {
        title: 'Send Image',
        desc: 'Upload your favorite photo',
      },
      step2: {
        title: 'Customize',
        desc: 'Choose size and style',
        description:
          'Drop your high-resolution image and choose your preferred print style, size, and finishing options from our premium collection.',
        heading: 'Upload & Select',
      },
      step3: {
        title: 'Receive',
        desc: 'Fast delivery to your door',
        description:
          "See exactly how your print will look with our advanced preview system. Make adjustments to cropping, color, and placement until it's perfect.",
        heading: 'Preview & Perfect',
      },
      cta: 'Start Creating Now',
    },
    quality: {
      title: 'Lifetime Quality Promise',
      subtitle: 'Premium materials that last',
      satisfaction: 'Customer Satisfaction',
      check: 'Quality check:',
      description:
        'UV-resistant, fade-proof materials backed by our unconditional satisfaction guarantee.',
      preview: 'Color-matched preview',
      turnaround: {
        title: 'Lightning Fast Turnaround',
        description: 'Most orders processed and shipped within 24-48 hours',
      },
      formats: {
        title: 'Supported formats:',
        supported: 'JPG, PNG, TIFF, RAW',
      },
    },
    testimonials: {
      badge: 'Customer Stories',
      title: 'What Our',
      subtitle: 'Happy Clients Say',
      customers: 'Happy Customers',
      description:
        "Join thousands of happy customers who've transformed their spaces with our premium prints.",
      cta: {
        title: 'Transform Your Space Today',
        subtitle:
          "Join thousands of customers who've transformed their spaces. Upload your photo today and see the magic happen.",
        ready: 'Ready to Start?',
        pricing: 'View Pricing',
      },
      stats: {
        satisfactionRate: 'Satisfaction Rate',
        supportAvailable: 'Support Available',
      },
    },
    footer: {
      tagline:
        'Crafting premium canvas prints and custom framing that transforms your memories into museum-quality wall art.',
      products: {
        title: 'Products',
        canvas: 'Canvas Prints',
        framed: 'Framed Prints',
        stickers: 'Wall Stickers',
      },
      contact: {
        title: 'Get in Touch',
        support: 'Customer Support',
        hours: 'Mon-Fri 9:00-17:00',
        businessHours: 'Mon-Fri: 9AM-6PM PST',
      },
      features: {
        shipping: 'Free Shipping',
        shippingDesc: 'Orders over €75',
        quality: 'Quality Guaranteed',
        qualityDesc: '100% satisfaction',
        support: '24/7 Support',
        supportDesc: 'Always here for you',
        turnaround: 'Fast Turnaround',
        turnaroundDesc: 'Ships in 3-5 days',
      },
      legal: {
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
      },
      thankYou: {
        title: 'Thank You for Your Order!',
        subtitle: 'Your order has been successfully received',
        orderNumber: 'Order Number:',
        description:
          "We'll send you an email confirmation with your order details. You can use the order number to track your status.",
        tracking: 'Use this number to track your order',
        processing:
          "Your order is currently being processed and you'll receive an update soon.",
        closeButton: 'Close',
        newOrderButton: 'New Order',
      },
      copyright:
        '© 2024 Studio Vista. All rights reserved. Crafted with precision and passion.',
    },
  },
};

export default function Home() {
  const [language, setLanguage] = useState<'hr' | 'en'>('hr');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
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
  const [completedOrderId, setCompletedOrderId] = useState<string>('');
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card' as 'card' | 'paypal' | 'bank',
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
      (window as any).selectedImageFile = file;
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
    setUploadedImageUrl(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadError(null);
    setSelectedSize('30x20'); // Reset to default size
    setSelectedFrameColor('black'); // Reset to default frame color
    setModalStep('customize'); // Reset to first step
    setCompletedOrderId(''); // Reset order ID
    setOrderData({
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      paymentMethod: 'card',
    });

    // Clear file input and temp file storage
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Clean up temporary file reference
    delete (window as any).selectedImageFile;
  };

  const handleContinueOrder = () => {
    if (uploadedImage) {
      setModalStep('order');
    }
  };

  const handleBackToCustomize = () => {
    setModalStep('customize');
  };

  const handleOrderDataChange = (field: string, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCompleteOrder = async () => {
    try {
      // For now, simulate the order process without backend APIs
      console.log('Order Data:', {
        customerData: orderData,
        printData: {
          type: selectedPrintType,
          size: sizeOptions[selectedSize as keyof typeof sizeOptions].name,
          frameColor:
            selectedPrintType === 'framed' ? selectedFrameColor : undefined,
          price: getCurrentPrice(),
          imageUrl: uploadedImage,
        },
      });

      // Generate a temporary order ID
      const tempOrderId = 'ORDER-' + Date.now().toString().slice(-8);

      // Set order ID and show thank you screen immediately
      setCompletedOrderId(tempOrderId);
      setModalStep('thank-you');

      // Clean up the temporary file reference
      if ((window as any).selectedImageFile) {
        delete (window as any).selectedImageFile;
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

      // TODO: Later implement actual API calls when backend is configured
      /*
      // Upload image to DigitalOcean Spaces if we have a file
      if ((window as any).selectedImageFile) {
        const formData = new FormData();
        formData.append('file', (window as any).selectedImageFile);
        formData.append('printSize', selectedSize);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const uploadResult = await uploadResponse.json();
        
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Greška pri uploadu slike');
        }
        imageUrl = uploadResult.imageUrl;
      }

      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to submit order');
      }
      setCompletedOrderId(result.data._id);
      */
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(
        'Dogodila se greška pri slanju narudžbe. Molimo pokušajte ponovno.'
      );
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
        completedOrderId={completedOrderId}
        isUploading={isUploading}
        uploadError={uploadError}
        setUploadedImage={setUploadedImage}
        setUploadedImageUrl={setUploadedImageUrl}
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
