import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Brain, Target, CheckCircle } from 'lucide-react';
import { QuizQuestion, QuizResult } from '../types';
import { useTranslation } from '../utils/translations';

interface CareerQuizProps {
  onComplete: (result: QuizResult) => void;
  currentLanguage: string;
}

export default function CareerQuiz({ onComplete, currentLanguage }: CareerQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslation(currentLanguage);

  const questions: QuizQuestion[] = [
    {
      id: 'problem_solving',
      question: t('quiz.questions.problemSolving'),
      type: 'multiple-choice',
      category: 'personality',
      options: [
        t('quiz.options.logicalSteps'),
        t('quiz.options.creativeSolutions'),
        t('quiz.options.researchData'),
        t('quiz.options.collaborate')
      ]
    },
    {
      id: 'work_environment',
      question: t('quiz.questions.workEnvironment'),
      type: 'multiple-choice',
      category: 'personality',
      options: [
        t('quiz.options.fastPaced'),
        t('quiz.options.structured'),
        t('quiz.options.remote'),
        t('quiz.options.collaborative')
      ]
    },
    {
      id: 'learning_style',
      question: t('quiz.questions.learningStyle'),
      type: 'multiple-choice',
      category: 'learning-style',
      options: [
        t('quiz.options.handsOn'),
        t('quiz.options.documentation'),
        t('quiz.options.tutorials'),
        t('quiz.options.mentors')
      ]
    },
    {
      id: 'project_preference',
      question: t('quiz.questions.projectPreference'),
      type: 'multiple-choice',
      category: 'technical',
      options: [
        t('quiz.options.userInterfaces'),
        t('quiz.options.dataAlgorithms'),
        t('quiz.options.mobileApps'),
        t('quiz.options.systemArchitecture')
      ]
    },
    {
      id: 'technical_interest',
      question: t('quiz.questions.technicalInterest'),
      type: 'scale',
      category: 'technical',
      scaleMin: 1,
      scaleMax: 5
    },
    {
      id: 'collaboration_preference',
      question: t('quiz.questions.collaboration'),
      type: 'scale',
      category: 'personality',
      scaleMin: 1,
      scaleMax: 5
    },
    {
      id: 'career_motivation',
      question: t('quiz.questions.careerMotivation'),
      type: 'multiple-choice',
      category: 'motivation',
      options: [
        t('quiz.options.technicalProblems'),
        t('quiz.options.beautifulDesigns'),
        t('quiz.options.dataDecisions'),
        t('quiz.options.helpfulProducts')
      ]
    },
    {
      id: 'time_commitment',
      question: t('quiz.questions.timeCommitment'),
      type: 'multiple-choice',
      category: 'learning-style',
      options: [
        t('quiz.options.partTime'),
        t('quiz.options.dedicated'),
        t('quiz.options.intensive'),
        t('quiz.options.flexible')
      ]
    }
  ];

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: answer });
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const submitQuiz = async () => {
    setIsSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simple logic to determine career path based on answers
    const result = analyzeAnswers(answers);
    onComplete(result);
  };

  const analyzeAnswers = (answers: Record<string, any>): QuizResult => {
    // Simple scoring logic - in real app, this would use AI
    let frontendScore = 0;
    let backendScore = 0;
    let dataScore = 0;
    let designScore = 0;

    if (answers.problem_solving === t('quiz.options.creativeSolutions')) frontendScore += 2;
    if (answers.problem_solving === t('quiz.options.logicalSteps')) backendScore += 2;
    if (answers.problem_solving === t('quiz.options.researchData')) dataScore += 2;

    if (answers.project_preference === t('quiz.options.userInterfaces')) frontendScore += 3;
    if (answers.project_preference === t('quiz.options.dataAlgorithms')) dataScore += 3;
    if (answers.project_preference === t('quiz.options.systemArchitecture')) backendScore += 3;

    if (answers.career_motivation === t('quiz.options.beautifulDesigns')) {
      frontendScore += 2;
      designScore += 3;
    }
    if (answers.career_motivation === t('quiz.options.dataDecisions')) dataScore += 3;
    if (answers.career_motivation === t('quiz.options.technicalProblems')) backendScore += 2;

    const scores = {
      'Frontend Developer': frontendScore,
      'Backend Developer': backendScore,
      'Data Scientist': dataScore,
      'UX/UI Designer': designScore
    };

    const topCareer = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];

    const careerPaths = {
      'Frontend Developer': {
        description: t('quiz.results.frontend.description'),
        skills: ['React/Vue', 'JavaScript/TypeScript', 'CSS/Tailwind', 'Responsive Design'],
        nextSteps: [
          t('quiz.results.frontend.step1'),
          t('quiz.results.frontend.step2'),
          t('quiz.results.frontend.step3'),
          t('quiz.results.frontend.step4')
        ]
      },
      'Backend Developer': {
        description: t('quiz.results.backend.description'),
        skills: ['Node.js/Python', 'Databases', 'APIs', 'Cloud Platforms'],
        nextSteps: [
          t('quiz.results.backend.step1'),
          t('quiz.results.backend.step2'),
          t('quiz.results.backend.step3'),
          t('quiz.results.backend.step4')
        ]
      },
      'Data Scientist': {
        description: t('quiz.results.dataScience.description'),
        skills: ['Python/R', 'Machine Learning', 'Statistics', 'Data Visualization'],
        nextSteps: [
          t('quiz.results.dataScience.step1'),
          t('quiz.results.dataScience.step2'),
          t('quiz.results.dataScience.step3'),
          t('quiz.results.dataScience.step4')
        ]
      },
      'UX/UI Designer': {
        description: t('quiz.results.uxui.description'),
        skills: ['Figma/Sketch', 'User Research', 'Prototyping', 'Design Systems'],
        nextSteps: [
          t('quiz.results.uxui.step1'),
          t('quiz.results.uxui.step2'),
          t('quiz.results.uxui.step3'),
          t('quiz.results.uxui.step4')
        ]
      }
    };

    return {
      careerPath: topCareer,
      confidence: Math.max(75, Math.min(95, scores[topCareer] * 12)),
      description: careerPaths[topCareer].description,
      skills: careerPaths[topCareer].skills,
      nextSteps: careerPaths[topCareer].nextSteps,
      personalityType: 'Creative Problem Solver',
      learningStyle: 'Visual Learner',
      alternativePaths: Object.keys(careerPaths).filter(path => path !== topCareer),
      riasecProfile: 'Investigative',
      bigFiveTraits: {
        openness: 0.8,
        conscientiousness: 0.7,
        extraversion: 0.6,
        agreeableness: 0.7,
        neuroticism: 0.3
      }
    };
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasAnswer = answers[questions[currentQuestion]?.id] !== undefined;

  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center pt-16 transition-colors">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('quiz.analyzing')}</h2>
          <p className="text-gray-600 dark:text-gray-300">{t('quiz.findingMatch')}</p>
          <div className="w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-6 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 to-secondary-600"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 pt-16 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t('quiz.question')} {currentQuestion + 1} {t('quiz.of')} {questions.length}
            </span>
            <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
              {Math.round(progress)}% {t('quiz.complete')}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 to-secondary-600"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {questions[currentQuestion].question}
            </h2>

            {questions[currentQuestion].type === 'multiple-choice' && (
              <div className="space-y-3">
                {questions[currentQuestion].options?.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      answers[questions[currentQuestion].id] === option
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{option}</span>
                      {answers[questions[currentQuestion].id] === option && (
                        <CheckCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}

            {questions[currentQuestion].type === 'scale' && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>{t('quiz.scale.notAtAll')}</span>
                  <span>{t('quiz.scale.extremely')}</span>
                </div>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <motion.button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      className={`flex-1 h-12 rounded-xl border-2 font-semibold transition-all ${
                        answers[questions[currentQuestion].id] === value
                          ? 'border-primary-600 bg-primary-600 text-white'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 text-gray-700 dark:text-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {value}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <motion.button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
              currentQuestion === 0
                ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            whileHover={currentQuestion > 0 ? { scale: 1.05 } : {}}
            whileTap={currentQuestion > 0 ? { scale: 0.95 } : {}}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>{t('quiz.previous')}</span>
          </motion.button>

          {isLastQuestion ? (
            <motion.button
              onClick={submitQuiz}
              disabled={!hasAnswer}
              className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                hasAnswer
                  ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              whileHover={hasAnswer ? { scale: 1.05 } : {}}
              whileTap={hasAnswer ? { scale: 0.95 } : {}}
            >
              <Target className="w-5 h-5" />
              <span>{t('quiz.getResults')}</span>
            </motion.button>
          ) : (
            <motion.button
              onClick={nextQuestion}
              disabled={!hasAnswer}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                hasAnswer
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              }`}
              whileHover={hasAnswer ? { scale: 1.05 } : {}}
              whileTap={hasAnswer ? { scale: 0.95 } : {}}
            >
              <span>{t('quiz.next')}</span>
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}