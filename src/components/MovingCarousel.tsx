import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

const images = [
  '/images/carousel/client-1.jpg',
  '/images/carousel/client-2.jpg',
  '/images/carousel/client-3.jpg',
  '/images/carousel/client-4.jpg',
  '/images/carousel/client-5.jpg',
  '/images/carousel/client-6.jpg',
  '/images/carousel/client-7.jpg',
];

export const MovingCarousel: React.FC = () => {
  // Use enough duplication
  const displayImages = [...images, ...images, ...images, ...images];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>(0);
  const isPausedRef = useRef(false);

  // Configuration
  const SCROLL_SPEED = 0.5; // Pixels per frame
  const MANUAL_SCROLL_AMOUNT = 300; // Pixels to scroll on arrow click

  const animate = () => {
    if (scrollContainerRef.current && !isPausedRef.current) {
      const container = scrollContainerRef.current;
      const maxScroll = container.scrollWidth / 4; // Width of one set (approx)

      // Add speed to scroll
      container.scrollLeft += SCROLL_SPEED;

      // Reset seamless loop
      if (container.scrollLeft >= maxScroll * 2) { // Allow going further before reset to be safe
        // Reset back to range 1
        container.scrollLeft -= maxScroll;
      }
    }
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const amount = direction === 'left' ? -MANUAL_SCROLL_AMOUNT : MANUAL_SCROLL_AMOUNT;

      container.scrollBy({
        left: amount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="relative w-full py-20 bg-canvas overflow-hidden flex flex-col gap-12 group/section">
      <div className="text-center space-y-4 px-6 relative z-10">
        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Galeria Real</h2>
        <h3 className="text-2xl md:text-5xl font-serif text-white">Fotos enviadas por clientes em seus ambientes</h3>
      </div>

      <div
        className="relative w-full"
        onMouseEnter={() => (isPausedRef.current = true)}
        onMouseLeave={() => (isPausedRef.current = false)}
        onTouchStart={() => (isPausedRef.current = true)}
        onTouchEnd={() => (isPausedRef.current = false)}
      >
        {/* Navigation Arrows */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-12 z-30 pointer-events-none">
          <button
            onClick={() => handleManualScroll('left')}
            className="pointer-events-auto bg-black/50 backdrop-blur-sm border border-white/10 text-white p-3 md:p-4 rounded-full hover:bg-gold hover:text-black hover:scale-110 transition-all active:scale-95 shadow-lg group/btn"
            aria-label="Anterior"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => handleManualScroll('right')}
            className="pointer-events-auto bg-black/50 backdrop-blur-sm border border-white/10 text-white p-3 md:p-4 rounded-full hover:bg-gold hover:text-black hover:scale-110 transition-all active:scale-95 shadow-lg group/btn"
            aria-label="Próximo"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Side Fades */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-canvas to-transparent z-20 pointer-events-none"></div>
        <div className="hidden md:block absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-canvas to-transparent z-20 pointer-events-none"></div>

        {/* Scrolling Container */}
        <div
          ref={scrollContainerRef}
          className="
            flex gap-6 md:gap-8 px-4 
            overflow-x-auto snap-x snap-mandatory scrollbar-hide
            w-full
          "
        >
          {displayImages.map((src, index) => (
            <div
              key={index}
              className="
                flex-shrink-0 relative group
                w-[85vw] snap-center
                md:w-[calc(20vw-2rem)] md:snap-align-start
                aspect-square cursor-pointer
              "
              onClick={() => setSelectedImage(src)}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <ZoomIn className="text-white drop-shadow-lg" size={32} />
              </div>
              <img
                src={src}
                alt={`Ambiente Cliente ${index + 1}`}
                className="w-full h-full object-cover rounded-lg shadow-xl"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X size={32} />
          </button>

          <img
            src={selectedImage}
            alt="Zoom da imagem do cliente"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl animate-zoom-in"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking image
          />
        </div>
      )}

      <style>{`
        /* Hide scrollbar */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        
        @keyframes zoom-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-zoom-in {
          animation: zoom-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
};
