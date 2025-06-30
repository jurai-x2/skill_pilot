import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award,
  Crown,
  Medal,
  Flame,
  TrendingUp,
  Users,
  Calendar,
  X,
  Loader
} from 'lucide-react';
import { Achievement, Leaderboard, Challenge, User } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/supabase';

interface GamificationProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function Gamification({ user, isOpen, onClose, currentLanguage = 'en' }: GamificationProps) {
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard' | 'challenges'>('achievements');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const t = useTranslation(currentLanguage);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadAchievements();
    }
  }, [isOpen, currentUser]);

  const loadAchievements = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const { data, error } = await db.getUserAchievements(currentUser.id);

      if (error) {
        console.error('❌ Error loading achievements:', error);
        return;
      }

      if (data) {
        setAchievements(data);
      }

      // If no achievements exist, create some default ones
      if (!data || data.length === 0) {
        await createDefaultAchievements();
      }
    } catch (err: any) {
      console.error('❌ Error loading achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultAchievements = async () => {
    if (!currentUser) return;

    const defaultAchievements = [
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        xpReward: 50,
        category: 'learning',
        rarity: 'common',
        earned: currentUser.completed_lessons > 0
      },
      {
        name: 'Quiz Master',
        description: 'Complete the career discovery quiz',
        icon: '🧠',
        xpReward: 100,
        category: 'learning',
        rarity: 'rare',
        earned: !!currentUser.careerPath
      },
      {
        name: 'Week Warrior',
        description: 'Maintain a 7-day learning streak',
        icon: '🔥',
        xpReward: 150,
        category: 'streak',
        rarity: 'rare',
        earned: currentUser.streak >= 7
      },
      {
        name: 'Project Pioneer',
        description: 'Complete your first project',
        icon: '🚀',
        xpReward: 200,
        category: 'project',
        rarity: 'epic',
        earned: false
      },
      {
        name: 'Level Legend',
        description: 'Reach level 10',
        icon: '👑',
        xpReward: 500,
        category: 'milestone',
        rarity: 'legendary',
        earned: currentUser.level >= 10
      },
      {
        name: 'Community Helper',
        description: 'Help 10 people in the forum',
        icon: '🤝',
        xpReward: 300,
        category: 'social',
        rarity: 'epic',
        earned: false
      }
    ];

    // Create achievements in database
    for (const achievement of defaultAchievements) {
      if (achievement.earned) {
        try {
          await db.unlockAchievement(currentUser.id, achievement);
        } catch (err) {
          console.error('❌ Error creating achievement:', err);
        }
      }
    }

    // Reload achievements
    loadAchievements();
  };

  const mockLeaderboard: Leaderboard = {
    id: '1',
    type: 'global',
    period: 'weekly',
    entries: [
      {
        rank: 1,
        user: { ...user, name: 'Sarah Chen', total_xp: 2450 },
        score: 2450,
        change: 2,
        badge: '🥇'
      },
      {
        rank: 2,
        user: { ...user, name: 'Marcus Johnson', total_xp: 2380 },
        score: 2380,
        change: -1,
        badge: '🥈'
      },
      {
        rank: 3,
        user: { ...user, name: 'Elena Rodriguez', total_xp: 2250 },
        score: 2250,
        change: 1,
        badge: '🥉'
      },
      {
        rank: 4,
        user: { ...user, name: user.name, total_xp: user.total_xp },
        score: user.total_xp,
        change: 0
      },
      {
        rank: 5,
        user: { ...user, name: 'David Kim', total_xp: 420 },
        score: 420,
        change: -2
      }
    ],
    lastUpdated: new Date()
  };

  const mockChallenges: Challenge[] = [
    {
      id: '1',
      title: 'Daily Coder',
      description: 'Complete at least one lesson every day this week',
      type: 'weekly',
      xpReward: 200,
      requirements: ['Complete 1 lesson daily', 'Maintain streak for 7 days'],
      startDate: new Date('2024-02-12'),
      endDate: new Date('2024-02-18'),
      participants: 1247,
      completed: user.streak >= 7
    },
    {
      id: '2',
      title: 'Project Sprint',
      description: 'Submit a project within 48 hours',
      type: 'special',
      xpReward: 500,
      requirements: ['Choose any project', 'Submit within 48 hours', 'Include documentation'],
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-17'),
      participants: 89,
      completed: false
    },
    {
      id: '3',
      title: 'Knowledge Seeker',
      description: 'Read 5 articles from the learning feed',
      type: 'daily',
      xpReward: 75,
      requirements: ['Read 5 articles', 'Complete in one day'],
      startDate: new Date('2024-02-15'),
      endDate: new Date('2024-02-15'),
      participants: 567,
      completed: false
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
      case 'rare': return 'border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'border-purple-300 dark:border-purple-600 bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'border-amber-300 dark:border-amber-600 bg-amber-50 dark:bg-amber-900/20';
      default: return 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'rare': return 'shadow-blue-200 dark:shadow-blue-900/50';
      case 'epic': return 'shadow-purple-200 dark:shadow-purple-900/50';
      case 'legendary': return 'shadow-amber-200 dark:shadow-amber-900/50';
      default: return '';
    }
  };

  const getChallengeTypeColor = (type: string) => {
    switch (type) {
      case 'daily': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'weekly': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'monthly': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'special': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-3 h-3 text-green-500 dark:text-green-400" />;
    if (change < 0) return <TrendingUp className="w-3 h-3 text-red-500 dark:text-red-400 rotate-180" />;
    return <div className="w-3 h-3" />;
  };

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
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('gamification.title')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('gamification.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {[
            { id: 'achievements', label: t('gamification.achievements'), icon: Award },
            { id: 'leaderboard', label: t('gamification.leaderboard'), icon: Crown },
            { id: 'challenges', label: t('gamification.challenges'), icon: Target }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Progress Overview */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('gamification.yourProgress')}</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{achievements.filter(a => a.earned).length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('gamification.achievementsEarned')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400">{user.total_xp}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('gamification.totalXP')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">{user.level}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('gamification.currentLevel')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{user.streak}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{t('gamification.dayStreak')}</div>
                  </div>
                </div>
              </div>

              {/* Achievements Grid */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('gamification.allAchievements')}</h3>
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-400">Loading achievements...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          achievement.earned 
                            ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)} shadow-lg`
                            : 'border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 opacity-60'
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: achievement.earned ? 1.05 : 1 }}
                      >
                        <div className="text-center">
                          <div className="text-4xl mb-3">{achievement.icon}</div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{achievement.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{achievement.description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              achievement.earned ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                            }`}>
                              {achievement.rarity}
                            </span>
                            <div className="flex items-center space-x-1 text-sm">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span className="font-medium">{achievement.xpReward} XP</span>
                            </div>
                          </div>

                          {achievement.earned && achievement.earned_at && (
                            <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                              Earned {new Date(achievement.earned_at).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="space-y-6">
              {/* Leaderboard Header */}
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('gamification.weeklyLeaderboard')}</h3>
                <p className="text-gray-600 dark:text-gray-400">Compete with learners worldwide</p>
              </div>

              {/* Top 3 Podium */}
              <div className="flex justify-center items-end space-x-4 mb-8">
                {mockLeaderboard.entries.slice(0, 3).map((entry, index) => (
                  <motion.div
                    key={entry.rank}
                    className={`text-center ${
                      index === 0 ? 'order-2' : index === 1 ? 'order-1' : 'order-3'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${
                      entry.rank === 1 ? 'from-amber-400 to-amber-600' :
                      entry.rank === 2 ? 'from-gray-300 to-gray-500' :
                      'from-amber-600 to-amber-800'
                    } flex items-center justify-center mb-3`}>
                      <span className="text-2xl">{entry.badge}</span>
                    </div>
                    <div className="font-semibold text-gray-900 dark:text-white">{entry.user.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{entry.score} XP</div>
                    <div className={`h-${index === 0 ? '24' : index === 1 ? '20' : '16'} w-16 bg-gradient-to-t ${
                      entry.rank === 1 ? 'from-amber-400 to-amber-300' :
                      entry.rank === 2 ? 'from-gray-400 to-gray-300' :
                      'from-amber-600 to-amber-500'
                    } rounded-t-lg mt-2 mx-auto`} />
                  </motion.div>
                ))}
              </div>

              {/* Full Leaderboard */}
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{t('gamification.fullRankings')}</h4>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-600">
                  {mockLeaderboard.entries.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      className={`flex items-center justify-between p-4 ${
                        entry.user.name === user.name ? 'bg-primary-50 dark:bg-primary-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 flex items-center justify-center">
                          {entry.rank <= 3 ? (
                            <span className="text-lg">{entry.badge}</span>
                          ) : (
                            <span className="font-semibold text-gray-600 dark:text-gray-400">#{entry.rank}</span>
                          )}
                        </div>
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary-600 dark:text-primary-400">
                            {entry.user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{entry.user.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{entry.score} XP</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getChangeIcon(entry.change)}
                        <span className={`text-sm ${
                          entry.change > 0 ? 'text-green-600 dark:text-green-400' :
                          entry.change < 0 ? 'text-red-600 dark:text-red-400' :
                          'text-gray-600 dark:text-gray-400'
                        }`}>
                          {entry.change !== 0 && (entry.change > 0 ? '+' : '')}{entry.change}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'challenges' && (
            <div className="space-y-6">
              {/* Active Challenges */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('gamification.activeChallenges')}</h3>
                <div className="space-y-4">
                  {mockChallenges.map((challenge, index) => (
                    <motion.div
                      key={challenge.id}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        challenge.completed 
                          ? 'border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-900/20'
                          : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white">{challenge.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getChallengeTypeColor(challenge.type)}`}>
                              {challenge.type}
                            </span>
                            {challenge.completed && (
                              <span className="px-2 py-1 bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300 text-xs rounded-full">
                                {t('gamification.completed')}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{challenge.description}</p>
                          
                          <div className="space-y-1 mb-4">
                            {challenge.requirements.map((req, i) => (
                              <div key={i} className="flex items-center space-x-2 text-sm">
                                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                  challenge.completed ? 'bg-secondary-500' : 'bg-gray-300 dark:bg-gray-600'
                                }`}>
                                  {challenge.completed && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-gray-700 dark:text-gray-300">{req}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Ends {challenge.endDate.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>{challenge.participants} participants</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-amber-500" />
                              <span>{challenge.xpReward} XP</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-4">
                          {challenge.completed ? (
                            <div className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400">
                              <Trophy className="w-5 h-5" />
                              <span className="font-medium">{t('gamification.completed')}!</span>
                            </div>
                          ) : (
                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                              {t('gamification.joinChallenge')}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}