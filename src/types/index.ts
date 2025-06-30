export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  careerPath?: string;
  level: number;
  xp: number;
  total_xp: number;
  streak: number;
  completed_lessons: number;
  certificates: Certificate[];
  joined_at: string;
  country?: string;
  language: string;
  learning_style?: string;
  time_commitment?: string;
  github_url?: string;
  portfolio_url?: string;
  personality_type?: string;
  study_hours?: number;
  weekly_goal?: number;
  squad?: string;
  followers?: number;
  following?: number;
  created_at: string;
  updated_at: string;
}

export interface Certificate {
  id: string;
  name: string;
  careerTrack: string;
  issuedAt: Date;
  projectUrl?: string;
  uniqueId: string;
  verified: boolean;
  skills: string[];
  grade?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'scale' | 'ranking';
  options?: string[];
  scaleMin?: number;
  scaleMax?: number;
  category: 'personality' | 'learning-style' | 'motivation' | 'technical';
}

export interface QuizResult {
  careerPath: string;
  confidence: number;
  description: string;
  skills: string[];
  nextSteps: string[];
  personalityType: string;
  learningStyle: string;
  alternativePaths: string[];
  riasecProfile: string;
  bigFiveTraits: Record<string, number>;
}

export interface RoadmapStage {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  projects: Project[];
  lessons: Lesson[];
  estimatedWeeks: number;
  prerequisites?: string[];
  unlocked: boolean;
  xpRequired: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  completed: boolean;
  technologies: string[];
  submissionUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  feedback?: ProjectFeedback;
  requirements: string[];
  xpReward: number;
  submittedAt?: Date;
  approved: boolean;
}

export interface ProjectFeedback {
  score: number;
  comments: string;
  suggestions: string[];
  approved: boolean;
  reviewedAt: Date;
  reviewer: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'article' | 'interactive' | 'quiz';
  duration: number;
  completed: boolean;
  xpReward: number;
  content?: string;
  videoUrl?: string;
  quizQuestions?: QuizQuestion[];
  resources?: LearningResource[];
}

export interface LearningResource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'tool' | 'documentation';
  url: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  provider: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at?: string;
  xpReward: number;
  category: 'learning' | 'project' | 'streak' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  attachments?: FileAttachment[];
  messageType?: 'text' | 'code' | 'resume-feedback' | 'career-advice';
}

export interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  analysisResult?: FileAnalysis;
}

export interface FileAnalysis {
  type: 'resume' | 'code' | 'project' | 'data';
  feedback: string;
  suggestions: string[];
  score?: number;
  improvements: string[];
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  careerTrack: string;
  tags: string[];
  likes: number;
  replies: ForumReply[];
  createdAt: Date;
  solved: boolean;
  views: number;
  pinned: boolean;
}

export interface ForumReply {
  id: string;
  content: string;
  author: User;
  likes: number;
  createdAt: Date;
  isAnswer: boolean;
  parentId?: string;
}

export interface LiveEvent {
  id: string;
  title: string;
  description: string;
  type: 'hackathon' | 'ama' | 'workshop' | 'career-talk' | 'project-showcase';
  startTime: Date;
  endTime: Date;
  maxParticipants?: number;
  currentParticipants: number;
  host: string;
  registrationRequired: boolean;
  careerTracks: string[];
  meetingUrl?: string;
  recordingUrl?: string;
  prizes?: string[];
  featured: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  fullName: string;
  email: string;
  portfolioLink?: string;
  registeredAt: Date;
  status: 'registered' | 'attended' | 'cancelled';
}

export interface Resume {
  id?: string;
  userId?: string;
  personalInfo: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  summary?: string;
  skills?: string[];
  projects?: ResumeProject[];
  experience?: WorkExperience[];
  education?: Education[];
  certifications?: Certificate[];
  generatedAt?: Date;
  template?: string;
  atsScore?: number;
  feedback?: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  technologies?: string[];
  url?: string;
  github?: string;
  impact?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  current: boolean;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  gpa?: string;
  honors?: string[];
}

export interface MonetizationGuide {
  id: string;
  careerPath: string;
  strategies: MonetizationStrategy[];
  estimatedEarnings: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  successStories: SuccessStory[];
  marketplaces: Marketplace[];
}

export interface MonetizationStrategy {
  type: 'freelancing' | 'products' | 'templates' | 'courses' | 'consulting' | 'saas' | 'mobile-apps';
  title: string;
  description: string;
  platforms: string[];
  requirements: string[];
  timeToStart: string;
  potentialEarnings?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  examples?: string[];
}

export interface SuccessStory {
  id: string;
  name: string;
  careerPath: string;
  strategy: string;
  earnings: string;
  timeframe: string;
  story: string;
  avatar?: string;
}

export interface Marketplace {
  name: string;
  type: string;
  commission: string;
  difficulty: string;
  description: string;
  url: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'achievement' | 'milestone' | 'social' | 'system' | 'event' | 'streak';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LearningStreak {
  current: number;
  longest: number;
  lastActivity: Date;
  weeklyGoal: number;
  weeklyProgress: number;
  streakFreeze: number;
  perfectWeeks: number;
}

export interface StudySession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  lessonId?: string;
  projectId?: string;
  xpEarned: number;
  type: 'lesson' | 'project' | 'quiz' | 'practice' | 'forum' | 'mentor-chat';
  focusTime: number;
  distractions: number;
}

export interface Squad {
  id: string;
  name: string;
  description: string;
  careerTrack: string;
  members: User[];
  maxMembers: number;
  createdAt: Date;
  isPrivate: boolean;
  weeklyChallenge?: Challenge;
  leaderboard: SquadMember[];
}

export interface SquadMember {
  user: User;
  weeklyXP: number;
  rank: number;
  joinedAt: Date;
  role: 'member' | 'moderator' | 'leader';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'special';
  xpReward: number;
  requirements: string[];
  startDate: Date;
  endDate: Date;
  participants: number;
  completed: boolean;
}

export interface Leaderboard {
  id: string;
  type: 'global' | 'country' | 'career-track' | 'squad';
  period: 'daily' | 'weekly' | 'monthly' | 'all-time';
  entries: LeaderboardEntry[];
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  user: User;
  score: number;
  change: number;
  badge?: string;
}

export interface PersonalizedVideo {
  id: string;
  userId: string;
  type: 'motivation' | 'progress' | 'milestone' | 'reminder' | 'celebration';
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: Date;
  watched: boolean;
  duration: number;
  personalizedElements: string[];
}

export interface LearningFeed {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'tutorial' | 'course' | 'tool';
  url: string;
  thumbnailUrl?: string;
  provider: string;
  careerTracks: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration?: number;
  rating: number;
  views: number;
  tags: string[];
  featured: boolean;
}

export interface LanguageSettings {
  primary: string;
  secondary?: string;
  autoTranslate: boolean;
  voiceLanguage: string;
  region: string;
}

export interface ProgressAnalytics {
  userId: string;
  totalStudyTime: number;
  averageSessionTime: number;
  completionRate: number;
  strongestSkills: string[];
  improvementAreas: string[];
  learningVelocity: number;
  consistencyScore: number;
  weeklyStats: WeeklyStats[];
  monthlyStats: MonthlyStats[];
}

export interface WeeklyStats {
  week: string;
  studyTime: number;
  lessonsCompleted: number;
  xpEarned: number;
  projectsSubmitted: number;
  streakDays: number;
}

export interface MonthlyStats {
  month: string;
  studyTime: number;
  lessonsCompleted: number;
  xpEarned: number;
  projectsCompleted: number;
  certificatesEarned: number;
  skillsLearned: string[];
}

export interface ProjectSubmission {
  id: string;
  projectId: string;
  userId: string;
  submissionType: 'github' | 'live-url' | 'file-upload' | 'video-demo';
  submissionUrl: string;
  description: string;
  submittedAt: Date;
  status: 'pending' | 'under-review' | 'approved' | 'rejected' | 'needs-revision';
  feedback?: ProjectFeedback;
  reviewedAt?: Date;
  files?: FileAttachment[];
}

export interface MentorSession {
  id: string;
  userId: string;
  type: 'chat' | 'video' | 'code-review' | 'career-guidance';
  startTime: Date;
  endTime?: Date;
  topic: string;
  summary?: string;
  actionItems: string[];
  rating?: number;
  feedback?: string;
  mentorType: 'ai' | 'human' | 'peer';
}

export interface CareerAssessment {
  id: string;
  userId: string;
  type: 'initial' | 'reassessment' | 'skill-check' | 'career-pivot';
  completedAt: Date;
  results: QuizResult;
  previousResults?: QuizResult[];
  recommendations: string[];
  nextSteps: string[];
  confidenceLevel: number;
}