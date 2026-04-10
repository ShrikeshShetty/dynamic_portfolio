'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Github, Play } from 'lucide-react';
import type { Project } from '@/db/schema';

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/embed\/|youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  };

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-white via-green-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Subtle Background Gradient Animation */}
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: 'radial-gradient(circle at 30% 30%, rgba(34, 197, 94, 0.2) 0%, transparent 40%), radial-gradient(circle at 70% 70%, rgba(16, 185, 129, 0.15) 0%, transparent 40%)',
        }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Decorative Grid Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Floating Accent Shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-green-200/30 dark:bg-green-500/10 rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl"
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
            Projects
          </motion.h2>
          <motion.div
            className="w-20 h-1 bg-green-600 mx-auto mb-12"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-xl hover:shadow-2xl border border-green-100 dark:border-gray-700/50 transition-all duration-300 group"
              >
                {/* YouTube Video / Thumbnail */}
                {project.youtubeLink && (
                  <div className="aspect-video relative">
                    {playingVideo === project.id ? (
                      <iframe
                        src={`${getYouTubeEmbedUrl(project.youtubeLink)!}?autoplay=1`}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div
                        className="relative w-full h-full cursor-pointer group"
                        onClick={() => setPlayingVideo(project.id)}
                      >
                        <img
                          src={getYouTubeThumbnail(project.youtubeLink)!}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                          <motion.div
                            className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Play className="w-8 h-8 text-white ml-1" />
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                      {project.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.split(',').map((tech, i) => (
                      <motion.span
                        key={i}
                        className="px-2 py-1 text-xs bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-700 dark:text-green-400 rounded-full"
                        whileHover={{ scale: 1.05 }}
                      >
                        {tech.trim()}
                      </motion.span>
                    ))}
                  </div>

                  {project.githubLink && (
                    <motion.a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      <Github className="w-4 h-4" />
                      View Code
                    </motion.a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
