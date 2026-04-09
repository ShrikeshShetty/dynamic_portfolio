'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Resume } from '@/db/schema';

interface ResumeSectionProps {
  resume: Resume | null;
}

export default function ResumeSection({ resume }: ResumeSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!resume) return null;

  return (
    <section id="resume" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Resume
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-8"></div>

          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-lg"
            >
              <FileText className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {resume.fileName || 'My Resume'}
              </p>
              <Button asChild size="lg">
                <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </a>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
