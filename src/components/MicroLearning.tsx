import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  Clock, 
  Star, 
  BookOpen,
  Code,
  FileText,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  X
} from 'lucide-react';
import { Lesson, StudySession } from '../types';
import { useTranslation } from '../utils/translations';

interface MicroLearningProps {
  lesson: Lesson;
  onComplete: (xpEarned: number) => void;
  onClose: () => void;
  currentLanguage?: string;
}

export default function MicroLearning({ lesson, onComplete, onClose, currentLanguage = 'en' }: MicroLearningProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(new Date());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [showResults, setShowResults] = useState(false);
  const t = useTranslation(currentLanguage);

  const steps = [
    { type: 'intro', title: t('microLearning.introduction') },
    { type: 'content', title: t('microLearning.mainContent') },
    { type: 'practice', title: t('microLearning.practice') },
    { type: 'quiz', title: t('microLearning.quiz') },
    { type: 'summary', title: t('microLearning.summary') }
  ];

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isPlaying]);

  const handleComplete = () => {
    const studyTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60);
    const xpEarned = lesson.xpReward + (studyTime > 10 ? 10 : 0); // Bonus for focused study
    onComplete(xpEarned);
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'intro':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{lesson.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This micro-lesson will teach you the fundamentals in just {lesson.duration} minutes.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>{lesson.duration} {t('common.minutes')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4" />
                <span>{lesson.xpReward} XP</span>
              </div>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('microLearning.mainContent')}</h3>
            </div>
            
            {lesson.type === 'video' && (
              <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Play className="w-8 h-8 text-white ml-1" />
                  )}
                </button>
              </div>
            )}

            {lesson.type === 'article' && (
              <div className="prose max-w-none dark:prose-invert">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  This is where the main lesson content would be displayed. In a real implementation,
                  this would contain the actual educational content, formatted text, images, and
                  interactive elements to help users learn effectively.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Key Takeaway</h4>
                  <p className="text-blue-800 dark:text-blue-200">
                    Remember to practice what you learn and apply it to real projects for better retention.
                  </p>
                </div>
              </div>
            )}

            {lesson.type === 'interactive' && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Interactive Exercise</h4>
                </div>
                <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                  <div>// Try this interactive coding exercise</div>
                  <div>function greetUser(name) {'{'}</div>
                  <div className="ml-4">return `Hello, ${'{name}'}!`;</div>
                  <div>{'}'}</div>
                  <div className="mt-2 text-yellow-400">// Your turn: call the function</div>
                  <input 
                    type="text" 
                    placeholder="greetUser('Your Name')"
                    className="bg-gray-800 text-white p-2 rounded mt-2 w-full"
                  />
                </div>
              </div>
            )}

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        );

      case 'practice':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('microLearning.practice')}</h3>
              <p className="text-gray-600 dark:text-gray-300">Apply what you've learned with this hands-on exercise.</p>
            </div>
            
            <div className="bg-gradient-to-br from-accent-50 to-primary-50 dark:from-accent-900/20 dark:to-primary-900/20 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Exercise: Build a Simple Component</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Create a basic React component that displays a greeting message. Use the concepts
                you just learned in the previous section.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary-500" />
                  <span className="text-gray-700 dark:text-gray-300">Create a functional component</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary-500" />
                  <span className="text-gray-700 dark:text-gray-300">Add props for customization</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-secondary-500" />
                  <span className="text-gray-700 dark:text-gray-300">Style with CSS classes</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t('microLearning.quiz')}</h3>
              <p className="text-gray-600 dark:text-gray-300">Test your understanding with these quick questions.</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Question 1: What is the main benefit of micro-learning?
                </h4>
                <div className="space-y-2">
                  {[
                    'Better retention through spaced repetition',
                    'Faster completion times',
                    'Less content to remember',
                    'Easier to create'
                  ].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setQuizAnswers({ ...quizAnswers, q1: option })}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        quizAnswers.q1 === option
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Question 2: How long should a micro-lesson typically be?
                </h4>
                <div className="space-y-2">
                  {[
                    '5-15 minutes',
                    '30-45 minutes',
                    '1-2 hours',
                    'As long as needed'
                  ].map((option, index) => (
                    <button
                      key={index}
                      onClick={() => setQuizAnswers({ ...quizAnswers, q2: option })}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        quizAnswers.q2 === option
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('microLearning.lessonComplete')}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Great job! You've successfully completed this micro-lesson.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-secondary-50 to-accent-50 dark:from-secondary-900/20 dark:to-accent-900/20 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('microLearning.whatYouLearned')}</h3>
              <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Core concepts and fundamentals</li>
                <li>• Practical application techniques</li>
                <li>• Best practices and common patterns</li>
                <li>• Real-world implementation examples</li>
              </ul>
            </div>

            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2 text-secondary-600 dark:text-secondary-400">
                <Star className="w-4 h-4" />
                <span>+{lesson.xpReward} XP Earned</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>Study Time: {Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60)} min</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col transition-colors"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    index === currentStep
                      ? 'bg-primary-600 text-white'
                      : index < currentStep
                      ? 'bg-secondary-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {index < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
              ))}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">{steps[currentStep].title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step {currentStep + 1} of {steps.length}</p>
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
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex items-center justify-center"
            >
              <div className="w-full max-w-2xl">
                {renderStep()}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('quiz.previous')}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentStep(0)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              title="Restart lesson"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
            >
              <Award className="w-4 h-4" />
              <span>{t('microLearning.completeLesson')}</span>
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <span>{t('quiz.next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}