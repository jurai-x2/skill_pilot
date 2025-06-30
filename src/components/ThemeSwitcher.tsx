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
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        aria-label="Theme selector"
      >
        <CurrentIcon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">
          {currentThemeData.name}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - FIXED: Higher z-index */}
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown - FIXED: Much higher z-index for desktop visibility */}
            <motion.div
              className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-[9999]"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide px-3 py-2">
                  Theme
                </div>
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        currentTheme === theme.id 
                          ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' 
                          : 'text-gray-700 dark:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <div>
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{theme.description}</div>
                        </div>
                      </div>
                      {currentTheme === theme.id && (
                        <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
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