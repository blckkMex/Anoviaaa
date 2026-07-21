import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, ArrowRight, Eye, Star, MapPin, 
  Instagram, MessageCircle, Heart, Sparkles, ShoppingBag,
  Gift
} from 'lucide-react';

// --- Reusable Components ---

const FadeIn = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

// --- CSS Art Glyphs ---

const NecklaceGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-12 h-14 border-[2px] border-[var(--color-pink)] rounded-full absolute -top-4 opacity-80" />
    <div className="w-3 h-3 rotate-45 bg-[var(--color-pink)] absolute bottom-2" />
  </div>
);

const EarringGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center gap-3">
    <div className="w-3 h-6 border-[2px] border-[var(--color-pink)] rounded-t-full rounded-b-[4px]" />
    <div className="w-3 h-6 border-[2px] border-[var(--color-pink)] rounded-t-full rounded-b-[4px] translate-y-2" />
  </div>
);

const BangleGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-12 h-12 border-[3px] border-[var(--color-pink)] rounded-full" />
    <div className="w-14 h-14 border border-[var(--color-pink)] rounded-full absolute opacity-50" />
  </div>
);

const RingGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-10 h-10 border-[2px] border-[var(--color-pink)] rounded-full mt-2" />
    <div className="w-4 h-4 rotate-45 bg-[var(--color-pink)] absolute top-2" />
  </div>
);

const HairClipGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-12 h-4 border-[2px] border-[var(--color-pink)] rounded-full relative">
      <div className="w-10 h-1 bg-[var(--color-pink)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  </div>
);

const HamperGlyph = () => (
  <div className="w-16 h-16 relative flex items-center justify-center">
    <div className="w-12 h-12 border-[2px] border-[var(--color-pink)] relative flex items-center justify-center">
      <div className="absolute w-full h-[2px] bg-[var(--color-pink)]" />
      <div className="absolute h-full w-[2px] bg-[var(--color-pink)]" />
      <div className="w-4 h-4 border-[2px] border-[var(--color-pink)] absolute -top-4 rounded-full" />
    </div>
  </div>
);

// --- Sections ---

function AnnouncementBar() {
  return (
    <div className="bg-[var(--color-navy)] text-center py-2 px-4 z-50 relative text-[var(--color-pink)] text-xs sm:text-sm font-medium tracking-wide">
      Now delivering pan-India — Order on WhatsApp
    </div>
  );
}

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Our Story', href: '#story' },
    { name: 'Promise', href: '#promise' },
    { name: 'Shop', href: '#shop' },
    { name: 'Hampers', href: '#hampers' },
    { name: 'Reviews', href: '#reviews' },
  ];

  const scrollTo = (href: string) => {
    setIsOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`sticky top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? 'bg-[var(--color-bg-light)]/90 backdrop-blur-md border-b border-[var(--color-bg-accent)] shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-3 z-50 group">
          <div className="w-10 h-10 rounded-full bg-[var(--color-navy)] flex items-center justify-center text-[var(--color-pink)] font-serif text-xl italic group-hover:scale-105 transition-transform duration-300">
            A
          </div>
          <span className="font-serif text-2xl text-[var(--color-navy)] mt-1">Anovia</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button 
              key={link.name}
              onClick={() => scrollTo(link.href)}
              className="text-[var(--color-navy-light)] hover:text-[var(--color-navy)] font-medium text-sm uppercase tracking-wider relative group py-2"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--color-pink)] transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <button 
            onClick={() => scrollTo('#shop')}
            className="bg-[var(--color-navy)] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[var(--color-ink)] transition-colors hover-elevate"
          >
            Shop Now
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 text-[var(--color-navy)] p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
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
                <button 
                  key={link.name}
                  onClick={() => scrollTo(link.href)}
                  className="text-2xl font-serif text-[var(--color-navy)] hover:text-[var(--color-pink-dark)] transition-colors"
                >
                  {link.name}
                </button>
              ))}
              <button 
                onClick={() => scrollTo('#shop')}
                className="mt-8 bg-[var(--color-navy)] text-white px-8 py-4 rounded-full text-lg w-full font-medium"
              >
                Shop Now
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Hero() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] bg-[var(--color-pink)] rounded-full blur-[100px] opacity-30 animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-[var(--color-bg-accent)] rounded-full blur-[120px] opacity-60" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
      <div className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] max-w-[300px] max-h-[300px] bg-[var(--color-navy-soft)] rounded-full blur-[90px] opacity-20" style={{ animation: 'float 12s ease-in-out infinite' }} />

      <div className="z-10 flex flex-col items-center text-center w-full max-w-4xl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-[var(--color-navy)] bg-white/50 backdrop-blur-sm flex items-center justify-center mb-8 shadow-sm [animation:float_6s_ease-in-out_infinite]"
        >
          <span className="font-serif text-4xl md:text-5xl text-[var(--color-navy)] italic">A</span>
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-[clamp(3.4rem,10vw,7.2rem)] leading-[0.9] text-[var(--color-navy)] mb-6 tracking-tight"
        >
          Anovia
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-serif italic text-xl md:text-3xl text-[var(--color-navy-muted)] mb-8"
        >
          Jewellery & gifting that travels pan-India
        </motion.p>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-xl text-base md:text-lg text-[var(--color-navy-light)] mb-12 font-sans"
        >
          Anti-tarnish pieces made for every day, and curated hampers packed just like we'd pack them for a friend.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <button onClick={() => scrollTo('#shop')} className="px-8 py-4 bg-[var(--color-navy)] text-white rounded-full font-medium hover:bg-[var(--color-ink)] transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
            Shop the Edit <ArrowRight size={18} />
          </button>
          <button onClick={() => scrollTo('#hampers')} className="px-8 py-4 bg-transparent border-2 border-[var(--color-navy)] text-[var(--color-navy)] rounded-full font-medium hover:bg-[var(--color-navy)] hover:text-white transition-colors w-full sm:w-auto">
            View Hampers
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-3 cursor-pointer"
        onClick={() => scrollTo('#story')}
      >
        <span className="text-xs uppercase tracking-widest text-[var(--color-navy-muted)] font-medium">Scroll</span>
        <div className="w-[1px] h-12 bg-[var(--color-navy-soft)]/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-navy)] [animation:drop_2s_infinite]" />
        </div>
      </motion.div>
    </section>
  );
}

function MarqueeStrip() {
  const terms = ["Anti-tarnish", "Custom pieces", "Gift hampers", "Pan India delivery", "Curated by Anisha", "Since Day One"];
  const allTerms = [...terms, ...terms, ...terms, ...terms]; // Enough to scroll

  return (
    <div className="w-full bg-[var(--color-pink)] py-4 overflow-hidden flex whitespace-nowrap border-y border-[var(--color-pink-dark)]/30">
      <div className="flex w-max [animation:marquee_30s_linear_infinite]">
        {allTerms.map((term, i) => (
          <div key={i} className="flex items-center gap-6 px-6 text-[var(--color-navy)] font-medium text-sm md:text-base uppercase tracking-wider">
            <span>{term}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-navy)]/30" />
          </div>
        ))}
      </div>
    </div>
  );
}

function OurStory() {
  return (
    <section id="story" className="py-24 md:py-32 bg-[var(--color-bg-alt)] px-6">
      <div className="max-w-3xl mx-auto text-center">
        <FadeIn>
          <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-pink-dark)] mb-6 block">Our Story</span>
        </FadeIn>
        
        <FadeIn delay={0.1}>
          <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-navy)] mb-8 leading-tight">
            From a first market stall to doorsteps across India
          </h2>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="text-lg md:text-xl text-[var(--color-navy-light)] leading-relaxed mb-8 font-sans">
            Anovia started small — a table of hand-picked pieces at a local stall — and grew one order, one repeat customer, and one custom request at a time. Every hamper and every piece still gets packed the same way it did on day one.
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="font-serif italic text-2xl text-[var(--color-navy-muted)]">
            — Anisha, founder
          </p>
        </FadeIn>
      </div>
    </section>
  );
}

function ThePromise() {
  const promises = [
    {
      title: "Anti-Tarnish, Always",
      desc: "Jewellery meant to be worn, not kept in a box. Water-resistant and built for everyday life.",
      icon: <Sparkles className="text-[var(--color-pink-dark)]" size={28} />
    },
    {
      title: "Made to Fit You",
      desc: "Need a longer chain or a specific charm? We do custom pieces that actually feel like you.",
      icon: <Heart className="text-[var(--color-pink-dark)]" size={28} />
    },
    {
      title: "Gifted with Love",
      desc: "Every order feels like unboxing a present, complete with personal touches and careful packing.",
      icon: <Eye className="text-[var(--color-pink-dark)]" size={28} />
    }
  ];

  return (
    <section id="promise" className="py-24 md:py-32 bg-[var(--color-bg-light)] px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-24">
          <FadeIn>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy-muted)] mb-4 block">The Anovia Promise</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-navy)] mb-6">Small details, kept carefully</h2>
            <p className="text-lg text-[var(--color-navy-light)] max-w-2xl mx-auto">
              Every piece is chosen the way we'd choose something for a friend — pretty, practical, and built to last past one season.
            </p>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {promises.map((p, i) => (
            <FadeIn key={i} delay={0.2 + (i * 0.1)}>
              <div className="bg-white rounded-3xl p-10 text-center border border-[var(--color-bg-accent)] hover:-translate-y-2 transition-transform duration-500 shadow-sm hover:shadow-xl hover:shadow-[var(--color-bg-accent)] h-full flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-[var(--color-bg-accent)] flex items-center justify-center mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-bg-accent)] to-[var(--color-pink)] opacity-20" />
                  {p.icon}
                </div>
                <h3 className="font-serif text-2xl text-[var(--color-navy)] mb-4">{p.title}</h3>
                <p className="text-[var(--color-navy-light)] leading-relaxed">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function ShopTheEdit() {
  const categories = [
    { name: "Necklaces", desc: "Layered or solo", glyph: <NecklaceGlyph /> },
    { name: "Earrings", desc: "Studs & hoops", glyph: <EarringGlyph /> },
    { name: "Bangles", desc: "Stacks & cuffs", glyph: <BangleGlyph /> },
    { name: "Rings", desc: "Adjustable sizes", glyph: <RingGlyph /> },
    { name: "Hair Accessories", desc: "Claws & bands", glyph: <HairClipGlyph /> },
    { name: "Gift Hampers", desc: "Curated boxes", glyph: <HamperGlyph /> }
  ];

  return (
    <section id="shop" className="py-24 md:py-32 bg-[var(--color-navy)] px-6 relative overflow-hidden">
      {/* Decorative bg elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-ink)] rounded-full blur-[100px] opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-navy-light)] rounded-full blur-[120px] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <FadeIn>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-pink)] mb-4 block">Shop the Edit</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif text-white max-w-3xl mx-auto leading-tight">
              Something for every collarbone, wrist, and desk drawer
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c, i) => (
            <FadeIn key={i} delay={0.1 * i} className="h-full">
              <a href="https://wa.me/message" target="_blank" rel="noopener noreferrer" className="block h-full border border-[var(--color-navy-light)]/40 rounded-3xl p-8 bg-[var(--color-ink)]/20 backdrop-blur-sm hover:-translate-y-2 hover:bg-[var(--color-navy-light)]/20 transition-all duration-300 group flex flex-col items-center text-center">
                <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500 text-[var(--color-pink)]">
                  {c.glyph}
                </div>
                <h3 className="font-serif text-2xl text-white mb-2">{c.name}</h3>
                <p className="text-[var(--color-navy-soft)] mb-6">{c.desc}</p>
                <div className="mt-auto w-10 h-10 rounded-full bg-[var(--color-navy-light)]/30 flex items-center justify-center text-white group-hover:bg-[var(--color-pink)] group-hover:text-[var(--color-navy)] transition-colors">
                  <ArrowRight size={18} />
                </div>
              </a>
            </FadeIn>
          ))}
        </div>
        
        <FadeIn delay={0.6} className="mt-16 text-center">
          <a href="https://wa.me/message" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[var(--color-pink)] font-medium hover:text-white transition-colors border-b border-[var(--color-pink)] pb-1">
            Browse full catalog on WhatsApp <ArrowRight size={16} />
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

function MysteryScoop() {
  const items = [
    "A dainty jewellery piece", "A cute hair band", "A mini notebook", 
    "A set of sticky notes", "A fun keychain", "A pastel pen", 
    "A nourishing lip oil", "Refresh wipes", "A velvet scrunchie", 
    "A sturdy claw clip", "A little free gift"
  ];
  
  const [currentItem, setCurrentItem] = useState("?");
  const [isShaking, setIsShaking] = useState(false);

  const handleShake = () => {
    if (isShaking) return;
    setIsShaking(true);
    
    // Scramble effect
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
    <section id="scoop" className="py-24 md:py-32 bg-[var(--color-pink)] px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        <div className="flex-1 text-center md:text-left">
          <FadeIn>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy)]/60 mb-4 block">The Mystery Scoop</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-6xl font-serif text-[var(--color-navy)] mb-6 leading-tight">
              Shake the jar.<br/>See what you get.
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-[var(--color-navy)]/80 mb-10 max-w-md mx-auto md:mx-0">
              Every order includes a little something extra — a mystery gift we sneak in just for you. Because everyone loves a surprise.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <button 
              onClick={handleShake}
              className="bg-[var(--color-navy)] text-white px-8 py-4 rounded-full font-medium hover:bg-[var(--color-ink)] hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              Shake It
            </button>
            <p className="text-sm mt-4 text-[var(--color-navy)]/60 font-medium">
              Tap the jar or press the button to reveal your scoop
            </p>
          </FadeIn>
        </div>

        <div className="flex-1 flex justify-center">
          <FadeIn delay={0.4} className="relative cursor-pointer" onClick={handleShake}>
            <div className={`relative ${isShaking ? 'animate-[shake_0.5s_cubic-bezier(.36,.07,.19,.97)_both]' : ''}`}>
              {/* Lid */}
              <div className={`w-40 h-8 bg-[var(--color-navy)] rounded-t-lg mx-auto relative z-20 transition-transform duration-200 ${isShaking ? '-translate-y-4 rotate-2' : ''}`}>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-[var(--color-navy)] rounded-t-md" />
              </div>
              
              {/* Jar Body */}
              <div className="w-64 h-72 bg-white/40 backdrop-blur-md border-4 border-[var(--color-navy)] rounded-b-[40px] rounded-t-xl relative z-10 flex items-center justify-center p-8 shadow-2xl overflow-hidden shadow-[var(--color-navy)]/10">
                {/* Shine */}
                <div className="absolute top-0 left-4 w-6 h-full bg-white/30 rotate-12 -translate-y-10" />
                
                {/* Contents Text */}
                <div className="text-center z-30">
                  <span className="font-serif text-3xl md:text-4xl text-[var(--color-navy)] font-medium leading-tight">
                    {currentItem}
                  </span>
                </div>

                {/* Decorative particles inside */}
                <div className="absolute bottom-4 left-6 w-8 h-8 rounded-full bg-[var(--color-pink-dark)]/40 blur-sm" />
                <div className="absolute bottom-10 right-8 w-12 h-12 rounded-full bg-[var(--color-bg-accent)]/60 blur-md" />
                <div className="absolute top-20 right-6 w-6 h-6 rounded-full bg-[var(--color-navy)]/10 blur-sm" />
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function HampersSection() {
  const tags = ["Custom Branding", "Bulk Orders", "Birthday Boxes", "Wedding Favours", "Corporate Gifting"];

  return (
    <section id="hampers" className="py-24 md:py-32 bg-white px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
        <div className="flex-1 order-2 md:order-1 flex justify-center w-full">
          <FadeIn className="w-full max-w-[400px] aspect-square relative">
            {/* CSS Art Gift Box */}
            <div className="absolute inset-0 bg-[var(--color-bg-accent)] rounded-3xl overflow-hidden group hover:shadow-2xl hover:shadow-[var(--color-bg-accent)] transition-all duration-500">
              <div className="absolute top-1/2 left-0 w-full h-12 bg-[var(--color-navy)] -translate-y-1/2" />
              <div className="absolute top-0 left-1/2 w-12 h-full bg-[var(--color-navy)] -translate-x-1/2" />
              
              {/* Bow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 z-10 flex justify-center group-hover:scale-110 transition-transform duration-500">
                <div className="w-16 h-16 border-8 border-[var(--color-pink)] rounded-full absolute -left-8 origin-right rotate-12" />
                <div className="w-16 h-16 border-8 border-[var(--color-pink)] rounded-full absolute -right-8 origin-left -rotate-12" />
                <div className="w-10 h-10 bg-[var(--color-pink-dark)] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-md" />
              </div>

              {/* Decorative dots */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-[var(--color-pink)] rounded-full opacity-50" />
              <div className="absolute bottom-12 right-10 w-6 h-6 bg-[var(--color-pink)] rounded-full opacity-50" />
              <div className="absolute top-20 right-16 w-3 h-3 bg-[var(--color-navy)] rounded-full opacity-20" />
            </div>
          </FadeIn>
        </div>

        <div className="flex-1 order-1 md:order-2">
          <FadeIn>
            <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[var(--color-navy-muted)] mb-4">
              <Gift size={16} /> Hampers & Corporate
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-navy)] mb-6 leading-tight">
              The gift that does all the work for you
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-[var(--color-navy-light)] mb-8">
              From birthday surprises to bulk corporate gifting — we plan the box, you take the credit. Custom branding available for orders of 10+.
            </p>
          </FadeIn>
          <FadeIn delay={0.3}>
            <div className="flex flex-wrap gap-3 mb-10">
              {tags.map((tag, i) => (
                <span key={i} className="px-4 py-2 bg-[var(--color-bg-alt)] text-[var(--color-navy)] rounded-full text-sm font-medium border border-[var(--color-bg-accent)]">
                  {tag}
                </span>
              ))}
            </div>
            <a 
              href="https://wa.me/message" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-navy)] text-white px-8 py-4 rounded-full font-medium hover:bg-[var(--color-ink)] transition-colors w-full sm:w-auto"
            >
              Get a Quote <ArrowRight size={18} />
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function Locations() {
  const places = [
    { name: "Ahmedabad", desc: "Home base. Local pickup available on request.", type: "HQ" },
    { name: "Jamnagar", desc: "Our second home turf and creative base.", type: "Studio" },
    { name: "Pan India", desc: "Delivered securely wherever you are.", type: "Delivery" }
  ];

  return (
    <section id="locations" className="py-24 bg-[var(--color-bg-alt)] px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-pink-dark)] mb-4 block">Where We Are</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-navy)]">
              Rooted in Gujarat, reaching everywhere
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {places.map((place, i) => (
            <FadeIn key={i} delay={0.2 + (i * 0.1)}>
              <div className="bg-white p-8 rounded-3xl border border-[var(--color-bg-accent)] hover:-translate-y-2 transition-transform duration-300 h-full flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-bg-accent)] text-[var(--color-navy)] flex items-center justify-center">
                    <MapPin size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-navy-muted)]">{place.type}</span>
                </div>
                <h3 className="font-serif text-2xl text-[var(--color-navy)] mb-3">{place.name}</h3>
                <p className="text-[var(--color-navy-light)]">{place.desc}</p>
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
    {
      text: "Ordered a custom bracelet and it still looks brand new months later.",
      author: "Verified Buyer"
    },
    {
      text: "The hamper was packed so beautifully, it barely needed wrapping.",
      author: "Verified Buyer"
    },
    {
      text: "Fast delivery and the mystery scoop gift was such a sweet surprise.",
      author: "Verified Buyer"
    }
  ];

  return (
    <section id="reviews" className="py-24 md:py-32 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <FadeIn>
            <span className="text-sm font-bold uppercase tracking-widest text-[var(--color-navy-muted)] mb-4 block">What people say</span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-navy)]">
              From people who came back
            </h2>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <FadeIn key={i} delay={0.2 + (i * 0.1)}>
              <div className="bg-[var(--color-bg-light)] p-8 rounded-3xl border border-[var(--color-bg-accent)] h-full flex flex-col relative">
                <div className="text-[var(--color-pink)] font-serif text-6xl absolute top-4 right-6 opacity-20">"</div>
                <div className="flex gap-1 mb-6 text-[var(--color-pink-dark)]">
                  {[...Array(5)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                </div>
                <p className="text-[var(--color-navy)] text-lg mb-8 font-medium italic flex-1 relative z-10">"{r.text}"</p>
                <div className="text-sm text-[var(--color-navy-muted)] uppercase tracking-wider font-bold">
                  — {r.author}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABand() {
  return (
    <section className="bg-[var(--color-navy)] py-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-full bg-[var(--color-ink)] clip-path-slant opacity-20" />
      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-4">Ready to order?</h2>
          <p className="text-[var(--color-pink)] text-lg">Send us a message to check availability.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <a href="#shop" className="bg-white text-[var(--color-navy)] px-8 py-4 rounded-full font-medium hover:bg-[var(--color-pink)] transition-colors text-center">
            Shop the Edit
          </a>
          <a href="https://wa.me/message" target="_blank" rel="noopener noreferrer" className="bg-transparent border-2 border-[var(--color-pink)] text-[var(--color-pink)] px-8 py-4 rounded-full font-medium hover:bg-[var(--color-pink)] hover:text-[var(--color-navy)] transition-colors flex items-center justify-center gap-2">
            <MessageCircle size={18} /> Order on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="bg-[var(--color-ink)] pt-20 pb-10 px-6 text-[var(--color-bg-light)]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 border-b border-white/10 pb-16">
        
        <div className="md:col-span-5">
          <a href="#" className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[var(--color-pink)] flex items-center justify-center text-[var(--color-navy)] font-serif text-xl italic">
              A
            </div>
            <span className="font-serif text-3xl text-white">Anovia</span>
          </a>
          <p className="text-white/60 leading-relaxed max-w-sm mb-6">
            Anti-tarnish jewellery, customisation, and hampers made for gifting — designed in Ahmedabad & Jamnagar, delivered pan-India. Curated by Anisha.
          </p>
        </div>

        <div className="md:col-span-3">
          <h4 className="text-white font-serif text-xl mb-6">Explore</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="#shop" className="text-white/60 hover:text-[var(--color-pink)] transition-colors">Shop the Edit</a></li>
            <li><a href="#scoop" className="text-white/60 hover:text-[var(--color-pink)] transition-colors">Mystery Scoop</a></li>
            <li><a href="#hampers" className="text-white/60 hover:text-[var(--color-pink)] transition-colors">Hampers & Corporate</a></li>
            <li><a href="#reviews" className="text-white/60 hover:text-[var(--color-pink)] transition-colors">Reviews</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="text-white font-serif text-xl mb-6">Reach Us</h4>
          <ul className="flex flex-col gap-4">
            <li>
              <a href="https://instagram.com/anoviaaa.16" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-[var(--color-pink)] transition-colors">
                <Instagram size={18} /> @anoviaaa.16
              </a>
            </li>
            <li>
              <a href="https://wa.me/message" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-[var(--color-pink)] transition-colors">
                <MessageCircle size={18} /> WhatsApp Community
              </a>
            </li>
            <li>
              <a href="https://instagram.com/anoviaa.16" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/60 hover:text-[var(--color-pink)] transition-colors">
                <Instagram size={18} /> Backup: @anoviaa.16
              </a>
            </li>
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

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-light)] text-[var(--color-foreground)] font-sans">
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <MarqueeStrip />
        <OurStory />
        <ThePromise />
        <ShopTheEdit />
        <MysteryScoop />
        <HampersSection />
        <Locations />
        <Reviews />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}

export default App;
