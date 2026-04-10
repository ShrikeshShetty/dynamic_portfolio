'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, User, Code, FolderKanban, Users, Link2, FileText, GraduationCap, Trophy,
  Menu, X, LogOut, Settings, Shield, Sparkles, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Hero', href: '/operator/admin', icon: Home, color: 'from-blue-500 to-cyan-500' },
  { label: 'About', href: '/operator/admin/about', icon: User, color: 'from-purple-500 to-pink-500' },
  { label: 'Skills', href: '/operator/admin/skills', icon: Code, color: 'from-green-500 to-emerald-500' },
  { label: 'Projects', href: '/operator/admin/projects', icon: FolderKanban, color: 'from-orange-500 to-amber-500' },
  { label: 'Client Projects', href: '/operator/admin/client-projects', icon: Users, color: 'from-red-500 to-rose-500' },
  { label: 'Contact Links', href: '/operator/admin/contact-links', icon: Link2, color: 'from-indigo-500 to-violet-500' },
  { label: 'Education', href: '/operator/admin/education', icon: GraduationCap, color: 'from-teal-500 to-cyan-500' },
  { label: 'Extra Curricular', href: '/operator/admin/extra-curricular', icon: Trophy, color: 'from-yellow-500 to-orange-500' },
  { label: 'Resume', href: '/operator/admin/resume', icon: FileText, color: 'from-slate-500 to-gray-500' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    const isAuth = sessionStorage.getItem('adminAuthenticated') === 'true';
    if (!isAuth && pathname !== '/operator/admin/login') {
      router.push('/operator/admin/login');
    } else if (isAuth) {
      setAuthenticated(true);
    }
    setChecking(false);
  }, [pathname, router]);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    router.push('/operator/admin/login');
  };

  // Don't show layout for login page
  if (pathname === '/operator/admin/login') {
    return <>{children}</>;
  }

  // Show loading while checking auth
  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-400 font-medium">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Admin Panel</h1>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="rounded-xl">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || typeof window !== 'undefined' && window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50 z-40 pt-20 lg:pt-0 shadow-2xl shadow-slate-900/5"
          >
            {/* Logo Section */}
            <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 hidden lg:block">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-lg font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">Admin Panel</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Portfolio Management
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)]">
              <p className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Menu</p>
              {navItems.map((item, index) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative overflow-hidden',
                        isActive
                          ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 bg-gradient-to-r opacity-20"
                          initial={false}
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                        />
                      )}
                      <div className={cn(
                        'relative z-10 flex items-center gap-3 w-full',
                        isActive ? 'text-white' : ''
                      )}>
                        <div className={cn(
                          'w-9 h-9 rounded-lg flex items-center justify-center transition-all',
                          isActive 
                            ? 'bg-white/20' 
                            : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-gradient-to-br ' + item.color
                        )}>
                          <item.icon className={cn(
                            'w-5 h-5 transition-colors',
                            isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400 group-hover:text-white'
                          )} />
                        </div>
                        <span className="font-medium text-sm">{item.label}</span>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white/80 dark:from-slate-900/80 to-transparent">
              <div className="space-y-2">
                <Link href="/" className="block">
                  <Button variant="outline" className="w-full rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
                    <LogOut className="w-4 h-4 mr-2" />
                    Back to Site
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-72 pt-20 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
