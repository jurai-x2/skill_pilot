import React from 'react';
import { Brain, User, Menu, X, MessageCircle, FileText, Users, DollarSign, BookOpen, Upload, Calendar, Play, Trophy, Video, ChevronDown, Sparkles, Zap, Globe, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { User as UserType } from '../types';

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
  user?: UserType | null;
  onAuthClick: (mode: 'signin' | 'signup') => void;
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
  currentLanguage,
  user,
  onAuthClick
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showToolsMenu, setShowToolsMenu] = React.useState(false);
  const [showLearningMenu, setShowLearningMenu] = React.useState(false);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  
  const t = useTranslation(currentLanguage);
  const { signOut } = useAuth();

  const navigation = [
    { name: t('header.home'), id: 'home', icon: Brain },
    { name: t('header.quiz'), id: 'quiz', icon: Sparkles },
    { name: t('header.dashboard'), id: 'dashboard', icon: Zap },
    { name: t('header.roadmap'), id: 'roadmap', icon: Trophy },
  ];

  const learningTools = [
    { name: t('tools.microLearning'), icon: BookOpen, action: onOpenMicroLearning, color: 'from-blue-500 to-cyan-500', description: 'Bite-sized lessons' },
    { name: t('tools.learningFeed'), icon: Play, action: onOpenLearningFeed, color: 'from-purple-500 to-pink-500', description: 'Curated content' },
    { name: t('tools.liveEvents'), icon: Calendar, action: onOpenLiveEvents, color: 'from-green-500 to-emerald-500', description: 'Live workshops' },
    { name: t('tools.personalVideos'), icon: Video, action: onOpenPersonalizedVideos, color: 'from-orange-500 to-red-500', description: 'AI-generated videos' },
  ];

  const tools = [
    { name: t('tools.aiMentor'), icon: MessageCircle, action: onOpenAIMentor, color: 'from-indigo-500 to-purple-500', description: '24/7 AI assistance' },
    { name: t('tools.resumeBuilder'), icon: FileText, action: onOpenResumeBuilder, color: 'from-teal-500 to-cyan-500', description: 'Professional resumes' },
    { name: t('tools.community'), icon: Users, action: onOpenCommunityForum, color: 'from-pink-500 to-rose-500', description: 'Connect & learn' },
    { name: t('tools.projectSubmit'), icon: Upload, action: onOpenProjectSubmission, color: 'from-amber-500 to-orange-500', description: 'Submit projects' },
    { name: t('tools.achievements'), icon: Trophy, action: onOpenGamification, color: 'from-yellow-500 to-amber-500', description: 'Track progress' },
    { name: t('tools.monetization'), icon: DollarSign, action: onOpenMonetizationGuide, color: 'from-emerald-500 to-green-500', description: 'Earn money' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    onViewChange('home');
  };

  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Enhanced Glassmorphism Background */}
      <div className="absolute inset-0 bg-white/85 dark:bg-gray-900/85 backdrop-blur-2xl border-b border-white/30 dark:border-gray-700/40 shadow-xl shadow-black/5 dark:shadow-black/25" />
      
      {/* Animated Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px">
        <div className="h-full bg-gradient-to-r from-transparent via-primary-500/60 to-transparent animate-pulse" />
      </div>
      
      <div className="relative max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Enhanced Logo */}
          <motion.div 
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => onViewChange('home')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-600 via-secondary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-500/30 group-hover:shadow-primary-500/50 transition-all duration-500 group-hover:rotate-3">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-accent-400 to-secondary-500 rounded-full animate-pulse shadow-lg" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                SkillPilot
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium -mt-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                AI-Powered Learning
              </span>
            </div>
          </motion.div>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-3">
            {navigation.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`relative flex items-center space-x-3 px-6 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
                    currentView === item.id
                      ? 'text-white shadow-xl'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-gray-800/60'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
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
                </motion.button>
              );
            })}
            
            {/* Enhanced Learning Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setShowLearningMenu(!showLearningMenu)}
                className="flex items-center space-x-3 px-6 py-3.5 rounded-2xl font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <BookOpen className="w-5 h-5" />
                <span className="text-base">{t('header.learning')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showLearningMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <AnimatePresence>
                {showLearningMenu && (
                  <motion.div
                    className="absolute top-full right-0 mt-3 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-3 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-3xl" />
                    <div className="relative space-y-2">
                      <div className="px-4 py-2">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Learning Tools
                        </h3>
                      </div>
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
                          whileHover={{ x: 6 }}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                            <tool.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 dark:text-white text-base">{tool.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{tool.description}</div>
                          </div>
                          <ChevronDown className="w-5 h-5 text-gray-400 rotate-[-90deg] group-hover:text-primary-500 transition-colors" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Enhanced Tools Dropdown */}
            <div className="relative">
              <motion.button
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                className="flex items-center space-x-3 px-6 py-3.5 rounded-2xl font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-gray-800/60 transition-all duration-300"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Trophy className="w-5 h-5" />
                <span className="text-base">{t('header.tools')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showToolsMenu ? 'rotate-180' : ''}`} />
              </motion.button>
              
              <AnimatePresence>
                {showToolsMenu && (
                  <motion.div
                    className="absolute top-full right-0 mt-3 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-3 overflow-hidden"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-secondary-500/5 to-accent-500/5 rounded-3xl" />
                    <div className="relative">
                      <div className="px-4 py-2 mb-2">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          Professional Tools
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
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
                            whileHover={{ y: -3 }}
                          >
                            <div className={`w-14 h-14 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                              <tool.icon className="w-7 h-7 text-white" />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900 dark:text-white text-sm">{tool.name}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.description}</div>
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

          {/* Enhanced Right side controls */}
          <div className="hidden xl:flex items-center space-x-4">
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={(language) => {
                const event = new CustomEvent('languageChange', { detail: language });
                window.dispatchEvent(event);
              }}
            />
            <ThemeSwitcher currentTheme={currentTheme} onThemeChange={onThemeChange} />
            
            {user ? (
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
                      className="absolute top-full right-0 mt-3 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/40 p-3 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-4 border-b border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                            <span className="font-semibold text-primary-600 dark:text-primary-400">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center space-x-3 p-3 text-left rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <motion.button 
                  onClick={() => onAuthClick('signin')}
                  className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign In
                </motion.button>
                <motion.button 
                  onClick={() => onAuthClick('signup')}
                  className="px-6 py-3 bg-primary-600 text-white rounded-2xl font-medium hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </div>
            )}
          </div>

          {/* Enhanced Mobile menu button */}
          <div className="xl:hidden">
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 hover:from-primary-100 hover:to-secondary-100 dark:hover:from-primary-900/30 dark:hover:to-secondary-900/30 transition-all duration-300 shadow-lg"
              whileTap={{ scale: 0.95 }}
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

        {/* Enhanced Mobile Navigation - Fixed Scrolling Issue */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="xl:hidden overflow-hidden"
            >
              {/* Scrollable Container with Fixed Height */}
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl mt-6 border border-white/30 dark:border-gray-700/40 shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="py-8 space-y-8">
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
                            className={`w-full flex items-center space-x-4 p-5 text-left rounded-2xl transition-all duration-300 ${
                              currentView === item.id
                                ? 'bg-gradient-to-r from-primary-600 to-secondary-500 text-white shadow-xl'
                                : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700/70'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ x: 6 }}
                          >
                            <Icon className="w-6 h-6" />
                            <span className="font-semibold text-lg">{item.name}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Mobile Learning Tools - Enhanced with Scrolling */}
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
                          <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <tool.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{tool.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Professional Tools - Enhanced with Scrolling */}
                  <div className="px-8">
                    <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4 flex items-center space-x-2">
                      <Trophy className="w-4 h-4" />
                      <span>{t('header.tools')}</span>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {tools.map((tool, index) => (
                        <motion.button
                          key={tool.name}
                          onClick={() => {
                            tool.action();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-4 p-5 bg-white/70 dark:bg-gray-700/70 rounded-2xl hover:bg-white/90 dark:hover:bg-gray-700/90 transition-all duration-300 text-left"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ y: -3 }}
                        >
                          <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                            <tool.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{tool.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{tool.description}</div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Controls - Enhanced with Better Spacing */}
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
                      
                      {user ? (
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-2xl">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                              <span className="font-semibold text-primary-600 dark:text-primary-400">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 dark:text-white">{user.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{user.email}</div>
                            </div>
                          </div>
                          <motion.button 
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-semibold">Sign Out</span>
                          </motion.button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <motion.button 
                            onClick={() => {
                              onAuthClick('signin');
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl border-2 border-primary-200 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <User className="w-5 h-5" />
                            <span className="font-semibold">Sign In</span>
                          </motion.button>
                          <motion.button 
                            onClick={() => {
                              onAuthClick('signup');
                              setIsMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-center space-x-3 p-4 rounded-2xl bg-primary-600 text-white hover:bg-primary-700 transition-all duration-300 shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Sparkles className="w-5 h-5" />
                            <span className="font-semibold">Get Started</span>
                          </motion.button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Padding for Better Scrolling */}
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