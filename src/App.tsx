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
import { QuizResult, User, Lesson, Project } from './types';

type Theme = 'light' | 'dark' | 'system';

function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
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
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState<Theme>('system');
  
  // Mock user data - in real app, this would come from authentication
  const [user] = useState<User>({
    id: '1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    careerPath: 'Frontend Developer',
    level: 3,
    xp: 150,
    totalXp: 450,
    streak: 5,
    completedLessons: 12,
    certificates: [
      {
        id: '1',
        name: 'HTML/CSS Fundamentals',
        careerTrack: 'Frontend Developer',
        issuedAt: new Date('2024-01-15'),
        projectUrl: 'https://github.com/alexchen/portfolio',
        uniqueId: 'CERT-001-2024',
        verified: true,
        skills: ['HTML', 'CSS', 'Responsive Design']
      }
    ],
    joinedAt: new Date('2024-01-01'),
    language: currentLanguage,
    country: 'United States',
    githubUrl: 'https://github.com/alexchen',
    portfolioUrl: 'https://alexchen.dev',
    personalityType: 'Creative Problem Solver',
    studyHours: 45,
    weeklyGoal: 10
  });

  // Theme management
  useEffect(() => {
    // Load saved theme preference
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

    // Apply theme
    if (theme === 'dark') {
      applyTheme(true);
    } else if (theme === 'light') {
      applyTheme(false);
    } else if (theme === 'system') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemPrefersDark);
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    // Save theme preference
    localStorage.setItem('theme', theme);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // Language management
  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Save language preference
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  // Listen for language change events from header
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail);
    };

    window.addEventListener('languageChange', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange as EventListener);
    };
  }, []);

  // Mock lesson for micro-learning demo
  const mockLesson: Lesson = {
    id: '1',
    title: 'React Hooks Fundamentals',
    type: 'interactive',
    duration: 15,
    completed: false,
    xpReward: 100,
    content: 'Learn the basics of React Hooks and how to use them effectively.',
    resources: []
  };

  // Mock project for submission demo
  const mockProject: Project = {
    id: '1',
    title: 'Personal Portfolio Website',
    description: 'Build a responsive portfolio website showcasing your skills and projects',
    difficulty: 'beginner',
    estimatedHours: 8,
    completed: false,
    technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
    requirements: [
      'Create a responsive layout that works on all devices',
      'Include an about section with your background',
      'Showcase at least 3 projects with descriptions',
      'Add a contact form with validation',
      'Deploy the website to a hosting platform'
    ],
    xpReward: 200,
    approved: false
  };

  const handleStartQuiz = () => {
    setCurrentView('quiz');
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    setCurrentView('results');
  };

  const handleViewRoadmap = () => {
    setCurrentView('roadmap');
  };

  const handleLessonComplete = (xpEarned: number) => {
    // In a real app, this would update user XP and progress
    console.log(`Lesson completed! Earned ${xpEarned} XP`);
    setShowMicroLearning(false);
  };

  const handleProjectSubmit = (submission: any) => {
    // In a real app, this would submit to backend
    console.log('Project submitted:', submission);
    setShowProjectSubmission(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <LandingPage onStartQuiz={handleStartQuiz} currentLanguage={currentLanguage} />;
      case 'quiz':
        return <CareerQuiz onComplete={handleQuizComplete} currentLanguage={currentLanguage} />;
      case 'results':
        return quizResult ? (
          <QuizResults 
            result={quizResult} 
            onViewRoadmap={handleViewRoadmap}
            currentLanguage={currentLanguage}
          />
        ) : null;
      case 'dashboard':
        return <Dashboard user={user} onViewRoadmap={handleViewRoadmap} currentLanguage={currentLanguage} />;
      case 'roadmap':
        return <Roadmap careerPath={quizResult?.careerPath || user.careerPath || 'Frontend Developer'} currentLanguage={currentLanguage} />;
      default:
        return <LandingPage onStartQuiz={handleStartQuiz} currentLanguage={currentLanguage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header 
        currentView={currentView} 
        onViewChange={setCurrentView}
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
        currentTheme={theme}
        onThemeChange={setTheme}
        currentLanguage={currentLanguage}
      />

      {renderCurrentView()}
      
      {/* Modals and Overlays */}
      <AIMentor 
        isOpen={showAIMentor} 
        onClose={() => setShowAIMentor(false)}
        currentLanguage={currentLanguage}
      />
      
      {showResumeBuilder && (
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
        careerPath={user.careerPath || 'Frontend Developer'}
        isOpen={showMonetizationGuide}
        onClose={() => setShowMonetizationGuide(false)}
        currentLanguage={currentLanguage}
      />

      {showMicroLearning && (
        <MicroLearning
          lesson={mockLesson}
          onComplete={handleLessonComplete}
          onClose={() => setShowMicroLearning(false)}
          currentLanguage={currentLanguage}
        />
      )}

      {showProjectSubmission && (
        <ProjectSubmission
          project={mockProject}
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

      <Gamification
        user={user}
        isOpen={showGamification}
        onClose={() => setShowGamification(false)}
        currentLanguage={currentLanguage}
      />

      <PersonalizedVideos
        user={user}
        isOpen={showPersonalizedVideos}
        onClose={() => setShowPersonalizedVideos(false)}
        currentLanguage={currentLanguage}
      />
    </div>
  );
}

export default App;