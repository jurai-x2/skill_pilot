import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  ShoppingBag, 
  GraduationCap,
  Users,
  Globe,
  Star,
  ArrowRight,
  X,
  ExternalLink
} from 'lucide-react';
import { MonetizationGuide as MonetizationGuideType, MonetizationStrategy } from '../types';
import { useTranslation } from '../utils/translations';

interface MonetizationGuideProps {
  careerPath: string;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function MonetizationGuide({ careerPath, isOpen, onClose, currentLanguage = 'en' }: MonetizationGuideProps) {
  const [selectedStrategy, setSelectedStrategy] = useState<MonetizationStrategy | null>(null);
  const t = useTranslation(currentLanguage);

  const monetizationData: MonetizationGuideType = {
    id: '1',
    careerPath,
    strategies: [
      {
        type: 'freelancing',
        title: 'Freelance Development',
        description: 'Offer your services on freelancing platforms and build a client base',
        platforms: ['Upwork', 'Fiverr', 'Freelancer', 'Toptal'],
        requirements: ['Portfolio with 3+ projects', 'Strong communication skills', 'Time management'],
        timeToStart: '1-2 weeks'
      },
      {
        type: 'products',
        title: 'Digital Products',
        description: 'Create and sell web applications, mobile apps, or SaaS products',
        platforms: ['App Store', 'Google Play', 'Product Hunt', 'Gumroad'],
        requirements: ['Full-stack development skills', 'UI/UX knowledge', 'Marketing basics'],
        timeToStart: '2-6 months'
      },
      {
        type: 'templates',
        title: 'Code Templates & Themes',
        description: 'Sell website templates, UI components, and code snippets',
        platforms: ['ThemeForest', 'Creative Market', 'GitHub Sponsors', 'CodeCanyon'],
        requirements: ['Design skills', 'Clean code practices', 'Documentation skills'],
        timeToStart: '2-4 weeks'
      },
      {
        type: 'courses',
        title: 'Online Teaching',
        description: 'Create courses, tutorials, and educational content',
        platforms: ['Udemy', 'Teachable', 'YouTube', 'Skillshare'],
        requirements: ['Teaching ability', 'Video editing skills', 'Subject expertise'],
        timeToStart: '1-3 months'
      },
      {
        type: 'consulting',
        title: 'Technical Consulting',
        description: 'Provide expert advice and solutions to businesses',
        platforms: ['LinkedIn', 'Clarity.fm', 'Direct outreach', 'Referrals'],
        requirements: ['Deep expertise', 'Business acumen', 'Network building'],
        timeToStart: '6-12 months'
      }
    ],
    estimatedEarnings: {
      beginner: '$500-2,000/month',
      intermediate: '$2,000-8,000/month',
      advanced: '$8,000-25,000+/month'
    },
    successStories: [],
    marketplaces: []
  };

  const deploymentOptions = [
    {
      name: 'Netlify',
      description: 'Perfect for static sites and JAMstack apps',
      pricing: 'Free tier available',
      icon: Globe
    },
    {
      name: 'Vercel',
      description: 'Optimized for React and Next.js applications',
      pricing: 'Free for personal projects',
      icon: Globe
    },
    {
      name: 'Heroku',
      description: 'Great for full-stack applications',
      pricing: 'Free tier with limitations',
      icon: Globe
    },
    {
      name: 'AWS',
      description: 'Enterprise-grade cloud platform',
      pricing: 'Pay-as-you-use',
      icon: Globe
    }
  ];

  const paymentIntegrations = [
    {
      name: 'Stripe',
      description: 'Most popular payment processor',
      features: ['Credit cards', 'Subscriptions', 'Global payments'],
      difficulty: 'Easy'
    },
    {
      name: 'PayPal',
      description: 'Widely trusted payment solution',
      features: ['PayPal payments', 'Credit cards', 'Buy now pay later'],
      difficulty: 'Easy'
    },
    {
      name: 'Razorpay',
      description: 'Popular in India and Southeast Asia',
      features: ['UPI', 'Wallets', 'Net banking'],
      difficulty: 'Medium'
    }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col transition-colors"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('monetization.title')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('monetization.subtitle')} {careerPath.toLowerCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Earnings Overview */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('monetization.earningPotential')}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <Star className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-green-900 dark:text-green-100">{t('monetization.beginner')}</h4>
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{monetizationData.estimatedEarnings.beginner}</p>
                <p className="text-sm text-green-600 dark:text-green-400">First 6 months</p>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">{t('monetization.intermediate')}</h4>
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{monetizationData.estimatedEarnings.intermediate}</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">6-18 months</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-2">
                  <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">{t('monetization.advanced')}</h4>
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{monetizationData.estimatedEarnings.advanced}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">18+ months</p>
              </div>
            </div>
          </div>

          {/* Monetization Strategies */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('monetization.strategies')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monetizationData.strategies.map((strategy, index) => {
                const icons = {
                  freelancing: Briefcase,
                  products: ShoppingBag,
                  templates: Globe,
                  courses: GraduationCap,
                  consulting: Users
                };
                const Icon = icons[strategy.type];

                return (
                  <motion.div
                    key={strategy.type}
                    className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedStrategy(strategy)}
                    whileHover={{ y: -2 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{strategy.title}</h4>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{strategy.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Start in {strategy.timeToStart}</span>
                      <ArrowRight className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Deployment Options */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('monetization.deploymentPlatforms')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {deploymentOptions.map((option, index) => (
                <motion.div
                  key={option.name}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <option.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-white">{option.name}</h4>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{option.description}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium">{option.pricing}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Payment Integration */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('monetization.paymentIntegration')}</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {paymentIntegrations.map((payment, index) => (
                <motion.div
                  key={payment.name}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{payment.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      payment.difficulty === 'Easy' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                      payment.difficulty === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                      'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    }`}>
                      {payment.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{payment.description}</p>
                  <div className="space-y-1">
                    {payment.features.map((feature, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-primary-600 dark:bg-primary-400 rounded-full" />
                        <span className="text-xs text-gray-600 dark:text-gray-400">{feature}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Strategy Detail Modal */}
        {selectedStrategy && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedStrategy.title}</h3>
                <button
                  onClick={() => setSelectedStrategy(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 mb-6">{selectedStrategy.description}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStrategy.platforms.map(platform => (
                      <span key={platform} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Requirements</h4>
                  <ul className="space-y-1">
                    {selectedStrategy.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-secondary-600 dark:bg-secondary-400 rounded-full" />
                        <span className="text-gray-600 dark:text-gray-300">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg">
                  <p className="text-accent-800 dark:text-accent-200">
                    <strong>Time to start:</strong> {selectedStrategy.timeToStart}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}