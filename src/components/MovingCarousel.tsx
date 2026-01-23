import React from 'react';

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
              alt={`Ambiente Cliente ${index + 1}`}
              className="w-full h-full object-cover rounded-lg shadow-xl group-hover:scale-105 transition-transform duration-500"
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
