import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ArrowRight, Star, MapPin,
  Instagram, MessageCircle, Heart, Sparkles,
  Gift, LockKeyhole, Camera
} from 'lucide-react';
import Admin from './pages/Admin';
import { getProducts, getOffers, getSettings, getGallery, Product, Offer, GalleryItem, Settings } from './lib/api';

// ── Decorative helpers ──────────────────────────────────────────────────────

const SparkleIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2l1.5 6.5L20 10l-6.5 1.5L12 18l-1.5-6.5L4 10l6.5-1.5z" />
  </svg>
);

const Daisy = ({ className = '', style }: { className?: string; style?: React.CSSProperties }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={className} style={style}>
    <circle cx="16" cy="16" r="5" fill="#FF80AB" />
    {[0,45,90,135,180,225,270,315].map((deg, i) => (
      <ellipse key={i} cx="16" cy="5" rx="3" ry="5.5" fill="#FFB6C1" opacity="0.85"
        transform={`rotate(${deg} 16 16)`} />
    ))}
  </svg>
);

const WaveDivider = ({ fill = 'var(--color-pink)', bg = 'transparent', flip = false }: {
  fill?: string; bg?: string; flip?: boolean;
}) => (
  <div className="w-full overflow-hidden leading-[0]" style={{ background: bg, transform: flip ? 'rotate(180deg)' : undefined }}>
    <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-12" xmlns="http://www.w3.org/2000/svg">
      <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill={fill} />
    </svg>
  </div>
);

// ── CSS-art glyphs ──────────────────────────────────────────────────────────

const NecklaceGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-12 h-14 border-[2.5px] border-[var(--color-navy)] rounded-full absolute -top-4 opacity-90" />
    <div className="w-3 h-3 rotate-45 bg-[var(--color-navy)] absolute bottom-2" />
  </div>
);
const EarringGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center gap-3">
    <div className="w-3 h-6 border-[2.5px] border-[var(--color-navy)] rounded-t-full rounded-b-[4px]" />
    <div className="w-3 h-6 border-[2.5px] border-[var(--color-navy)] rounded-t-full rounded-b-[4px] translate-y-2" />
  </div>
);
const BangleGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-12 h-12 border-[3px] border-[var(--color-navy)] rounded-full" />
    <div className="w-14 h-14 border border-[var(--color-navy)] rounded-full absolute opacity-40" />
  </div>
);
const RingGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-10 h-10 border-[2.5px] border-[var(--color-navy)] rounded-full mt-2" />
    <div className="w-4 h-4 rotate-45 bg-[var(--color-navy)] absolute top-2" />
  </div>
);
const HairClipGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-12 h-4 border-[2.5px] border-[var(--color-navy)] rounded-full relative">
      <div className="w-10 h-1 bg-[var(--color-navy)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  </div>
);
const HamperGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-12 h-12 border-[2.5px] border-[var(--color-navy)] relative flex items-center justify-center rounded-sm">
      <div className="absolute w-full h-[2.5px] bg-[var(--color-navy)]" />
      <div className="absolute h-full w-[2.5px] bg-[var(--color-navy)]" />
      <div className="w-4 h-4 border-[2.5px] border-[var(--color-navy)] absolute -top-4 rounded-full" />
    </div>
  </div>
);
const OxidisedGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-11 h-11 border-[3px] border-[var(--color-navy)] rounded-full" />
    <div className="absolute w-5 h-5 border-[2px] border-[var(--color-navy)] rotate-45" />
    <div className="absolute w-2 h-2 rounded-full bg-[var(--color-navy)]" />
  </div>
);

const CATEGORY_GLYPHS: Record<string, React.ReactNode> = {
  'Necklaces': <NecklaceGlyph />,
  'Earrings': <EarringGlyph />,
  'Bangles': <BangleGlyph />,
  'Rings': <RingGlyph />,
  'Hair Accessories': <HairClipGlyph />,
  'Oxidised Jewellery': <OxidisedGlyph />,
};

const FadeIn = ({ children, delay = 0, className = '', onClick }: {
  children: React.ReactNode; delay?: number; className?: string; onClick?: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

// ── Sections ────────────────────────────────────────────────────────────────

function AnnouncementBar({ text }: { text: string }) {
  return (
    <div className="bg-[var(--color-navy)] text-center py-2 px-4 z-50 relative text-white text-xs sm:text-sm font-semibold tracking-wide">
      <SparkleIcon size={12} className="inline-block mr-2 opacity-80" />
      {text}
      <SparkleIcon size={12} className="inline-block ml-2 opacity-80" />
    </div>
  );
}

function Header({ whatsappUrl }: { whatsappUrl: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { name: 'Our Story', href: '#story' },
    { name: 'Promise', href: '#promise' },
    { name: 'Catalogue', href: '#catalogue' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
  ];

  const scrollTo = (href: string) => {
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 w-full z-40 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md border-b border-[var(--color-bg-accent)] shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 z-50 group">
          <div className="w-10 h-10 rounded-full bg-[var(--color-navy)] flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300 shadow-md">
            A
          </div>
          <span className="text-2xl font-bold text-[var(--color-navy)] tracking-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            Anovia
          </span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button key={link.name} onClick={() => scrollTo(link.href)}
              className="text-[var(--color-navy-muted)] hover:text-[var(--color-navy)] font-semibold text-sm uppercase tracking-wider relative group py-2 transition-colors"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2.5px] bg-[var(--color-pink)] rounded-full transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <div className="flex items-center gap-3">
          <a href="/login"
              className="flex items-center gap-1.5 text-[var(--color-navy-muted)] hover:text-[var(--color-navy)] text-xs font-bold uppercase tracking-wide transition-colors">
              <LockKeyhole size={14} /> Admin
            </a>
           <button onClick={() => scrollTo('#catalogue')}
              className="bg-[var(--color-navy)] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[var(--color-navy-light)] transition-colors shadow-md hover:shadow-lg">
              Shop Now
            </button>
          </div>
        </div>

        <button className="md:hidden z-50 text-[var(--color-navy)] p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 bg-[var(--color-bg-light)] z-40 md:hidden pt-24 px-6 flex flex-col"
          >
            <nav className="flex flex-col gap-6 items-center mt-10">
              {navLinks.map((link) => (
                <button key={link.name} onClick={() => scrollTo(link.href)}
                  className="text-2xl font-bold text-[var(--color-navy)] hover:text-[var(--color-pink)] transition-colors"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {link.name}
                </button>
              ))}
              <button onClick={() => scrollTo('#catalogue')}
                className="mt-8 bg-[var(--color-navy)] text-white px-8 py-4 rounded-full text-lg w-full font-bold shadow-md">
                Shop Now
              </button>
               <a href="/login" className="mt-3 flex items-center justify-center gap-2 text-[var(--color-navy-muted)] font-bold">
                <LockKeyhole size={16} /> Admin Login
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero({ subtitle, body }: { subtitle: string; body: string }) {
  const scrollTo = (href: string) => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6 bg-[var(--color-bg-light)]">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-[var(--color-pink)] rounded-full blur-[100px] opacity-25 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[var(--color-bg-accent)] rounded-full blur-[120px] opacity-70" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
      <div className="absolute top-[20%] right-[8%] w-[30vw] h-[30vw] max-w-[280px] max-h-[280px] bg-[var(--color-navy-soft)] rounded-full blur-[90px] opacity-40" style={{ animation: 'float 12s ease-in-out infinite' }} />

      <Daisy className="absolute top-[15%] left-[6%] opacity-60" style={{ animation: 'wave-bob 4s ease-in-out infinite' } as React.CSSProperties} />
      <Daisy className="absolute bottom-[20%] right-[8%] opacity-50 scale-75" style={{ animation: 'wave-bob 5s ease-in-out infinite 1s' } as React.CSSProperties} />
      <SparkleIcon size={28} className="absolute top-[30%] right-[18%] text-[var(--color-pink)] opacity-60" />
      <SparkleIcon size={20} className="absolute top-[60%] left-[12%] text-[var(--color-navy)] opacity-40" />
      <SparkleIcon size={14} className="absolute top-[10%] right-[35%] text-[var(--color-pink-dark)] opacity-50" />

      <div className="z-10 flex flex-col items-center text-center w-full max-w-4xl">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-[var(--color-navy)] bg-white shadow-xl flex items-center justify-center mb-8"
          style={{ animation: 'float 6s ease-in-out infinite' }}
        >
          <span className="text-5xl md:text-6xl text-[var(--color-navy)] font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>A</span>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[clamp(3.4rem,10vw,7rem)] leading-[0.9] text-[var(--color-navy)] mb-6 tracking-tight font-bold"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          Anovia
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-xl md:text-3xl text-[var(--color-navy-muted)] mb-6 font-semibold"
          style={{ fontFamily: 'Fredoka, sans-serif' }}
        >
          <SparkleIcon size={18} className="inline-block mr-2 text-[var(--color-pink)]" />
          {subtitle}
          <SparkleIcon size={18} className="inline-block ml-2 text-[var(--color-pink)]" />
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-xl text-base md:text-lg text-[var(--color-navy-muted)] mb-12 font-medium"
        >
          {body}
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button onClick={() => scrollTo('#catalogue')}
            className="px-8 py-4 bg-[var(--color-navy)] text-white rounded-full font-bold hover:bg-[var(--color-navy-light)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2">
             View Catalogue <ArrowRight size={18} />
          </button>
          <button onClick={() => scrollTo('#gallery')}
            className="px-8 py-4 bg-white border-2 border-[var(--color-navy)] text-[var(--color-navy)] rounded-full font-bold hover:bg-[var(--color-navy)] hover:text-white transition-all shadow-md w-full sm:w-auto">
            View Gallery
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-3 cursor-pointer"
        onClick={() => scrollTo('#story')}
      >
        <span className="text-xs uppercase tracking-widest text-[var(--color-navy-muted)] font-semibold">Scroll</span>
        <div className="w-[1px] h-12 bg-[var(--color-navy-soft)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-navy)]" style={{ animation: 'drop 2s infinite' }} />
        </div>
      </motion.div>
    </section>
  );
}

function MarqueeStrip({ offers }: { offers: Offer[] }) {
  const terms = offers.length > 0 ? offers.map(o => o.text) : ['Anti-tarnish', 'Custom pieces', 'Oxidised jewellery', 'Pan India delivery', 'Curated by Anisha', 'Since Day One'];
  const allTerms = [...terms, ...terms, ...terms, ...terms];

  return (
    <>
      <WaveDivider fill="var(--color-pink)" bg="var(--color-bg-light)" />
      <div className="w-full bg-[var(--color-pink)] py-4 overflow-hidden flex whitespace-nowrap">
        <div className="flex w-max" style={{ animation: 'marquee 30s linear infinite' }}>
          {allTerms.map((term, i) => (
            <div key={i} className="flex items-center gap-6 px-6 text-white font-bold text-sm md:text-base uppercase tracking-wider">
              <span>{term}</span>
              <SparkleIcon size={12} className="opacity-70" />
            </div>
          ))}
        </div>
      </div>
      <WaveDivider fill="var(--color-bg-alt)" bg="var(--color-pink)" />
    </>
  );
}

function OurStory({ heading, body, founder }: { heading: string; body: string; founder: string }) {
  return (
    <section id="story" className="py-24 md:py-32 bg-[var(--color-bg-alt)] px-6">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Daisy className="opacity-80 scale-75" />
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy)]">Our Story</span>
            <Daisy className="opacity-80 scale-75" />
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-navy)] mb-8 leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {heading}
          </h2>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p className="text-lg md:text-xl text-[var(--color-navy-muted)] leading-relaxed mb-8">
            {body}
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="text-2xl text-[var(--color-navy)] font-semibold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            {founder}
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function ThePromise({ heading, body }: { heading: string; body: string }) {
  const promises = [
    { title: 'Anti-Tarnish, Always', desc: 'Jewellery meant to be worn, not kept in a box. Water-resistant and built for everyday life.', icon: <Sparkles className="text-[var(--color-navy)]" size={28} /> },
    { title: 'Made to Fit You', desc: 'Need a longer chain or a specific charm? We do custom pieces that actually feel like you.', icon: <Heart className="text-[var(--color-navy)]" fill="currentColor" size={28} /> },
    { title: 'Gifted with Love', desc: 'Every order feels like unboxing a present, complete with personal touches and careful packing.', icon: <Gift className="text-[var(--color-navy)]" size={28} /> },
  ];

  return (
    <section id="promise" className="py-24 md:py-32 bg-white px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <FadeIn>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy-muted)] mb-4 block">
              <SparkleIcon size={12} className="inline-block mr-1 text-[var(--color-pink)]" />
              The Anovia Promise
              <SparkleIcon size={12} className="inline-block ml-1 text-[var(--color-pink)]" />
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-navy)] mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>{heading}</h2>
            <p className="text-lg text-[var(--color-navy-muted)] max-w-2xl mx-auto">{body}</p>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promises.map((p, i) => (
            <FadeIn key={i} delay={0.2 + i * 0.1}>
              <div className="bg-[var(--color-bg-light)] rounded-3xl p-10 text-center border-2 border-[var(--color-bg-accent)] hover:-translate-y-2 transition-all duration-500 shadow-sm hover:shadow-xl hover:border-[var(--color-pink)] h-full flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[var(--color-bg-accent)] flex items-center justify-center mb-6 shadow-sm">{p.icon}</div>
                <h3 className="text-2xl font-bold text-[var(--color-navy)] mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>{p.title}</h3>
                <p className="text-[var(--color-navy-muted)] leading-relaxed">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopTheEdit({ products, whatsappUrl }: { products: Product[]; whatsappUrl: string }) {
  const categories = products.length > 0 ? products : [
    { id: 0, name: 'Necklaces', category: 'Necklaces', description: 'Layered or solo', price: '', imageUrl: '', inStock: true, sortOrder: 0 },
    { id: 1, name: 'Earrings', category: 'Earrings', description: 'Studs & hoops', price: '', imageUrl: '', inStock: true, sortOrder: 1 },
    { id: 2, name: 'Bangles', category: 'Bangles', description: 'Stacks & cuffs', price: '', imageUrl: '', inStock: true, sortOrder: 2 },
    { id: 3, name: 'Rings', category: 'Rings', description: 'Adjustable sizes', price: '', imageUrl: '', inStock: true, sortOrder: 3 },
    { id: 4, name: 'Hair Accessories', category: 'Hair Accessories', description: 'Claws & bands', price: '', imageUrl: '', inStock: true, sortOrder: 4 },
    { id: 5, name: 'Oxidised Jewellery', category: 'Oxidised Jewellery', description: 'Statement pieces', price: '', imageUrl: '', inStock: true, sortOrder: 5 },
  ];

  return (
    <>
      <WaveDivider fill="var(--color-navy)" bg="white" />
       <section id="catalogue" className="py-24 md:py-32 bg-[var(--color-navy)] px-6 relative overflow-hidden">
        <SparkleIcon size={40} className="absolute top-12 left-12 text-white opacity-10" />
        <SparkleIcon size={24} className="absolute bottom-20 right-20 text-[var(--color-pink)] opacity-30" />
        <Daisy className="absolute top-8 right-16 opacity-15 scale-150" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 md:mb-20">
            <FadeIn>
               <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-pink)] mb-4 block">Anovia Catalogue</span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-4xl md:text-5xl font-bold text-white max-w-3xl mx-auto leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                 Find your next favourite piece
              </h2>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((c, i) => (
              <FadeIn key={c.id} delay={0.1 * i} className="h-full">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center text-center h-full border-2 border-white/20 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-sm hover:-translate-y-2 hover:bg-white/20 hover:border-[var(--color-pink)] transition-all duration-300 group"
                >
                  {c.imageUrl ? (
                    <div className="w-full h-48 overflow-hidden shrink-0">
                      <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center pt-6">
                      <div className="transform group-hover:scale-110 transition-transform duration-500 text-white">
                         {CATEGORY_GLYPHS[c.category] ?? CATEGORY_GLYPHS['Oxidised Jewellery']}
                      </div>
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1 items-center">
                    <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>{c.name}</h3>
                    {c.price && <p className="text-[var(--color-pink)] font-bold mb-1">{c.price}</p>}
                    {c.description && <p className="text-white/70 text-sm mb-4">{c.description}</p>}
                    {!c.inStock && <span className="text-xs text-red-300 font-semibold mb-2">Out of stock</span>}
                    <div className="mt-auto w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-[var(--color-pink)] transition-colors">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.6} className="mt-16 text-center">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--color-pink)] font-bold hover:text-white transition-colors border-b-2 border-[var(--color-pink)] pb-1">
               Browse the full catalogue on WhatsApp <ArrowRight size={16} />
            </a>
          </FadeIn>
        </div>
      </section>
      <WaveDivider fill="var(--color-bg-alt)" bg="var(--color-navy)" />
    </>
  );
}

function MysteryScoop({ heading, body }: { heading: string; body: string }) {
  const items = ['A dainty jewellery piece', 'A cute hair band', 'A mini notebook', 'A set of sticky notes', 'A fun keychain', 'A pastel pen', 'A nourishing lip oil', 'Refresh wipes', 'A velvet scrunchie', 'A sturdy claw clip', 'A little free gift'];
  const [currentItem, setCurrentItem] = useState('?');
  const [isShaking, setIsShaking] = useState(false);

  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    let count = 0;
    const interval = setInterval(() => {
      setCurrentItem(items[Math.floor(Math.random() * items.length)]);
      count++;
      if (count > 10) {
        clearInterval(interval);
        setCurrentItem(items[Math.floor(Math.random() * items.length)]);
        setTimeout(() => setIsShaking(false), 200);
      }
    }, 50);
  };

  return (
    <section id="scoop" className="py-24 md:py-32 bg-[var(--color-bg-alt)] px-6 overflow-hidden relative">
      <Daisy className="absolute top-10 right-10 opacity-40 scale-150" />
      <Daisy className="absolute bottom-10 left-10 opacity-30" />

      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        <div className="flex-1 text-center md:text-left">
          <FadeIn>
            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
              <SparkleIcon size={14} className="text-[var(--color-pink-dark)]" />
              <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy-muted)]">The Mystery Scoop</span>
              <SparkleIcon size={14} className="text-[var(--color-pink-dark)]" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-bold text-[var(--color-navy)] mb-6 leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {heading.split('.').map((s, i, arr) => s.trim() && <span key={i}>{s.trim()}{i < arr.length - 1 ? '.' : ''}{i < arr.length - 2 ? <br /> : ''}</span>)}
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-[var(--color-navy-muted)] mb-10 max-w-md mx-auto md:mx-0">{body}</p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <button onClick={handleShake}
              className="bg-[var(--color-navy)] text-white px-8 py-4 rounded-full font-bold hover:bg-[var(--color-navy-light)] hover:scale-105 transition-all shadow-lg active:scale-95">
              Shake It
            </button>
            <p className="text-sm mt-4 text-[var(--color-navy-muted)] font-medium">Tap the jar or press the button to reveal your scoop</p>
          </FadeIn>
        </div>

        <div className="flex-1 flex justify-center">
          <FadeIn delay={0.4} className="relative cursor-pointer" onClick={handleShake}>
            <div className={`relative ${isShaking ? 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}`}>
              <div className={`w-40 h-8 bg-[var(--color-navy)] rounded-t-xl mx-auto relative z-20 transition-transform duration-200 ${isShaking ? '-translate-y-5 rotate-3' : ''} shadow-md`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[var(--color-navy)] rounded-t-lg" />
              </div>
              <div className="w-64 h-72 bg-white/60 backdrop-blur-md border-4 border-[var(--color-navy)] rounded-b-[40px] rounded-t-xl relative z-10 flex items-center justify-center p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 left-4 w-6 h-full bg-white/40 rotate-12 -translate-y-10" />
                <div className="text-center z-30">
                  <span className="text-2xl md:text-3xl text-[var(--color-navy)] font-bold leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>{currentItem}</span>
                </div>
                <div className="absolute bottom-4 left-6 w-8 h-8 rounded-full bg-[var(--color-pink)]/40 blur-sm" />
                <div className="absolute bottom-10 right-8 w-10 h-10 rounded-full bg-[var(--color-bg-accent)]/70 blur-md" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function OxidisedSection({ heading, body, whatsappUrl }: { heading: string; body: string; whatsappUrl: string }) {
  const tags = ['Statement earrings', 'Tribal motifs', 'Layered necklaces', 'Everyday silver', 'Gift-ready pieces'];

  return (
    <section id="oxidised" className="py-24 md:py-32 bg-white px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        <div className="flex-1 order-2 md:order-1 flex justify-center w-full">
          <FadeIn className="w-full max-w-[400px] aspect-square relative">
            <div className="absolute inset-0 bg-[var(--color-bg-alt)] rounded-3xl overflow-hidden group hover:shadow-2xl transition-all duration-500 border-2 border-[var(--color-bg-accent)]">
              <div className="absolute top-1/2 left-0 w-full h-10 bg-[var(--color-navy)] -translate-y-1/2" />
              <div className="absolute top-0 left-1/2 w-10 h-full bg-[var(--color-navy)] -translate-x-1/2" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-10 flex justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-16 h-16 border-8 border-[var(--color-pink)] rounded-full absolute -left-8 origin-right rotate-12" />
                <div className="w-16 h-16 border-8 border-[var(--color-pink)] rounded-full absolute -right-8 origin-left -rotate-12" />
                <div className="w-10 h-10 bg-[var(--color-pink-dark)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-md" />
              </div>
              <Daisy className="absolute top-6 left-6 opacity-30 scale-75" />
              <Daisy className="absolute bottom-8 right-8 opacity-25 scale-50" />
            </div>
          </FadeIn>
        </div>

        <div className="flex-1 order-1 md:order-2">
          <FadeIn>
            <div className="flex items-center gap-2 mb-4">
               <Sparkles size={16} className="text-[var(--color-navy)]" />
               <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy-muted)]">Oxidised Jewellery</span>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-navy)] mb-6 leading-tight" style={{ fontFamily: 'Fredoka, sans-serif' }}>{heading}</h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[var(--color-navy-muted)] mb-8">{body}</p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-3 mb-10">
              {tags.map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-[var(--color-bg-alt)] text-[var(--color-navy)] rounded-full text-sm font-bold border-2 border-[var(--color-bg-accent)] hover:border-[var(--color-navy)] transition-colors">
                  {tag}
                </span>
              ))}
            </div>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-navy)] text-white px-8 py-4 rounded-full font-bold hover:bg-[var(--color-navy-light)] transition-colors shadow-md w-full sm:w-auto">
               Shop oxidised pieces <ArrowRight size={18} />
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function PhotoGallery({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;
  return (
    <section id="gallery" className="py-24 md:py-32 bg-[var(--color-bg-alt)] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <FadeIn>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy-muted)] mb-4 block">
              <Camera size={14} className="inline-block mr-2 text-[var(--color-pink)]" /> Anovia moments
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              A little gallery of lovely things
            </h2>
          </FadeIn>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <FadeIn key={item.id} delay={index * 0.05} className={index % 5 === 0 ? 'md:col-span-2 md:row-span-2' : ''}>
              <figure className="group h-full min-h-44 overflow-hidden rounded-3xl bg-white border-2 border-[var(--color-bg-accent)] shadow-sm">
                <img src={item.imageUrl} alt={item.altText || item.title} className="w-full h-full min-h-44 object-cover group-hover:scale-105 transition-transform duration-500" />
                {item.title && <figcaption className="sr-only">{item.title}</figcaption>}
              </figure>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Locations() {
  const places = [
    { name: 'Ahmedabad', desc: 'Home base. Local pickup available on request.', type: 'HQ' },
    { name: 'Jamnagar', desc: 'Our second home turf and creative base.', type: 'Studio' },
    { name: 'Pan India', desc: 'Delivered securely wherever you are.', type: 'Delivery' },
  ];
  return (
    <section id="locations" className="py-24 bg-[var(--color-bg-alt)] px-6 relative overflow-hidden">
      <Daisy className="absolute top-8 right-12 opacity-30 scale-125" />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy)] mb-4 block">
              <SparkleIcon size={12} className="inline-block mr-1 text-[var(--color-pink-dark)]" />
              Where We Are
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              Rooted in Gujarat, reaching everywhere
            </h2>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {places.map((place, i) => (
            <FadeIn key={i} delay={0.2 + i * 0.1}>
              <div className="bg-white p-8 rounded-3xl border-2 border-[var(--color-bg-accent)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col shadow-sm hover:border-[var(--color-navy)]">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-bg-accent)] text-[var(--color-navy)] flex items-center justify-center"><MapPin size={24} /></div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-navy-muted)] bg-[var(--color-bg-alt)] px-2 py-1 rounded-full">{place.type}</span>
                </div>
                <h3 className="text-2xl font-bold text-[var(--color-navy)] mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>{place.name}</h3>
                <p className="text-[var(--color-navy-muted)]">{place.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    { text: 'Ordered a custom bracelet and it still looks brand new months later.', author: 'Verified Buyer' },
    { text: 'The hamper was packed so beautifully, it barely needed wrapping.', author: 'Verified Buyer' },
    { text: 'Fast delivery and the mystery scoop gift was such a sweet surprise.', author: 'Verified Buyer' },
  ];
  return (
    <section id="reviews" className="py-24 md:py-32 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn><span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy-muted)] mb-4 block">What people say</span></FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-navy)]" style={{ fontFamily: 'Fredoka, sans-serif' }}>From people who came back</h2>
          </FadeIn>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <FadeIn key={i} delay={0.2 + i * 0.1}>
              <div className="bg-[var(--color-bg-light)] p-8 rounded-3xl border-2 border-[var(--color-bg-accent)] h-full flex flex-col relative hover:border-[var(--color-pink)] hover:-translate-y-1 transition-all">
                <div className="text-[var(--color-pink)] text-7xl absolute top-2 right-5 opacity-15 leading-none font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>"</div>
                <div className="flex gap-1 mb-6 text-[var(--color-pink-dark)]">{[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}</div>
                <p className="text-[var(--color-navy)] text-lg mb-8 font-semibold flex-1 relative z-10">"{r.text}"</p>
                <div className="text-sm text-[var(--color-navy-muted)] uppercase tracking-wider font-bold">— {r.author}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand({ heading, body, whatsappUrl }: { heading: string; body: string; whatsappUrl: string }) {
  return (
    <>
      <WaveDivider fill="var(--color-navy)" bg="white" />
      <section className="bg-[var(--color-navy)] py-20 px-6 relative overflow-hidden">
        <SparkleIcon size={60} className="absolute top-6 left-10 text-white opacity-10" />
        <SparkleIcon size={36} className="absolute bottom-6 right-16 text-[var(--color-pink)] opacity-20" />
        <Daisy className="absolute top-8 right-8 opacity-10 scale-150" />
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Fredoka, sans-serif' }}>{heading}</h2>
            <p className="text-white/80 text-lg font-medium">{body}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <a href="#shop" className="bg-white text-[var(--color-navy)] px-8 py-4 rounded-full font-bold hover:bg-[var(--color-bg-light)] transition-colors text-center shadow-md">
              View Catalogue
            </a>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-[var(--color-navy)] transition-colors flex items-center justify-center gap-2">
              <MessageCircle size={18} /> Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

function Footer({ tagline, whatsappUrl, instagramHandle, instagramUrl }: {
  tagline: string; whatsappUrl: string; instagramHandle: string; instagramUrl: string;
}) {
  return (
    <footer id="contact" className="bg-[var(--color-ink)] pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 border-b border-white/10 pb-16">
        <div className="md:col-span-5">
          <a href="#" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--color-pink)] flex items-center justify-center text-white font-bold text-xl shadow-md">A</div>
            <span className="text-3xl font-bold text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>Anovia</span>
          </a>
          <p className="text-white/60 leading-relaxed max-w-sm mb-6">{tagline}</p>
        </div>
        <div className="md:col-span-3">
          <h4 className="text-white font-bold text-xl mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>Explore</h4>
          <ul className="flex flex-col gap-4">
            {[['Catalogue','#catalogue'],['Mystery Scoop','#scoop'],['Oxidised Jewellery','#oxidised'],['Gallery','#gallery'],['Reviews','#reviews']].map(([l,h]) => (
              <li key={l}><a href={h} className="text-white/60 hover:text-[var(--color-pink)] transition-colors font-medium">{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-4">
          <h4 className="text-white font-bold text-xl mb-6" style={{ fontFamily: 'Fredoka, sans-serif' }}>Reach Us</h4>
          <ul className="flex flex-col gap-4">
            <li><a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-[var(--color-pink)] transition-colors font-medium"><Instagram size={18} /> {instagramHandle}</a></li>
            <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-[var(--color-pink)] transition-colors font-medium"><MessageCircle size={18} /> WhatsApp Community</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm">
        <p>© {new Date().getFullYear()} Anovia. Made with care.</p>
        <p>Ahmedabad · Jamnagar · Pan India</p>
      </div>
    </footer>
  );
}

// ── Default content fallbacks ────────────────────────────────────────────────

const DEFAULTS: Settings = {
  announcement_text: 'Free delivery on orders of Rs 599+ — Order on WhatsApp',
  hero_subtitle: 'Jewellery & gifting that travels pan-India',
  hero_body: 'Anti-tarnish pieces made for every day, with oxidised jewellery and thoughtful gifting for every mood.',
  story_heading: 'From a first market stall to doorsteps across India',
  story_body: 'Anovia started small — a table of hand-picked pieces at a local stall — and grew one order, one repeat customer, and one custom request at a time.',
  story_founder: '— Anisha, founder',
  promise_heading: 'Small details, kept carefully',
  promise_body: 'Every piece is chosen the way we\'d choose something for a friend — pretty, practical, and built to last past one season.',
  scoop_heading: 'Shake the jar. See what you get.',
  scoop_body: 'Every order includes a little something extra — a mystery gift we sneak in just for you.',
  oxidised_heading: 'Bold oxidised pieces, made to stand out',
  oxidised_body: 'Discover expressive oxidised jewellery with a handcrafted feel — easy to style, easy to gift, and made for everyday drama.',
  cta_heading: 'Ready to order?',
  cta_body: 'Send us a message to check availability.',
  footer_tagline: 'Anti-tarnish jewellery, oxidised statement pieces, and thoughtful gifting — designed in Ahmedabad & Jamnagar, delivered pan-India.',
  whatsapp_url: 'https://wa.me/918200230930',
  instagram_handle: '@anoviaaa.16',
  instagram_url: 'https://instagram.com/anoviaaa.16',
};

function s(settings: Settings, key: string) {
  return settings[key] ?? DEFAULTS[key] ?? '';
}

// ── Main Site ────────────────────────────────────────────────────────────────

function MainSite() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [products, setProducts] = useState<Product[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    Promise.all([
      getSettings().then(setSettings).catch(() => {}),
      getProducts().then(setProducts).catch(() => {}),
      getOffers().then(setOffers).catch(() => {}),
      getGallery().then(setGallery).catch(() => {}),
    ]);
  }, []);

  const configuredWa = s(settings, 'whatsapp_url');
  const wa = configuredWa === 'https://wa.me/message' ? 'https://wa.me/918200230930' : configuredWa;

  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] text-[var(--color-foreground)]">
      <AnnouncementBar text={s(settings, 'announcement_text')} />
      <Header whatsappUrl={wa} />
      <main>
        <Hero subtitle={s(settings, 'hero_subtitle')} body={s(settings, 'hero_body')} />
        <MarqueeStrip offers={offers} />
        <OurStory heading={s(settings, 'story_heading')} body={s(settings, 'story_body')} founder={s(settings, 'story_founder')} />
        <ThePromise heading={s(settings, 'promise_heading')} body={s(settings, 'promise_body')} />
        <ShopTheEdit products={products} whatsappUrl={wa} />
        <MysteryScoop heading={s(settings, 'scoop_heading')} body={s(settings, 'scoop_body')} />
        <OxidisedSection heading={s(settings, 'oxidised_heading') || s(settings, 'hampers_heading')} body={s(settings, 'oxidised_body') || s(settings, 'hampers_body')} whatsappUrl={wa} />
        <PhotoGallery items={gallery} />
        <Locations />
        <Reviews />
        <CTABand heading={s(settings, 'cta_heading')} body={s(settings, 'cta_body')} whatsappUrl={wa} />
      </main>
      <Footer
        tagline={s(settings, 'footer_tagline')}
        whatsappUrl={wa}
        instagramHandle={s(settings, 'instagram_handle')}
        instagramUrl={s(settings, 'instagram_url')}
      />
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route path="/login" component={Admin} />
      <Route component={MainSite} />
    </Switch>
  );
}
