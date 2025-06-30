import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Circle, 
  Lock, 
  Play, 
  BookOpen, 
  Code, 
  Award,
  Clock,
  Star,
  ArrowRight,
  Loader
} from 'lucide-react';
import { RoadmapStage, Project, Lesson } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/supabase';

interface RoadmapProps {
  careerPath: string;
  currentLanguage: string;
}

export default function Roadmap({ careerPath, currentLanguage }: RoadmapProps) {
  const [stages, setStages] = useState<RoadmapStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const t = useTranslation(currentLanguage);

  useEffect(() => {
    const loadRoadmap = async () => {
      if (!user) return;

      try {
        setLoading(true);
        console.log('📊 Loading roadmap for user:', user.id, 'career:', careerPath);

        const { data: existingStages, error: fetchError } = await db.getRoadmapStages(user.id);

        if (fetchError) {
          console.error('❌ Error fetching roadmap stages:', fetchError);
          setError('Failed to load roadmap');
          return;
        }

        // If no stages exist, create them
        if (!existingStages || existingStages.length === 0) {
          console.log('📝 Creating new roadmap stages for:', careerPath);
          const { data: newStages, error: createError } = await db.createRoadmapStages(user.id, careerPath);
          
          if (createError) {
            console.error('❌ Error creating roadmap stages:', createError);
            setError('Failed to create roadmap');
            return;
          }

          if (newStages) {
            setStages(newStages);
          }
        } else {
          console.log('✅ Loaded existing roadmap stages:', existingStages.length);
          setStages(existingStages);
        }
      } catch (err: any) {
        console.error('❌ Roadmap loading error:', err);
        setError('Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, [user, careerPath]);

  const handleLessonComplete = async (lessonId: string, xpReward: number) => {
    try {
      const { error } = await db.updateLessonProgress(lessonId, true, xpReward);
      if (error) {
        console.error('❌ Error updating lesson progress:', error);
        return;
      }

      // Update local state
      setStages(prev => prev.map(stage => ({
        ...stage,
        lessons: stage.lessons.map(lesson => 
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
      })));

      // Update user XP locally (will be synced with server)
      if (user) {
        // This would trigger a user profile refresh in a real app
        console.log('✅ Lesson completed, XP earned:', xpReward);
      }
    } catch (err: any) {
      console.error('❌ Error completing lesson:', err);
    }
  };

  const handleProjectComplete = async (projectId: string) => {
    try {
      const { error } = await db.updateProjectProgress(projectId, true);
      if (error) {
        console.error('❌ Error updating project progress:', error);
        return;
      }

      // Update local state
      setStages(prev => prev.map(stage => ({
        ...stage,
        projects: stage.projects.map(project => 
          project.id === projectId ? { ...project, completed: true } : project
        )
      })));

      console.log('✅ Project completed');
    } catch (err: any) {
      console.error('❌ Error completing project:', err);
    }
  };

  const getStageStatus = (stage: RoadmapStage, index: number) => {
    if (stage.completed) return 'completed';
    if (stage.unlocked) return 'current';
    return 'locked';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
      case 'intermediate': return 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30';
      case 'advanced': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700';
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return Play;
      case 'interactive': return Code;
      case 'article': return BookOpen;
      default: return BookOpen;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Loading your personalized roadmap...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Unable to Load Roadmap</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const completedStages = stages.filter(stage => stage.completed).length;
  const totalStages = stages.length;
  const overallProgress = totalStages > 0 ? (completedStages / totalStages) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {careerPath} {t('roadmap.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {t('roadmap.subtitle')} {careerPath.toLowerCase()}
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('roadmap.overallProgress')}</h2>
            <span className="text-primary-600 dark:text-primary-400 font-semibold">
              {Math.round(overallProgress)}% {t('quiz.complete')}
            </span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: '0%' }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{completedStages} {t('roadmap.of')} {totalStages} {t('roadmap.stagesCompleted')}</span>
            <span>{t('roadmap.estimatedCompletion')}: {Math.max(1, Math.ceil((totalStages - completedStages) * 2))} {t('roadmap.months')}</span>
          </div>
        </motion.div>

        {/* Roadmap Stages */}
        <div className="space-y-8">
          {stages.map((stage, stageIndex) => {
            const status = getStageStatus(stage, stageIndex);
            
            return (
              <motion.div
                key={stage.id}
                className={`relative ${stageIndex < stages.length - 1 ? 'pb-8' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + stageIndex * 0.1 }}
              >
                {/* Connecting Line */}
                {stageIndex < stages.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-full bg-gray-200 dark:bg-gray-700 z-0" />
                )}

                <div className="relative z-10">
                  {/* Stage Header */}
                  <div className="flex items-start space-x-4 mb-6">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      status === 'completed' ? 'bg-secondary-500' :
                      status === 'current' ? 'bg-primary-500' :
                      'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle className="w-6 h-6 text-white" />
                      ) : status === 'current' ? (
                        <Circle className="w-6 h-6 text-white" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t('roadmap.stage')} {stageIndex + 1}: {stage.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{stage.description}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-3 py-1 rounded-full font-medium ${
                          status === 'completed' ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300' :
                          status === 'current' ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' :
                          'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {status === 'completed' ? t('roadmap.completed') :
                           status === 'current' ? t('roadmap.inProgress') :
                           t('roadmap.locked')}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {stage.lessons?.length || 0} {t('roadmap.lessons')} • {stage.projects?.length || 0} {t('roadmap.project')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage Content */}
                  {status !== 'locked' && (
                    <div className="ml-16 space-y-6">
                      {/* Lessons */}
                      {stage.lessons && stage.lessons.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('roadmap.lessons')}</h4>
                          <div className="grid gap-3">
                            {stage.lessons.map((lesson, lessonIndex) => {
                              const LessonIcon = getLessonIcon(lesson.type);
                              return (
                                <motion.div
                                  key={lesson.id}
                                  className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${
                                    lesson.completed 
                                      ? 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-700' 
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                  }`}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.5 + lessonIndex * 0.1 }}
                                  whileHover={{ scale: 1.02 }}
                                >
                                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                    lesson.completed ? 'bg-secondary-500' : 'bg-primary-100 dark:bg-primary-900/30'
                                  }`}>
                                    {lesson.completed ? (
                                      <CheckCircle className="w-5 h-5 text-white" />
                                    ) : (
                                      <LessonIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-medium text-gray-900 dark:text-white">{lesson.title}</h5>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                      <span className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>{lesson.duration} {t('common.minutes')}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <Star className="w-4 h-4" />
                                        <span>{lesson.xpReward} XP</span>
                                      </span>
                                    </div>
                                  </div>
                                  {!lesson.completed && (
                                    <motion.button
                                      onClick={() => handleLessonComplete(lesson.id, lesson.xpReward)}
                                      className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
                                      whileHover={{ scale: 1.05 }}
                                    >
                                      <span>{t('roadmap.startLesson')}</span>
                                      <ArrowRight className="w-4 h-4" />
                                    </motion.button>
                                  )}
                                </motion.div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Projects */}
                      {stage.projects && stage.projects.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">{t('roadmap.projects')}</h4>
                          <div className="space-y-4">
                            {stage.projects.map((project, projectIndex) => (
                              <motion.div
                                key={project.id}
                                className={`p-6 rounded-xl border transition-all ${
                                  project.completed 
                                    ? 'bg-secondary-50 dark:bg-secondary-900/20 border-secondary-200 dark:border-secondary-700' 
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 + projectIndex * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                              >
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                      {project.title}
                                    </h5>
                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                                    
                                    <div className="flex items-center space-x-4 text-sm">
                                      <span className={`px-2 py-1 rounded-full font-medium ${getDifficultyColor(project.difficulty)}`}>
                                        {project.difficulty}
                                      </span>
                                      <span className="text-gray-600 dark:text-gray-400">
                                        {project.estimatedHours} {t('common.hours')}
                                      </span>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {project.technologies.map((tech) => (
                                        <span
                                          key={tech}
                                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div className="ml-4">
                                    {project.completed ? (
                                      <div className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-medium">{t('roadmap.completed')}</span>
                                      </div>
                                    ) : (
                                      <motion.button
                                        onClick={() => handleProjectComplete(project.id)}
                                        className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        {t('roadmap.startProject')}
                                      </motion.button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Completion Certificate Preview */}
        <motion.div
          className="mt-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Award className="w-16 h-16 mx-auto mb-4 opacity-80" />
          <h3 className="text-2xl font-bold mb-2">{t('roadmap.certificationAwaits')}</h3>
          <p className="text-primary-100 mb-4">
            {t('roadmap.certificationDescription')} {careerPath} {t('roadmap.certificate')}
          </p>
          <div className="text-sm text-primary-200">
            {t('roadmap.recognizedBy')}
          </div>
        </motion.div>
      </div>
    </div>
  );
}