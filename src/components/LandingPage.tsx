import React from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  Zap, 
  Award, 
  Users, 
  Globe, 
  ArrowRight,
  Star,
  CheckCircle,
  Sparkles,
  Heart,
  TrendingUp,
  Shield,
  Lightbulb
} from 'lucide-react';
import { useTranslation } from '../utils/translations';

interface LandingPageProps {
  onStartQuiz: () => void;
  currentLanguage: string;
}

export default function LandingPage({ onStartQuiz, currentLanguage }: LandingPageProps) {
  const t = useTranslation(currentLanguage);

  const features = [
    {
      icon: Brain,
      title: t('features.aiDiscovery.title'),
      description: t('features.aiDiscovery.description')
    },
    {
      icon: Target,
      title: t('features.roadmaps.title'),
      description: t('features.roadmaps.description')
    },
    {
      icon: Zap,
      title: t('features.microLearning.title'),
      description: t('features.microLearning.description')
    },
    {
      icon: Award,
      title: t('features.certificates.title'),
      description: t('features.certificates.description')
    },
    {
      icon: Users,
      title: t('features.aiMentor.title'),
      description: t('features.aiMentor.description')
    },
    {
      icon: Globe,
      title: t('features.multilingual.title'),
      description: t('features.multilingual.description')
    }
  ];

  const stats = [
    { number: '50K+', label: t('stats.students') },
    { number: '95%', label: t('stats.successRate') },
    { number: '30+', label: t('stats.careerPaths') },
    { number: '85+', label: t('stats.languages') }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Frontend Developer',
      content: 'SkillPilot helped me transition from marketing to tech in just 6 months!',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=150'
    },
    {
      name: 'Marcus Johnson',
      role: 'Data Scientist',
      content: 'The AI-powered quiz revealed my passion for data science. Best career decision!',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150'
    },
    {
      name: 'Elena Rodriguez',
      role: 'UX Designer',
      content: 'The project-based learning approach made everything click for me.',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=150'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Refined badge size */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23f0f9ff%22 fill-opacity=%220.4%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Smaller, More Elegant Badge */}
              <div className="flex justify-center mb-8">
                <motion.div 
                  className="inline-flex items-center space-x-3 bg-gradient-to-r from-primary-100 via-white to-secondary-100 dark:from-primary-900/30 dark:via-gray-800/50 dark:to-secondary-900/30 text-primary-700 dark:text-primary-300 px-6 py-3 rounded-full text-sm font-semibold shadow-lg hover:shadow-xl border border-primary-200/50 dark:border-primary-700/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent font-semibold">
                    {t('landing.aiPowered')}
                  </span>
                  <div className="w-2 h-2 bg-gradient-to-r from-accent-400 to-secondary-500 rounded-full animate-pulse shadow-sm" />
                </motion.div>
              </div>
              
              {/* Enhanced Title with Better Spacing */}
              <div className="space-y-8 mb-12">
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white leading-tight">
                  <span className="block mb-6">Discover Your</span>
                  <span className="block bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
                    Perfect Tech Career
                  </span>
                </h1>
                
                <div className="max-w-4xl mx-auto">
                  <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {t('landing.subtitle')}
                  </p>
                </div>
              </div>
              
              {/* Smaller CTA Buttons with Reduced Padding and Text Size */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <motion.button
                  onClick={onStartQuiz}
                  className="group relative w-full sm:w-auto bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center space-x-3 hover:from-primary-700 hover:to-secondary-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform-gpu"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Sparkles className="w-6 h-6 relative z-10" />
                  <span className="relative z-10">{t('landing.startQuiz')}</span>
                  <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.button>
                
                <motion.button
                  className="group w-full sm:w-auto text-primary-600 dark:text-primary-400 px-8 py-4 rounded-2xl font-bold text-lg border-2 border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-300 flex items-center justify-center space-x-3"
                  whileHover={{ scale: 1.05, y: -4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-6 h-6 border-2 border-current rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[7px] border-l-current border-y-[4px] border-y-transparent ml-0.5" />
                  </div>
                  <span>{t('landing.watchDemo')}</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Floating Elements */}
        <motion.div
          className="absolute top-40 left-10 w-24 h-24 bg-gradient-to-br from-primary-400/30 to-secondary-400/30 rounded-3xl opacity-60 blur-sm"
          animate={{ y: [-15, 15, -15], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-56 right-20 w-20 h-20 bg-gradient-to-br from-accent-400/30 to-primary-400/30 rounded-full opacity-60 blur-sm"
          animate={{ y: [15, -15, 15], rotate: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 w-16 h-16 bg-gradient-to-br from-secondary-400/30 to-accent-400/30 rounded-2xl opacity-60 blur-sm"
          animate={{ y: [-10, 10, -10], rotate: [0, 3, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary-600 dark:text-primary-400 mb-3">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('landing.features.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              {t('landing.features.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Why SkillPilot Section */}
      <section className="py-24 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent-100 to-secondary-100 dark:from-accent-900/30 dark:to-secondary-900/30 text-accent-700 dark:text-accent-300 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Heart className="w-4 h-4" />
                <span>Why We Built SkillPilot</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Breaking Down Barriers to 
                <span className="block bg-gradient-to-r from-accent-600 to-secondary-600 bg-clip-text text-transparent">
                  Tech Success
                </span>
              </h2>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                We believe everyone deserves a chance to thrive in tech, regardless of their background, 
                location, or native language. Traditional career guidance is often generic, expensive, 
                and inaccessible to many.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      The Problem We Solve
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      70% of career changers struggle to find the right tech path. Generic advice 
                      doesn't account for personality, learning style, or individual goals.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Our AI-Powered Solution
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Using psychology and machine learning, we create personalized career paths 
                      that match your unique personality and learning preferences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Accessible to Everyone
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Free to start, available in 85+ languages, and designed for learners 
                      from all backgrounds and experience levels.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-3xl p-8 border border-primary-200/50 dark:border-primary-700/50">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Perfect For:
                </h3>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      <strong>Career Changers</strong> looking to transition into tech
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-secondary-500 to-accent-500 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      <strong>Students & Graduates</strong> unsure about their tech specialization
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      <strong>Self-Taught Learners</strong> seeking structured guidance
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      <strong>International Learners</strong> wanting education in their native language
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      <strong>Busy Professionals</strong> needing flexible, bite-sized learning
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-accent-500 to-secondary-500 rounded-full" />
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                      <strong>Anyone</strong> passionate about technology and personal growth
                    </span>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-white/60 dark:bg-gray-800/60 rounded-2xl border border-white/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Our Mission</h4>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    To democratize tech education and make career success achievable for everyone, 
                    everywhere, in every language.
                  </p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent-400/20 to-secondary-400/20 rounded-full blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-full blur-xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('landing.testimonials.title')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {t('landing.testimonials.subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-accent-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-8 italic text-lg leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center space-x-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('landing.cta.title')}
            </h2>
            <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t('landing.cta.subtitle')}
            </p>
            <motion.button
              onClick={onStartQuiz}
              className="bg-white text-primary-600 px-12 py-6 rounded-2xl font-bold text-xl flex items-center space-x-4 mx-auto hover:bg-gray-50 transition-colors shadow-2xl hover:shadow-3xl"
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-7 h-7" />
              <span>{t('landing.cta.button')}</span>
              <ArrowRight className="w-7 h-7" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}