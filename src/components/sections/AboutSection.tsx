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
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            About Me
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {aboutData.imageUrl && (
                <div className="relative rounded-lg overflow-hidden shadow-2xl">
                  <img
                    src={aboutData.imageUrl}
                    alt="About"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent"></div>
                </div>
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                {aboutData.description}
              </p>

              {/* Info Items */}
              <div className="grid grid-cols-1 gap-4 mb-8">
                {infoItems.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <item.icon className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <div className="flex items-center gap-2 flex-1">
                      <p className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">{item.label}:</p>
                      <p className="text-gray-900 dark:text-white font-medium whitespace-nowrap">{item.value}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={inView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    className="text-center p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
                  >
                    <stat.icon className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {inView && (
                        <CountUp start={0} end={stat.value || 0} duration={2.5} separator="," />
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
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
