'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { SKILL_CATEGORIES } from '@/lib/constants';
import type { Skill } from '@/db/schema';

interface SkillsSectionProps {
  skills: Skill[];
}

export default function SkillsSection({ skills }: SkillsSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const frontendSkills = skills.filter(s => s.category === 'frontend');
  const backendSkills = skills.filter(s => s.category === 'backend');
  const toolsSkills = skills.filter(s => s.category === 'tools');

  const categories = [
    { key: 'frontend', title: SKILL_CATEGORIES.frontend, skills: frontendSkills, color: 'bg-blue-500' },
    { key: 'backend', title: SKILL_CATEGORIES.backend, skills: backendSkills, color: 'bg-green-500' },
    { key: 'tools', title: SKILL_CATEGORIES.tools, skills: toolsSkills, color: 'bg-purple-500' },
  ];

  return (
    <section id="skills" className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Skills
          </h2>
          <div className="w-20 h-1 bg-primary-600 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category, catIndex) => (
              <motion.div
                key={category.key}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
                className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${category.color}`}></span>
                  {category.title}
                </h3>

                <div className="space-y-4">
                  {category.skills.map((skill, index) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.3, delay: catIndex * 0.1 + index * 0.05 }}
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700 dark:text-gray-300">{skill.name}</span>
                        <span className="text-gray-500 dark:text-gray-400">{skill.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <motion.div
                          className={`h-2 rounded-full ${category.color}`}
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.percentage}%` } : {}}
                          transition={{ duration: 1, delay: catIndex * 0.1 + index * 0.05 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
