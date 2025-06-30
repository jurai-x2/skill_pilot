import React, { useState, useEffect } from 'react';
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
  X,
  Send,
  Loader
} from 'lucide-react';
import { ForumPost, ForumReply } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/supabase';

interface CommunityForumProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function CommunityForum({ isOpen, onClose, currentLanguage = 'en' }: CommunityForumProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    careerTrack: '',
    tags: [] as string[]
  });
  const { user } = useAuth();
  const t = useTranslation(currentLanguage);

  const categories = [
    { id: 'all', name: t('community.allPosts'), count: 0 },
    { id: 'frontend', name: 'Frontend', count: 0 },
    { id: 'backend', name: 'Backend', count: 0 },
    { id: 'data-science', name: 'Data Science', count: 0 },
    { id: 'career', name: 'Career Advice', count: 0 }
  ];

  useEffect(() => {
    if (isOpen) {
      loadPosts();
    }
  }, [isOpen, selectedCategory]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getForumPosts(
        selectedCategory === 'all' ? undefined : selectedCategory,
        20
      );

      if (error) {
        console.error('❌ Error loading forum posts:', error);
        return;
      }

      if (data) {
        // Transform data to match our ForumPost interface
        const transformedPosts: ForumPost[] = data.map(post => ({
          id: post.id,
          title: post.title,
          content: post.content,
          author: {
            id: post.users?.id || post.user_id || '',
            name: post.users?.name || 'Anonymous',
            email: post.users?.email || '',
            careerPath: post.users?.career_path || '',
            level: 1,
            xp: 0,
            total_xp: 0,
            streak: 0,
            completed_lessons: 0,
            certificates: [],
            joined_at: new Date().toISOString(),
            language: 'en'
          },
          careerTrack: post.career_track,
          tags: post.tags || [],
          likes: post.likes || 0,
          replies: [], // We'll load replies separately if needed
          createdAt: new Date(post.created_at),
          solved: post.solved || false,
          views: post.views || 0,
          pinned: post.pinned || false
        }));

        setPosts(transformedPosts);
      }
    } catch (err: any) {
      console.error('❌ Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const { data, error } = await db.createForumPost(user.id, {
        title: newPost.title,
        content: newPost.content,
        careerTrack: newPost.careerTrack || user.careerPath || 'General',
        tags: newPost.tags
      });

      if (error) {
        console.error('❌ Error creating post:', error);
        return;
      }

      if (data) {
        // Add the new post to the list
        const newForumPost: ForumPost = {
          id: data.id,
          title: data.title,
          content: data.content,
          author: user,
          careerTrack: data.career_track,
          tags: data.tags || [],
          likes: 0,
          replies: [],
          createdAt: new Date(data.created_at),
          solved: false,
          views: 0,
          pinned: false
        };

        setPosts(prev => [newForumPost, ...prev]);
        setNewPost({ title: '', content: '', careerTrack: '', tags: [] });
        setShowNewPost(false);
      }
    } catch (err: any) {
      console.error('❌ Error creating post:', err);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const { error } = await db.likeForumPost(postId);
      if (error) {
        console.error('❌ Error liking post:', error);
        return;
      }

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    } catch (err: any) {
      console.error('❌ Error liking post:', err);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || 
      post.careerTrack.toLowerCase().includes(selectedCategory.replace('-', ' '));
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            {user && (
              <button
                onClick={() => setShowNewPost(true)}
                className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 mb-6"
              >
                <Plus className="w-4 h-4" />
                <span>{t('community.newPost')}</span>
              </button>
            )}

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
                        {category.id === 'all' ? posts.length : posts.filter(p => p.careerTrack.toLowerCase().includes(category.id.replace('-', ' '))).length}
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
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
                  </div>
                </div>
              ) : (
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

                  {filteredPosts.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {searchQuery ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* New Post Modal */}
        {showNewPost && user && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Post</h3>
                <button
                  onClick={() => setShowNewPost(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    placeholder="What's your question or topic?"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Content</label>
                  <textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                    placeholder="Describe your question or share your thoughts..."
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    rows={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Career Track</label>
                  <select
                    value={newPost.careerTrack}
                    onChange={(e) => setNewPost({ ...newPost, careerTrack: e.target.value })}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a category</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Career Advice">Career Advice</option>
                    <option value="General">General</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.title.trim() || !newPost.content.trim()}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    <span>Post</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}