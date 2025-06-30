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
  X,
  XCircle,
  Lightbulb,
  Target,
  Zap
} from 'lucide-react';
import { Lesson, StudySession } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/supabase';

interface MicroLearningProps {
  lesson: Lesson;
  onComplete: (xpEarned: number) => void;
  onClose: () => void;
  currentLanguage?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ContentSection {
  type: 'paragraph' | 'heading' | 'keyTakeaway' | 'codeExample' | 'list';
  content: string;
  items?: string[];
}

export default function MicroLearning({ lesson, onComplete, onClose, currentLanguage = 'en' }: MicroLearningProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [startTime] = useState(new Date());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showQuizFeedback, setShowQuizFeedback] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const { user } = useAuth();
  const t = useTranslation(currentLanguage);

  const steps = [
    { type: 'intro', title: t('microLearning.introduction') },
    { type: 'content', title: t('microLearning.mainContent') },
    { type: 'practice', title: t('microLearning.practice') },
    { type: 'quiz', title: t('microLearning.quiz') },
    { type: 'summary', title: t('microLearning.summary') }
  ];

  // Mock quiz questions with immediate feedback
  const quizQuestions: QuizQuestion[] = [
    {
      id: 'q1',
      question: 'What is the main benefit of micro-learning?',
      options: [
        'Better retention through spaced repetition',
        'Faster completion times',
        'Less content to remember',
        'Easier to create'
      ],
      correctAnswer: 0,
      explanation: 'Micro-learning improves retention by breaking information into digestible chunks and allowing for spaced repetition, which strengthens memory formation.'
    },
    {
      id: 'q2',
      question: 'How long should a micro-lesson typically be?',
      options: [
        '5-15 minutes',
        '30-45 minutes',
        '1-2 hours',
        'As long as needed'
      ],
      correctAnswer: 0,
      explanation: 'Micro-lessons should be 5-15 minutes to maintain focus and fit into busy schedules while covering one specific learning objective.'
    }
  ];

  // Enhanced content structure for articles
  const parseContent = (content: string): ContentSection[] => {
    if (!content) return [];

    const sections: ContentSection[] = [];
    const lines = content.split('\n\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      if (trimmed.startsWith('# ')) {
        sections.push({
          type: 'heading',
          content: trimmed.substring(2)
        });
      } else if (trimmed.startsWith('KEY: ')) {
        sections.push({
          type: 'keyTakeaway',
          content: trimmed.substring(5)
        });
      } else if (trimmed.startsWith('CODE: ')) {
        sections.push({
          type: 'codeExample',
          content: trimmed.substring(6)
        });
      } else if (trimmed.startsWith('LIST: ')) {
        const items = trimmed.substring(6).split('|').map(item => item.trim());
        sections.push({
          type: 'list',
          content: 'Key Points:',
          items
        });
      } else {
        sections.push({
          type: 'paragraph',
          content: trimmed
        });
      }
    });

    return sections;
  };

  const enhancedContent = `# React Hooks Fundamentals

React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have revolutionized how we write React applications.

KEY: Hooks allow you to reuse stateful logic between components without changing your component hierarchy.

The most commonly used hooks are useState and useEffect. useState lets you add state to functional components, while useEffect lets you perform side effects.

CODE: const [count, setCount] = useState(0);

LIST: useState returns an array with two elements|The current state value|A function to update the state|You can call the setter function to trigger a re-render

Understanding hooks is essential for modern React development. They make components more readable and easier to test.

KEY: Always call hooks at the top level of your React function, never inside loops, conditions, or nested functions.`;

  const contentSections = parseContent(lesson.content || enhancedContent);

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

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
    setShowQuizFeedback(prev => ({ ...prev, [questionId]: true }));
    
    // Store the answer for final scoring
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const calculateQuizScore = () => {
    let correct = 0;
    quizQuestions.forEach(question => {
      if (quizAnswers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return (correct / quizQuestions.length) * 100;
  };

  const handleComplete = async () => {
    const studyTime = Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60);
    const quizScore = calculateQuizScore();
    
    // Calculate XP based on lesson completion and quiz performance
    let earnedXP = lesson.xpReward;
    if (quizScore >= 80) earnedXP += 20; // Bonus for good quiz performance
    if (studyTime <= lesson.duration) earnedXP += 10; // Bonus for efficient completion
    
    setXpEarned(earnedXP);
    
    // Update lesson completion in database if user is logged in
    if (user && lesson.id) {
      try {
        await db.updateLessonProgress(lesson.id, true, earnedXP);
        
        // Update user XP
        if (user) {
          await db.updateUser(user.id, {
            xp: user.xp + earnedXP,
            total_xp: user.total_xp + earnedXP,
            completed_lessons: user.completed_lessons + 1
          });
        }
      } catch (err) {
        console.error('❌ Error updating lesson progress:', err);
      }
    }
    
    onComplete(earnedXP);
  };

  const renderContentSection = (section: ContentSection, index: number) => {
    switch (section.type) {
      case 'heading':
        return (
          <motion.h3
            key={index}
            className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Target className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            <span>{section.content}</span>
          </motion.h3>
        );
      
      case 'keyTakeaway':
        return (
          <motion.div
            key={index}
            className="bg-gradient-to-r from-accent-50 to-secondary-50 dark:from-accent-900/20 dark:to-secondary-900/20 border-l-4 border-accent-500 p-4 rounded-lg mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-start space-x-3">
              <Lightbulb className="w-5 h-5 text-accent-600 dark:text-accent-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-accent-900 dark:text-accent-100 mb-1">Key Takeaway</h4>
                <p className="text-accent-800 dark:text-accent-200">{section.content}</p>
              </div>
            </div>
          </motion.div>
        );
      
      case 'codeExample':
        return (
          <motion.div
            key={index}
            className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Code className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Code Example</span>
            </div>
            <pre className="text-green-300 font-mono text-sm overflow-x-auto">
              <code>{section.content}</code>
            </pre>
          </motion.div>
        );
      
      case 'list':
        return (
          <motion.div
            key={index}
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{section.content}</h4>
            <ul className="space-y-2">
              {section.items?.map((item, itemIndex) => (
                <motion.li
                  key={itemIndex}
                  className="flex items-start space-x-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (index * 0.1) + (itemIndex * 0.05) }}
                >
                  <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        );
      
      default:
        return (
          <motion.p
            key={index}
            className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {section.content}
          </motion.p>
        );
    }
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.type) {
      case 'intro':
        return (
          <div className="text-center space-y-6">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <BookOpen className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{lesson.title}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                This micro-lesson will teach you the fundamentals in just {lesson.duration} minutes.
              </p>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Clock className="w-4 h-4" />
                <span>{lesson.duration} {t('common.minutes')}</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Star className="w-4 h-4" />
                <span>{lesson.xpReward} XP</span>
              </motion.div>
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
                {contentSections.map((section, index) => renderContentSection(section, index))}
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
                {[
                  'Create a functional component',
                  'Add props for customization',
                  'Style with CSS classes'
                ].map((task, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <CheckCircle className="w-5 h-5 text-secondary-500" />
                    <span className="text-gray-700 dark:text-gray-300">{task}</span>
                  </motion.div>
                ))}
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
            
            <div className="space-y-6">
              {quizQuestions.map((question, questionIndex) => {
                const selectedAnswer = selectedAnswers[question.id];
                const showFeedback = showQuizFeedback[question.id];
                const isCorrect = selectedAnswer === question.correctAnswer;

                return (
                  <motion.div
                    key={question.id}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: questionIndex * 0.2 }}
                  >
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">
                      Question {questionIndex + 1}: {question.question}
                    </h4>
                    
                    <div className="space-y-3 mb-4">
                      {question.options.map((option, optionIndex) => {
                        const isSelected = selectedAnswer === optionIndex;
                        const isCorrectOption = optionIndex === question.correctAnswer;
                        
                        let buttonClass = 'w-full text-left p-3 rounded-lg border-2 transition-all ';
                        
                        if (!showFeedback) {
                          buttonClass += isSelected 
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500';
                        } else {
                          if (isCorrectOption) {
                            buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300';
                          } else if (isSelected && !isCorrect) {
                            buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300';
                          } else {
                            buttonClass += 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400';
                          }
                        }

                        return (
                          <motion.button
                            key={optionIndex}
                            onClick={() => !showFeedback && handleQuizAnswer(question.id, optionIndex)}
                            className={buttonClass}
                            disabled={showFeedback}
                            whileHover={!showFeedback ? { scale: 1.02 } : {}}
                            whileTap={!showFeedback ? { scale: 0.98 } : {}}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {showFeedback && (
                                <div className="flex items-center space-x-2">
                                  {isCorrectOption && (
                                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                                  )}
                                  {isSelected && !isCorrect && (
                                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Immediate Feedback */}
                    <AnimatePresence>
                      {showFeedback && (
                        <motion.div
                          className={`p-4 rounded-lg border-l-4 ${
                            isCorrect 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
                              : 'bg-red-50 dark:bg-red-900/20 border-red-500'
                          }`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="flex items-start space-x-3">
                            {isCorrect ? (
                              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div>
                              <p className={`font-medium mb-2 ${
                                isCorrect 
                                  ? 'text-green-800 dark:text-green-200' 
                                  : 'text-red-800 dark:text-red-200'
                              }`}>
                                {isCorrect ? 'Correct!' : 'Not quite right.'}
                              </p>
                              <p className={`text-sm ${
                                isCorrect 
                                  ? 'text-green-700 dark:text-green-300' 
                                  : 'text-red-700 dark:text-red-300'
                              }`}>
                                {question.explanation}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );

      case 'summary':
        const quizScore = calculateQuizScore();
        
        return (
          <div className="text-center space-y-6">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Award className="w-10 h-10 text-white" />
            </motion.div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('microLearning.lessonComplete')}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Great job! You've successfully completed this micro-lesson.
              </p>
            </div>
            
            {/* Enhanced XP Display */}
            <motion.div 
              className="bg-gradient-to-br from-secondary-50 to-accent-50 dark:from-secondary-900/20 dark:to-accent-900/20 rounded-xl p-6 border border-secondary-200 dark:border-secondary-700"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-center space-x-3 mb-4">
                <motion.div
                  className="flex items-center space-x-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  <Zap className="w-8 h-8 text-accent-600 dark:text-accent-400" />
                  <span className="text-3xl font-bold text-accent-600 dark:text-accent-400">
                    +{xpEarned || lesson.xpReward}
                  </span>
                  <span className="text-lg font-semibold text-accent-600 dark:text-accent-400">XP</span>
                </motion.div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">Quiz Score</div>
                  <div className={`text-lg font-bold ${
                    quizScore >= 80 ? 'text-green-600 dark:text-green-400' : 
                    quizScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {Math.round(quizScore)}%
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 dark:text-white">Study Time</div>
                  <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                    {Math.floor((new Date().getTime() - startTime.getTime()) / 1000 / 60)} min
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">{t('microLearning.whatYouLearned')}</h3>
              <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Core concepts and fundamentals</li>
                <li>• Practical application techniques</li>
                <li>• Best practices and common patterns</li>
                <li>• Real-world implementation examples</li>
              </ul>
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    index === currentStep
                      ? 'bg-primary-600 text-white scale-110'
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
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('quiz.previous')}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentStep(0)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title="Restart lesson"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {currentStep === steps.length - 1 ? (
            <motion.button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-6 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Award className="w-4 h-4" />
              <span>{t('microLearning.completeLesson')}</span>
            </motion.button>
          ) : (
            <button
              onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
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