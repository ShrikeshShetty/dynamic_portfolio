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
  const [animationComplete, setAnimationComplete] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrollProgressRef = useRef(0);

  // Preload all frames
  useEffect(() => {
    const loadImages = async () => {
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
    };

    loadImages();
  }, []);

  // Draw current frame on canvas
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const img = imagesRef.current[index];

    if (canvas && ctx && img && img.complete) {
      const scale = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      canvas.width = width * scale;
      canvas.height = height * scale;
      ctx.scale(scale, scale);

      // Calculate aspect ratio fit
      const imgAspect = img.width / img.height;
      const canvasAspect = width / height;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > canvasAspect) {
        drawWidth = width;
        drawHeight = width / imgAspect;
        drawX = 0;
        drawY = (height - drawHeight) / 2;
      } else {
        drawHeight = height;
        drawWidth = height * imgAspect;
        drawX = (width - drawWidth) / 2;
        drawY = 0;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }
  }, []);

  // Handle scroll-driven animation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || animationComplete) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const scrollHeight = container.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, Math.max(0, scrolled / scrollHeight));

      scrollProgressRef.current = progress;

      const newFrameIndex = Math.floor(progress * (TOTAL_ANIMATION_FRAMES - 1));
      setFrameIndex(newFrameIndex);

      if (progress >= 1 && !animationComplete) {
        setAnimationComplete(true);
        // Reset to frame 0 after completion
        setTimeout(() => {
          setFrameIndex(0);
          setShowContent(true);
        }, 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animationComplete]);

  // Draw frame when index changes
  useEffect(() => {
    if (imagesLoaded) {
      drawFrame(frameIndex);
    }
  }, [frameIndex, imagesLoaded, drawFrame]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      drawFrame(frameIndex);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [frameIndex, drawFrame]);

  return (
    <section id="home" className="relative min-h-[300vh]" ref={containerRef}>
      {/* Sticky container for animation */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Canvas Animation */}
        <motion.div
          className="absolute"
          initial={{ x: 0, scale: 1 }}
          animate={
            animationComplete
              ? { x: '25vw', scale: 0.8 }
              : { x: 0, scale: 1 }
          }
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <canvas
            ref={canvasRef}
            className="w-[60vw] h-[60vh] md:w-[50vw] md:h-[70vh] lg:w-[40vw] lg:h-[80vh]"
            style={{ maxWidth: '600px' }}
          />
          {!imagesLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}
        </motion.div>

        {/* Hero Content - Appears after animation */}
        <AnimatePresence>
          {showContent && heroData && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute left-[5vw] md:left-[10vw] text-left z-10"
            >
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-primary-600 dark:text-primary-400 font-medium mb-2"
              >
                {heroData.introLine}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {heroData.role}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-lg"
              >
                {heroData.description}
              </motion.p>

              {/* Contact Icons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-4 mb-6"
              >
                <a
                  href={`mailto:${heroData.email}`}
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Mail className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </a>
                <a
                  href={heroData.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </a>
                <a
                  href={heroData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
                >
                  <Linkedin className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </a>
              </motion.div>

              {/* Resume Button */}
              {heroData.resumeUrl && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Button asChild>
                    <a href={heroData.resumeUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </a>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll indicator - Only show before animation */}
        {!animationComplete && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <span className="text-sm mb-2">Scroll to explore</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        )}

        {/* Progress bar */}
        {!animationComplete && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800">
            <motion.div
              className="h-full bg-primary-600"
              style={{ width: `${(frameIndex / (TOTAL_ANIMATION_FRAMES - 1)) * 100}%` }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
