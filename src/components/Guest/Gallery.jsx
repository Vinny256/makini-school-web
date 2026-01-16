import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImages, faCircleNotch } from '@fortawesome/free-solid-svg-icons';

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = [
    { url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800", title: "Grade 10 STEM Enrollment" },
    { url: "https://images.unsplash.com/photo-1577896851231-70ef14697593?q=80&w=800", title: "Junior Secondary Science Lab" },
    { url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800", title: "Digital Literacy Workshop" },
    { url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800", title: "Creative Arts Session" },
    { url: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=800", title: "Student Leadership Council" },
    { url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800", title: "CBC Competency Exhibition" },
    { url: "https://images.unsplash.com/photo-1523050337452-57c666085b4d?q=80&w=800", title: "Sports Day Finals" },
    { url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=800", title: "New Campus Library" },
    { url: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=800", title: "Primary to Secondary Transition" },
    { url: "https://images.unsplash.com/photo-1501290791746-4162092afa5e?q=80&w=800", title: "Faculty Graduation Ceremony" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 30000); // 30 Seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section id="gallery" className="py-24 bg-white dark:bg-slate-900 transition-colors overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4 text-blue-900 dark:text-yellow-400">
          <FontAwesomeIcon icon={faImages} size="xl" />
          <h2 className="text-4xl font-black uppercase tracking-tighter">School Gallery</h2>
        </div>

        <div className="relative mt-12 flex justify-center items-center">
          {/* Circular Running Timer (Clockwise) */}
          <div className="absolute w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-full border-4 border-gray-100 dark:border-slate-800"></div>
          <div className="absolute w-[350px] h-[350px] md:w-[550px] md:h-[550px] rounded-full border-4 border-blue-900 dark:border-yellow-400 border-t-transparent animate-[spin_30s_linear_infinite]"></div>

          {/* Image Display */}
          <div className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full overflow-hidden border-[15px] border-white dark:border-slate-800 shadow-2xl z-10 relative">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === activeIndex 
                    ? "opacity-100 scale-100 rotate-0" 
                    : "opacity-0 scale-50 -rotate-12 clip-path-cut" 
                }`}
                style={{
                  clipPath: index !== activeIndex ? 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' : 'none'
                }}
              >
                <img src={slide.url} className="w-full h-full object-cover" alt={slide.title} />
                <div className="absolute bottom-0 w-full bg-blue-900/80 p-6 text-white">
                  <p className="font-bold text-lg">{slide.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Indicator Dots */}
        <div className="mt-16 flex justify-center gap-2">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-2 rounded-full transition-all ${i === activeIndex ? 'w-8 bg-blue-900' : 'w-2 bg-gray-300'}`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;