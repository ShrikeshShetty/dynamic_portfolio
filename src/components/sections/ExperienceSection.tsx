'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Building2, Users, User, ExternalLink, FileText, Award, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ClientProject, Internship } from '@/db/schema';

interface ExperienceSectionProps {
  clientProjects: ClientProject[];
  internships: Internship[];
}

export default function ExperienceSection({ clientProjects, internships }: ExperienceSectionProps) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeTab, setActiveTab] = useState<'client' | 'internship'>('client');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <section id="experience" className="py-24 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium mb-4"
            >
              <Briefcase className="w-4 h-4" />
              <span>Professional Journey</span>
            </motion.div>

            <motion.h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Experience
            </motion.h2>

            <motion.div className="w-24 h-1 mx-auto bg-gradient-to-r from-primary-600 to-purple-600 rounded-full" />
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 dark:bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setActiveTab('client')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'client'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Client Projects
                </span>
              </button>
              <button
                onClick={() => setActiveTab('internship')}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  activeTab === 'internship'
                    ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Internships
                </span>
              </button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'client' ? (
              <motion.div
                key="client"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {clientProjects.length > 0 ? (
                  <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {clientProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        variants={cardVariants}
                        className="group relative"
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700">
                          {/* Image */}
                          <div className="aspect-video overflow-hidden relative">
                            <img
                              src={project.coverImageUrl}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-900/90 rounded-full shadow-lg hover:scale-110 transition-transform"
                              >
                                <ExternalLink className="w-4 h-4 text-primary-600" />
                              </a>
                            )}
                          </div>

                          {/* Content */}
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {project.title}
                            </h3>
                            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mb-3">
                              <Building2 className="w-4 h-4" />
                              <span>{project.clientName}</span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 flex-1">
                              {project.description}
                            </p>
                            
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1 text-primary-600 dark:text-primary-400 text-sm font-medium hover:gap-2 transition-all"
                              >
                                View Project <ChevronRight className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No client projects yet.
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="internship"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {internships.length > 0 ? (
                  <motion.div
                    className="grid md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {internships.map((internship) => (
                      <motion.div
                        key={internship.id}
                        variants={cardVariants}
                        onClick={() => setSelectedInternship(internship)}
                        className="group cursor-pointer"
                      >
                        <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                          <div className="p-6">
                            <div className="flex items-start gap-4">
                              {/* Company Logo */}
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                                <img
                                  src={internship.companyLogo}
                                  alt={internship.companyName}
                                  className="w-full h-full object-contain p-2"
                                />
                              </div>

                              {/* Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                  {internship.companyName}
                                </h3>
                                <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">
                                  {internship.role}
                                </p>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <User className="w-4 h-4" />
                                    {internship.projectLead}
                                  </span>
                                  <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                                    internship.isTeamProject
                                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                      : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                  }`}>
                                    {internship.isTeamProject ? (
                                      <>
                                        <Users className="w-3 h-3" />
                                        Team of {internship.teamSize}
                                      </>
                                    ) : (
                                      <>
                                        <User className="w-3 h-3" />
                                        Individual
                                      </>
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Arrow */}
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                            </div>

                            {/* Documents Preview */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex gap-2">
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <FileText className="w-3 h-3" />
                                <span>Offer Letter</span>
                                <span className="text-green-500">{'\u2713'}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Award className="w-3 h-3" />
                                <span>Certificate</span>
                                <span className="text-green-500">{'\u2713'}</span>
                              </div>
                              {internship.lorUrl && (
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                  <FileText className="w-3 h-3" />
                                  <span>LOR</span>
                                  <span className="text-green-500">{'\u2713'}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No internships yet.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Internship Detail Modal */}
      <AnimatePresence>
        {selectedInternship && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedInternship(null)}
            />
            
            <motion.div
              className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="p-8">
                {/* Header */}
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
                    <img
                      src={selectedInternship.companyLogo}
                      alt={selectedInternship.companyName}
                      className="w-full h-full object-contain p-3"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {selectedInternship.companyName}
                    </h3>
                    <p className="text-primary-600 dark:text-primary-400 font-medium text-lg">
                      {selectedInternship.role}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    <User className="w-5 h-5 text-primary-500" />
                    <span className="font-medium">Project Lead:</span>
                    <span>{selectedInternship.projectLead}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                    {selectedInternship.isTeamProject ? (
                      <>
                        <Users className="w-5 h-5 text-blue-500" />
                        <span className="font-medium">Team Size:</span>
                        <span>{selectedInternship.teamSize} members</span>
                      </>
                    ) : (
                      <>
                        <User className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Project Type:</span>
                        <span>Individual Project</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Documents */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Documents</h4>
                  
                  <a
                    href={selectedInternship.offerLetterUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Offer Letter</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">View PDF</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>

                  <a
                    href={selectedInternship.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">Certificate</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">View PDF</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                  </a>

                  {selectedInternship.lorUrl && (
                    <a
                      href={selectedInternship.lorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">Letter of Recommendation</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">View PDF</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-gray-400" />
                    </a>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="mt-8 w-full py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
