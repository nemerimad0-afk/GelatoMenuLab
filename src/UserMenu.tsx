import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Coffee, CupSoda, CakeSlice, Utensils, ChevronUp, ChevronRight, ChevronLeft, Volume2, VolumeX, Sparkles, IceCream, Instagram, Facebook, MessageCircle, MapPin } from "lucide-react";
import { MenuCategory, menuData as localMenuData } from "./data";
import { settingsData as localSettingsData } from "./settingsData";

const iconMap: Record<string, React.ReactNode> = {
  Coffee: <Coffee size={20} />,
  CupSoda: <CupSoda size={20} />,
  CakeSlice: <CakeSlice size={20} />,
  Utensils: <Utensils size={20} />,
  IceCream: <IceCream size={20} />,
};

const permanentCategoryImages: Record<string, string> = {
  gelato: "/images/category_gelato_1779623553083.png",
  hot_drinks: "/images/category_hot_drinks_1779623576114.png",
  cold_drinks: "/images/category_cold_drinks_1779623595463.png",
  waffles: "/images/category_waffle_1779623610768.png",
  crepes: "/images/category_crepe_1779623625872.png",
  affogato: "/images/category_gelato_1779623553083.png",
  pancakes: "/images/category_pancake_1779623694838.png",
  smoothies: "/images/category_smoothie_1779623641703.png",
  fresh_drinks: "/images/category_cold_drinks_1779623595463.png",
  soft_drinks: "/images/category_mojito_1779623662643.png",
  mojitos: "/images/category_mojito_1779623662643.png",
  milkshakes: "/images/category_milkshake_1779623714422.png",
  gelato_roma_cake: "https://www.image2url.com/r2/default/files/1779629268606-f7637ff7-caae-4a6a-b0ec-b4b391f43644.png",
  frozen_yogurt: "/images/category_frozen_yogurt_1779623678153.png",
};

export default function UserMenu() {
  const [menuData, setMenuData] = useState<MenuCategory[]>(localMenuData);
  const [showSplash, setShowSplash] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`/api/menu?t=${Date.now()}`)
      .then(r => {
        if (!r.ok) throw new Error("API not available");
        return r.json();
      })
      .then(data => setMenuData(data))
      .catch(e => {
        console.error("Could not fetch menu data from server, using exported data");
        setMenuData(localMenuData);
      });
  }, []);

  // Handle auto-playing music once splash disappears
  useEffect(() => {
    if (!showSplash && audioRef.current && !isMusicPlaying) {
      const playOnInteract = () => {
         if (audioRef.current) {
            audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
         }
         document.removeEventListener('click', playOnInteract);
         document.removeEventListener('scroll', playOnInteract);
         document.removeEventListener('touchstart', playOnInteract);
      };
      
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
         playPromise.then(() => {
            setIsMusicPlaying(true);
         }).catch(() => {
            document.addEventListener('click', playOnInteract);
            document.addEventListener('scroll', playOnInteract);
            document.addEventListener('touchstart', playOnInteract);
         });
      }
    }
  }, [showSplash]);

  // Auto-hide splash after 5 seconds
  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="https://www.image2url.com/r2/default/files/1779609642716-4e650a6a-b24e-4822-9380-8a529e1eb49a.mp3"
        loop
        preload="auto"
      />
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#FFFBF5] text-center overflow-hidden px-4"
          >
            {/* Elegant Background Image with Ken Burns */}
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 15, ease: "linear" }}
              className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FFFBF5] via-[#FFFBF5]/80 to-[#FFFBF5]/60 z-10" />

            {/* Glowing Backdrop for Logo */}
            <motion.div
              animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#5E2D14]/10 rounded-full blur-[80px] z-10 pointer-events-none"
            />
            
            {/* Floating Gold Particles */}
            <div className="absolute inset-0 z-20 pointer-events-none">
               {Array.from({ length: 15 }).map((_, i) => (
                 <motion.div
                    key={i}
                    className="absolute bg-[#5E2D14] rounded-full opacity-20 shadow-[0_0_10px_#5E2D14]"
                    style={{
                       width: Math.random() * 4 + 2 + 'px',
                       height: Math.random() * 4 + 2 + 'px',
                       top: Math.random() * 100 + '%',
                       left: Math.random() * 100 + '%',
                    }}
                    animate={{
                       y: [0, -100, 0],
                       opacity: [0, 0.8, 0],
                    }}
                    transition={{
                       duration: Math.random() * 4 + 4,
                       repeat: Infinity,
                       ease: "easeInOut",
                       delay: Math.random() * 2
                    }}
                 />
               ))}
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="relative z-30 mb-8"
            >
              <div 
                className="relative mx-auto mb-4 flex items-center justify-center"
                style={{ perspective: "1000px" }}
              >
                <motion.img 
                  animate={{ 
                    y: [0, -15, 0],
                    rotateX: [5, 15, 5], 
                    rotateY: [-10, 10, -10]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  src="/logo-menu.png" 
                  alt="Gelato Lab Logo" 
                  className="h-40 sm:h-56 lg:h-64 w-auto object-contain mb-8 p-4 sm:p-6 rounded-[3rem] backdrop-blur-xl bg-gradient-to-tr from-white/20 to-white/5 border border-white/50 border-t-white/80 border-l-white/80 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_4px_15px_rgba(255,255,255,0.5),inset_0_-4px_15px_rgba(0,0,0,0.3)] filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.4)]"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.includes('logo-menu.png')) {
                      target.src = '/logo.png';
                      return;
                    }
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent && parent.nextElementSibling) {
                       parent.nextElementSibling.classList.remove('hidden');
                    }
                  }}
                />
              </div>
              <h1 className="hidden text-6xl sm:text-7xl font-bold tracking-tight text-[#5E2D14] font-['Cairo'] mb-4">
                Gelato Lab
              </h1>
              <p className="text-xl sm:text-2xl text-[#8B4B27] font-medium font-['Cairo'] mb-12 italic">
                أطعم جيلاتو وألذ حلويات...
              </p>
            </motion.div>
            
            <div className="relative z-30 mb-8 flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                {/* Background faded logo */}
                <img 
                  src="/logo.png" 
                  alt="Logo Outline" 
                  className="absolute w-28 h-28 object-contain opacity-20 filter grayscale"
                />
                
                {/* Filling colored logo */}
                <motion.img 
                  src="/logo.png" 
                  alt="Logo Filling" 
                  className="absolute w-28 h-28 object-contain filter drop-shadow-xl"
                  initial={{ clipPath: "inset(100% 0 0 0)", scale: 0.9, opacity: 0 }}
                  animate={{ clipPath: "inset(0% 0 0 0)", scale: 1, opacity: 1 }}
                  transition={{ duration: 5, ease: "easeOut" }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`min-h-screen relative bg-[#1A0B05] text-white font-['Cairo'] pb-24 ${showSplash ? "h-screen overflow-hidden" : ""}`}>
        {/* Decorative Background Texture */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute inset-0 bg-[#1A0B05]" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542840410-3092f99611a3?auto=format&fit=crop&q=80&w=2000')] opacity-5 bg-cover bg-center mix-blend-screen" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          <div className="absolute top-[40%] left-0 w-[600px] h-[600px] bg-[#8B4B27]/10 rounded-full blur-[120px] -ml-40" />
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-[#5E2D14]/10 rounded-full blur-[150px] mb-[-400px]" />
        </div>
        
        {/* Floating Music Toggle */}
        {!showSplash && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={toggleMusic}
            className={`fixed top-4 left-4 z-50 p-3 rounded-full backdrop-blur border text-[#5E2D14] shadow-md hover:scale-105 transition-all duration-300 ${showScrollTop ? "bg-[#FFFBF5] border-[#EFE6DD]" : "bg-white/80 border-[#EFE6DD]"}`}
            title="تشغيل/إيقاف الموسيقى"
          >
            {isMusicPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </motion.button>
        )}

        {/* Floating Header with Logo */}
        {!showSplash && !selectedCategory && (
          <div className={`fixed top-6 left-0 right-0 z-40 flex flex-col items-center justify-center transition-all duration-500 ease-in-out pointer-events-none ${
            showScrollTop ? "translate-y-0 opacity-100" : "translate-y-[-200%] opacity-0"
          }`}>
            <div className="py-2 px-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5),auto_0_0_rgba(212,175,55,0.3)] border border-white/60 pointer-events-auto transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <img 
                src="/logo-menu.png" 
                alt="Gelato Lab" 
                className="h-14 sm:h-16 w-auto object-contain filter drop-shadow-sm"
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!selectedCategory ? (
            <motion.div
              key="main-menu"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <div className="relative h-[40vh] sm:h-[50vh] w-full overflow-hidden">
                <motion.div
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="absolute inset-0 z-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&q=80&w=2070')",
                  }}
                />
                <div className="absolute inset-0 bg-[#1A0B05]/30 mix-blend-multiply z-10 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-[#1A0B05]" />
                <div 
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center"
                >
                  <motion.img 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    src="/logo.png" 
                    alt="Gelato Lab" 
                    className="h-32 sm:h-44 w-auto mb-8 object-contain p-4 sm:p-6 rounded-full bg-gradient-to-br from-[#FFFDF9] to-[#F4EBE1] border-2 border-[#D4AF37]/60 shadow-[0_15px_35px_rgba(0,0,0,0.5),inset_0_4px_10px_rgba(255,255,255,1)] filter drop-shadow-xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src.includes('logo.png')) {
                        target.src = '/logo-menu.png';
                        return;
                      }
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const h1 = document.createElement('h1');
                        h1.className = "text-4xl sm:text-7xl font-bold tracking-tight mb-2 text-[#5E2D14] drop-shadow-lg bg-white/85 p-4 rounded-3xl backdrop-blur-md border border-white/60";
                        h1.textContent = "Gelato Lab";
                        parent.insertBefore(h1, target.nextSibling);
                      }
                    }}
                  />
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-lg sm:text-2xl text-[#FFFBF5] font-bold drop-shadow-md bg-white/20 px-6 py-2 rounded-full backdrop-blur-md border border-white/20"
                  >
                    اختر طلبك من القائمة
                  </motion.p>
                </div>
              </div>

              <main className="max-w-4xl mx-auto p-4 sm:p-6 relative z-30 pb-20 -mt-8 sm:-mt-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {menuData.map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6, type: "spring", stiffness: 100 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setSelectedCategory(category);
                      }}
                      className="relative h-56 sm:h-72 rounded-[2.5rem] overflow-hidden group w-full text-right shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 border-[3px] border-white/40"
                    >
                      <motion.div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${category.image || permanentCategoryImages[category.id] || "/images/category_gelato_1779623553083.png"}')` }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B05]/95 via-[#1A0B05]/40 to-transparent z-10 transition-opacity duration-500 opacity-90 group-hover:opacity-100" />
                      
                      <div className="absolute top-6 left-6 z-20">
                        <div className="w-12 h-12 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white flex items-center justify-center opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                           <ChevronLeft size={24} className="transform transition-transform duration-300 group-hover:-translate-x-1" />
                        </div>
                      </div>

                      <div className="absolute bottom-0 right-0 left-0 p-6 sm:p-8 z-20">
                        <div className="transform transition-transform duration-500 group-hover:-translate-y-2 relative">
                          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[#D4AF37]/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          <div className="text-[#5E2D14] mb-4 bg-gradient-to-br from-[#FFFBF5] to-[#f0e6d5] w-fit p-3.5 rounded-2xl shadow-xl transform transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 border border-white">
                            {category.icon && iconMap[category.icon]}
                          </div>
                          <div className="inline-flex items-center gap-2">
                             <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-l from-white to-white/70 drop-shadow-lg break-words">
                               {category.title}
                             </h2>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </main>

              {/* Footer */}
              <footer className="mt-16 bg-[#1A0B05] rounded-t-[3rem] p-8 sm:p-12 pb-24 text-center shadow-[0_-10px_40px_rgba(0,0,0,0.1)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542840410-3092f99611a3?auto=format&fit=crop&q=80&w=800')] opacity-5 bg-center bg-cover mix-blend-overlay" />
                
                <div className="relative z-10 max-w-4xl mx-auto">
                  <h3 className="text-[#D4AF37] text-xl sm:text-2xl font-bold mb-6">
                    تابعنا على مواقع التواصل الاجتماعي
                  </h3>

                  <div className="flex justify-center items-center gap-4 sm:gap-6 mb-8" dir="ltr">
                    <a href="https://www.instagram.com/gelato.lab.palestine?igsh=ZHdzbG1jejgzeXZ2" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#1A0B05] hover:scale-110 transition-all duration-300 flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
                      <Instagram size={22} />
                    </a>
                    <a href="https://www.facebook.com/share/18DfbQAT31/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white/5 hover:bg-[#D4AF37] hover:text-[#1A0B05] hover:scale-110 transition-all duration-300 flex items-center justify-center text-white backdrop-blur-sm border border-white/10">
                      <Facebook size={22} />
                    </a>
                  </div>
                  
                  <p className="text-white/50 text-sm mb-4">
                    أو تواصل عبر الواتساب
                  </p>

                  <div className="flex justify-center mb-12">
                    <a href="https://wa.me/970569716164" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 hover:scale-110 transition-all duration-300 flex items-center justify-center text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] border border-green-400/50">
                      <MessageCircle size={28} />
                    </a>
                  </div>
                  
                  <div className="border-t border-white/10 pt-10 pb-2 flex flex-col items-center">
                    <h4 className="text-xl sm:text-2xl font-bold text-white mb-2">جيلاتو لاب - دورا</h4>
                    <p className="text-white/50 mb-10 text-sm">تجربة طعم لا يُقاوم</p>
                    <p className="text-white/40 text-xs">
                      © 2026 جميع الحقوق محفوظة - جيلاتو لاب
                    </p>
                  </div>
                </div>
              </footer>
            </motion.div>
          ) : (
            <motion.div
              key="category-details"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              {/* Category Header with Image */}
              {/* Back Button (Fixed & Animated) */}
              <motion.button
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                onClick={() => setSelectedCategory(null)}
                className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#FFFBF5]/95 text-[#5E2D14] backdrop-blur-md px-6 py-3 rounded-full hover:bg-white transition-colors shadow-lg border border-[#EFE6DD] group"
              >
                <ChevronRight size={20} className="transform group-hover:translate-x-1 transition-transform" />
                <span className="font-bold text-lg">العودة للقائمة</span>
              </motion.button>

              <div className="relative h-[35vh] sm:h-[45vh] w-full overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${selectedCategory.image || permanentCategoryImages[selectedCategory.id] || "/images/category_gelato_1779623553083.png"}')` }}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <div className="absolute inset-0 bg-[#3A1A0A]/60 z-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0B05] via-[rgba(26,11,5,0.7)] to-transparent z-15" />
                
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center mt-12">
                  <motion.div 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-[#D4AF37] mb-4 bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/20 shadow-xl transform -rotate-3"
                  >
                    {selectedCategory.icon && iconMap[selectedCategory.icon]}
                  </motion.div>
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] mb-2"
                  >
                    {selectedCategory.title}
                  </motion.h1>
                </div>
              </div>

              {/* Items List */}
              <main className="max-w-3xl mx-auto px-4 -mt-10 sm:-mt-16 pb-20 relative z-30">
                <div className="grid gap-4">
                  {(() => {
                    const isFrozenYogurt = selectedCategory.id === "frozen_yogurt";
                    
                    const renderItemCard = (item: any, idx: number) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: idx * 0.1, duration: 0.5, type: "spring", stiffness: 100 }}
                        whileHover={{ y: -5, scale: 1.01 }}
                        className="p-5 md:p-6 rounded-[2rem] bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-[#D4AF37]/40 shadow-lg hover:shadow-[0_8px_30px_rgb(212,175,55,0.15)] transition-all duration-300 group flex gap-4 sm:gap-6 items-center"
                      >
                        {/* Item Image */}
                        {item.image && (
                          <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)] border-2 border-white/5 group-hover:border-[#D4AF37]/30 transition-colors relative">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}

                        <div className="flex-1 flex flex-col justify-center">
                          <div className="flex flex-row justify-between items-start mb-2 gap-2 sm:gap-4 w-full">
                            <h3 className="text-lg sm:text-xl font-bold text-white transition-colors flex items-center gap-2 flex-wrap drop-shadow-md">
                              {item.name}
                              {item.isPopular && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#D4AF37]/20 text-[#D4AF37] font-bold border border-[#D4AF37]/30 whitespace-nowrap shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                                  <Sparkles size={12} fill="currentColor" />
                                  مميز
                                </span>
                              )}
                            </h3>
                            
                            {/* Helper to parse sizes/prices from desc */}
                            {(() => {
                              const gelatoMatch = item.description?.match(/طابة:\s*(\d+)،\s*طابتين:\s*(\d+)،\s*ثلاث\s*طابات:\s*(\d+)/);
                              const sizeMatch = item.description?.match(/\((كبير|جماعية):\s*(\d+)\)/);
                              
                              if (gelatoMatch) {
                                return (
                                  <div className="flex flex-col gap-1 items-end shrink-0">
                                    <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#D4AF37]/20 to-transparent pr-3 pl-2 py-0.5 rounded-l-full sm:rounded-full text-[#D4AF37] font-black w-24 border-r-2 border-[#D4AF37]">
                                      <span className="text-xs font-bold whitespace-nowrap">طابة:</span>
                                      <div className="flex items-baseline gap-0.5">
                                        <span className="text-sm">{gelatoMatch[1]}</span>
                                        <span className="text-[10px] text-[#D4AF37]/80">₪</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#D4AF37]/20 to-transparent pr-3 pl-2 py-0.5 rounded-l-full sm:rounded-full text-[#D4AF37] font-black w-24 border-r-2 border-[#D4AF37]">
                                      <span className="text-xs font-bold whitespace-nowrap">طابتين:</span>
                                      <div className="flex items-baseline gap-0.5">
                                        <span className="text-sm">{gelatoMatch[2]}</span>
                                        <span className="text-[10px] text-[#D4AF37]/80">₪</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#D4AF37]/20 to-transparent pr-3 pl-2 py-0.5 rounded-l-full sm:rounded-full text-[#D4AF37] font-black w-24 border-r-2 border-[#D4AF37]">
                                      <span className="text-xs font-bold whitespace-nowrap">3 طابات:</span>
                                      <div className="flex items-baseline gap-0.5">
                                        <span className="text-sm">{gelatoMatch[3]}</span>
                                        <span className="text-[10px] text-[#D4AF37]/80">₪</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }
                              
                              if (sizeMatch) {
                                const smallLabel = sizeMatch[1] === 'كبير' ? 'صغير' : 'فردية';
                                return (
                                  <div className="flex flex-col gap-1 items-end shrink-0">
                                    <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#D4AF37]/20 to-transparent pr-3 pl-2 py-1 rounded-l-full sm:rounded-full text-[#D4AF37] font-black min-w-[90px] border-r-2 border-[#D4AF37]">
                                      <span className="text-xs font-bold whitespace-nowrap">{smallLabel}:</span>
                                      <div className="flex items-baseline gap-0.5">
                                        <span className="text-sm">{item.price}</span>
                                        <span className="text-[10px] text-[#D4AF37]/80">₪</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-[#D4AF37]/20 to-transparent pr-3 pl-2 py-1 rounded-l-full sm:rounded-full text-[#D4AF37] font-black min-w-[90px] border-r-2 border-[#D4AF37]">
                                      <span className="text-xs font-bold whitespace-nowrap">{sizeMatch[1]}:</span>
                                      <div className="flex items-baseline gap-0.5">
                                        <span className="text-sm">{sizeMatch[2]}</span>
                                        <span className="text-[10px] text-[#D4AF37]/80">₪</span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                              if (item.price !== undefined) {
                                return (
                                  <div className="flex items-base gap-1 bg-gradient-to-r from-[#D4AF37]/20 to-transparent pr-4 pl-3 py-1 sm:px-4 sm:py-1.5 rounded-l-full sm:rounded-full text-[#D4AF37] font-black w-fit shrink-0 border-r-2 border-[#D4AF37] shadow-inner mb-1 sm:mb-0">
                                    <span className="text-base sm:text-lg">{item.price}</span>
                                    <span className="text-xs sm:text-sm font-bold text-[#D4AF37]/80">₪</span>
                                  </div>
                                );
                              }
                              return null;
                            })()}

                          </div>
                          {item.description && (
                            <p className="text-sm sm:text-base text-white/70 font-medium leading-relaxed drop-shadow-sm mt-1 sm:mt-0">
                              {item.description
                                .replace(/\s*-\s*طابة:\s*\d+،\s*طابتين:\s*\d+،\s*ثلاث\s*طابات:\s*\d+/, "")
                                .replace(/\s*\((كبير|جماعية):\s*\d+\)/, "")}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    );

                    if (isFrozenYogurt) {
                      const baseItems = selectedCategory.items.filter(item => !item.id.startsWith("fya"));
                      const toppingItems = selectedCategory.items.filter(item => item.id.startsWith("fya"));
                      return (
                        <>
                          {baseItems.map((item, idx) => renderItemCard(item, idx))}
                          
                          {toppingItems.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                              className="mt-8 mb-4 flex items-center justify-center gap-4"
                            >
                              <div className="h-[2px] bg-gradient-to-l from-transparent to-[#D4AF37]/60 flex-1" />
                              <span className="flex items-center gap-3 text-xl sm:text-2xl font-black text-[#D4AF37] px-6 py-2 rounded-full bg-gradient-to-r from-[#D4AF37]/15 to-[#D4AF37]/5 border border-[#D4AF37]/35 shadow-[0_4px_15px_rgba(212,175,55,0.15)] select-none">
                                <Sparkles size={22} className="text-[#D4AF37]" fill="currentColor" />
                                المكملات والإضافات
                              </span>
                              <div className="h-[2px] bg-gradient-to-r from-transparent to-[#D4AF37]/60 flex-1" />
                            </motion.div>
                          )}
                          
                          {toppingItems.map((item, idx) => renderItemCard(item, baseItems.length + idx))}
                        </>
                      );
                    } else {
                      return selectedCategory.items.map((item, idx) => renderItemCard(item, idx));
                    }
                  })()}
                </div>
              </main>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#5E2D14] text-[#FFFBF5] shadow-lg shadow-[#5E2D14]/20 hover:bg-[#8B4B27] transition-colors"
            >
              <ChevronUp size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
