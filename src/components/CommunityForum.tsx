import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  CheckCircle,
  User,
  Clock,
  Tag,
  TrendingUp,
  Users,
  X
} from 'lucide-react';
import { ForumPost, ForumReply } from '../types';
import { useTranslation } from '../utils/translations';

interface CommunityForumProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function CommunityForum({ isOpen, onClose, currentLanguage = 'en' }: CommunityForumProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const t = useTranslation(currentLanguage);

  const categories = [
    { id: 'all', name: t('community.allPosts'), count: 156 },
    { id: 'frontend', name: 'Frontend', count: 45 },
    { id: 'backend', name: 'Backend', count: 32 },
    { id: 'data-science', name: 'Data Science', count: 28 },
    { id: 'career', name: 'Career Advice', count: 51 }
  ];

  const mockPosts: ForumPost[] = [
    {
      id: '1',
      title: 'How to handle state management in large React applications?',
      content: 'I\'m working on a complex React app and struggling with state management. Should I use Redux, Zustand, or Context API?',
      author: {
        id: '1',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        careerPath: 'Frontend Developer',
        level: 3,
        xp: 150,
        totalXp: 450,
        streak: 5,
        completedLessons: 12,
        certificates: [],
        joinedAt: new Date(),
        language: 'en'
      },
      careerTrack: 'Frontend Developer',
      tags: ['React', 'State Management', 'Redux'],
      likes: 24,
      replies: [],
      createdAt: new Date('2024-01-15'),
      solved: false,
      views: 0,
      pinned: false
    },
    {
      id: '2',
      title: 'Best practices for API design in Node.js',
      content: 'What are the current best practices for designing RESTful APIs in Node.js? Looking for advice on structure, error handling, and authentication.',
      author: {
        id: '2',
        name: 'Marcus Johnson',
        email: 'marcus@example.com',
        careerPath: 'Backend Developer',
        level: 4,
        xp: 200,
        totalXp: 600,
        streak: 12,
        completedLessons: 18,
        certificates: [],
        joinedAt: new Date(),
        language: 'en'
      },
      careerTrack: 'Backend Developer',
      tags: ['Node.js', 'API', 'REST'],
      likes: 18,
      replies: [],
      createdAt: new Date('2024-01-14'),
      solved: true,
      views: 0,
      pinned: false
    }
  ];

  const [posts, setPosts] = useState<ForumPost[]>(mockPosts);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.careerTrack.toLowerCase().includes(selectedCategory.replace('-', ' '));
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
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
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-primary-500 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('community.title')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('community.subtitle')}</p>
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
            <button
              className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 mb-6"
            >
              <Plus className="w-4 h-4" />
              <span>{t('community.newPost')}</span>
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('community.categories')}</h3>
                <div className="space-y-1">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('community.popularTags')}</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'JavaScript', 'Python', 'Node.js', 'Career'].map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t('community.searchPosts')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <Filter className="w-4 h-4" />
                  <span>{t('community.filter')}</span>
                </button>
              </div>
            </div>

            {/* Posts List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {filteredPosts.map(post => (
                  <motion.div
                    key={post.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{post.author.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{post.author.careerPath}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{post.createdAt.toLocaleDateString()}</span>
                        {post.solved && (
                          <CheckCircle className="w-4 h-4 text-secondary-500" />
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{post.content}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike(post.id);
                          }}
                          className="flex items-center space-x-1 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <Heart className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.replies.length}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}