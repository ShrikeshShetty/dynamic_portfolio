'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';
import type { Education } from '@/db/schema';

interface EducationSectionProps {
  education: Education[];
}

const LEVEL_COLORS = {
  HSC: { bg: 'bg-yellow-100 dark:bg-yellow-500/10', text: 'text-yellow-700 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-500/20' },
  UG: { bg: 'bg-blue-100 dark:bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/20' },
  PG: { bg: 'bg-purple-100 dark:bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-500/20' },
} as const;

export default function EducationSection({ education }: EducationSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (education.length === 0) return null;

  return (
    <section id="education" className="py-20 bg-gradient-to-br from-white via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-indigo-900/10 dark:to-gray-900 relative overflow-hidden">
      {/* Subtle Background Gradient Animation */}
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.2) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 40%)',
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Floating Accent Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"
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
            Education
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-indigo-600 mx-auto mb-12"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          />

          <div className="max-w-4xl mx-auto">
            {education.map((edu, index) => {
              const colors = LEVEL_COLORS[edu.level as keyof typeof LEVEL_COLORS] || LEVEL_COLORS.UG;
              
              return (
                <motion.div
                  key={edu.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="relative mb-8 last:mb-0"
                >
                  {/* Timeline Line */}
                  {index !== education.length - 1 && (
                    <div className="absolute left-8 top-20 w-0.5 h-full bg-indigo-200 dark:bg-indigo-500/20" />
                  )}

                  <div className="flex gap-6">
                    {/* Icon */}
                    <motion.div
                      className={`w-16 h-16 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center flex-shrink-0`}
                      whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.3 }}
                    >
                      <GraduationCap className={`w-8 h-8 ${colors.text}`} />
                    </motion.div>

                    {/* Content Card */}
                    <motion.div
                      className={`flex-1 p-6 rounded-xl bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl border ${colors.border} transition-all duration-300`}
                      whileHover={{ scale: 1.02, y: -5 }}
                    >
                      {/* Level Badge */}
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${colors.bg} ${colors.text}`}>
                          {edu.level}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {edu.academicYear}
                        </span>
                      </div>

                      {/* Stream */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {edu.stream}
                      </h3>

                      {/* College Name */}
                      <p className="text-gray-600 dark:text-gray-400 mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-indigo-500" />
                        {edu.collegeName}
                      </p>

                      {/* CGPA/Percentage */}
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-green-500" />
                        <span className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {edu.cgpaOrPercentage}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
