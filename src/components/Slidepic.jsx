import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function EnhancedPromotionCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const slideIntervalRef = useRef(null);

  const slides = [
    "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1600&q=80",
    "https://plus.unsplash.com/premium_photo-1661762555601-47d088a26b50?auto=format&fit=crop&w=1600&q=80",
  ];

  const intervalTime = 5000;

  useEffect(() => {
    if (!isPaused) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, intervalTime);
    }
    return () => clearInterval(slideIntervalRef.current);
  }, [isPaused]);

  const handlePrev = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  const handleNext = () =>
    setCurrentSlide((prev) => (prev + 1) % slides.length);

  return (
    <div
      className="relative w-full overflow-hidden shadow-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[30vh] md:h-[40vh] w-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[currentSlide]}
            src={slides[currentSlide]}
            alt={`Slide ${currentSlide + 1}`}
            className="absolute inset-0 w-full h-full object-cover object-center"
            initial={{ opacity: 0.7, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent z-10" />

        {/* Navigation buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-5 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full transition-all shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-5 top-1/2 -translate-y-1/2 z-20 p-3 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full transition-all shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-full border-2 transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-red-500 border-white scale-110'
                  : 'bg-white/60 border-white/50 hover:bg-white/90'
              }`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 backdrop-blur-sm">
          <motion.div
            key={currentSlide}
            className="h-full bg-red-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: isPaused ? 0 : intervalTime / 1000, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  );
}
