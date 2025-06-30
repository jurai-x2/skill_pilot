import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor, Check, ChevronDown } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export default function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themes = [
    {
      id: 'light' as const,
      name: 'Light',
      icon: Sun,
      description: 'Light theme'
    },
    {
      id: 'dark' as const,
      name: 'Dark',
      icon: Moon,
      description: 'Dark theme'
    },
    {
      id: 'system' as const,
      name: 'System',
      icon: Monitor,
      description: 'Follow system preference'
    }
  ];

  const currentThemeData = themes.find(theme => theme.id === currentTheme) || themes[0];
  const CurrentIcon = currentThemeData.icon;

  const handleThemeSelect = (theme: Theme) => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-3 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg group min-w-[140px]"
        aria-label="Theme selector"
      >
        <CurrentIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-shrink-0" />
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors flex-1">
          {currentThemeData.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Ultra-high priority backdrop */}
            <div
              className="fixed inset-0 z-[99998] bg-black/30 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Maximum z-index dropdown for desktop visibility */}
            <motion.div
              className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl shadow-2xl z-[99999] overflow-hidden"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-3">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2 mb-2">
                  Theme
                </div>
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        currentTheme === theme.id 
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 font-semibold' 
                          : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5" />
                        <div>
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{theme.description}</div>
                        </div>
                      </div>
                      {currentTheme === theme.id && (
                        <Check className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}