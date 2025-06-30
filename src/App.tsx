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
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [theme, setTheme] = useState<Theme>('system');
  
  const { user, loading, error: authError } = useAuth();

  // Check if Supabase is configured first
  const supabaseConfigured = isSupabaseConfigured();

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

  // Load user's latest quiz result
  useEffect(() => {
    const loadQuizResult = async () => {
      if (user && supabaseConfigured) {
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
          console.error('Error loading quiz results:', error);
        }
      }
    };

    loadQuizResult();
  }, [user, supabaseConfigured]);

  // Session timeout management
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let warningTimeoutId: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      
      if (user && supabaseConfigured) {
        // Warn user 5 minutes before timeout
        warningTimeoutId = setTimeout(() => {
          const shouldContinue = confirm(
            'Your session will expire in 5 minutes due to inactivity. Click OK to continue your session.'
          );
          if (!shouldContinue) {
            // User chose to logout
            window.location.reload();
          }
        }, 25 * 60 * 1000); // 25 minutes

        // Auto logout after 30 minutes of inactivity
        timeoutId = setTimeout(() => {
          alert('Your session has expired due to inactivity. Please sign in again.');
          window.location.reload();
        }, 30 * 60 * 1000); // 30 minutes
      }
    };

    const handleActivity = () => {
      resetTimeout();
    };

    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(warningTimeoutId);
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, supabaseConfigured]);

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
    if (!supabaseConfigured) {
      alert('Please configure Supabase to use the quiz feature.');
      return;
    }
    if (!user) {
      setAuthMessage('Please log in or sign up to take the career quiz and save your results.');
      setAuthModalMode('signup');
      setShowAuthModal(true);
      return;
    }
    setCurrentView('quiz');
  };

  const handleQuizComplete = async (result: QuizResult) => {
    if (user && supabaseConfigured) {
      // Save quiz result to database
      try {
        await db.saveQuizResult(user.id, result);
      } catch (error) {
        console.error('Error saving quiz result:', error);
      }
    }
    setQuizResult(result);
    setCurrentView('results');
  };

  const handleViewRoadmap = () => {
    if (!supabaseConfigured) {
      alert('Please configure Supabase to access the roadmap feature.');
      return;
    }
    if (!user) {
      setAuthMessage('Please sign in to access your personalized learning roadmap.');
      setAuthModalMode('signin');
      setShowAuthModal(true);
      return;
    }
    setCurrentView('roadmap');
  };

  const handleViewChange = (view: string) => {
    // Check if user needs to be authenticated for protected views
    const protectedViews = ['dashboard', 'roadmap'];
    if (protectedViews.includes(view)) {
      if (!supabaseConfigured) {
        alert('Please configure Supabase to access this feature.');
        return;
      }
      if (!user) {
        setAuthMessage('Please sign in to access this feature.');
        setAuthModalMode('signin');
        setShowAuthModal(true);
        return;
      }
    }
    setCurrentView(view);
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

  const openAuthModal = (mode: 'signin' | 'signup', message?: string) => {
    if (!supabaseConfigured) {
      alert('Please configure Supabase to use authentication features.');
      return;
    }
    setAuthModalMode(mode);
    setAuthMessage(message || '');
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
    setAuthMessage('');
  };

  // Prevent direct URL access to protected routes
  useEffect(() => {
    const protectedViews = ['dashboard', 'roadmap'];
    if (protectedViews.includes(currentView) && (!user || !supabaseConfigured) && !loading) {
      setCurrentView('home');
      if (supabaseConfigured) {
        setAuthMessage('Please sign in to access this feature.');
        setAuthModalMode('signin');
        setShowAuthModal(true);
      }
    }
  }, [currentView, user, loading, supabaseConfigured]);

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

  // Show configuration error screen if Supabase is not configured
  if (!supabaseConfigured) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Supabase Configuration Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
            To use SkillPilot's authentication and data features, you need to set up Supabase.
          </p>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-left mb-8">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 text-xl">Quick Setup Guide:</h3>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <strong>Create a Supabase project:</strong>
                  <br />
                  <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    Go to supabase.com
                  </a> and create a new project
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <strong>Get your credentials:</strong>
                  <br />
                  Go to Settings → API and copy your Project URL and anon public key
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <strong>Update your .env file:</strong>
                  <div className="mt-2 p-3 bg-gray-900 dark:bg-gray-700 rounded-lg">
                    <code className="text-green-400 text-sm">
                      VITE_SUPABASE_URL=https://your-project-ref.supabase.co<br/>
                      VITE_SUPABASE_ANON_KEY=your-anon-key-here
                    </code>
                  </div>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <strong>Restart the development server</strong>
                  <br />
                  The database tables will be created automatically
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              <strong>Note:</strong> All database migrations are included and will run automatically when you connect to Supabase.
              No additional setup is required!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error screen if authentication fails
  if (authError) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Authentication Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{authError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading SkillPilot...</p>
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
        currentTheme={theme}
        onThemeChange={setTheme}
        currentLanguage={currentLanguage}
        user={user}
        onAuthClick={openAuthModal}
      />

      {renderCurrentView()}
      
      {/* Modals and Overlays */}
      {supabaseConfigured && (
        <AuthModal 
          isOpen={showAuthModal}
          onClose={closeAuthModal}
          initialMode={authModalMode}
          message={authMessage}
        />
      )}
      
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
    </div>
  );
}

export default App;