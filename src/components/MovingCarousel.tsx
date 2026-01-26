import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

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
  // Triple the images to ensure seamless loop
  const displayImages = [...images, ...images, ...images];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <section className="relative w-full py-20 bg-canvas overflow-hidden flex flex-col gap-12">
      <div className="text-center space-y-4 px-6 relative z-10">
        <h2 className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold">Galeria Real</h2>
        <h3 className="text-2xl md:text-5xl font-serif text-white">Fotos enviadas por clientes em seus ambientes</h3>
      </div>

      <div className="relative w-full">
        {/* Side Fades - Hidden on mobile during swipe interaction for better visibility */}
        <div className="hidden md:block absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none"></div>
        <div className="hidden md:block absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling Container */}
        {/* Mobile: Horizontal scroll (overflow-x-auto) with snap */}
        {/* Desktop: Animate scroll */}
        <div className="
          flex gap-6 md:gap-8 px-4 
          overflow-x-auto snap-x snap-mandatory scrollbar-hide
          md:overflow-x-hidden md:animate-scroll md:w-fit
        ">
          {displayImages.map((src, index) => (
            <div
              key={index}
              className="
                flex-shrink-0 relative group
                w-[85vw] snap-center
                md:w-[calc(20vw-2rem)] md:snap-align-none
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
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
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
