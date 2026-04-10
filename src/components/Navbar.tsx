'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, FileText } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Fetch resume URL
    fetch('/api/resume')
      .then(res => res.json())
      .then(data => {
        if (data && data.fileUrl) {
          setResumeUrl(data.fileUrl);
        }
      })
      .catch(() => {});
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      )}
      style={{ '--nav-text-color': scrolled ? 'auto' : 'white' } as React.CSSProperties}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-xl font-bold text-gray-900 dark:text-white"
            whileHover={{ scale: 1.05 }}
            style={{ color: scrolled ? undefined : 'white' }}
          >
            Portfolio
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <motion.button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                style={{ color: scrolled ? undefined : 'white' }}
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.button>
            ))}
            
            {/* Resume Button */}
            {resumeUrl && (
              <motion.a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all",
                  scrolled
                    ? "bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg hover:shadow-xl"
                    : "bg-white text-primary-600 hover:bg-gray-100"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FileText className="w-4 h-4" />
                Resume
              </motion.a>
            )}
            
            {/* Theme Toggle */}
            <motion.button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors",
                scrolled 
                  ? "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                  : "bg-white/20 backdrop-blur-sm hover:bg-white/30"
              )}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className={cn("w-5 h-5", scrolled ? "text-gray-700" : "text-white")} />
              )}
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <motion.button
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full transition-colors",
                scrolled 
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white/20 backdrop-blur-sm"
              )}
              whileTap={{ scale: 0.9 }}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-500" />
              ) : (
                <Moon className={cn("w-5 h-5", scrolled ? "text-gray-700" : "text-white")} />
              )}
            </motion.button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 rounded-full transition-colors",
                scrolled 
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white/20 backdrop-blur-sm"
              )}
              style={{ color: scrolled ? undefined : 'white' }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.href}
                  onClick={() => handleNavClick(item.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="block w-full text-left py-3 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {item.label}
                </motion.button>
              ))}
              
              {/* Mobile Resume Button */}
              {resumeUrl && (
                <motion.a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: NAV_ITEMS.length * 0.1 }}
                  className="flex items-center gap-2 w-full mt-4 py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg font-semibold text-center justify-center"
                >
                  <FileText className="w-4 h-4" />
                  View Resume
                </motion.a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
