import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Trophy, 
  Video, 
  MessageSquare,
  Star,
  ExternalLink,
  Bell,
  BellOff,
  Filter,
  Search,
  X,
  Loader,
  CheckCircle,
  AlertTriangle,
  User,
  Mail,
  Link,
  Github
} from 'lucide-react';
import { LiveEvent } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/supabase';

interface LiveEventsProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

interface EventRegistration {
  eventId: string;
  fullName: string;
  email: string;
  portfolioLink?: string;
}

export default function LiveEvents({ isOpen, onClose, currentLanguage = 'en' }: LiveEventsProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<LiveEvent | null>(null);
  const [registrationForm, setRegistrationForm] = useState({
    fullName: '',
    email: '',
    portfolioLink: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { user } = useAuth();
  const t = useTranslation(currentLanguage);

  useEffect(() => {
    if (isOpen) {
      loadEvents();
      loadRegistrations();
    }
  }, [isOpen]);

  // Load user's registered events from localStorage
  const loadRegistrations = () => {
    if (user) {
      const savedRegistrations = localStorage.getItem(`event_registrations_${user.id}`);
      if (savedRegistrations) {
        setRegisteredEvents(new Set(JSON.parse(savedRegistrations)));
      }
    }
  };

  // Save registrations to localStorage
  const saveRegistrations = (registrations: Set<string>) => {
    if (user) {
      localStorage.setItem(`event_registrations_${user.id}`, JSON.stringify([...registrations]));
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await db.getLiveEvents();

      if (error) {
        console.error('❌ Error loading live events:', error);
        return;
      }

      if (data && data.length > 0) {
        // Transform data to match our LiveEvent interface
        const transformedEvents: LiveEvent[] = data.map(event => ({
          id: event.id,
          title: event.title,
          description: event.description,
          type: event.type,
          startTime: new Date(event.start_time),
          endTime: new Date(event.end_time),
          maxParticipants: event.max_participants || undefined,
          currentParticipants: event.current_participants,
          host: event.host,
          registrationRequired: event.registration_required,
          careerTracks: event.career_tracks || [],
          meetingUrl: event.meeting_url || undefined,
          recordingUrl: event.recording_url || undefined,
          prizes: event.prizes || undefined,
          featured: event.featured
        }));

        setEvents(transformedEvents);
      } else {
        // If no events, use mock data
        setEvents(mockEvents);
      }
    } catch (err: any) {
      console.error('❌ Error loading events:', err);
      // Fallback to mock data
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const mockEvents: LiveEvent[] = [
    {
      id: '1',
      title: 'React Hooks Masterclass',
      description: 'Deep dive into advanced React Hooks patterns and custom hooks development',
      type: 'workshop',
      startTime: new Date('2024-02-15T18:00:00'),
      endTime: new Date('2024-02-15T20:00:00'),
      maxParticipants: 100,
      currentParticipants: 67,
      host: 'Sarah Chen - Senior React Developer',
      registrationRequired: true,
      careerTracks: ['Frontend Developer'],
      featured: true
    },
    {
      id: '2',
      title: 'AI/ML Career AMA',
      description: 'Ask anything about breaking into AI and Machine Learning careers',
      type: 'ama',
      startTime: new Date('2024-02-16T19:00:00'),
      endTime: new Date('2024-02-16T20:30:00'),
      maxParticipants: 200,
      currentParticipants: 143,
      host: 'Dr. Alex Kumar - ML Engineer at Google',
      registrationRequired: true,
      careerTracks: ['Data Scientist', 'AI Engineer'],
      featured: false
    },
    {
      id: '3',
      title: 'Build a Full-Stack App Hackathon',
      description: '48-hour hackathon to build a complete web application',
      type: 'hackathon',
      startTime: new Date('2024-02-20T09:00:00'),
      endTime: new Date('2024-02-22T18:00:00'),
      maxParticipants: 50,
      currentParticipants: 32,
      host: 'SkillPilot Team',
      registrationRequired: true,
      careerTracks: ['Frontend Developer', 'Backend Developer', 'Full Stack Developer'],
      prizes: ['$1000 First Prize', '$500 Second Prize', '$250 Third Prize'],
      featured: true
    },
    {
      id: '4',
      title: 'From Bootcamp to FAANG',
      description: 'Success stories and tips from developers who made it to top tech companies',
      type: 'career-talk',
      startTime: new Date('2024-02-18T17:00:00'),
      endTime: new Date('2024-02-18T18:30:00'),
      maxParticipants: 300,
      currentParticipants: 256,
      host: 'Multiple FAANG Engineers',
      registrationRequired: false,
      careerTracks: ['Frontend Developer', 'Backend Developer', 'Data Scientist'],
      featured: false
    },
    {
      id: '5',
      title: 'Portfolio Project Showcase',
      description: 'Present your projects and get feedback from industry experts',
      type: 'project-showcase',
      startTime: new Date('2024-02-25T16:00:00'),
      endTime: new Date('2024-02-25T18:00:00'),
      maxParticipants: 30,
      currentParticipants: 18,
      host: 'Industry Panel',
      registrationRequired: true,
      careerTracks: ['Frontend Developer', 'Backend Developer', 'UX/UI Designer'],
      featured: false
    }
  ];

  const eventTypes = [
    { id: 'all', name: t('liveEvents.allEvents'), count: events.length },
    { id: 'workshop', name: t('liveEvents.workshops'), count: events.filter(e => e.type === 'workshop').length },
    { id: 'hackathon', name: t('liveEvents.hackathons'), count: events.filter(e => e.type === 'hackathon').length },
    { id: 'ama', name: t('liveEvents.amas'), count: events.filter(e => e.type === 'ama').length },
    { id: 'career-talk', name: t('liveEvents.careerTalks'), count: events.filter(e => e.type === 'career-talk').length }
  ];

  const filteredEvents = events.filter(event => {
    const matchesFilter = selectedFilter === 'all' || event.type === selectedFilter;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleRegistration = (event: LiveEvent) => {
    if (!user) return;
    
    if (registeredEvents.has(event.id)) {
      // Show confirmation for unregistering
      if (confirm(`Are you sure you want to cancel your registration for "${event.title}"?`)) {
        const newRegistrations = new Set(registeredEvents);
        newRegistrations.delete(event.id);
        setRegisteredEvents(newRegistrations);
        saveRegistrations(newRegistrations);
        
        // Show toast
        setToastMessage(`You've unregistered from "${event.title}"`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } else {
      // Open registration modal
      setSelectedEvent(event);
      setRegistrationForm({
        fullName: user.name,
        email: user.email,
        portfolioLink: user.portfolio_url || ''
      });
      setShowRegistrationModal(true);
    }
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const errors: Record<string, string> = {};
    if (!registrationForm.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!registrationForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registrationForm.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedEvent) {
        // Add to registered events
        const newRegistrations = new Set(registeredEvents);
        newRegistrations.add(selectedEvent.id);
        setRegisteredEvents(newRegistrations);
        saveRegistrations(newRegistrations);
        
        // Save registration details
        const registrations = JSON.parse(localStorage.getItem('event_registrations_details') || '[]');
        registrations.push({
          eventId: selectedEvent.id,
          eventTitle: selectedEvent.title,
          eventDate: selectedEvent.startTime,
          eventType: selectedEvent.type,
          fullName: registrationForm.fullName,
          email: registrationForm.email,
          portfolioLink: registrationForm.portfolioLink,
          registeredAt: new Date()
        });
        localStorage.setItem('event_registrations_details', JSON.stringify(registrations));
        
        // Close modal and show toast
        setShowRegistrationModal(false);
        setToastMessage(`You've successfully registered for "${selectedEvent.title}"`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
      
      setIsSubmitting(false);
    }, 1000);
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return Video;
      case 'hackathon': return Trophy;
      case 'ama': return MessageSquare;
      case 'career-talk': return Users;
      case 'project-showcase': return Star;
      default: return Calendar;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'hackathon': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
      case 'ama': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      case 'career-talk': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
      case 'project-showcase': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
    }
  };

  const formatEventTime = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const isEventLive = (event: LiveEvent) => {
    const now = new Date();
    return now >= event.startTime && now <= event.endTime;
  };

  const isEventUpcoming = (event: LiveEvent) => {
    const now = new Date();
    return now < event.startTime;
  };

  const isEventFull = (event: LiveEvent) => {
    return event.maxParticipants !== undefined && event.currentParticipants >= event.maxParticipants;
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
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('liveEvents.title')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('liveEvents.subtitle')}</p>
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
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 p-6">
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder={t('liveEvents.searchEvents')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t('liveEvents.eventTypes')}</h3>
                <div className="space-y-1">
                  {eventTypes.map(type => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedFilter(type.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedFilter === type.id
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-sm">{type.name}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                        {type.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{t('liveEvents.thisWeek')}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('liveEvents.events')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{events.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('liveEvents.registered')}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{registeredEvents.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{t('liveEvents.liveNow')}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {events.filter(e => isEventLive(e)).length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Loading events...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Featured Events */}
                {filteredEvents.some(e => e.featured) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('liveEvents.featuredEvents')}</h3>
                    <div className="grid gap-4">
                      {filteredEvents.filter(e => e.featured).map((event, index) => {
                        const EventIcon = getEventTypeIcon(event.type);
                        const isRegistered = registeredEvents.has(event.id);
                        const isLive = isEventLive(event);
                        const isUpcoming = isEventUpcoming(event);
                        const isFull = isEventFull(event);

                        return (
                          <motion.div
                            key={event.id}
                            className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 border border-primary-200 dark:border-primary-700 rounded-xl p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start space-x-4">
                                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                                  <EventIcon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                                    {isLive && (
                                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                                        LIVE
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-4 h-4" />
                                      <span>{formatEventTime(event.startTime)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Users className="w-4 h-4" />
                                      <span>{event.currentParticipants}/{event.maxParticipants || '∞'}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleRegistration(event)}
                                  className={`p-2 rounded-lg transition-colors ${
                                    isRegistered ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                  }`}
                                >
                                  {isRegistered ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                                </button>
                                <button
                                  onClick={() => {
                                    if (isLive && event.meetingUrl) {
                                      window.open(event.meetingUrl, '_blank');
                                    } else if (!isRegistered && !isFull) {
                                      toggleRegistration(event);
                                    }
                                  }}
                                  disabled={!isLive && isRegistered || (!isLive && isFull)}
                                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    isLive && event.meetingUrl
                                      ? 'bg-red-500 text-white hover:bg-red-600'
                                      : isRegistered
                                      ? 'bg-secondary-500 text-white hover:bg-secondary-600'
                                      : isFull
                                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                      : 'bg-primary-600 text-white hover:bg-primary-700'
                                  }`}
                                >
                                  {isLive && event.meetingUrl 
                                    ? t('liveEvents.joinNow') 
                                    : isRegistered 
                                    ? t('liveEvents.registered') 
                                    : isFull 
                                    ? 'Event Full' 
                                    : t('liveEvents.register')}
                                </button>
                              </div>
                            </div>
                            
                            {event.prizes && (
                              <div className="bg-white dark:bg-gray-800 bg-opacity-50 dark:bg-opacity-50 rounded-lg p-3 mb-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Trophy className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                  <span className="font-medium text-gray-900 dark:text-white">Prizes</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {event.prizes.map((prize, i) => (
                                    <span key={i} className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
                                      {prize}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {event.careerTracks.map((track, i) => (
                                <span key={i} className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full">
                                  {track}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* All Events */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('liveEvents.allEvents')}</h3>
                  <div className="space-y-4">
                    {filteredEvents.map((event, index) => {
                      const EventIcon = getEventTypeIcon(event.type);
                      const isRegistered = registeredEvents.has(event.id);
                      const isLive = isEventLive(event);
                      const isUpcoming = isEventUpcoming(event);
                      const isFull = isEventFull(event);

                      return (
                        <motion.div
                          key={event.id}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4 flex-1">
                              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <EventIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-2">
                                  <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
                                  <span className={`px-2 py-1 text-xs rounded-full ${getEventTypeColor(event.type)}`}>
                                    {event.type.replace('-', ' ')}
                                  </span>
                                  {isLive && (
                                    <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                                      LIVE
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 mb-3">{event.description}</p>
                                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{formatEventTime(event.startTime)}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Users className="w-4 h-4" />
                                    <span>{event.currentParticipants}/{event.maxParticipants || '∞'}</span>
                                  </div>
                                  <span className="text-gray-500 dark:text-gray-400">by {event.host}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => toggleRegistration(event)}
                                className={`p-2 rounded-lg transition-colors ${
                                  isRegistered ? 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20' : 'text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                              >
                                {isRegistered ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                              </button>
                              <button
                                onClick={() => {
                                  if (isLive && event.meetingUrl) {
                                    window.open(event.meetingUrl, '_blank');
                                  } else if (!isRegistered && !isFull) {
                                    toggleRegistration(event);
                                  }
                                }}
                                disabled={!isLive && isRegistered || (!isLive && isFull)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                  isLive && event.meetingUrl
                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                    : isRegistered
                                    ? 'bg-secondary-500 text-white hover:bg-secondary-600'
                                    : isFull
                                    ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                    : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                              >
                                {isLive && event.meetingUrl 
                                  ? t('liveEvents.joinNow') 
                                  : isRegistered 
                                  ? t('liveEvents.registered') 
                                  : isFull 
                                  ? 'Event Full' 
                                  : t('liveEvents.register')}
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {filteredEvents.length === 0 && !loading && (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {searchQuery ? 'Try adjusting your search terms' : 'Check back later for upcoming events'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Registration Modal */}
        <AnimatePresence>
          {showRegistrationModal && selectedEvent && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Register for Event</h3>
                  <button
                    onClick={() => setShowRegistrationModal(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getEventTypeColor(selectedEvent.type)}`}>
                      {React.createElement(getEventTypeIcon(selectedEvent.type), { className: "w-5 h-5" })}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{selectedEvent.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatEventTime(selectedEvent.startTime)}</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleRegistrationSubmit}>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                          <input
                            type="text"
                            value={registrationForm.fullName}
                            onChange={(e) => setRegistrationForm({...registrationForm, fullName: e.target.value})}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              formErrors.fullName ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Enter your full name"
                          />
                        </div>
                        {formErrors.fullName && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.fullName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                          <input
                            type="email"
                            value={registrationForm.email}
                            onChange={(e) => setRegistrationForm({...registrationForm, email: e.target.value})}
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                              formErrors.email ? 'border-red-300 dark:border-red-600' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Enter your email address"
                          />
                        </div>
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          GitHub/Portfolio Link (Optional)
                        </label>
                        <div className="relative">
                          <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                          <input
                            type="url"
                            value={registrationForm.portfolioLink}
                            onChange={(e) => setRegistrationForm({...registrationForm, portfolioLink: e.target.value})}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="https://github.com/yourusername"
                          />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full flex items-center justify-center space-x-2 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader className="w-5 h-5 animate-spin" />
                              <span>Registering...</span>
                            </>
                          ) : (
                            <span>Submit Registration</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-md z-[70]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Success</p>
                  <p className="text-gray-600 dark:text-gray-300">{toastMessage}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}