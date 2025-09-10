export interface Translations {
  nav: {
    products: string;
    process: string;
    about?: string;
    getStarted?: string;
    contact?: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle?: string;
    subtitle1?: string;
    subtitle2?: string;
    description: string;
    createButton?: string;
    galleryButton?: string;
    cta?: string;
    stats?: {
      customers: string;
      rating: string;
      satisfaction: string;
    };
    floating?: {
      shipping: string;
      shippingDesc: string;
      framing: string;
      framingDesc: string;
    };
    features?: {
      premium: string;
      fast: string;
      support: string;
    };
  };
  products: {
    badge: string;
    title: string;
    subtitle: string;
    description?: string;
    canvas: {
      name?: string;
      popular?: string;
      title?: string;
      subtitle?: string;
      description: string;
      from?: string;
      shipping?: string;
      days?: string;
      button?: string;
    };
    framed: {
      name?: string;
      title?: string;
      subtitle?: string;
      description: string;
      from?: string;
      shipping?: string;
      days?: string;
      button?: string;
      premium?: string;
    };
    sticker: {
      name?: string;
      title?: string;
      subtitle?: string;
      description: string;
      from?: string;
      shipping?: string;
      days?: string;
      button?: string;
      modern?: string;
    };
  };
  whyChooseUs: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    features: {
      speed: {
        title: string;
        description: string;
      };
      quality: {
        title: string;
        description: string;
      };
      support: {
        title: string;
        description: string;
      };
    };
    stats: {
      satisfaction: string;
      delivered: string;
      industry: string;
      leader: string;
    };
  };
  process: {
    badge: string;
    title: string;
    subtitle: string;
    description?: string;
    cta: string;
    step1?: {
      title: string;
      desc: string;
    };
    step2?: {
      title: string;
      desc: string;
      description: string;
      heading: string;
    };
    step3?: {
      title: string;
      desc: string;
      description: string;
      heading: string;
    };
    steps?: {
      upload: {
        title: string;
        description: string;
      };
      customize: {
        title: string;
        description: string;
      };
      receive: {
        title: string;
        description: string;
      };
    };
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    story: string;
    experience: string;
    company: {
      title: string;
      name: string;
      address: string;
      oib: string;
      iban: string;
      email: string;
      phone: string;
    };
    contact: {
      title: string;
      subtitle: string;
      form: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        message: string;
        send: string;
        sending: string;
        success: string;
        error: string;
      };
    };
  };
  testimonials: {
    badge: string;
    title: string;
    subtitle: string;
    description: string;
    customers: string;
    verifiedPurchase: string;
    averageRating: string;
    reviews: Array<{
      stars: string;
      quote: string;
      name: string;
      profession: string;
      location: string;
      initial: string;
      bgColor: string;
    }>;
    stats: {
      satisfactionRate: string;
      supportAvailable: string;
    };
  };
  footer: {
    tagline: string;
    products: {
      title: string;
      canvas: string;
      framed: string;
      stickers: string;
    };
    contact: {
      title: string;
      businessHours: string;
      support: string;
    };
    copyright: string;
    legal: {
      privacy: string;
      terms: string;
    };
    features: {
      turnaround: string;
      turnaroundDesc: string;
      quality: string;
      qualityDesc: string;
      shipping: string;
      shippingDesc: string;
    };
  };
}
