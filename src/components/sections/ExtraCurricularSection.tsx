'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ExtraCurricular } from '@/db/schema';

interface ExtraCurricularSectionProps {
  activities: ExtraCurricular[];
}

export default function ExtraCurricularSection({ activities }: ExtraCurricularSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  if (activities.length === 0) return null;

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = scrollPosition < activities.length - 1;

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const cardWidth = container.querySelector('.activity-card')?.clientWidth || 400;
    const gap = 24;
    const scrollAmount = cardWidth + gap;
    
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - 1)
      : Math.min(activities.length - 1, scrollPosition + 1);
    
    container.scrollTo({
      left: newPosition * scrollAmount,
      behavior: 'smooth',
    });
    setScrollPosition(newPosition);
  };

  // Determine layout based on number of activities
  const getLayoutClass = () => {
    if (activities.length === 1) return 'flex justify-center';
    if (activities.length === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto';
    if (activities.length === 3) return 'grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto';
    return 'flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth';
  };

  const showArrows = activities.length > 3;

  return (
    <section id="extra-curricular" className="py-20 bg-gradient-to-br from-white via-amber-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/10 dark:to-gray-900 relative overflow-hidden">
      {/* Subtle Background Gradient Animation */}
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(245, 158, 11, 0.2) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(249, 115, 22, 0.15) 0%, transparent 40%)',
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Floating Accent Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-orange-200/30 dark:bg-orange-500/10 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Extra Curricular Activities
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-amber-600 mx-auto mb-12"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          />

          {/* Activities Container with Navigation */}
          <div className="relative">
            {/* Left Arrow */}
            {showArrows && canScrollLeft && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleScroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </motion.button>
            )}

            {/* Right Arrow */}
            {showArrows && canScrollRight && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => handleScroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/90 dark:bg-gray-800/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </motion.button>
            )}

            {/* Activities Grid/Scroll Container */}
            <div
              ref={scrollContainerRef}
              className={`${getLayoutClass()} ${showArrows ? 'px-14' : ''}`}
              onScroll={(e) => {
                const target = e.target as HTMLDivElement;
                const cardWidth = target.querySelector('.activity-card')?.clientWidth || 400;
                const gap = 24;
                const scrollAmount = cardWidth + gap;
                const newPosition = Math.round(target.scrollLeft / scrollAmount);
                setScrollPosition(newPosition);
              }}
            >
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`activity-card bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl border border-amber-100 dark:border-gray-700/50 overflow-hidden transition-all duration-300 group ${
                    activities.length === 1 ? 'max-w-md' : 
                    activities.length === 2 ? '' : 
                    activities.length === 3 ? '' : 
                    'min-w-[350px] md:min-w-[400px] flex-shrink-0'
                  }`}
                >
                  {/* Logo */}
                  <div className="relative h-40 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-700 flex items-center justify-center overflow-hidden">
                    <motion.img
                      src={activity.logo}
                      alt={activity.title}
                      className="w-24 h-24 object-contain"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100';
                      }}
                    />
                    <motion.div
                      className="absolute top-3 right-3 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center"
                      whileHover={{ scale: 1.2 }}
                    >
                      <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {activity.title}
                    </h3>
                    <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm mb-3">
                      {activity.header}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {activity.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scroll Indicators (for scrollable layout) */}
            {showArrows && (
              <div className="flex justify-center gap-2 mt-6">
                {activities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (!scrollContainerRef.current) return;
                      const cardWidth = scrollContainerRef.current.querySelector('.activity-card')?.clientWidth || 400;
                      const gap = 24;
                      const scrollAmount = cardWidth + gap;
                      scrollContainerRef.current.scrollTo({
                        left: index * scrollAmount,
                        behavior: 'smooth',
                      });
                      setScrollPosition(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      scrollPosition === index 
                        ? 'bg-amber-600 w-6' 
                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-amber-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
