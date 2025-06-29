import React, { useState, useEffect, useRef } from 'react';
import { 
  Brain, 
  User, 
  Menu, 
  X, 
  MessageCircle, 
  FileText, 
  Users, 
  DollarSign, 
  BookOpen, 
  Upload, 
  Calendar, 
  Play, 
  Trophy, 
  Video, 
  ChevronDown, 
  Sparkles, 
  Zap, 
  Globe,
  Search,
  Bell,
  Settings,
  LogOut,
  UserCircle,
  Shield,
  HelpCircle,
  Keyboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../utils/translations';

type Theme = 'light' | 'dark' | 'system';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onOpenAIMentor: () => void;
  onOpenResumeBuilder: () => void;
  onOpenCommunityForum: () => void;
  onOpenMonetizationGuide: () => void;
  onOpenMicroLearning: () => void;
  onOpenProjectSubmission: () => void;
  onOpenLiveEvents: () => void;
  onOpenLearningFeed: () => void;
  onOpenGamification: () => void;
  onOpenPersonalizedVideos: () => void;
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  currentLanguage: string;
}

export default function Header({ 
  currentView, 
  onViewChange, 
  onOpenAIMentor,
  onOpenResumeBuilder,
  onOpenCommunityForum,
  onOpenMonetizationGuide,
  onOpenMicroLearning,
  onOpenProjectSubmission,
  onOpenLiveEvents,
  onOpenLearningFeed,
  onOpenGamification,
  onOpenPersonalizedVideos,
  currentTheme,
  onThemeChange,
  currentLanguage
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [showLearningMenu, setShowLearningMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Mock notification count
  const [isScrolled, setIsScrolled] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslation(currentLanguage);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close menus on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowToolsMenu(false);
        setShowLearningMenu(false);
        setShowUserMenu(false);
        setShowSearch(false);
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const navigation = [
    { name: t('header.home'), id: 'home', icon: Brain, shortcut: 'H' },
    { name: t('header.quiz'), id: 'quiz', icon: Sparkles, shortcut: 'Q' },
    { name: t('header.dashboard'), id: 'dashboard', icon: Zap, shortcut: 'D' },
    { name: t('header.roadmap'), id: 'roadmap', icon: Trophy, shortcut: 'R' },
  ];

  const learningTools = [
    { 
      name: t('tools.microLearning'), 
      icon: BookOpen, 
      action: onOpenMicroLearning, 
      color: 'from-blue-500 to-cyan-500', 
      description: 'Bite-sized lessons',
      badge: 'New'
    },
    { 
      name: t('tools.learningFeed'), 
      icon: Play, 
      action: onOpenLearningFeed, 
      color: 'from-purple-500 to-pink-500', 
      description: 'Curated content',
      badge: '12 new'
    },
    { 
      name: t('tools.liveEvents'), 
      icon: Calendar, 
      action: onOpenLiveEvents, 
      color: 'from-green-500 to-emerald-500', 
      description: 'Live workshops',
      badge: 'Live'
    },
    { 
      name: t('tools.personalVideos'), 
      icon: Video, 
      action: onOpenPersonalizedVideos, 
      color: 'from-orange-500 to-red-500', 
      description: 'AI-generated videos',
      badge: '3 new'
    },
  ];

  const tools = [
    { 
      name: t('tools.aiMentor'), 
      icon: MessageCircle, 
      action: onOpenAIMentor, 
      color: 'from-indigo-500 to-purple-500', 
      description: '24/7 AI assistance',
      shortcut: 'M'
    },
    { 
      name: t('tools.resumeBuilder'), 
      icon: FileText, 
      action: onOpenResumeBuilder, 
      color: 'from-teal-500 to-cyan-500', 
      description: 'Professional resumes',
      shortcut: 'B'
    },
    { 
      name: t('tools.community'), 
      icon: Users, 
      action: onOpenCommunityForum, 
      color: 'from-pink-500 to-rose-500', 
      description: 'Connect & learn',
      shortcut: 'C'
    },
    { 
      name: t('tools.projectSubmit'), 
      icon: Upload, 
      action: onOpenProjectSubmission, 
      color: 'from-amber-500 to-orange-500', 
      description: 'Submit projects',
      shortcut: 'P'
    },
    { 
      name: t('tools.achievements'), 
      icon: Trophy, 
      action: onOpenGamification, 
      color: 'from-yellow-500 to-amber-500', 
      description: 'Track progress',
      shortcut: 'A'
    },
    { 
      name: t('tools.monetization'), 
      icon: DollarSign, 
      action: onOpenMonetizationGuide, 
      color: 'from-emerald-500 to-green-500', 
      description: 'Earn money',
      shortcut: 'E'
    },
  ];

  const userMenuItems = [
    { name: 'Profile', icon: UserCircle, action: () => {}, shortcut: 'Shift+P' },
    { name: 'Settings', icon: Settings, action: () => {}, shortcut: 'Shift+S' },
    { name: 'Help & Support', icon: HelpCircle, action: () => {}, shortcut: 'Shift+H' },
    { name: 'Privacy & Security', icon: Shield, action: () => {}, shortcut: 'Shift+R' },
    { name: 'Keyboard Shortcuts', icon: Keyboard, action: () => {}, shortcut: '?' },
    { name: 'Sign Out', icon: LogOut, action: () => {}, shortcut: 'Shift+Q', danger: true },
  ];

  // Enhanced search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement search logic here
    console.log('Searching for:', query);
  };

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/10 dark:shadow-black/30' 
          : 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated gradient border */}
      <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-transparent via-primary-500/60 to-transparent"
          animate={{ 
            x: ['-100%', '100%'],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      </div>
      
      <div className="relative max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo with micro-interactions */}
          <motion.div 
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => onViewChange('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <motion.div 
                className="w-16 h-16 bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-500"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.6 }}
              >
                <Brain className="w-9 h-9 text-white" />
              </motion.div>
              <motion.div 
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-accent-400 to-secondary-500 rounded-full shadow-lg"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                SkillPilot
              </span>
              <motion.span 
                className="text-sm text-gray-500 dark:text-gray-400 font-medium -mt-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors"
                initial={{ opacity: 0.7 }}
                whileHover={{ opacity: 1 }}
              >
                AI-Powered Learning
              </motion.span>
            </div>
          </motion.div>

          {/* Enhanced Desktop Navigation with keyboard shortcuts */}
          <nav className="hidden xl:flex items-center space-x-2">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`relative flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 group ${
                    currentView === item.id
                      ? 'text-white shadow-xl'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
                  }`}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ y: 0, scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  title={`${item.name} (${item.shortcut})`}
                >
                  {currentView === item.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-500 rounded-2xl shadow-lg"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="relative z-10 text-base">{item.name}</span>
                  
                  {/* Keyboard shortcut indicator */}
                  <span className="relative z-10 text-xs opacity-60 bg-black/10 dark:bg-white/10 px-1.5 py-0.5 rounded group-hover:opacity-80 transition-opacity">
                    {item.shortcut}
                  </span>
                </motion.button>
              );
            })}
            
            {/* Enhanced Learning Dropdown with badges */}
            <div className="relative">
              <motion.button
                onClick={() => setShowLearningMenu(!showLearningMenu)}
                className="flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300 relative"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-base">{t('header.learning')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showLearningMenu ? 'rotate-180' : ''}`} />
                
                {/* New content indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </motion.button>
              
              <AnimatePresence>
                {showLearningMenu && (
                  <motion.div
                    className="absolute top-full right-0 mt-4 w-96 bg-white/98 dark:bg-gray-800/98 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-4 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-3xl" />
                    <div className="relative">
                      <div className="px-2 py-2 mb-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                          <Sparkles className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                          <span>Learning Tools</span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Accelerate your learning journey</p>
                      </div>
                      <div className="space-y-2">
                        {learningTools.map((tool, index) => (
                          <motion.button
                            key={tool.name}
                            onClick={() => {
                              tool.action();
                              setShowLearningMenu(false);
                            }}
                            className="relative w-full flex items-center space-x-4 p-4 text-left rounded-2xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 group"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ x: 6, scale: 1.02 }}
                          >
                            <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                              <tool.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white text-base flex items-center space-x-2">
                                <span>{tool.name}</span>
                                {tool.badge && (
                                  <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full animate-pulse">
                                    {tool.badge}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</div>
                            </div>
                            <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:text-primary-500 transition-colors" />
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Enhanced Tools Dropdown with shortcuts */}
            <div className="relative">
              <motion.button
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                className="flex items-center space-x-3 px-6 py-4 rounded-2xl font-semibold text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300"
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.98 }}
              >
                <Trophy className="w-5 h-5" />
                <span className="text-base">{t('header.tools')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showToolsMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <AnimatePresence>
                {showToolsMenu && (
                  <motion.div
                    className="absolute top-full right-0 mt-4 w-[28rem] bg-white/98 dark:bg-gray-800/98 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-4 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/5 to-accent-500/5 rounded-3xl" />
                    <div className="relative">
                      <div className="px-2 py-2 mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                          <Trophy className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                          <span>Professional Tools</span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Build your career with powerful tools</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {tools.map((tool, index) => (
                          <motion.button
                            key={tool.name}
                            onClick={() => {
                              tool.action();
                              setShowToolsMenu(false);
                            }}
                            className="relative flex flex-col items-center space-y-3 p-5 text-center rounded-2xl hover:bg-white/70 dark:hover:bg-gray-700/70 transition-all duration-300 group"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            title={`${tool.name} (${tool.shortcut})`}
                          >
                            <div className={`w-16 h-16 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                              <tool.icon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.description}</div>
                              <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                                {tool.shortcut}
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Enhanced Right side controls with search */}
          <div className="hidden xl:flex items-center space-x-3">
            {/* Search functionality */}
            <div className="relative">
              <AnimatePresence>
                {showSearch ? (
                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 'auto', opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search courses, tools..."
                      className="w-64 px-4 py-3 bg-white/90 dark:bg-gray-800/90 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm"
                      onBlur={() => !searchQuery && setShowSearch(false)}
                    />
                    <button
                      onClick={() => setShowSearch(false)}
                      className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ) : (
                  <motion.button
                    onClick={() => setShowSearch(true)}
                    className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-300 shadow-lg hover:shadow-xl group"
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    title="Search (Ctrl+K)"
                  >
                    <Search className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <motion.button 
              className="relative p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-amber-100 hover:to-orange-100 dark:hover:from-amber-900/30 dark:hover:to-orange-900/30 transition-all duration-300 shadow-lg hover:shadow-xl group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
              {notifications > 0 && (
                <motion.div 
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {notifications}
                </motion.div>
              )}
            </motion.button>

            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={(language) => {
                const event = new CustomEvent('languageChange', { detail: language });
                window.dispatchEvent(event);
              }}
            />
            
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
            
            {/* Enhanced User Menu */}
            <div className="relative">
              <motion.button 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-300 shadow-lg hover:shadow-xl group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <User className="w-6 h-6 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg" />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    className="absolute top-full right-0 mt-4 w-72 bg-white/98 dark:bg-gray-800/98 backdrop-blur-3xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-4 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* User info header */}
                    <div className="px-2 py-3 border-b border-gray-200 dark:border-gray-700 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">Alex Chen</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Frontend Developer</div>
                          <div className="text-xs text-primary-600 dark:text-primary-400">Level 3 • 450 XP</div>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="space-y-1">
                      {userMenuItems.map((item, index) => (
                        <motion.button
                          key={item.name}
                          onClick={() => {
                            item.action();
                            setShowUserMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-3 text-left rounded-2xl transition-all duration-300 group ${
                            item.danger 
                              ? 'hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400' 
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 4 }}
                          title={`${item.name} (${item.shortcut})`}
                        >
                          <div className="flex items-center space-x-3">
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <span className="text-xs opacity-60 font-mono bg-black/5 dark:bg-white/5 px-1.5 py-0.5 rounded">
                            {item.shortcut}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="xl:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-300 shadow-lg"
              whileTap={{ scale: 0.95 }}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-7 h-7 text-gray-600 dark:text-gray-300" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden overflow-hidden"
            >
              <div className="bg-white/98 dark:bg-gray-800/98 backdrop-blur-3xl rounded-3xl mt-6 border border-white/30 dark:border-gray-700/40 shadow-2xl max-h-[85vh] overflow-y-auto">
                <div className="py-8 space-y-8">
                  {/* Mobile Search */}
                  <div className="px-8">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search courses, tools..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Mobile Navigation Items */}
                  <div className="px-8">
                    <div className="space-y-3">
                      {navigation.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <motion.button
                            key={item.id}
                            onClick={() => {
                              onViewChange(item.id);
                              setIsMenuOpen(false);
                            }}
                            className={`w-full flex items-center space-x-4 p-6 text-left rounded-2xl transition-all duration-300 ${
                              currentView === item.id
                                ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-xl'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 6 }}
                          >
                            <Icon className="w-7 h-7" />
                            <span className="font-semibold text-lg">{item.name}</span>
                            <span className="ml-auto text-sm opacity-60 font-mono bg-black/10 dark:bg-white/10 px-2 py-1 rounded">
                              {item.shortcut}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Mobile Learning Tools */}
                  <div className="px-8">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{t('header.learning')}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {learningTools.map((tool, index) => (
                        <motion.button
                          key={tool.name}
                          onClick={() => {
                            tool.action();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-4 p-5 bg-white/70 dark:bg-gray-700/70 rounded-2xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 text-left"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                          whileHover={{ y: -3 }}
                        >
                          <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <tool.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-semibold text-gray-700 dark:text-gray-300 truncate flex items-center space-x-2">
                              <span>{tool.name}</span>
                              {tool.badge && (
                                <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{tool.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Professional Tools */}
                  <div className="px-8">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 flex items-center space-x-2">
                      <Trophy className="w-4 h-4" />
                      <span>{t('header.tools')}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {tools.map((tool, index) => (
                        <motion.button
                          key={tool.name}
                          onClick={() => {
                            tool.action();
                            setIsMenuOpen(false);
                          }}
                          className="flex flex-col items-center space-y-3 p-5 bg-white/70 dark:bg-gray-700/70 rounded-2xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 text-center"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ y: -3 }}
                        >
                          <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <tool.icon className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{tool.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.description}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 font-mono bg-gray-100 dark:bg-gray-600 px-1.5 py-0.5 rounded">
                              {tool.shortcut}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Controls */}
                  <div className="px-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center justify-between">
                        <LanguageSelector 
                          currentLanguage={currentLanguage}
                          onLanguageChange={(language) => {
                            const event = new CustomEvent('languageChange', { detail: language });
                            window.dispatchEvent(event);
                          }}
                        />
                        <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
                      </div>
                      
                      {/* Mobile User Profile */}
                      <motion.div 
                        className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">A</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white">Alex Chen</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Frontend Developer • Level 3</div>
                        </div>
                        <div className="relative">
                          <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                          {notifications > 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                              {notifications}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Bottom Padding */}
                  <div className="h-4" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}