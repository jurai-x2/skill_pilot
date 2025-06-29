import React from 'react';
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
  ArrowRight
} from 'lucide-react';
import { RoadmapStage, Project, Lesson } from '../types';
import { useTranslation } from '../utils/translations';

interface RoadmapProps {
  careerPath: string;
  currentLanguage: string;
}

export default function Roadmap({ careerPath, currentLanguage }: RoadmapProps) {
  const t = useTranslation(currentLanguage);

  // Mock roadmap data - in real app, this would come from API
  const stages: RoadmapStage[] = [
    {
      id: '1',
      title: 'Foundations',
      description: 'Master the basics of web development',
      completed: true,
      estimatedWeeks: 4,
      unlocked: true,
      xpRequired: 0,
      projects: [
        {
          id: 'p1',
          title: 'Personal Portfolio',
          description: 'Build a responsive portfolio website',
          difficulty: 'beginner',
          estimatedHours: 8,
          completed: true,
          technologies: ['HTML', 'CSS', 'JavaScript'],
          requirements: ['Create responsive layout', 'Add contact form', 'Deploy to hosting'],
          xpReward: 200,
          approved: true
        }
      ],
      lessons: [
        { id: 'l1', title: 'HTML Fundamentals', type: 'video', duration: 45, completed: true, xpReward: 50, resources: [] },
        { id: 'l2', title: 'CSS Styling', type: 'interactive', duration: 60, completed: true, xpReward: 75, resources: [] },
        { id: 'l3', title: 'JavaScript Basics', type: 'article', duration: 90, completed: true, xpReward: 100, resources: [] }
      ]
    },
    {
      id: '2',
      title: 'Frontend Frameworks',
      description: 'Learn modern frontend development with React',
      completed: false,
      estimatedWeeks: 6,
      unlocked: true,
      xpRequired: 500,
      projects: [
        {
          id: 'p2',
          title: 'Todo Application',
          description: 'Build a full-featured todo app with React',
          difficulty: 'intermediate',
          estimatedHours: 12,
          completed: false,
          technologies: ['React', 'JavaScript', 'CSS'],
          requirements: ['Use React hooks', 'Add local storage', 'Implement CRUD operations'],
          xpReward: 300,
          approved: false
        }
      ],
      lessons: [
        { id: 'l4', title: 'React Components', type: 'video', duration: 75, completed: true, xpReward: 100, resources: [] },
        { id: 'l5', title: 'State Management', type: 'interactive', duration: 90, completed: false, xpReward: 125, resources: [] },
        { id: 'l6', title: 'React Hooks', type: 'video', duration: 60, completed: false, xpReward: 100, resources: [] }
      ]
    },
    {
      id: '3',
      title: 'Advanced Concepts',
      description: 'Master advanced frontend patterns and tools',
      completed: false,
      estimatedWeeks: 8,
      unlocked: false,
      xpRequired: 1000,
      projects: [
        {
          id: 'p3',
          title: 'E-commerce Dashboard',
          description: 'Build a complex dashboard with data visualization',
          difficulty: 'advanced',
          estimatedHours: 20,
          completed: false,
          technologies: ['React', 'TypeScript', 'Chart.js', 'API Integration'],
          requirements: ['TypeScript implementation', 'Data visualization', 'API integration'],
          xpReward: 500,
          approved: false
        }
      ],
      lessons: [
        { id: 'l7', title: 'TypeScript Integration', type: 'video', duration: 120, completed: false, xpReward: 150, resources: [] },
        { id: 'l8', title: 'Performance Optimization', type: 'article', duration: 90, completed: false, xpReward: 125, resources: [] },
        { id: 'l9', title: 'Testing Strategies', type: 'interactive', duration: 105, completed: false, xpReward: 175, resources: [] }
      ]
    }
  ];

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
            <span className="text-primary-600 dark:text-primary-400 font-semibold">33% {t('quiz.complete')}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
              initial={{ width: '0%' }}
              animate={{ width: '33%' }}
              transition={{ duration: 1, delay: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-4 text-sm text-gray-600 dark:text-gray-400">
            <span>1 {t('roadmap.of')} 3 {t('roadmap.stagesCompleted')}</span>
            <span>{t('roadmap.estimatedCompletion')}: 2-3 {t('roadmap.months')}</span>
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
                          {stage.lessons.length} {t('roadmap.lessons')} • {stage.projects.length} {t('roadmap.project')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stage Content */}
                  {status !== 'locked' && (
                    <div className="ml-16 space-y-6">
                      {/* Lessons */}
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

                      {/* Projects */}
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