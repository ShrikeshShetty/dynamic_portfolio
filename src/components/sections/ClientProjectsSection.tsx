'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { User, X, ExternalLink, Sparkles, ArrowRight, Code2, Zap, Braces, Database, Globe, Layers, Cpu, Terminal, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ClientProject } from '@/db/schema';

interface ClientProjectsSectionProps {
  clientProjects: ClientProject[];
}

export default function ClientProjectsSection({ clientProjects }: ClientProjectsSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [selectedProject, setSelectedProject] = useState<ClientProject | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9, rotateX: -15 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const shineVariants = {
    initial: { x: '-100%', opacity: 0 },
    hover: {
      x: '200%',
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  };

  const gradientBorderVariants = {
    initial: { backgroundPosition: '0% 50%' },
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <section id="client-projects" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* ========== SIMPLIFIED BACKGROUND FOR MOBILE ========== */}
      
      {/* Static gradient background for mobile */}
      {isMobile ? (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-purple-500/10 to-pink-500/10" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
        </div>
      ) : (
        <>
          {/* Desktop: Morphing Blobs - reduced count */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`blob-${i}`}
              className="absolute blur-3xl"
              style={{
                width: 300 + i * 100,
                height: 300 + i * 100,
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
                background: `radial-gradient(circle, ${
                  i === 0 ? 'rgba(99, 102, 241, 0.2)' : 'rgba(139, 92, 246, 0.2)'
                } 0%, transparent 70%)`,
              }}
              animate={{
                scale: [1, 1.3, 1],
                x: [0, 50, -50, 0],
                y: [0, -30, 30, 0],
              }}
              transition={{
                duration: 15 + i * 5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}

          {/* Desktop: Glowing Orbs - reduced count */}
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full"
              style={{
                width: 100 + i * 50,
                height: 100 + i * 50,
                left: `${25 * (i % 4)}%`,
                top: `${25 * (i % 4)}%`,
                background: `radial-gradient(circle, ${
                  ['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.15)'][i]
                } 0%, transparent 70%)`,
                filter: 'blur(40px)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i,
                ease: 'easeInOut',
              }}
            />
          ))}
        </>
      )}

      {/* Static dots pattern - no animation */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      {/* ========== END BACKGROUND ANIMATIONS ========== */}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Header with animated underline */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4"
            >
              <Sparkles className="w-4 h-4" />
              <span>Featured Work</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              Client Projects
            </motion.h2>

            <motion.div
              className="relative w-24 h-1 mx-auto overflow-hidden rounded-full"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600" />
            </motion.div>
          </div>

          {/* Cards Grid */}
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            {clientProjects.map((project, index) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                onMouseEnter={() => !isMobile && setHoveredIndex(index)}
                onMouseLeave={() => !isMobile && setHoveredIndex(null)}
                className="relative group"
              >
                {/* Animated Gradient Border - Desktop only */}
                {!isMobile && (
                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef, #6366f1)',
                      backgroundSize: '200% 200%',
                    }}
                    variants={gradientBorderVariants}
                    initial="initial"
                    animate={hoveredIndex === index ? 'animate' : 'initial'}
                  />
                )}

                {/* Card Container */}
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  {/* Cover Image */}
                  <motion.div
                    className="aspect-video overflow-hidden cursor-pointer relative"
                    onClick={() => {
                      if (project.liveUrl) {
                        window.open(project.liveUrl, '_blank');
                      } else {
                        setSelectedProject(project);
                      }
                    }}
                    whileHover={!isMobile ? { scale: 1.02 } : {}}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      animate={!isMobile ? {
                        scale: hoveredIndex === index ? 1.1 : 1,
                      } : {}}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />

                    {/* Shine Effect - Desktop only */}
                    {!isMobile && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                        variants={shineVariants}
                        initial="initial"
                        animate={hoveredIndex === index ? 'hover' : 'initial'}
                      />
                    )}

                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                      initial={{ opacity: 0.3 }}
                      animate={!isMobile ? { opacity: hoveredIndex === index ? 0.7 : 0.3 } : {}}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Tech Icons - Static on mobile */}
                    <div className="absolute top-4 left-4">
                      <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                        <Code2 className="w-4 h-4 text-white" />
                      </div>
                    </div>

                    <div className="absolute top-4 right-4">
                      <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                        <Zap className="w-4 h-4 text-yellow-400" />
                      </div>
                    </div>

                    {/* Visit Site Overlay - Desktop only */}
                    {!isMobile && project.liveUrl && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div
                          className="bg-white/95 dark:bg-gray-900/95 px-6 py-3 rounded-full flex items-center gap-2 shadow-lg"
                          initial={{ y: 20, scale: 0.9 }}
                          animate={{
                            y: hoveredIndex === index ? 0 : 20,
                            scale: hoveredIndex === index ? 1 : 0.9,
                          }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <ExternalLink className="w-5 h-5 text-primary-600" />
                          <span className="font-semibold text-gray-900 dark:text-white">Visit Site</span>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <motion.h3
                      className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative inline-block"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {project.title}
                      {!isMobile && (
                        <motion.span
                          className="absolute bottom-0 left-0 h-0.5 bg-primary-600"
                          initial={{ width: 0 }}
                          animate={{ width: hoveredIndex === index ? '100%' : 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.h3>

                    {/* Client Name */}
                    <motion.div
                      className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <User className="w-4 h-4 text-primary-500" />
                      <span className="text-sm font-medium">{project.clientName}</span>
                    </motion.div>

                    {/* Description */}
                    <motion.p
                      className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 flex-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {truncateText(project.description, 100)}
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                      className="flex gap-3"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <motion.div
                        whileHover={!isMobile ? { scale: 1.05 } : {}}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProject(project)}
                        >
                          View Details
                        </Button>
                      </motion.div>

                      {project.liveUrl && (
                        <motion.div
                          whileHover={!isMobile ? { scale: 1.05 } : {}}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="sm"
                            onClick={() => window.open(project.liveUrl!, '_blank')}
                            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Visit
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Bottom Accent - Desktop only */}
                    {!isMobile && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600"
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{
                          scaleX: hoveredIndex === index ? 1 : 0,
                          opacity: hoveredIndex === index ? 1 : 0,
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Premium Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={() => setSelectedProject(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal */}
            <motion.div
              className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef, #6366f1)',
                  backgroundSize: '200% 200%',
                  padding: '2px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />

              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-3 rounded-full bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </motion.button>

              {/* Cover Image */}
              <motion.div
                className="aspect-video overflow-hidden relative"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={selectedProject.coverImageUrl}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </motion.div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[50vh]">
                <motion.h3
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-3"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {selectedProject.title}
                </motion.h3>

                <motion.div
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-6"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <User className="w-5 h-5 text-primary-500" />
                  </motion.div>
                  <span className="font-medium">{selectedProject.clientName}</span>
                </motion.div>

                <motion.p
                  className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {selectedProject.description}
                </motion.p>

                {selectedProject.liveUrl && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Button
                      size="lg"
                      onClick={() => window.open(selectedProject.liveUrl!, '_blank')}
                      className="bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 hover:from-primary-700 hover:via-primary-600 hover:to-primary-700 relative overflow-hidden group"
                      style={{ backgroundSize: '200% 200%' }}
                    >
                      <motion.span
                        className="absolute inset-0 bg-white/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      <ExternalLink className="w-5 h-5 mr-2 relative z-10" />
                      <span className="relative z-10 font-semibold">Visit Live Website</span>
                      <motion.div
                        className="absolute right-4"
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4 relative z-10" />
                      </motion.div>
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
