import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  BookOpen, 
  ExternalLink, 
  Star, 
  Clock, 
  Eye,
  Filter,
  Search,
  Bookmark,
  BookmarkCheck,
  X
} from 'lucide-react';
import { LearningFeed as LearningFeedType } from '../types';
import { useTranslation } from '../utils/translations';

interface LearningFeedProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function LearningFeed({ isOpen, onClose, currentLanguage = 'en' }: LearningFeedProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const t = useTranslation(currentLanguage);

  const mockFeedItems: LearningFeedType[] = [
    {
      id: '1',
      title: 'Complete React Course 2024 - From Zero to Hero',
      description: 'Master React with hooks, context, and modern patterns. Build 5 real projects.',
      type: 'course',
      url: 'https://youtube.com/watch?v=example1',
      thumbnailUrl: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?w=400',
      provider: 'FreeCodeCamp',
      careerTracks: ['Frontend Developer'],
      difficulty: 'intermediate',
      duration: 480,
      rating: 4.8,
      views: 125000,
      tags: ['React', 'JavaScript', 'Hooks', 'Context'],
      featured: true
    },
    {
      id: '2',
      title: 'Python Data Science Handbook',
      description: 'Essential tools for working with data in Python: NumPy, Pandas, Matplotlib, and Scikit-Learn.',
      type: 'article',
      url: 'https://jakevdp.github.io/PythonDataScienceHandbook/',
      provider: 'Jake VanderPlas',
      careerTracks: ['Data Scientist'],
      difficulty: 'intermediate',
      rating: 4.9,
      views: 89000,
      tags: ['Python', 'Data Science', 'NumPy', 'Pandas'],
      featured: false
    },
    {
      id: '3',
      title: 'Building REST APIs with Node.js and Express',
      description: 'Learn to build scalable REST APIs with authentication, validation, and database integration.',
      type: 'tutorial',
      url: 'https://youtube.com/watch?v=example3',
      thumbnailUrl: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?w=400',
      provider: 'Traversy Media',
      careerTracks: ['Backend Developer', 'Full Stack Developer'],
      difficulty: 'intermediate',
      duration: 180,
      rating: 4.7,
      views: 67000,
      tags: ['Node.js', 'Express', 'REST API', 'MongoDB'],
      featured: true
    },
    {
      id: '4',
      title: 'Figma for Developers',
      description: 'Bridge the gap between design and development with Figma skills every developer needs.',
      type: 'video',
      url: 'https://youtube.com/watch?v=example4',
      thumbnailUrl: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?w=400',
      provider: 'Design Course',
      careerTracks: ['Frontend Developer', 'UX/UI Designer'],
      difficulty: 'beginner',
      duration: 90,
      rating: 4.6,
      views: 45000,
      tags: ['Figma', 'Design', 'UI/UX', 'Prototyping'],
      featured: false
    },
    {
      id: '5',
      title: 'Machine Learning Crash Course',
      description: 'Google\'s fast-paced, practical introduction to machine learning with TensorFlow APIs.',
      type: 'course',
      url: 'https://developers.google.com/machine-learning/crash-course',
      provider: 'Google',
      careerTracks: ['Data Scientist', 'AI Engineer'],
      difficulty: 'intermediate',
      duration: 900,
      rating: 4.8,
      views: 234000,
      tags: ['Machine Learning', 'TensorFlow', 'Python', 'AI'],
      featured: true
    },
    {
      id: '6',
      title: 'CSS Grid Complete Guide',
      description: 'Sell website templates, UI components, and code snippets',
      type: 'tutorial',
      url: 'https://css-tricks.com/snippets/css/complete-guide-grid/',
      provider: 'CSS-Tricks',
      careerTracks: ['Frontend Developer', 'UX/UI Designer'],
      difficulty: 'intermediate',
      rating: 4.7,
      views: 156000,
      tags: ['CSS', 'Grid', 'Layout', 'Responsive'],
      featured: false
    }
  ];

  const filters = [
    { id: 'all', name: t('learningFeed.allContent'), count: mockFeedItems.length },
    { id: 'video', name: t('learningFeed.videos'), count: mockFeedItems.filter(i => i.type === 'video').length },
    { id: 'course', name: t('learningFeed.courses'), count: mockFeedItems.filter(i => i.type === 'course').length },
    { id: 'tutorial', name: t('learningFeed.tutorials'), count: mockFeedItems.filter(i => i.type === 'tutorial').length },
    { id: 'article', name: t('learningFeed.articles'), count: mockFeedItems.filter(i => i.type === 'article').length }
  ];

  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];

  const filteredItems = mockFeedItems.filter(item => {
    const matchesFilter = selectedFilter === 'all' || item.type === selectedFilter;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const toggleBookmark = (itemId: string) => {
    setBookmarkedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleViewClick = (item: LearningFeedType) => {
    // Always redirect to the specified YouTube video regardless of the item's URL
    window.open('https://youtu.be/pKd0Rpw7O48?si=ZcGJOGzKHebi9HVd', '_blank');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'course': return BookOpen;
      case 'tutorial': return Play;
      case 'article': return BookOpen;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      case 'course': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'tutorial': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'article': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'intermediate': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'advanced': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col transition-colors"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('learningFeed.title')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('learningFeed.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('learningFeed.searchContent')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Content Type Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('learningFeed.contentType')}</h3>
                <div className="space-y-1">
                  {filters.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedFilter(filter.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedFilter === filter.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-sm">{filter.name}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                        {filter.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookmarks */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('learningFeed.bookmarks')}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {bookmarkedItems.size} {t('learningFeed.itemsSaved')}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('learningFeed.popularTags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Python', 'JavaScript', 'CSS', 'Node.js', 'AI'].map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* Featured Content */}
              {filteredItems.some(item => item.featured) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('learningFeed.featuredContent')}</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredItems.filter(item => item.featured).slice(0, 2).map((item, index) => {
                      const TypeIcon = getTypeIcon(item.type);
                      const isBookmarked = bookmarkedItems.has(item.id);

                      return (
                        <motion.div
                          key={item.id}
                          className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 rounded-xl overflow-hidden"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          {item.thumbnailUrl && (
                            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
                              <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute top-3 left-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(item.type)}`}>
                                  {item.type}
                                </span>
                              </div>
                              <div className="absolute top-3 right-3">
                                <button
                                  onClick={() => toggleBookmark(item.id)}
                                  className="p-2 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 rounded-full hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all"
                                >
                                  {isBookmarked ? (
                                    <BookmarkCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                  ) : (
                                    <Bookmark className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                  )}
                                </button>
                              </div>
                              {item.duration && (
                                <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                  {formatDuration(item.duration)}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{item.title}</h4>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-amber-400" />
                                  <span>{item.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{(item.views / 1000).toFixed(0)}k</span>
                                </div>
                              </div>
                              <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                                {item.difficulty}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600 dark:text-gray-400">{item.provider}</span>
                              <button
                                onClick={() => handleViewClick(item)}
                                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                              >
                                <TypeIcon className="w-4 h-4" />
                                <span>{t('learningFeed.view')}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* All Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('learningFeed.allContent')}</h3>
                <div className="space-y-4">
                  {filteredItems.map((item, index) => {
                    const TypeIcon = getTypeIcon(item.type);
                    const isBookmarked = bookmarkedItems.has(item.id);

                    return (
                      <motion.div
                        key={item.id}
                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="flex items-start space-x-4">
                          {item.thumbnailUrl && (
                            <div className="relative w-32 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item.thumbnailUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                              {item.duration && (
                                <div className="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white px-1 py-0.5 rounded text-xs">
                                  {formatDuration(item.duration)}
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{item.title}</h4>
                              <button
                                onClick={() => toggleBookmark(item.id)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors ml-2"
                              >
                                {isBookmarked ? (
                                  <BookmarkCheck className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                                ) : (
                                  <Bookmark className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                )}
                              </button>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(item.type)}`}>
                                  {item.type}
                                </span>
                                <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(item.difficulty)}`}>
                                  {item.difficulty}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-amber-400" />
                                  <span>{item.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{(item.views / 1000).toFixed(0)}k</span>
                                </div>
                                <span>{item.provider}</span>
                              </div>
                              <button
                                onClick={() => handleViewClick(item)}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                              >
                                <TypeIcon className="w-3 h-3" />
                                <span>{t('learningFeed.view')}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-1 mt-3">
                              {item.tags.slice(0, 4).map((tag, i) => (
                                <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}