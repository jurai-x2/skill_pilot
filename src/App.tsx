import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import CareerQuiz from './components/CareerQuiz';
import QuizResults from './components/QuizResults';
import Dashboard from './components/Dashboard';
import Roadmap from './components/Roadmap';
import AIMentor from './components/AIMentor';
import ResumeBuilder from './components/ResumeBuilder';
import CommunityForum from './components/CommunityForum';
import MonetizationGuide from './components/MonetizationGuide';
import MicroLearning from './components/MicroLearning';
import ProjectSubmission from './components/ProjectSubmission';
import LiveEvents from './components/LiveEvents';
import LearningFeed from './components/LearningFeed';
import Gamification from './components/Gamification';
import PersonalizedVideos from './components/PersonalizedVideos';
import Certificates from './components/Certificates';
import Profile from './components/Profile';
import AuthModal from './components/Auth/AuthModal';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { QuizResult, Lesson, Project } from './types';
import { useAuth } from './hooks/useAuth';
import { db, isSupabaseConfigured } from './lib/supabase';

type Theme = 'light' | 'dark' | 'system';

function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [authMessage, setAuthMessage] = useState<string>('');
  const [showAIMentor, setShowAIMentor] = useState(false);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showCommunityForum, setShowCommunityForum] = useState(false);
  const [showMonetizationGuide, setShowMonetizationGuide] = useState(false);
  const [showMicroLearning, setShowMicroLearning] = useState(false);
  const [showProjectSubmission, setShowProjectSubmission] = useState(false);
  const [showLiveEvents, setShowLiveEvents] = useState(false);
  const [showLearningFeed, setShowLearningFeed] = useState(false);
  const [showGamification, setShowGamification] = useState(false);
  const [showPersonalizedVideos, setShowPersonalizedVideos] = useState(false);
  const [showCertificates, setShowCertificates] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState<Theme>('system');
  
  const { user, loading, error: authError, isConfigured } = useAuth();

  console.log('🎯 App State:', {
    user: user ? `${user.name} (${user.email})` : 'No user',
    loading,
    authError,
    isConfigured,
    currentView
  });

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        applyTheme(e.matches);
      }
    };

    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemPrefersDark);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);
    localStorage.setItem('theme', theme);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Language management
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  // Load user's latest quiz result
  useEffect(() => {
    const loadQuizResult = async () => {
      if (user && isConfigured) {
        try {
          const { data } = await db.getQuizResults(user.id);
          if (data && data.length > 0) {
            const latestResult = data[0];
            setQuizResult({
              careerPath: latestResult.career_path,
              confidence: latestResult.confidence,
              description: latestResult.description,
              skills: latestResult.skills,
              nextSteps: latestResult.next_steps,
              personalityType: latestResult.personality_type,
              learningStyle: latestResult.learning_style,
              alternativePaths: latestResult.alternative_paths,
              riasecProfile: latestResult.riasec_profile,
              bigFiveTraits: latestResult.big_five_traits as Record<string, number>
            });
          }
        } catch (error) {
          console.error('❌ Error loading quiz results:', error);
        }
      }
    };

    loadQuizResult();
  }, [user, isConfigured]);

  // Dynamic lesson generation based on user's career path
  const generateDynamicLesson = (): Lesson => {
    const userCareerPath = quizResult?.careerPath || user?.careerPath || 'Frontend Developer';
    
    const lessonTemplates = {
      'Frontend Developer': {
        id: 'frontend-lesson-1',
        title: 'React Hooks Fundamentals',
        type: 'interactive' as const,
        duration: 15,
        completed: false,
        xpReward: 100,
        content: `# React Hooks Fundamentals

React Hooks are functions that let you use state and other React features in functional components. They were introduced in React 16.8 and have revolutionized how we write React applications.

KEY: Hooks allow you to reuse stateful logic between components without changing your component hierarchy.

The most commonly used hooks are useState and useEffect. useState lets you add state to functional components, while useEffect lets you perform side effects.

CODE: const [count, setCount] = useState(0);

LIST: useState returns an array with two elements|The current state value|A function to update the state|You can call the setter function to trigger a re-render

Understanding hooks is essential for modern React development. They make components more readable and easier to test.

KEY: Always call hooks at the top level of your React function, never inside loops, conditions, or nested functions.`,
        resources: []
      },
      'Backend Developer': {
        id: 'backend-lesson-1',
        title: 'Node.js API Development',
        type: 'interactive' as const,
        duration: 20,
        completed: false,
        xpReward: 120,
        content: `# Node.js API Development

Node.js is a powerful runtime environment that allows you to build scalable server-side applications using JavaScript. It's perfect for creating RESTful APIs and microservices.

KEY: Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient for data-intensive real-time applications.

Express.js is the most popular web framework for Node.js. It provides a robust set of features for web and mobile applications.

CODE: const express = require('express');
const app = express();
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

LIST: Key concepts in Node.js API development|Express.js for routing and middleware|Asynchronous programming with async/await|Database integration with MongoDB or PostgreSQL|Authentication and authorization|Error handling and validation

Building APIs with Node.js allows you to create scalable backend services that can handle thousands of concurrent connections.

KEY: Always implement proper error handling and input validation to ensure your APIs are secure and reliable.`,
        resources: []
      },
      'Data Scientist': {
        id: 'data-science-lesson-1',
        title: 'Python for Data Analysis',
        type: 'interactive' as const,
        duration: 25,
        completed: false,
        xpReward: 150,
        content: `# Python for Data Analysis

Python is the most popular programming language for data science due to its simplicity and powerful libraries. Pandas, NumPy, and Matplotlib form the core toolkit for data analysis.

KEY: Python's readable syntax and extensive ecosystem make it ideal for data manipulation, analysis, and visualization.

Pandas is a powerful data manipulation library that provides data structures like DataFrames for handling structured data efficiently.

CODE: import pandas as pd
df = pd.read_csv('data.csv')
df.head()
df.describe()

LIST: Essential Python libraries for data science|Pandas for data manipulation and analysis|NumPy for numerical computing|Matplotlib and Seaborn for data visualization|Scikit-learn for machine learning|Jupyter notebooks for interactive development

Data analysis involves cleaning, transforming, and exploring data to extract meaningful insights and patterns.

KEY: Always start with exploratory data analysis (EDA) to understand your data before applying any machine learning algorithms.`,
        resources: []
      },
      'UX/UI Designer': {
        id: 'uxui-lesson-1',
        title: 'Design Systems Fundamentals',
        type: 'article' as const,
        duration: 18,
        completed: false,
        xpReward: 110,
        content: `# Design Systems Fundamentals

A design system is a collection of reusable components, guided by clear standards, that can be assembled together to build any number of applications. It ensures consistency and efficiency in design.

KEY: Design systems bridge the gap between design and development, creating a shared language for teams.

Design systems include color palettes, typography scales, spacing systems, component libraries, and usage guidelines. They help maintain visual consistency across products.

LIST: Core components of a design system|Color palette with semantic naming|Typography scale and font hierarchy|Spacing and layout grid systems|Component library with variants|Documentation and usage guidelines|Accessibility standards and guidelines

Tools like Figma, Sketch, and Adobe XD help designers create and maintain design systems collaboratively.

KEY: A good design system evolves with the product and team needs, requiring regular updates and maintenance.`,
        resources: []
      },
      'Full Stack Developer': {
        id: 'fullstack-lesson-1',
        title: 'Full Stack Architecture Patterns',
        type: 'interactive' as const,
        duration: 22,
        completed: false,
        xpReward: 130,
        content: `# Full Stack Architecture Patterns

Full stack development involves working with both frontend and backend technologies to create complete web applications. Understanding architecture patterns is crucial for building scalable applications.

KEY: A well-designed architecture separates concerns, making your application easier to maintain, test, and scale.

Common patterns include MVC (Model-View-Controller), microservices, and serverless architectures. Each has its own benefits and use cases.

CODE: // Frontend (React)
const UserProfile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    fetch('/api/user').then(res => res.json()).then(setUser);
  }, []);
};

LIST: Key full stack concepts|Frontend frameworks (React, Vue, Angular)|Backend APIs (REST, GraphQL)|Database design and management|Authentication and authorization|Deployment and DevOps|Performance optimization

Modern full stack development often involves containerization with Docker and deployment on cloud platforms like AWS, Vercel, or Netlify.

KEY: Focus on creating a clear separation between your frontend and backend, using APIs as the communication layer.`,
        resources: []
      },
      'DevOps Engineer': {
        id: 'devops-lesson-1',
        title: 'CI/CD Pipeline Fundamentals',
        type: 'interactive' as const,
        duration: 20,
        completed: false,
        xpReward: 125,
        content: `# CI/CD Pipeline Fundamentals

Continuous Integration and Continuous Deployment (CI/CD) are essential practices in modern software development that automate the building, testing, and deployment of applications.

KEY: CI/CD pipelines reduce manual errors, increase deployment frequency, and improve overall software quality.

A typical CI/CD pipeline includes stages like code commit, automated testing, building, and deployment to various environments.

CODE: # GitHub Actions example
name: CI/CD Pipeline
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm test

LIST: CI/CD pipeline components|Version control integration (Git)|Automated testing (unit, integration)|Build automation|Deployment automation|Environment management|Monitoring and rollback strategies

Tools like GitHub Actions, Jenkins, GitLab CI, and CircleCI help implement robust CI/CD pipelines.

KEY: Start with simple pipelines and gradually add complexity as your team becomes more comfortable with the process.`,
        resources: []
      },
      'Mobile Developer': {
        id: 'mobile-lesson-1',
        title: 'React Native Fundamentals',
        type: 'interactive' as const,
        duration: 18,
        completed: false,
        xpReward: 115,
        content: `# React Native Fundamentals

React Native allows you to build mobile applications using React and JavaScript. It enables code sharing between iOS and Android platforms while maintaining native performance.

KEY: React Native uses native components instead of web components, providing a truly native user experience.

The core components include View, Text, ScrollView, and TouchableOpacity. These map to native UI elements on each platform.

CODE: import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const App = () => (
  <View style={styles.container}>
    <Text>Hello Mobile World!</Text>
  </View>
);

LIST: React Native core concepts|Native components and APIs|Navigation with React Navigation|State management with Redux or Context|Platform-specific code handling|Performance optimization techniques|Publishing to app stores

React Native bridges JavaScript and native code, allowing you to access device features like camera, GPS, and push notifications.

KEY: Learn the differences between web React and React Native, especially regarding styling and navigation patterns.`,
        resources: []
      }
    };

    // Return the lesson for the user's career path, or default to Frontend Developer
    return lessonTemplates[userCareerPath as keyof typeof lessonTemplates] || lessonTemplates['Frontend Developer'];
  };

  // Dynamic project generation based on user's career path
  const generateDynamicProject = (): Project => {
    const userCareerPath = quizResult?.careerPath || user?.careerPath || 'Frontend Developer';
    
    const projectTemplates = {
      'Frontend Developer': {
        id: 'frontend-project-1',
        title: 'Personal Portfolio Website',
        description: 'Build a responsive portfolio website showcasing your skills and projects using React and modern CSS',
        difficulty: 'beginner' as const,
        estimatedHours: 8,
        completed: false,
        technologies: ['React', 'CSS3', 'JavaScript', 'Responsive Design'],
        requirements: [
          'Create a responsive layout that works on all devices',
          'Include an about section with your background',
          'Showcase at least 3 projects with descriptions',
          'Add a contact form with validation',
          'Deploy the website to a hosting platform'
        ],
        xpReward: 200,
        approved: false
      },
      'Backend Developer': {
        id: 'backend-project-1',
        title: 'RESTful API with Authentication',
        description: 'Build a complete REST API with user authentication, data validation, and database integration',
        difficulty: 'intermediate' as const,
        estimatedHours: 12,
        completed: false,
        technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Bcrypt'],
        requirements: [
          'Implement user registration and login endpoints',
          'Add JWT-based authentication middleware',
          'Create CRUD operations for a resource (e.g., posts, products)',
          'Implement input validation and error handling',
          'Write API documentation and deploy to cloud'
        ],
        xpReward: 250,
        approved: false
      },
      'Data Scientist': {
        id: 'data-science-project-1',
        title: 'Data Analysis Dashboard',
        description: 'Create an interactive data analysis dashboard using Python, Pandas, and visualization libraries',
        difficulty: 'intermediate' as const,
        estimatedHours: 15,
        completed: false,
        technologies: ['Python', 'Pandas', 'Matplotlib', 'Streamlit', 'NumPy'],
        requirements: [
          'Load and clean a real-world dataset',
          'Perform exploratory data analysis (EDA)',
          'Create interactive visualizations',
          'Build insights and statistical summaries',
          'Deploy the dashboard using Streamlit or similar'
        ],
        xpReward: 300,
        approved: false
      },
      'UX/UI Designer': {
        id: 'uxui-project-1',
        title: 'Mobile App Design System',
        description: 'Design a complete mobile app interface with a comprehensive design system and prototypes',
        difficulty: 'intermediate' as const,
        estimatedHours: 10,
        completed: false,
        technologies: ['Figma', 'Design Systems', 'Prototyping', 'User Research'],
        requirements: [
          'Conduct user research and create personas',
          'Design wireframes and user flows',
          'Create a comprehensive design system',
          'Build high-fidelity mockups and prototypes',
          'Present the design with usability testing results'
        ],
        xpReward: 220,
        approved: false
      },
      'Full Stack Developer': {
        id: 'fullstack-project-1',
        title: 'Social Media Platform',
        description: 'Build a complete social media platform with real-time features, user authentication, and responsive design',
        difficulty: 'advanced' as const,
        estimatedHours: 20,
        completed: false,
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'JWT'],
        requirements: [
          'Implement user authentication and profiles',
          'Create post creation, editing, and deletion features',
          'Add real-time chat and notifications',
          'Build responsive frontend with modern UI',
          'Deploy both frontend and backend to cloud platforms'
        ],
        xpReward: 400,
        approved: false
      },
      'DevOps Engineer': {
        id: 'devops-project-1',
        title: 'CI/CD Pipeline Implementation',
        description: 'Set up a complete CI/CD pipeline with automated testing, building, and deployment',
        difficulty: 'intermediate' as const,
        estimatedHours: 14,
        completed: false,
        technologies: ['Docker', 'GitHub Actions', 'AWS/GCP', 'Kubernetes', 'Terraform'],
        requirements: [
          'Containerize a web application with Docker',
          'Set up automated testing in CI pipeline',
          'Implement automated deployment to staging and production',
          'Configure monitoring and logging',
          'Document the entire deployment process'
        ],
        xpReward: 280,
        approved: false
      },
      'Mobile Developer': {
        id: 'mobile-project-1',
        title: 'Cross-Platform Mobile App',
        description: 'Build a feature-rich mobile application using React Native with native device integrations',
        difficulty: 'intermediate' as const,
        estimatedHours: 16,
        completed: false,
        technologies: ['React Native', 'Expo', 'Firebase', 'Native APIs'],
        requirements: [
          'Create a multi-screen app with navigation',
          'Implement user authentication with Firebase',
          'Integrate device features (camera, location, etc.)',
          'Add offline functionality and data persistence',
          'Publish to app stores or provide APK/IPA'
        ],
        xpReward: 320,
        approved: false
      }
    };

    return projectTemplates[userCareerPath as keyof typeof projectTemplates] || projectTemplates['Frontend Developer'];
  };

  const handleStartQuiz = () => {
    console.log('🎯 handleStartQuiz called, user:', user ? 'authenticated' : 'not authenticated');
    
    if (!user) {
      console.log('🔐 User not authenticated, showing signup modal');
      setAuthMessage('Create your free account to take the career quiz and get personalized learning paths!');
      setAuthModalMode('signup');
      setShowAuthModal(true);
      return;
    }
    
    console.log('✅ User authenticated, going to quiz');
    setCurrentView('quiz');
  };

  const handleQuizComplete = async (result: QuizResult) => {
    if (user && isConfigured) {
      try {
        await db.saveQuizResult(user.id, result);
      } catch (error) {
        console.error('❌ Error saving quiz result:', error);
      }
    }
    setQuizResult(result);
    setCurrentView('results');
  };

  const handleViewRoadmap = () => {
    if (!user) {
      setAuthMessage('Please sign in to access your personalized learning roadmap.');
      setAuthModalMode('signin');
      setShowAuthModal(true);
      return;
    }
    setCurrentView('roadmap');
  };

  const handleViewChange = (view: string) => {
    // Define which views require authentication
    const protectedViews = ['dashboard', 'roadmap', 'quiz'];
    
    if (protectedViews.includes(view) && !user) {
      // Set appropriate message based on the view
      let message = 'Please sign in to access this feature.';
      let mode: 'signin' | 'signup' = 'signin';
      
      if (view === 'quiz') {
        message = 'Create your free account to take the career quiz and get personalized learning paths!';
        mode = 'signup';
      } else if (view === 'dashboard') {
        message = 'Please sign in to access your personalized dashboard.';
        mode = 'signin';
      } else if (view === 'roadmap') {
        message = 'Please sign in to access your personalized learning roadmap.';
        mode = 'signin';
      }
      
      setAuthMessage(message);
      setAuthModalMode(mode);
      setShowAuthModal(true);
      return;
    }
    
    setCurrentView(view);
  };

  const handleLessonComplete = (xpEarned: number) => {
    console.log(`Lesson completed! Earned ${xpEarned} XP`);
    setShowMicroLearning(false);
  };

  const handleProjectSubmit = (submission: any) => {
    console.log('Project submitted:', submission);
    setShowProjectSubmission(false);
  };

  const openAuthModal = (mode: 'signin' | 'signup', message?: string) => {
    console.log('🔐 Opening auth modal with mode:', mode);
    setAuthModalMode(mode);
    setAuthMessage(message || '');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    console.log('🔐 Closing auth modal');
    setShowAuthModal(false);
    setAuthMessage('');
  };

  // Prevent direct URL access to protected routes
  useEffect(() => {
    const protectedViews = ['dashboard', 'roadmap', 'quiz'];
    if (protectedViews.includes(currentView) && !user && !loading) {
      setCurrentView('home');
      
      // Set appropriate message based on the view
      let message = 'Please sign in to access this feature.';
      let mode: 'signin' | 'signup' = 'signin';
      
      if (currentView === 'quiz') {
        message = 'Create your free account to take the career quiz and get personalized learning paths!';
        mode = 'signup';
      } else if (currentView === 'dashboard') {
        message = 'Please sign in to access your personalized dashboard.';
        mode = 'signin';
      } else if (currentView === 'roadmap') {
        message = 'Please sign in to access your personalized learning roadmap.';
        mode = 'signin';
      }
      
      setAuthMessage(message);
      setAuthModalMode(mode);
      setShowAuthModal(true);
    }
  }, [currentView, user, loading]);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <LandingPage onStartQuiz={handleStartQuiz} currentLanguage={currentLanguage} />;
      case 'quiz':
        return (
          <ProtectedRoute 
            fallback={<LandingPage onStartQuiz={handleStartQuiz} currentLanguage={currentLanguage} />}
          >
            <CareerQuiz onComplete={handleQuizComplete} currentLanguage={currentLanguage} />
          </ProtectedRoute>
        );
      case 'results':
        return quizResult ? (
          <QuizResults 
            result={quizResult} 
            onViewRoadmap={handleViewRoadmap}
            currentLanguage={currentLanguage}
          />
        ) : null;
      case 'dashboard':
        return (
          <ProtectedRoute>
            {user && <Dashboard user={user} onViewRoadmap={handleViewRoadmap} currentLanguage={currentLanguage} />}
          </ProtectedRoute>
        );
      case 'roadmap':
        return (
          <ProtectedRoute>
            <Roadmap careerPath={quizResult?.careerPath || user?.careerPath || 'Frontend Developer'} currentLanguage={currentLanguage} />
          </ProtectedRoute>
        );
      default:
        return <LandingPage onStartQuiz={handleStartQuiz} currentLanguage={currentLanguage} />;
    }
  };

  // Show error screen if authentication fails
  if (authError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading SkillPilot...</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {isConfigured ? 'Checking authentication...' : 'Starting in demo mode...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header 
        currentView={currentView} 
        onViewChange={handleViewChange}
        onOpenAIMentor={() => setShowAIMentor(true)}
        onOpenResumeBuilder={() => setShowResumeBuilder(true)}
        onOpenCommunityForum={() => setShowCommunityForum(true)}
        onOpenMonetizationGuide={() => setShowMonetizationGuide(true)}
        onOpenMicroLearning={() => setShowMicroLearning(true)}
        onOpenProjectSubmission={() => setShowProjectSubmission(true)}
        onOpenLiveEvents={() => setShowLiveEvents(true)}
        onOpenLearningFeed={() => setShowLearningFeed(true)}
        onOpenGamification={() => setShowGamification(true)}
        onOpenPersonalizedVideos={() => setShowPersonalizedVideos(true)}
        onOpenCertificates={() => setShowCertificates(true)}
        onOpenProfile={() => setShowProfile(true)}
        currentTheme={theme}
        onThemeChange={setTheme}
        currentLanguage={currentLanguage}
        user={user}
        onAuthClick={openAuthModal}
      />

      {renderCurrentView()}
      
      {/* Modals and Overlays */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={closeAuthModal}
        initialMode={authModalMode}
        message={authMessage}
      />
      
      <AIMentor 
        isOpen={showAIMentor} 
        onClose={() => setShowAIMentor(false)}
        currentLanguage={currentLanguage}
      />
      
      {showResumeBuilder && user && (
        <ResumeBuilder 
          user={user}
          onClose={() => setShowResumeBuilder(false)}
          currentLanguage={currentLanguage}
        />
      )}
      
      <CommunityForum 
        isOpen={showCommunityForum}
        onClose={() => setShowCommunityForum(false)}
        currentLanguage={currentLanguage}
      />
      
      <MonetizationGuide 
        careerPath={user?.careerPath || 'Frontend Developer'}
        isOpen={showMonetizationGuide}
        onClose={() => setShowMonetizationGuide(false)}
        currentLanguage={currentLanguage}
      />

      {showMicroLearning && (
        <MicroLearning
          lesson={generateDynamicLesson()}
          onComplete={handleLessonComplete}
          onClose={() => setShowMicroLearning(false)}
          currentLanguage={currentLanguage}
        />
      )}

      {showProjectSubmission && (
        <ProjectSubmission
          project={generateDynamicProject()}
          onSubmit={handleProjectSubmit}
          onClose={() => setShowProjectSubmission(false)}
          currentLanguage={currentLanguage}
        />
      )}

      <LiveEvents
        isOpen={showLiveEvents}
        onClose={() => setShowLiveEvents(false)}
        currentLanguage={currentLanguage}
      />

      <LearningFeed
        isOpen={showLearningFeed}
        onClose={() => setShowLearningFeed(false)}
        currentLanguage={currentLanguage}
      />

      {user && (
        <Gamification
          user={user}
          isOpen={showGamification}
          onClose={() => setShowGamification(false)}
          currentLanguage={currentLanguage}
        />
      )}

      {user && (
        <PersonalizedVideos
          user={user}
          isOpen={showPersonalizedVideos}
          onClose={() => setShowPersonalizedVideos(false)}
          currentLanguage={currentLanguage}
        />
      )}

      {user && (
        <Certificates
          isOpen={showCertificates}
          onClose={() => setShowCertificates(false)}
          currentLanguage={currentLanguage}
        />
      )}

      {user && (
        <Profile
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          currentLanguage={currentLanguage}
        />
      )}
    </div>
  );
}

export default App;