import React from 'react';
import { motion } from 'framer-motion';
import { Target, Award, Lightbulb, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { QuizResult } from '../types';
import { useTranslation } from '../utils/translations';

interface QuizResultsProps {
  result: QuizResult;
  onViewRoadmap: () => void;
  currentLanguage: string;
}

export default function QuizResults({ result, onViewRoadmap, currentLanguage }: QuizResultsProps) {
  const t = useTranslation(currentLanguage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 pt-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('results.title')}
          </h1>
          <div className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full text-sm">
            <Sparkles className="w-4 h-4 text-accent-500" />
            <span className="text-gray-600 dark:text-gray-300">{t('results.confidence')}: {result.confidence}%</span>
          </div>
        </motion.div>

        {/* Career Match Card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-8 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <Award className="w-8 h-8" />
              <h2 className="text-2xl font-bold">{t('results.careerPath')}</h2>
            </div>
            <h3 className="text-3xl font-bold mb-4">{result.careerPath}</h3>
            <p className="text-primary-100 text-lg">{result.description}</p>
          </div>
          
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Key Skills */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary-500" />
                  <span>{t('results.keySkills')}</span>
                </h4>
                <div className="space-y-2">
                  {result.skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <div className="w-2 h-2 bg-primary-600 rounded-full" />
                      <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-accent-500" />
                  <span>{t('results.nextSteps')}</span>
                </h4>
                <div className="space-y-3">
                  {result.nextSteps.map((step, index) => (
                    <motion.div
                      key={step}
                      className="flex items-start space-x-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-gray-700 dark:text-gray-300">{step}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('results.personalizedPath')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('results.personalizedDescription')}
            </p>
            <motion.button
              onClick={onViewRoadmap}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-primary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{t('results.viewRoadmap')}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('results.aiMentorSupport')}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {t('results.aiMentorDescription')}
            </p>
            <motion.button
              className="w-full bg-secondary-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-secondary-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{t('results.chatWithMentor')}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>

        {/* Confidence Meter */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('results.matchConfidence')}</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{t('results.analysisResult')}</span>
                <span>{result.confidence}%</span>
              </div>
              <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-secondary-500 to-primary-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${result.confidence}%` }}
                  transition={{ duration: 1, delay: 1.2 }}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
            {t('results.confidenceDescription')} {result.confidence}% {t('results.confidenceMatch')}
          </p>
        </motion.div>
      </div>
    </div>
  );
}