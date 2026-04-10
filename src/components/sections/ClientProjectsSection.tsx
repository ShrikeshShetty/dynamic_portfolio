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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

  const floatingIconVariants = {
    initial: { y: 0, rotate: 0 },
    animate: {
      y: [-5, 5, -5],
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
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

  // Tech icons for floating animation
  const techIcons = [Code2, Zap, Braces, Database, Globe, Layers, Cpu, Terminal, GitBranch];

  return (
    <section id="client-projects" className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* ========== ULTRA CREATIVE BACKGROUND ========== */}
      
      {/* 1. Animated Mesh Gradient */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
          `,
        }}
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 2. Floating Geometric Shapes */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`shape-${i}`}
          className="absolute"
          style={{
            width: 40 + Math.random() * 60,
            height: 40 + Math.random() * 60,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{
            rotate: 0,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            rotate: [0, 360],
            scale: [0.5, 1, 0.5],
            opacity: [0.1, 0.3, 0.1],
            x: [0, 100, -100, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            delay: i * 2,
            ease: 'linear',
          }}
        >
          <div
            className="w-full h-full border-2 border-primary-500/20 dark:border-primary-400/20"
            style={{
              borderRadius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '0%' : '30%',
              transform: `rotate(${i * 45}deg)`,
            }}
          />
        </motion.div>
      ))}

      {/* 3. Morphing Blobs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`blob-${i}`}
          className="absolute blur-3xl"
          style={{
            width: 300 + i * 100,
            height: 300 + i * 100,
            left: `${20 + i * 30}%`,
            top: `${20 + i * 20}%`,
            background: `radial-gradient(circle, ${
              i === 0 ? 'rgba(99, 102, 241, 0.2)' : i === 1 ? 'rgba(139, 92, 246, 0.2)' : 'rgba(217, 70, 239, 0.2)'
            } 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, -50, 0],
            y: [0, -30, 30, 0],
            borderRadius: ['40% 60% 70% 30% / 40% 50% 60% 50%', '60% 40% 30% 70% / 50% 60% 40% 50%', '40% 60% 70% 30% / 40% 50% 60% 50%'],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 4. Animated Grid Lines */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`h-line-${i}`}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent"
            style={{ top: `${(i + 1) * 20}%` }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'easeInOut',
            }}
          />
        ))}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`v-line-${i}`}
            className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary-500 to-transparent"
            style={{ left: `${(i + 1) * 20}%` }}
            animate={{
              scaleY: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5 + 1.5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 5. Floating Tech Icons */}
      {techIcons.map((Icon, i) => (
        <motion.div
          key={`tech-icon-${i}`}
          className="absolute text-primary-500/10 dark:text-primary-400/10"
          style={{
            left: `${10 + (i * 10)}%`,
            top: `${Math.random() * 80 + 10}%`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.5, 1.5, 0.5],
            rotate: [0, 180, 360],
            y: [0, -200, 0],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'easeInOut',
          }}
        >
          <Icon className="w-8 h-8 md:w-12 md:h-12" />
        </motion.div>
      ))}

      {/* 6. Particle Constellation */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="absolute w-1 h-1 rounded-full bg-primary-500/40 dark:bg-primary-400/40"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 7. Wave Pattern */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-40 opacity-10"
        style={{
          background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%236366f1' d='M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom',
        }}
        animate={{
          x: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 8. Floating Code Brackets */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`bracket-${i}`}
          className="absolute text-4xl md:text-6xl font-mono text-primary-500/5 dark:text-primary-400/5 font-bold"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            rotate: [-10, 10, -10],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i,
            ease: 'easeInOut',
          }}
        >
          {i % 2 === 0 ? '</>' : '{ }'}
        </motion.div>
      ))}

      {/* 9. Orbiting Circles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orbit-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30 + i * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="border border-primary-500/10 dark:border-primary-400/10 rounded-full"
            style={{
              width: 200 + i * 150,
              height: 200 + i * 150,
              marginLeft: -(100 + i * 75),
              marginTop: -(100 + i * 75),
            }}
          >
            <motion.div
              className="absolute w-3 h-3 bg-primary-500/30 dark:bg-primary-400/30 rounded-full"
              style={{ top: 0, left: '50%', transform: 'translateX(-50%)' }}
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </div>
        </motion.div>
      ))}

      {/* 10. Glowing Orbs */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full"
          style={{
            width: 100 + i * 50,
            height: 100 + i * 50,
            left: `${25 * (i % 4)}%`,
            top: `${25 * (i % 4)}%`,
            background: `radial-gradient(circle, ${
              ['rgba(99, 102, 241, 0.15)', 'rgba(139, 92, 246, 0.15)', 'rgba(217, 70, 239, 0.15)', 'rgba(236, 72, 153, 0.15)'][i]
            } 0%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 11. Animated Dots Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        >
          <motion.div
            className="absolute inset-0"
            animate={{
              backgroundPosition: ['0px 0px', '30px 30px', '0px 0px'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      </div>

      {/* 12. Spiral Helix */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`helix-${i}`}
            className="absolute w-2 h-2 rounded-full bg-primary-500"
            style={{
              left: Math.cos((i * Math.PI) / 3) * 150,
              top: Math.sin((i * Math.PI) / 3) * 150,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      {/* 13. Floating Triangles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`triangle-${i}`}
          className="absolute"
          style={{
            left: `${20 + i * 20}%`,
            top: `${30 + i * 15}%`,
            width: 0,
            height: 0,
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderBottom: '35px solid rgba(99, 102, 241, 0.1)',
          }}
          animate={{
            rotate: [0, 360],
            y: [-30, 30, -30],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            delay: i * 2,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 14. Ripple Effect */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ripple-${i}`}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-primary-500/10 dark:border-primary-400/10 rounded-full"
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: [0, 400, 800],
            height: [0, 400, 800],
            opacity: [0.5, 0.2, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.5,
            ease: 'easeOut',
          }}
        />
      ))}

      {/* 15. Aurora Borealis Effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'linear-gradient(45deg, transparent 30%, rgba(99, 102, 241, 0.1) 50%, transparent 70%)',
          backgroundSize: '200% 200%',
        }}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

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
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
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
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="relative group"
              >
                {/* Animated Gradient Border */}
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

                {/* Card Container */}
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  {/* Cover Image with Parallax Effect */}
                  <motion.div
                    className="aspect-video overflow-hidden cursor-pointer relative"
                    onClick={() => {
                      if (project.liveUrl) {
                        window.open(project.liveUrl, '_blank');
                      } else {
                        setSelectedProject(project);
                      }
                    }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <motion.img
                      src={project.coverImageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      animate={{
                        scale: hoveredIndex === index ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />

                    {/* Shine Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                      variants={shineVariants}
                      initial="initial"
                      animate={hoveredIndex === index ? 'hover' : 'initial'}
                    />

                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: hoveredIndex === index ? 0.7 : 0.3 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Floating Tech Icons */}
                    <motion.div
                      className="absolute top-4 left-4"
                      variants={floatingIconVariants}
                      initial="initial"
                      animate="animate"
                    >
                      <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                        <Code2 className="w-4 h-4 text-white" />
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute top-4 right-4"
                      variants={floatingIconVariants}
                      initial="initial"
                      animate="animate"
                      transition={{ delay: 1 }}
                    >
                      <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                        <Zap className="w-4 h-4 text-yellow-400" />
                      </div>
                    </motion.div>

                    {/* Visit Site Overlay */}
                    {project.liveUrl && (
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

                    {/* Animated Corner Accent */}
                    <motion.div
                      className="absolute bottom-0 left-0 w-16 h-16"
                      style={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, transparent 50%)',
                      }}
                      animate={{
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                    />
                  </motion.div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Title with Animated Underline */}
                    <motion.h3
                      className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative inline-block"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {project.title}
                      <motion.span
                        className="absolute bottom-0 left-0 h-0.5 bg-primary-600"
                        initial={{ width: 0 }}
                        animate={{ width: hoveredIndex === index ? '100%' : 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.h3>

                    {/* Client Name with Icon Animation */}
                    <motion.div
                      className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-3"
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <motion.div
                        animate={{
                          scale: hoveredIndex === index ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <User className="w-4 h-4 text-primary-500" />
                      </motion.div>
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

                    {/* Buttons with Animations */}
                    <motion.div
                      className="flex gap-3"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedProject(project)}
                          className="relative overflow-hidden group/btn"
                        >
                          <motion.span
                            className="absolute inset-0 bg-primary-100 dark:bg-primary-900/30"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10">View Details</span>
                        </Button>
                      </motion.div>

                      {project.liveUrl && (
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            size="sm"
                            onClick={() => window.open(project.liveUrl!, '_blank')}
                            className="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 relative overflow-hidden"
                          >
                            <motion.span
                              className="absolute inset-0 bg-white/20"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '100%' }}
                              transition={{ duration: 0.5 }}
                            />
                            <ExternalLink className="w-4 h-4 mr-1 relative z-10" />
                            <span className="relative z-10">Visit</span>
                          </Button>
                        </motion.div>
                      )}
                    </motion.div>

                    {/* Animated Bottom Accent */}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-600 via-primary-400 to-primary-600"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{
                        scaleX: hoveredIndex === index ? 1 : 0,
                        opacity: hoveredIndex === index ? 1 : 0,
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>

                  {/* Floating Particles on Hover */}
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <>
                        {[...Array(5)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-primary-400/50"
                            initial={{
                              x: Math.random() * 300,
                              y: Math.random() * 200,
                              scale: 0,
                              opacity: 0,
                            }}
                            animate={{
                              y: [null, Math.random() * -100 - 50],
                              scale: [0, 1, 0],
                              opacity: [0, 1, 0],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 1.5,
                              delay: i * 0.1,
                              ease: 'easeOut',
                            }}
                          />
                        ))}
                      </>
                    )}
                  </AnimatePresence>
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
