'use client';

import Image from 'next/image';
import { useState, useRef, Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { TextureLoader } from 'three';
import {
  Sparkles,
  Palette,
  Truck,
  Upload,
  Eye,
  ChevronRight,
  X,
  ImageIcon,
  CreditCard,
  Wallet,
  Building,
  Shield,
  Award,
  ChevronLeft,
} from 'lucide-react';

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
      copyright:
        '© 2024 Studio Vista. All rights reserved. Crafted with precision and passion.',
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
      {/* Main Wall Background */}
      <mesh position={[0, 0, -3]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 15]} />
        <meshStandardMaterial
          color='#f5f3f0'
          roughness={0.95}
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
          {/* Main sticker - very thin */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, -2.99]} castShadow>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial
              map={texture}
              roughness={0.3}
              metalness={0}
              transparent={false}
            />
          </mesh>
          {/* Subtle shadow/depth */}
          <mesh rotation={[0, 0, 0]} position={[0, 0, -2.995]}>
            <planeGeometry args={[width + 0.02, height + 0.02]} />
            <meshStandardMaterial
              color='#000000'
              transparent={true}
              opacity={0.1}
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
          <ambientLight intensity={0.4} />

          {/* Main window light from upper right */}
          <directionalLight
            position={[8, 6, 4]}
            intensity={0.6}
            color='#fff8f0'
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />

          {/* Warm ceiling light */}
          <spotLight
            position={[0, 7, 0]}
            angle={0.8}
            penumbra={0.6}
            intensity={0.3}
            color='#fff2e6'
            castShadow
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
  const [modalStep, setModalStep] = useState<'customize' | 'order'>(
    'customize'
  );
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
      let imageUrl = uploadedImage; // Default to base64

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

        if (uploadResult.success) {
          imageUrl = uploadResult.imageUrl;
          // Clean up the temporary file reference
          delete (window as any).selectedImageFile;
        } else {
          throw new Error(uploadResult.error || 'Greška pri uploadu slike');
        }
      }

      // Create order object for API
      const order = {
        customerData: orderData,
        printData: {
          type: selectedPrintType,
          size: sizeOptions[selectedSize as keyof typeof sizeOptions].name,
          frameColor:
            selectedPrintType === 'framed' ? selectedFrameColor : undefined,
          price: getCurrentPrice(),
          imageUrl: imageUrl,
        },
        status:
          imageUrl && imageUrl !== uploadedImage ? 'pending' : 'awaiting_image', // pending if uploaded to spaces, awaiting_image if only base64
      };

      // Send order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message and reset form
        alert('Narudžba je uspješno poslana! Kontaktirat ćemo vas uskoro.');
        closeModal();
      } else {
        throw new Error(result.error || 'Failed to submit order');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(
        'Dogodila se greška pri slanju narudžbe. Molimo pokušajte ponovno.'
      );
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Navigation */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-20'>
            <div className='flex items-center'>
              <h1 className='text-3xl font-bold text-gray-900 tracking-tight'>
                Studio Vista
              </h1>
            </div>
            <div className='hidden md:flex items-center space-x-8'>
              <a
                href='#products'
                className='text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200'
              >
                {t.nav.products}
              </a>
              <a
                href='#how-it-works'
                className='text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200'
              >
                {t.nav.process}
              </a>
              <a
                href='#about'
                className='text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200'
              >
                {t.nav.about}
              </a>

              {/* Language Switcher */}
              <div className='flex items-center bg-gray-100 rounded-full p-1'>
                <button
                  onClick={() => setLanguage('hr')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    language === 'hr'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🇭🇷 HR
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1 ${
                    language === 'en'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  🇬🇧 EN
                </button>
              </div>

              <button
                onClick={() => openModal()}
                className='bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 hover:scale-105 flex items-center gap-2'
              >
                {t.nav.getStarted}
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className='relative min-h-screen flex items-center justify-center bg-gray-50 pt-20'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            {/* Left Content */}
            <div className='space-y-8'>
              <div className='space-y-6'>
                <div className='inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium gap-2'>
                  <Sparkles size={16} />
                  {t.hero.badge}
                </div>
                <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-[0.9] tracking-tight'>
                  {t.hero.title}
                  <span className='block text-gray-600'>
                    {t.hero.subtitle1}
                  </span>
                  <span className='block'>{t.hero.subtitle2}</span>
                </h1>
                <p className='text-xl text-gray-600 leading-relaxed max-w-lg'>
                  {t.hero.description}
                </p>
              </div>

              <div className='flex flex-col sm:flex-row gap-4'>
                <button
                  onClick={() => openModal()}
                  className='group bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2'
                >
                  <Palette size={20} />
                  {t.hero.createButton}
                  <ChevronRight
                    size={16}
                    className='group-hover:translate-x-1 transition-transform duration-200'
                  />
                </button>
                <button className='border-2 border-gray-300 hover:border-gray-900 text-gray-900 px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:bg-gray-900 hover:text-white flex items-center justify-center gap-2'>
                  <Eye size={20} />
                  {t.hero.galleryButton}
                </button>
              </div>

              {/* Stats */}
              <div className='flex gap-8 pt-8 border-t border-gray-200'>
                <div>
                  <div className='text-3xl font-bold text-gray-900'>50K+</div>
                  <div className='text-sm text-gray-600'>
                    {t.hero.stats.customers}
                  </div>
                </div>
                <div>
                  <div className='text-3xl font-bold text-gray-900'>4.9/5</div>
                  <div className='text-sm text-gray-600'>
                    {t.hero.stats.rating}
                  </div>
                </div>
                <div>
                  <div className='text-3xl font-bold text-gray-900'>100%</div>
                  <div className='text-sm text-gray-600'>
                    {t.hero.stats.satisfaction}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className='relative'>
              <div className='relative h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl'>
                <Image
                  src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  alt='Beautiful home interior with custom framed art'
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-black/10'></div>
              </div>

              {/* Floating Elements */}
              <div className='absolute -top-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                    <Truck className='text-green-600' size={20} />
                  </div>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {t.hero.floating.shipping}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {t.hero.floating.shippingDesc}
                    </div>
                  </div>
                </div>
              </div>

              <div className='absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100'>
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                    <Palette className='text-blue-600' size={20} />
                  </div>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {t.hero.floating.framing}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {t.hero.floating.framingDesc}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Showcase */}
      <section id='products' className='py-32 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <div className='inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6'>
              {t.products.badge}
            </div>
            <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              {t.products.title}
              <span className='block text-gray-600'>{t.products.subtitle}</span>
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              {t.products.description}
            </p>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Premium Canvas Card */}
            <div className='group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  alt='Premium canvas print in modern living space'
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900'>
                  {t.products.canvas.popular}
                </div>
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
              </div>
              <div className='p-8'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center'>
                    <Palette className='text-blue-600' size={24} />
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      {t.products.canvas.title}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {t.products.canvas.subtitle}
                    </p>
                  </div>
                </div>
                <p className='text-gray-600 mb-6 leading-relaxed'>
                  {t.products.canvas.description}
                </p>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <span className='text-3xl font-bold text-gray-900'>
                      €
                      {Math.min(
                        ...Object.values(sizeOptions).map((s) => s.canvas)
                      )}
                    </span>
                    <span className='text-gray-500 ml-1'>
                      {t.products.canvas.from.toLowerCase()}
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm text-gray-500'>
                      {t.products.canvas.shipping}
                    </div>
                    <div className='font-semibold text-gray-900'>
                      {t.products.canvas.days}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openModal('canvas')}
                  className='w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl group-hover:scale-105 flex items-center justify-center gap-2'
                >
                  <Palette size={18} />
                  {t.products.canvas.button}
                </button>
              </div>
            </div>

            {/* Professional Framing Card */}
            <div className='group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  alt='Elegant framed prints in sophisticated interior'
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900'>
                  {t.products.framed.premium}
                </div>
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
              </div>
              <div className='p-8'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center'>
                    <span className='text-green-600 text-xl'>🖼️</span>
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      {t.products.framed.title}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {t.products.framed.subtitle}
                    </p>
                  </div>
                </div>
                <p className='text-gray-600 mb-6 leading-relaxed'>
                  {t.products.framed.description}
                </p>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <span className='text-3xl font-bold text-gray-900'>
                      €
                      {Math.min(
                        ...Object.values(sizeOptions).map((s) => s.framed)
                      )}
                    </span>
                    <span className='text-gray-500 ml-1'>starting</span>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm text-gray-500'>Ships in</div>
                    <div className='font-semibold text-gray-900'>5-7 days</div>
                  </div>
                </div>
                <button
                  onClick={() => openModal('framed')}
                  className='w-full border-2 border-gray-300 hover:border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl group-hover:scale-105'
                >
                  {t.products.framed.button}
                </button>
              </div>
            </div>

            {/* Wall Sticker Card */}
            <div className='group relative bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2'>
              <div className='relative h-80 overflow-hidden'>
                <Image
                  src='https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  alt='Wall sticker application in modern interior'
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-700'
                />
                <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900'>
                  {t.products.sticker.modern}
                </div>
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300'></div>
              </div>
              <div className='p-8'>
                <div className='flex items-center gap-3 mb-4'>
                  <div className='w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center'>
                    <span className='text-green-600 text-xl'>🏷️</span>
                  </div>
                  <div>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      {t.products.sticker.title}
                    </h3>
                    <p className='text-sm text-gray-500'>
                      {t.products.sticker.subtitle}
                    </p>
                  </div>
                </div>
                <p className='text-gray-600 mb-6 leading-relaxed'>
                  {t.products.sticker.description}
                </p>
                <div className='flex items-center justify-between mb-6'>
                  <div>
                    <span className='text-3xl font-bold text-gray-900'>
                      €
                      {Math.min(
                        ...Object.values(sizeOptions).map((s) => s.sticker)
                      )}
                    </span>
                    <span className='text-gray-500 ml-1'>
                      {t.products.sticker.from.toLowerCase()}
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm text-gray-500'>
                      {t.products.sticker.shipping}
                    </div>
                    <div className='font-semibold text-gray-900'>
                      {t.products.sticker.days}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openModal('sticker')}
                  className='w-full border-2 border-gray-300 hover:border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl group-hover:scale-105'
                >
                  {t.products.sticker.button}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-32 bg-gray-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-20 items-center'>
            {/* Left Content */}
            <div className='space-y-8'>
              <div className='space-y-6'>
                <div className='inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium'>
                  Why Choose Us
                </div>
                <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 leading-tight'>
                  Crafted with
                  <span className='block text-gray-600'>Precision & Care</span>
                </h2>
                <p className='text-xl text-gray-600 leading-relaxed'>
                  Every piece we create is a testament to our commitment to
                  excellence, combining cutting-edge technology with artisanal
                  craftsmanship.
                </p>
              </div>

              <div className='space-y-6'>
                {/* Feature 1 */}
                <div className='flex gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300'>
                  <div className='flex-shrink-0 w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center'>
                    <span className='text-blue-600 text-xl'>⚡</span>
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                      {t.quality.turnaround.title}
                    </h3>
                    <p className='text-gray-600'>
                      {t.quality.turnaround.description}
                    </p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className='flex gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300'>
                  <div className='flex-shrink-0 w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center'>
                    <span className='text-green-600 text-xl'>🎯</span>
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                      Color-Perfect Guarantee
                    </h3>
                    <p className='text-gray-600'>
                      Advanced color calibration ensures your prints match your
                      vision exactly, every time.
                    </p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className='flex gap-6 p-6 bg-white rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300'>
                  <div className='flex-shrink-0 w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center'>
                    <span className='text-purple-600 text-xl'>🛡️</span>
                  </div>
                  <div>
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                      {t.quality.title}
                    </h3>
                    <p className='text-gray-600'>{t.quality.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Quality Showcase */}
            <div className='relative'>
              <div className='relative h-[600px] rounded-3xl overflow-hidden shadow-2xl'>
                <Image
                  src='https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
                  alt='Artisan crafting premium canvas print'
                  fill
                  className='object-cover'
                />
                <div className='absolute inset-0 bg-black/20'></div>
              </div>

              {/* Quality Stats */}
              <div className='absolute -bottom-8 -left-8 bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 max-w-xs'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                      <span className='text-green-600 text-lg'>✓</span>
                    </div>
                    <div>
                      <div className='font-bold text-gray-900'>99.8%</div>
                      <div className='text-sm text-gray-600'>
                        {t.quality.satisfaction}
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center gap-4'>
                    <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                      <span className='text-blue-600 text-lg'>🏆</span>
                    </div>
                    <div>
                      <div className='font-bold text-gray-900'>50,000+</div>
                      <div className='text-sm text-gray-600'>
                        Prints Delivered
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Award Badge */}
              <div className='absolute -top-6 -right-6 bg-gray-900 text-white rounded-2xl p-6 shadow-xl'>
                <div className='text-center'>
                  <div className='text-2xl mb-2'>🥇</div>
                  <div className='font-bold text-sm'>Industry</div>
                  <div className='font-bold text-sm'>Leader</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id='how-it-works' className='py-32 bg-white'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-20'>
            <div className='inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-6'>
              {t.process.badge}
            </div>
            <h2 className='text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight'>
              {t.process.title}
              <span className='block text-gray-600'>{t.process.subtitle}</span>
            </h2>
            <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
              {t.process.description}
            </p>
          </div>

          <div className='relative'>
            {/* Connection Line */}
            <div className='hidden lg:block absolute top-24 left-0 right-0 h-px bg-gray-300 z-0'></div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10'>
              {/* Step 1 */}
              <div className='group text-center'>
                <div className='relative mb-8'>
                  <div className='w-24 h-24 mx-auto bg-gray-900 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300'>
                    01
                  </div>
                  <div className='absolute -top-3 -right-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm'>📤</span>
                  </div>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  {t.process.step2.heading}
                </h3>
                <p className='text-gray-600 leading-relaxed mb-6'>
                  {t.process.step2.description}
                </p>
                <div className='bg-gray-50 rounded-2xl p-4 border border-gray-200'>
                  <div className='text-sm text-gray-500 mb-2'>
                    {t.quality.formats.title}
                  </div>
                  <div className='text-sm font-medium text-gray-900'>
                    {t.quality.formats.supported}
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className='group text-center'>
                <div className='relative mb-8'>
                  <div className='w-24 h-24 mx-auto bg-gray-900 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300'>
                    02
                  </div>
                  <div className='absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm'>🎨</span>
                  </div>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  {t.process.step3.heading}
                </h3>
                <p className='text-gray-600 leading-relaxed mb-6'>
                  {t.process.step3.description}
                </p>
                <div className='bg-gray-50 rounded-2xl p-4 border border-gray-200'>
                  <div className='text-sm text-gray-500 mb-2'>
                    {t.quality.check}
                  </div>
                  <div className='text-sm font-medium text-gray-900'>
                    {t.quality.preview}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className='group text-center'>
                <div className='relative mb-8'>
                  <div className='w-24 h-24 mx-auto bg-gray-900 rounded-3xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300'>
                    03
                  </div>
                  <div className='absolute -top-3 -right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm'>🚚</span>
                  </div>
                </div>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  Craft & Deliver
                </h3>
                <p className='text-gray-600 leading-relaxed mb-6'>
                  Our artisans carefully craft your print using premium
                  materials, then package and ship it with protective care to
                  your door.
                </p>
                <div className='bg-gray-50 rounded-2xl p-4 border border-gray-200'>
                  <div className='text-sm text-gray-500 mb-2'>
                    Delivery time:
                  </div>
                  <div className='text-sm font-medium text-gray-900'>
                    3-7 business days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className='text-center mt-16'>
            <button
              onClick={() => openModal()}
              className='bg-gray-900 hover:bg-gray-800 text-white px-10 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl'
            >
              {t.process.cta}
              <span className='ml-2'>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
                "The quality blew me away! The canvas print of our wedding photo
                has become the centerpiece of our living room. The colors are so
                vibrant and true to life."
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
                "Ordered three metal prints for my office. The process was
                seamless, delivery was super fast, and the quality is absolutely
                professional grade."
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
                "As an art collector, I'm very particular about quality. Studio
                Vista exceeded my expectations with their framing and attention
                to detail."
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
                <div className='text-3xl font-bold text-gray-900 mb-2'>
                  4.9/5
                </div>
                <div className='text-gray-600'>Average Rating</div>
              </div>
              <div className='bg-white rounded-2xl p-6 border border-gray-200'>
                <div className='text-3xl font-bold text-gray-900 mb-2'>
                  99.8%
                </div>
                <div className='text-gray-600'>
                  {t.testimonials.stats.satisfactionRate}
                </div>
              </div>
              <div className='bg-white rounded-2xl p-6 border border-gray-200'>
                <div className='text-3xl font-bold text-gray-900 mb-2'>
                  24/7
                </div>
                <div className='text-gray-600'>
                  {t.testimonials.stats.supportAvailable}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-32 bg-gray-900 text-white relative overflow-hidden'>
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 20c0 0 0-8.95 0-10h10c0 1.05 0 10 0 10H20z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className='relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8'>
          <div className='space-y-8'>
            <div className='inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium'>
              {t.testimonials.cta.ready}
            </div>
            <h2 className='text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight'>
              {t.testimonials.cta.title}
            </h2>
            <p className='text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed'>
              {t.testimonials.cta.subtitle}
            </p>

            <div className='flex flex-col sm:flex-row gap-6 justify-center pt-8'>
              <button
                onClick={() => openModal()}
                className='group bg-white hover:bg-gray-100 text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl'
              >
                {t.process.cta}
                <span className='ml-2 group-hover:translate-x-1 transition-transform duration-200'>
                  →
                </span>
              </button>
              <button className='border-2 border-white/30 hover:border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm'>
                {t.testimonials.cta.pricing}
              </button>
            </div>

            {/* Quick Benefits */}
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 pt-16 text-center'>
              <div className='space-y-2'>
                <div className='text-3xl mb-3'>⚡</div>
                <div className='font-semibold'>
                  {t.footer.features.turnaround}
                </div>
                <div className='text-gray-400 text-sm'>
                  {t.footer.features.turnaroundDesc}
                </div>
              </div>
              <div className='space-y-2'>
                <div className='text-3xl mb-3'>🛡️</div>
                <div className='font-semibold'>{t.footer.features.quality}</div>
                <div className='text-gray-400 text-sm'>
                  {t.footer.features.qualityDesc}
                </div>
              </div>
              <div className='space-y-2'>
                <div className='text-3xl mb-3'>🚚</div>
                <div className='font-semibold'>
                  {t.footer.features.shipping}
                </div>
                <div className='text-gray-400 text-sm'>
                  {t.footer.features.shippingDesc}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id='contact' className='bg-black text-white py-20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-12'>
            {/* Brand Section */}
            <div className='lg:col-span-2 space-y-6'>
              <div>
                <h3 className='text-3xl font-bold mb-4'>Studio Vista</h3>
                <p className='text-gray-400 text-lg leading-relaxed max-w-md'>
                  {t.footer.tagline}
                </p>
              </div>

              <div className='flex space-x-6'>
                <a
                  href='#'
                  className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
                >
                  <span className='sr-only'>Facebook</span>
                  <span className='text-xl'>📘</span>
                </a>
                <a
                  href='#'
                  className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
                >
                  <span className='sr-only'>Instagram</span>
                  <span className='text-xl'>📷</span>
                </a>
                <a
                  href='#'
                  className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
                >
                  <span className='sr-only'>Twitter</span>
                  <span className='text-xl'>🐦</span>
                </a>
                <a
                  href='#'
                  className='w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-2xl flex items-center justify-center transition-colors duration-300'
                >
                  <span className='sr-only'>Pinterest</span>
                  <span className='text-xl'>📌</span>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className='text-lg font-bold mb-6'>
                {t.footer.products.title}
              </h4>
              <ul className='space-y-4'>
                <li>
                  <a
                    href='#products'
                    className='text-gray-400 hover:text-white transition-colors duration-300'
                  >
                    {t.footer.products.canvas}
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='text-gray-400 hover:text-white transition-colors duration-300'
                  >
                    Framed Prints
                  </a>
                </li>
                <li>
                  <a
                    href='#products'
                    className='text-gray-400 hover:text-white transition-colors duration-300'
                  >
                    {t.footer.products.stickers}
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition-colors duration-300'
                  >
                    Photo Books
                  </a>
                </li>
                <li>
                  <a
                    href='#'
                    className='text-gray-400 hover:text-white transition-colors duration-300'
                  >
                    Wall Collages
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div>
              <h4 className='text-lg font-bold mb-6'>
                {t.footer.contact.title}
              </h4>
              <div className='space-y-4 text-gray-400'>
                <div className='flex items-center gap-3'>
                  <span className='text-lg'>📍</span>
                  <span>
                    123 Art Street
                    <br />
                    Creative City, CA 90210
                  </span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-lg'>📞</span>
                  <span>(555) 123-4567</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-lg'>✉️</span>
                  <span>hello@studiovista.com</span>
                </div>
                <div className='flex items-center gap-3'>
                  <span className='text-lg'>🕒</span>
                  <span>{t.footer.contact.businessHours}</span>
                </div>
              </div>

              <div className='mt-8'>
                <h5 className='font-semibold mb-3'>
                  {t.footer.contact.support}
                </h5>
                <div className='space-y-2 text-sm text-gray-400'>
                  <div>
                    <a
                      href='#'
                      className='hover:text-white transition-colors duration-300'
                    >
                      Help Center
                    </a>
                  </div>
                  <div>
                    <a
                      href='#'
                      className='hover:text-white transition-colors duration-300'
                    >
                      Track Your Order
                    </a>
                  </div>
                  <div>
                    <a
                      href='#'
                      className='hover:text-white transition-colors duration-300'
                    >
                      Returns & Exchanges
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className='border-t border-gray-800 mt-16 pt-8'>
            <div className='flex flex-col lg:flex-row justify-between items-center gap-4'>
              <p className='text-gray-400 text-center lg:text-left'>
                {t.footer.copyright}
              </p>
              <div className='flex gap-6 text-sm text-gray-400'>
                <a
                  href='#'
                  className='hover:text-white transition-colors duration-300'
                >
                  {t.footer.legal.privacy}
                </a>
                <a
                  href='#'
                  className='hover:text-white transition-colors duration-300'
                >
                  {t.footer.legal.terms}
                </a>
                <a
                  href='#'
                  className='hover:text-white transition-colors duration-300'
                >
                  Shipping Info
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md'>
          <div className='w-full max-w-7xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex relative'>
            {modalStep === 'customize' ? (
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
                          <div className='font-medium text-sm'>
                            {option.name}
                          </div>
                          <div className='text-xs mt-1'>
                            €
                            {selectedPrintType === 'canvas'
                              ? option.canvas
                              : selectedPrintType === 'framed'
                              ? option.framed
                              : option.sticker}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frame Color Selection - only show for framed prints */}
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
                          <div className='w-4 h-4 bg-gray-300 rounded-sm border border-gray-400'></div>
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
            ) : (
              <>
                {/* Order Form Step */}
                <div className='w-1/2 flex flex-col'>
                  {/* Fixed Header */}
                  <div className='flex items-center justify-between p-8 pb-4 border-b border-gray-200'>
                    <div>
                      <h2 className='text-2xl font-bold text-gray-900'>
                        Podaci za narudžbu
                      </h2>
                      <p className='text-gray-800 mt-1'>
                        Unesi podatke za dostavu i plaćanje
                      </p>
                    </div>
                    <button
                      onClick={closeModal}
                      className='p-2 hover:bg-gray-100 rounded-xl transition-colors'
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Scrollable Form */}
                  <div className='flex-1 overflow-y-auto px-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100'>
                    <form className='space-y-6 py-6 pb-32'>
                      {/* Personal Information */}
                      <div>
                        <h3 className='text-lg font-bold text-gray-900 mb-4'>
                          Osobni podaci
                        </h3>
                        <div className='grid grid-cols-1 gap-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-800 mb-1'>
                              Ime i prezime *
                            </label>
                            <input
                              type='text'
                              value={orderData.name}
                              onChange={(e) =>
                                handleOrderDataChange('name', e.target.value)
                              }
                              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                              placeholder='Unesite ime i prezime'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-800 mb-1'>
                              Email adresa *
                            </label>
                            <input
                              type='email'
                              value={orderData.email}
                              onChange={(e) =>
                                handleOrderDataChange('email', e.target.value)
                              }
                              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                              placeholder='ime@primjer.com'
                            />
                          </div>
                          <div>
                            <label className='block text-sm font-medium text-gray-800 mb-1'>
                              Telefon
                            </label>
                            <input
                              type='tel'
                              value={orderData.phone}
                              onChange={(e) =>
                                handleOrderDataChange('phone', e.target.value)
                              }
                              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                              placeholder='+385 99 123 4567'
                            />
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div>
                        <h3 className='text-lg font-bold text-gray-900 mb-4'>
                          Adresa za dostavu
                        </h3>
                        <div className='space-y-4'>
                          <div>
                            <label className='block text-sm font-medium text-gray-800 mb-1'>
                              Ulica i broj *
                            </label>
                            <input
                              type='text'
                              value={orderData.address}
                              onChange={(e) =>
                                handleOrderDataChange('address', e.target.value)
                              }
                              className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                              placeholder='Ulica Grada Vukovara 269'
                            />
                          </div>
                          <div className='grid grid-cols-2 gap-4'>
                            <div>
                              <label className='block text-sm font-medium text-gray-800 mb-1'>
                                Grad *
                              </label>
                              <input
                                type='text'
                                value={orderData.city}
                                onChange={(e) =>
                                  handleOrderDataChange('city', e.target.value)
                                }
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                                placeholder='Zagreb'
                              />
                            </div>
                            <div>
                              <label className='block text-sm font-medium text-gray-800 mb-1'>
                                Poštanski broj *
                              </label>
                              <input
                                type='text'
                                value={orderData.postalCode}
                                onChange={(e) =>
                                  handleOrderDataChange(
                                    'postalCode',
                                    e.target.value
                                  )
                                }
                                className='w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500'
                                placeholder='10000'
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div>
                        <h3 className='text-lg font-bold text-gray-900 mb-4'>
                          Način plaćanja
                        </h3>
                        <div className='space-y-3'>
                          <label className='flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50'>
                            <input
                              type='radio'
                              name='payment'
                              value='card'
                              checked={orderData.paymentMethod === 'card'}
                              onChange={(e) =>
                                handleOrderDataChange(
                                  'paymentMethod',
                                  e.target.value
                                )
                              }
                              className='mr-3'
                            />
                            <div className='flex items-center gap-3'>
                              <CreditCard size={20} />
                              <div>
                                <div className='font-medium text-gray-900'>
                                  Kreditna/debitna kartica
                                </div>
                                <div className='text-sm text-gray-800'>
                                  Visa, Mastercard, Maestro
                                </div>
                              </div>
                            </div>
                          </label>
                          <label className='flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50'>
                            <input
                              type='radio'
                              name='payment'
                              value='paypal'
                              checked={orderData.paymentMethod === 'paypal'}
                              onChange={(e) =>
                                handleOrderDataChange(
                                  'paymentMethod',
                                  e.target.value
                                )
                              }
                              className='mr-3'
                            />
                            <div className='flex items-center gap-3'>
                              <Wallet size={20} />
                              <div>
                                <div className='font-medium text-gray-900'>
                                  PayPal
                                </div>
                                <div className='text-sm text-gray-800'>
                                  Sigurno plaćanje putem PayPal-a
                                </div>
                              </div>
                            </div>
                          </label>
                          <label className='flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50'>
                            <input
                              type='radio'
                              name='payment'
                              value='bank'
                              checked={orderData.paymentMethod === 'bank'}
                              onChange={(e) =>
                                handleOrderDataChange(
                                  'paymentMethod',
                                  e.target.value
                                )
                              }
                              className='mr-3'
                            />
                            <div className='flex items-center gap-3'>
                              <Building size={20} />
                              <div>
                                <div className='font-medium text-gray-900'>
                                  Bankovni transfer
                                </div>
                                <div className='text-sm text-gray-800'>
                                  Plaćanje na žiro račun
                                </div>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Panel - Order Summary */}
                <div className='w-1/2 p-8 bg-gradient-to-br from-gray-50 to-gray-100'>
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
                          <h4 className='font-medium text-gray-900'>
                            {selectedPrintType === 'canvas' && 'Canvas print'}
                            {selectedPrintType === 'framed' &&
                              'Uokvireni print'}
                            {selectedPrintType === 'sticker' &&
                              'Zidna naljepnica'}
                          </h4>
                          <p className='text-sm text-gray-700'>
                            {
                              sizeOptions[
                                selectedSize as keyof typeof sizeOptions
                              ].name
                            }
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
              </>
            )}

            {/* Modal Footer - Conditional based on step */}
            <div className='absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6'>
              <div className='max-w-7xl mx-auto flex items-center justify-between'>
                {modalStep === 'customize' ? (
                  <>
                    <div className='text-sm text-gray-700 font-medium'>
                      {uploadedImage
                        ? `€${getCurrentPrice()} • ${
                            sizeOptions[
                              selectedSize as keyof typeof sizeOptions
                            ].name
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
                ) : (
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
      )}
    </div>
  );
}
