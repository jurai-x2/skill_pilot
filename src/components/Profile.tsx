import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User as UserIcon, 
  Mail, 
  MapPin, 
  Calendar, 
  Github, 
  Globe, 
  Edit, 
  Save, 
  X, 
  CheckCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Target,
  Zap,
  RefreshCw,
  Loader
} from 'lucide-react';
import { User } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/supabase';

interface ProfileProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function Profile({ isOpen, onClose, currentLanguage = 'en' }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showTrackChangeConfirm, setShowTrackChangeConfirm] = useState(false);
  const [newCareerPath, setNewCareerPath] = useState<string | null>(null);
  const [isChangingTrack, setIsChangingTrack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({});
  
  const { user, updateProfile } = useAuth();
  const t = useTranslation(currentLanguage);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        country: user.country || '',
        avatar_url: user.avatar_url || '',
        github_url: user.github_url || '',
        portfolio_url: user.portfolio_url || '',
        careerPath: user.careerPath || ''
      });
    }
  }, [user]);

  const careerPaths = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Mobile Developer',
    'DevOps Engineer',
    'Data Scientist',
    'UX/UI Designer',
    'Game Developer',
    'Blockchain Developer',
    'AI/ML Engineer'
  ];

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } else {
        setError(result.error?.message || 'Failed to update profile');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCareerPathChange = async () => {
    if (!user || !newCareerPath) return;
    
    setIsChangingTrack(true);
    setError(null);
    
    try {
      // 1. Delete existing roadmap
      const { error: deleteError } = await db.deleteUserRoadmap(user.id);
      
      if (deleteError) {
        throw new Error('Failed to reset roadmap: ' + deleteError.message);
      }
      
      // 2. Update user's career path
      const { error: updateError } = await db.updateUser(user.id, {
        career_path: newCareerPath
      });
      
      if (updateError) {
        throw new Error('Failed to update career path: ' + updateError.message);
      }
      
      // 3. Create new roadmap stages
      const { error: createError } = await db.createRoadmapStages(user.id, newCareerPath);
      
      if (createError) {
        throw new Error('Failed to create new roadmap: ' + createError.message);
      }
      
      // 4. Update local state
      setFormData(prev => ({ ...prev, careerPath: newCareerPath }));
      setSuccess('Career path changed successfully! Your roadmap has been updated.');
      
      // 5. Update user profile in auth context
      await updateProfile({ careerPath: newCareerPath });
      
      // Clear confirmation dialog
      setShowTrackChangeConfirm(false);
      setNewCareerPath(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to change career path');
    } finally {
      setIsChangingTrack(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col transition-colors"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Profile</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and manage your profile information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <p className="text-green-700 dark:text-green-300">{success}</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {/* Left Column - Profile Info */}
            <div className="md:col-span-2 space-y-8">
              {/* Profile Card */}
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 h-32 relative">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors disabled:opacity-50"
                      >
                        {isSaving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                      </button>
                    </div>
                  )}
                  
                  <div className="absolute -bottom-12 left-6">
                    <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-700 overflow-hidden bg-gray-200 dark:bg-gray-600">
                      {formData.avatar_url ? (
                        <img 
                          src={formData.avatar_url} 
                          alt={formData.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary-100 dark:bg-primary-900/30">
                          <span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                            {formData.name?.charAt(0).toUpperCase() || user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="pt-16 px-6 pb-6">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={formData.name || ''}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Country
                        </label>
                        <input
                          type="text"
                          value={formData.country || ''}
                          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Profile Photo URL
                        </label>
                        <input
                          type="url"
                          value={formData.avatar_url || ''}
                          onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          GitHub URL
                        </label>
                        <input
                          type="url"
                          value={formData.github_url || ''}
                          onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="https://github.com/username"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Portfolio URL
                        </label>
                        <input
                          type="url"
                          value={formData.portfolio_url || ''}
                          onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          placeholder="https://myportfolio.com"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {user.name}
                      </h3>
                      
                      <div className="space-y-3 text-gray-600 dark:text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4" />
                          <span>{user.email}</span>
                        </div>
                        
                        {user.country && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>{user.country}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {new Date(user.joined_at).toLocaleDateString()}</span>
                        </div>
                        
                        {user.github_url && (
                          <div className="flex items-center space-x-2">
                            <Github className="w-4 h-4" />
                            <a 
                              href={user.github_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              GitHub Profile
                            </a>
                          </div>
                        )}
                        
                        {user.portfolio_url && (
                          <div className="flex items-center space-x-2">
                            <Globe className="w-4 h-4" />
                            <a 
                              href={user.portfolio_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              Portfolio Website
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Career Path Section */}
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Career Path</h3>
                  <button
                    onClick={() => setShowTrackChangeConfirm(true)}
                    className="flex items-center space-x-2 px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Change Path</span>
                  </button>
                </div>
                
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-6 border border-primary-100 dark:border-primary-800/30">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {user.careerPath || 'No Career Path Selected'}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {user.careerPath 
                          ? 'Your personalized learning journey' 
                          : 'Take the career quiz to discover your path'}
                      </p>
                    </div>
                  </div>
                  
                  {user.careerPath && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Current Level</span>
                        <span className="font-semibold text-gray-900 dark:text-white">{user.level}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                          style={{ width: `${(user.xp / (user.level * 100)) * 100}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span>{user.xp} XP</span>
                        <span>{user.level * 100} XP needed for level {user.level + 1}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Right Column - Stats & Achievements */}
            <div className="space-y-8">
              {/* Stats Card */}
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Progress</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total XP</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{user.total_xp.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Lessons Completed</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{user.completed_lessons}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Certificates Earned</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{user.certificates.length}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Learning Streak</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">{user.streak} days</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account Settings */}
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      value={user.language}
                      disabled
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Change language from the main menu
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Weekly Learning Goal
                    </label>
                    <select
                      value={user.weekly_goal}
                      disabled
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white cursor-not-allowed"
                    >
                      <option value="5">5 hours/week</option>
                      <option value="10">10 hours/week</option>
                      <option value="15">15 hours/week</option>
                      <option value="20">20 hours/week</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Career Path Change Confirmation Modal */}
      {showTrackChangeConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Change Career Path</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Changing your career path will reset your current roadmap progress. All lessons and projects will be replaced with a new roadmap for your selected path.
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select New Career Path
              </label>
              <select
                value={newCareerPath || ''}
                onChange={(e) => setNewCareerPath(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="" disabled>Select a career path</option>
                {careerPaths.map(path => (
                  <option key={path} value={path} disabled={path === user?.careerPath}>
                    {path} {path === user?.careerPath ? '(Current)' : ''}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 mb-1">Warning</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    This action cannot be undone. Your current progress will be reset and a new learning path will be created.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowTrackChangeConfirm(false);
                  setNewCareerPath(null);
                }}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCareerPathChange}
                disabled={!newCareerPath || isChangingTrack || newCareerPath === user?.careerPath}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isChangingTrack ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Changing...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Change Path</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}