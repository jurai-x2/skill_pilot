import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Target, 
  BookOpen, 
  Award, 
  Calendar, 
  TrendingUp,
  Star,
  Clock,
  CheckCircle,
  Zap
} from 'lucide-react';
import { User } from '../types';
import { useTranslation } from '../utils/translations';

interface DashboardProps {
  user: User;
  onViewRoadmap: () => void;
  currentLanguage: string;
}

export default function Dashboard({ user, onViewRoadmap, currentLanguage }: DashboardProps) {
  const t = useTranslation(currentLanguage);

  const stats = [
    {
      icon: Target,
      label: t('dashboard.currentLevel'),
      value: user.level,
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Zap,
      label: t('dashboard.totalXP'),
      value: user.totalXp,
      color: 'from-accent-500 to-accent-600'
    },
    {
      icon: BookOpen,
      label: t('dashboard.lessonsCompleted'),
      value: user.completedLessons,
      color: 'from-secondary-500 to-secondary-600'
    },
    {
      icon: Award,
      label: t('dashboard.certificatesEarned'),
      value: user.certificates.length,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const achievements = [
    { name: 'First Steps', description: 'Completed your first lesson', earned: true },
    { name: 'Quiz Master', description: 'Completed career discovery quiz', earned: true },
    { name: 'Week Warrior', description: 'Maintained 7-day learning streak', earned: user.streak >= 7 },
    { name: 'Project Builder', description: 'Completed your first project', earned: false },
    { name: 'Level Up', description: 'Reached level 5', earned: user.level >= 5 },
    { name: 'Certificate Collector', description: 'Earned 3 certificates', earned: user.certificates.length >= 3 }
  ];

  const recentActivity = [
    { action: 'Completed lesson: JavaScript Fundamentals', time: '2 hours ago', type: 'lesson' },
    { action: 'Earned 50 XP for quiz completion', time: '1 day ago', type: 'xp' },
    { action: 'Started new project: Portfolio Website', time: '2 days ago', type: 'project' },
    { action: 'Unlocked achievement: Quiz Master', time: '3 days ago', type: 'achievement' }
  ];

  const nextMilestone = {
    name: 'Frontend Foundations Certificate',
    progress: 65,
    requirements: 'Complete 5 more lessons and 1 project'
  };

  const levelProgress = ((user.xp / (user.level * 100)) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('dashboard.welcome')}, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('dashboard.ready')} {user.careerPath || 'tech'} {t('dashboard.journey')}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Progress */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('dashboard.currentProgress')}</h2>
                <motion.button
                  onClick={onViewRoadmap}
                  className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  {t('dashboard.viewRoadmap')}
                </motion.button>
              </div>

              {/* Level Progress */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Level {user.level} Progress
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {user.xp}/{user.level * 100} XP
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                    initial={{ width: '0%' }}
                    animate={{ width: `${levelProgress}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
              </div>

              {/* Next Milestone */}
              <div className="border border-primary-200 dark:border-primary-700 rounded-lg p-4 bg-primary-50 dark:bg-primary-900/20">
                <div className="flex items-center space-x-3 mb-3">
                  <Trophy className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  <h3 className="font-semibold text-primary-900 dark:text-primary-100">Next Milestone</h3>
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">{nextMilestone.name}</h4>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{nextMilestone.requirements}</span>
                  <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                    {nextMilestone.progress}%
                  </span>
                </div>
                <div className="w-full h-2 bg-primary-200 dark:bg-primary-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary-600"
                    initial={{ width: '0%' }}
                    animate={{ width: `${nextMilestone.progress}%` }}
                    transition={{ duration: 1, delay: 0.9 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{t('dashboard.recentActivity')}</h2>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === 'lesson' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      activity.type === 'xp' ? 'bg-amber-100 dark:bg-amber-900/30' :
                      activity.type === 'project' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-purple-100 dark:bg-purple-900/30'
                    }`}>
                      {activity.type === 'lesson' && <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                      {activity.type === 'xp' && <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                      {activity.type === 'project' && <Target className="w-4 h-4 text-green-600 dark:text-green-400" />}
                      {activity.type === 'achievement' && <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                <Award className="w-5 h-5 text-accent-500" />
                <span>{t('dashboard.achievements')}</span>
              </h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.name}
                    className={`flex items-start space-x-3 p-3 rounded-lg ${
                      achievement.earned 
                        ? 'bg-secondary-50 dark:bg-secondary-900/20 border border-secondary-200 dark:border-secondary-700' 
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      achievement.earned ? 'bg-secondary-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {achievement.earned ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-500 rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-medium ${
                        achievement.earned ? 'text-secondary-900 dark:text-secondary-100' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${
                        achievement.earned ? 'text-secondary-700 dark:text-secondary-300' : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Learning Streak */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-accent-500" />
                <span>{t('dashboard.learningStreak')}</span>
              </h2>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">
                  {user.streak} days
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {t('dashboard.keepItUp')}
                </p>
                <div className="grid grid-cols-7 gap-1">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-lg ${
                        i < user.streak ? 'bg-accent-500' : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}