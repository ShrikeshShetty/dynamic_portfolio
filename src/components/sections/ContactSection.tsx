'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Mail, Github, Linkedin, ExternalLink } from 'lucide-react';
import type { ContactLink } from '@/db/schema';

interface ContactSectionProps {
  contactLinks: ContactLink[];
}

const iconMap: Record<string, typeof Mail> = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
};

export default function ContactSection({ contactLinks }: ContactSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-white via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 relative overflow-hidden">
      {/* Subtle Background Gradient Animation */}
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(168, 85, 247, 0.2) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 40%)',
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Floating Accent Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
          >
            Get In Touch
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-purple-600 mx-auto mb-8"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          />

          <motion.p
            className="text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Feel free to reach out for collaborations, opportunities, or just to say hello!
          </motion.p>

          <div className="flex flex-wrap justify-center gap-6">
            {contactLinks.map((link, index) => {
              const Icon = iconMap[link.type] || Mail;
              const isEmail = link.type === 'email';

              return (
                <motion.a
                  key={link.id}
                  href={isEmail ? `mailto:${link.url}` : link.url}
                  target={isEmail ? undefined : '_blank'}
                  rel={isEmail ? undefined : 'noopener noreferrer'}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 px-6 py-4 bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-xl hover:shadow-2xl border border-purple-100 dark:border-gray-700/50 transition-all duration-300"
                >
                  <motion.div
                    className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-5 h-5 text-purple-400" />
                  </motion.div>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {link.displayText || link.url}
                  </span>
                  {!isEmail && <ExternalLink className="w-4 h-4 text-gray-500" />}
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
