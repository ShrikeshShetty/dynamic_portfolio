'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Github, Linkedin, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TOTAL_ANIMATION_FRAMES } from '@/lib/constants';
import type { HeroSection as HeroType } from '@/db/schema';

interface HeroSectionProps {
  heroData: HeroType | null;
}

export default function HeroSection({ heroData }: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [frameIndex, setFrameIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [contentVisible, setContentVisible] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    for (let i = 1; i <= TOTAL_ANIMATION_FRAMES; i++) {
      const img = new Image();
      img.src = `/hero_animation/ezgif-frame-${String(i).padStart(3, '0')}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_ANIMATION_FRAMES) {
          setImagesLoaded(true);
        }
      };
      images.push(img);
    }
    imagesRef.current = images;
  }, []);

  // Draw current frame on canvas - full screen cover
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];

    if (canvas && ctx && img && img.complete) {
      const scale = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width * scale;
      canvas.height = height * scale;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      // Reset transform before scaling to avoid cumulative scaling artifacts
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);

      // Cover entire screen (crop to fill)
      const imgAspect = img.width / img.height;
      const screenAspect = width / height;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > screenAspect) {
        drawHeight = height;
        drawWidth = height * imgAspect;
        drawX = (width - drawWidth) / 2;
        drawY = 0;
      } else {
        drawWidth = width;
        drawHeight = width / imgAspect;
        drawX = 0;
        drawY = (height - drawHeight) / 2;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }
  }, []);

  // Handle scroll-driven animation - works for both mobile and desktop
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollHeight = container.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, scrolled / scrollHeight));

      setScrollProgress(progress);

      // Animation phase: 0 to 0.8 of scroll
      const animationProgress = Math.min(1, progress / 0.8);
      
      if (animationProgress < 1) {
        const newFrameIndex = Math.floor(animationProgress * (TOTAL_ANIMATION_FRAMES - 1));
        setFrameIndex(newFrameIndex);
        setContentVisible(false);
      } else {
        setFrameIndex(0);
        setContentVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Draw frame when index changes
  useEffect(() => {
    if (imagesLoaded) {
      drawFrame(frameIndex);
    }
  }, [frameIndex, imagesLoaded, drawFrame]);

  // Initial draw
  useEffect(() => {
    if (imagesLoaded) {
      drawFrame(0);
    }
  }, [imagesLoaded, drawFrame]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(frameIndex);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [frameIndex, drawFrame]);

  const isComplete = scrollProgress >= 0.8;

  return (
    <section 
      id="home" 
      className="relative min-h-[300vh] md:min-h-[400vh] bg-black" 
      ref={containerRef}
    >
      {/* Sticky container for animation */}
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {/* Full Screen Canvas Animation */}
        <div 
          className="absolute inset-0 h-full md:inset-y-0 md:right-0 md:left-auto"
          style={{
            width: isComplete ? (typeof window !== 'undefined' && window.innerWidth >= 768 ? '70%' : '100%') : '100%',
            opacity: isComplete && typeof window !== 'undefined' && window.innerWidth < 768 ? 0.3 : 1,
            transition: 'width 0.5s ease, opacity 0.5s ease'
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: '100%', height: '100%', display: 'block' }}
          />
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>

        {/* Dark overlay for mobile when content visible */}
        {contentVisible && (
          <div className="absolute inset-0 bg-black/60 md:hidden z-0" />
        )}

        {/* Hero Content */}
        <AnimatePresence>
          {contentVisible && heroData && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute inset-0 flex items-center justify-center p-4 md:absolute md:inset-auto md:left-[12vw] md:top-[40%] md:-translate-y-1/2 md:text-left z-10"
            >
              <div className="text-center md:text-left max-w-lg w-full px-2">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-primary-400 font-medium mb-2 text-sm md:text-base"
                >
                  {heroData.introLine}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 md:mb-4"
                >
                  {heroData.role}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm md:text-base text-gray-300 mb-4 md:mb-6 max-w-sm mx-auto md:mx-0"
                >
                  {heroData.description}
                </motion.p>

                {/* Contact Icons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-2 md:gap-3 mb-4 md:mb-6 justify-center md:justify-start"
                >
                  <a
                    href={`mailto:${heroData.email}`}
                    className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Mail className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </a>
                  <a
                    href={heroData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Github className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </a>
                  <a
                    href={heroData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 md:p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Linkedin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </a>
                </motion.div>

                {/* Resume Button */}
                {heroData.resumeUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex justify-center md:justify-start"
                  >
                    <Button asChild className="bg-primary-600 hover:bg-primary-700 text-sm md:text-base">
                      <a href={heroData.resumeUrl} target="_blank" rel="noopener noreferrer">
                        <Download className="w-4 h-4 mr-2" />
                        Download Resume
                      </a>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator */}
        {scrollProgress < 0.1 && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="flex flex-col items-center text-white/80">
              <span className="text-sm mb-2">Scroll to explore</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Continue scroll indicator */}
        {contentVisible && scrollProgress > 0.85 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center text-white/60">
              <span className="text-sm mb-2">Continue scrolling</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200/30">
          <div
            className="h-full bg-primary-600 transition-all duration-100"
            style={{ width: `${Math.min(100, scrollProgress * 125)}%` }}
          />
        </div>
      </div>
    </section>
  );
}
