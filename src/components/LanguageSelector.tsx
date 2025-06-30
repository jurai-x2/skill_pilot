import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
    { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
    { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
    { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
    { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' }
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  const handleLanguageSelect = (languageCode: string) => {
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-3 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg group min-w-[160px]"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors flex-shrink-0" />
        <span className="text-xl flex-shrink-0">{currentLang.flag}</span>
        <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors truncate flex-1">
          {currentLang.nativeName}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Ultra-high priority backdrop */}
            <div
              className="fixed inset-0 z-[99998] bg-black/30 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Maximum z-index dropdown with ultra-high contrast */}
            <motion.div
              className="absolute top-full mt-2 z-[99999] bg-white dark:bg-gray-800 backdrop-blur-2xl border-2 border-gray-300 dark:border-gray-600 rounded-2xl shadow-2xl overflow-hidden
                         /* Mobile: Full width with high contrast */
                         left-0 right-0 max-h-[70vh]
                         /* Small screens (640px+): Positioned dropdown */
                         sm:left-auto sm:right-0 sm:w-80
                         /* Medium screens (768px+): Larger dropdown */
                         md:w-96 md:max-h-[28rem]
                         /* Large screens (1024px+): Even larger */
                         lg:w-[26rem] lg:max-h-[32rem]
                         /* Extra large screens (1280px+): Maximum size */
                         xl:w-[28rem] xl:max-h-[36rem]"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* High contrast gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 to-secondary-500/10 rounded-2xl" />
              
              <div className="relative">
                {/* Header - ULTRA HIGH contrast and readable in dark theme */}
                <div className="px-6 py-4 border-b-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-primary-600 dark:text-primary-400 flex-shrink-0" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Select Language
                    </h3>
                    <div className="ml-auto text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full">
                      85+ supported
                    </div>
                  </div>
                </div>

                {/* Language List - Maximum contrast and readability */}
                <div className="overflow-y-auto p-4 bg-white dark:bg-gray-800
                               /* Responsive max heights */
                               max-h-[55vh] sm:max-h-80 md:max-h-96 lg:max-h-[28rem] xl:max-h-[32rem]">
                  <div className="space-y-2">
                    {languages.map((language, index) => (
                      <motion.button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language.code)}
                        className={`w-full flex items-center justify-between rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 group touch-manipulation border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600
                                   /* Responsive padding for better touch targets */
                                   px-4 py-4 sm:px-5 sm:py-4 md:px-6 md:py-4 lg:px-6 lg:py-4
                                   ${
                          currentLanguage === language.code 
                            ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-800 dark:text-primary-200 shadow-md border-primary-400 dark:border-primary-600 font-semibold' 
                            : 'text-gray-800 dark:text-gray-100 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center flex-1 min-w-0
                                       /* Responsive spacing */
                                       space-x-4 sm:space-x-4 md:space-x-5">
                          <span className="flex-shrink-0
                                         /* Responsive flag size */
                                         text-2xl sm:text-2xl md:text-3xl lg:text-3xl">
                            {language.flag}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold truncate
                                           /* Responsive text size with high contrast */
                                           text-base sm:text-base md:text-lg lg:text-lg
                                           text-gray-900 dark:text-white">
                              {language.nativeName}
                            </div>
                            <div className="truncate font-medium
                                           /* Responsive subtitle size with good contrast */
                                           text-sm sm:text-sm md:text-base lg:text-base
                                           text-gray-600 dark:text-gray-300">
                              {language.name}
                            </div>
                          </div>
                        </div>
                        {currentLanguage === language.code && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="flex items-center justify-center shadow-lg flex-shrink-0 bg-primary-600 dark:bg-primary-500 rounded-full border-2 border-white dark:border-gray-800
                                       /* Responsive check size */
                                       w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                          >
                            <Check className="text-white dark:text-white font-bold
                                             /* Responsive icon size */
                                             w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
                
                {/* Footer - ULTRA HIGH contrast in dark theme */}
                <div className="border-t-2 border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700
                               /* Responsive padding */
                               p-4 sm:p-4 md:p-5 lg:p-6">
                  <div className="text-center">
                    <div className="text-gray-800 dark:text-gray-100 font-semibold
                                   /* Responsive text size */
                                   text-sm sm:text-sm md:text-base lg:text-base">
                      🌍 AI-powered translation available
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}