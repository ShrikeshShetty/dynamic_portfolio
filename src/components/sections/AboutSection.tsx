'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';
import { Calendar, Phone, MapPin, GraduationCap, Mail, FolderKanban, Cpu, Code2 } from 'lucide-react';
import type { AboutSection as AboutType } from '@/db/schema';

interface AboutSectionProps {
  aboutData: AboutType | null;
}

export default function AboutSection({ aboutData }: AboutSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!aboutData) return null;

  const stats = [
    { icon: FolderKanban, label: 'Projects', value: aboutData.projectCount },
    { icon: Cpu, label: 'Technologies', value: aboutData.technologyCount },
    { icon: Code2, label: 'Years Coding', value: aboutData.codingYears },
  ];

  const infoItems = [
    { icon: Calendar, label: 'Birthday', value: aboutData.birthday },
    { icon: Phone, label: 'Phone', value: aboutData.phone },
    { icon: MapPin, label: 'Location', value: aboutData.location },
    { icon: GraduationCap, label: 'Degree', value: aboutData.degree },
    { icon: Mail, label: 'Email', value: aboutData.email },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-gray-900 relative overflow-hidden">
      {/* Subtle Background Gradient Animation */}
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.2) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(99, 102, 241, 0.15) 0%, transparent 40%)',
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Floating Accent Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-blue-200/30 dark:bg-blue-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl"
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
            About Me
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-blue-600 mx-auto mb-12"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          />

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.95 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              {aboutData.imageUrl && (
                <div className="relative rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700/50">
                  <img
                    src={aboutData.imageUrl}
                    alt="About"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent"></div>
                </div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.p
                className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
              >
                {aboutData.description}
              </motion.p>

              {/* Info Items */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {infoItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="flex items-start gap-3 p-3 rounded-lg bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg border border-blue-100 dark:border-gray-700/50 transition-all duration-300"
                  >
                    <motion.div
                      className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className="w-4 h-4 text-blue-400" />
                    </motion.div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-1 min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{item.label}:</p>
                      <p className="text-gray-900 dark:text-white font-medium break-all sm:break-normal">
                        {item.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center p-4 rounded-lg bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm shadow-md hover:shadow-lg border border-blue-100 dark:border-gray-700/50 transition-all duration-300"
                  >
                    <motion.div
                      className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-2"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <stat.icon className="w-5 h-5 text-blue-400" />
                    </motion.div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {inView && (
                        <CountUp start={0} end={stat.value || 0} duration={4} separator="," useEasing decimals={0} />
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
