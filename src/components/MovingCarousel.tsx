import React from 'react';

const images = [
  '/images/carousel/premium_1.jpg',
  '/images/carousel/premium_2.jpg',
  '/images/carousel/premium_3.jpg',
  '/images/carousel/premium_4.jpg',
  '/images/carousel/premium_5.jpg',
  '/images/carousel/premium_6.jpg',
  '/images/carousel/premium_7.jpg',
  '/images/carousel/premium_8.jpg',
  '/images/carousel/premium_9.jpg',
  '/images/carousel/premium_10.jpg',
  '/images/carousel/premium_11.jpg',
  '/images/carousel/premium_12.jpg',
  '/images/carousel/premium_13.jpg',
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
      <div className="flex w-fit animate-scroll gap-6 md:gap-8 px-4">
        {displayImages.map((src, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-[70vw] md:w-[calc(20vw-2rem)] aspect-square group transition-all duration-500"
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
