import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Clock,
  Star,
  Calendar,
  Eye,
  X
} from 'lucide-react';
import { PersonalizedVideo, User } from '../types';
import { useTranslation } from '../utils/translations';

interface PersonalizedVideosProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function PersonalizedVideos({ user, isOpen, onClose, currentLanguage = 'en' }: PersonalizedVideosProps) {
  const [selectedVideo, setSelectedVideo] = useState<PersonalizedVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const t = useTranslation(currentLanguage);

  const mockVideos: PersonalizedVideo[] = [
    {
      id: '1',
      userId: user.id,
      type: 'motivation',
      title: `Keep Going, ${user.name}! You're Making Great Progress`,
      description: 'A personalized motivation message based on your recent achievements',
      videoUrl: 'https://example.com/video1.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400',
      createdAt: new Date('2024-02-14'),
      watched: false,
      duration: 120,
      personalizedElements: ['User name', 'Recent achievements', 'Current level', 'Learning streak']
    },
    {
      id: '2',
      userId: user.id,
      type: 'progress',
      title: 'Your Weekly Progress Report',
      description: 'See how much you\'ve accomplished this week and what\'s next',
      videoUrl: 'https://example.com/video2.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?w=400',
      createdAt: new Date('2024-02-12'),
      watched: true,
      duration: 180,
      personalizedElements: ['Weekly stats', 'Completed lessons', 'XP earned', 'Next milestones']
    },
    {
      id: '3',
      userId: user.id,
      type: 'milestone',
      title: 'Congratulations on Reaching Level 3!',
      description: 'Celebrate your achievement and discover what unlocks next',
      videoUrl: 'https://example.com/video3.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=400',
      createdAt: new Date('2024-02-10'),
      watched: true,
      duration: 90,
      personalizedElements: ['Level achievement', 'Unlocked content', 'Personal stats', 'Next goals']
    },
    {
      id: '4',
      userId: user.id,
      type: 'reminder',
      title: 'Don\'t Break Your Streak!',
      description: 'A gentle reminder to keep your learning momentum going',
      videoUrl: 'https://example.com/video4.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?w=400',
      createdAt: new Date('2024-02-13'),
      watched: false,
      duration: 60,
      personalizedElements: ['Current streak', 'Learning schedule', 'Recommended lessons', 'Motivation']
    },
    {
      id: '5',
      userId: user.id,
      type: 'celebration',
      title: 'Amazing! You Completed Your First Project',
      description: 'Celebrate your first project completion and see what\'s possible next',
      videoUrl: 'https://example.com/video5.mp4',
      thumbnailUrl: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?w=400',
      createdAt: new Date('2024-02-08'),
      watched: true,
      duration: 150,
      personalizedElements: ['Project details', 'Skills learned', 'Portfolio addition', 'Next projects']
    }
  ];

  const getVideoTypeColor = (type: string) => {
    switch (type) {
      case 'motivation': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'progress': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'milestone': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'reminder': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'celebration': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const markAsWatched = (videoId: string) => {
    // In a real app, this would update the backend
    console.log(`Marking video ${videoId} as watched`);
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
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <Play className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('personalVideos.title')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('personalVideos.subtitle')}</p>
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
          {/* Video List */}
          <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('personalVideos.recentVideos')}</h3>
              <div className="space-y-3">
                {mockVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedVideo?.id === video.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setSelectedVideo(video)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative flex-shrink-0">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 rounded flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                        {!video.watched && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2 mb-1">
                          {video.title}
                        </h4>
                        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                          <span className={`px-2 py-1 rounded-full ${getVideoTypeColor(video.type)}`}>
                            {video.type}
                          </span>
                          <span>{formatDuration(video.duration)}</span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{video.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 flex flex-col">
            {selectedVideo ? (
              <>
                {/* Video Area */}
                <div className="flex-1 bg-black relative">
                  <img
                    src={selectedVideo.thumbnailUrl}
                    alt={selectedVideo.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Video Controls Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <button
                      onClick={() => {
                        setIsPlaying(!isPlaying);
                        if (!selectedVideo.watched) {
                          markAsWatched(selectedVideo.id);
                        }
                      }}
                      className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                    >
                      {isPlaying ? (
                        <Pause className="w-8 h-8 text-white" />
                      ) : (
                        <Play className="w-8 h-8 text-white ml-1" />
                      )}
                    </button>
                  </div>

                  {/* Bottom Controls */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
                        >
                          {isMuted ? (
                            <VolumeX className="w-5 h-5" />
                          ) : (
                            <Volume2 className="w-5 h-5" />
                          )}
                        </button>
                        <div className="flex items-center space-x-2 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(selectedVideo.duration)}</span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded">
                        <Maximize className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedVideo.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedVideo.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>Created {selectedVideo.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(selectedVideo.duration)}</span>
                        </div>
                        <span className={`px-2 py-1 rounded-full ${getVideoTypeColor(selectedVideo.type)}`}>
                          {selectedVideo.type}
                        </span>
                      </div>
                    </div>
                    
                    {!selectedVideo.watched && (
                      <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        <span className="text-sm font-medium">New</span>
                      </div>
                    )}
                  </div>

                  {/* Personalization Details */}
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t('gamification.personalizedForYou')}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {t('personalVideos.createdFor')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {selectedVideo.personalizedElements.map((element, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full"
                        >
                          {element}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <h3 className="text-lg font-medium mb-2">{t('personalVideos.selectVideo')}</h3>
                  <p className="text-gray-400 dark:text-gray-500">{t('personalVideos.chooseFromCollection')}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}