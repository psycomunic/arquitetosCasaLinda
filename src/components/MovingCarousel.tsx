import React from 'react';

const images = [
  '/images/carousel/quadro_1.png',
  '/images/carousel/quadro_2.png',
  '/images/carousel/quadro_3.png',
  '/images/carousel/quadro_4.png',
  '/images/carousel/quadro_5.png',
  '/images/carousel/quadro_6.png',
  '/images/carousel/quadro_7.png',
  '/images/carousel/quadro_8.png',
  '/images/carousel/quadro_9.png',
  '/images/carousel/quadro_10.png',
];

export const MovingCarousel: React.FC = () => {
  // Triple the images to ensure seamless loop
  const displayImages = [...images, ...images, ...images];

  return (
    <section className="relative w-full py-20 bg-canvas overflow-hidden">
      {/* Side Fades */}
      <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-canvas to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-canvas to-transparent z-10 pointer-events-none"></div>

      {/* Scrolling Container */}
      <div className="flex w-fit animate-scroll gap-4 md:gap-8 px-4">
        {displayImages.map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[45vw] md:w-[calc(20vw-2rem)] aspect-square group transition-all duration-500"
          >
            <img
              src={src}
              alt={`Quadro ${index + 1}`}
              className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>

      <style>{`
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
      `}</style>
    </section>
  );
};
