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
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Get In Touch
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8"></div>

          <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            Feel free to reach out for collaborations, opportunities, or just to say hello!
          </p>

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
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3 px-6 py-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <Icon className="w-6 h-6 text-primary-600" />
                  <span className="text-gray-900 dark:text-white font-medium">
                    {link.displayText || link.url}
                  </span>
                  {!isEmail && <ExternalLink className="w-4 h-4 text-gray-400" />}
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
