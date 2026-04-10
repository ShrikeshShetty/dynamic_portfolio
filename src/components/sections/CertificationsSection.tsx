'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, ExternalLink, FileText, Sparkles, Shield, Trophy, Star, Download } from 'lucide-react';
import type { Certification } from '@/db/schema';

interface CertificationsSectionProps {
  certifications: Certification[];
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <section id="certifications" className="py-24 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Trophy className="w-32 h-32 text-amber-500" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-10">
        <Star className="w-24 h-24 text-orange-500" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-sm font-medium mb-4"
            >
              <Award className="w-4 h-4" />
              <span>Professional Credentials</span>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
            >
              Certifications
            </motion.h2>

            <motion.p
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
            >
              Professional certifications and achievements that validate my expertise and commitment to continuous learning
            </motion.p>

            <motion.div
              className="w-24 h-1 mx-auto mt-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            />
          </div>

          {/* Certifications Grid */}
          {certifications.length > 0 ? (
            <motion.div
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  variants={cardVariants}
                  className="group"
                >
                  <a
                    href={cert.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block h-full"
                  >
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-full border border-gray-100 dark:border-gray-700 group-hover:border-amber-300 dark:group-hover:border-amber-700">
                      {/* Gradient Border Top */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Card Content */}
                      <div className="p-6">
                        {/* Icon */}
                        <div className="mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Award className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                          {cert.title}
                        </h3>

                        {/* Issued By */}
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                          <Shield className="w-4 h-4" />
                          <span className="text-sm">{cert.issuedBy}</span>
                        </div>

                        {/* View Certificate Button */}
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium text-sm group-hover:gap-3 transition-all">
                          <FileText className="w-4 h-4" />
                          <span>View Certificate</span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Decorative Badge */}
                      <div className="absolute top-4 right-4">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                    </div>
                  </a>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Award className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400">No certifications added yet.</p>
            </motion.div>
          )}

          {/* Stats or Additional Info */}
          {certifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                <Trophy className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {certifications.length} Certification{certifications.length !== 1 ? 's' : ''} Achieved
                </span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
