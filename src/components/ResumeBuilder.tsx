import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  User, 
  Briefcase, 
  GraduationCap, 
  Award,
  Code,
  Plus,
  X,
  Sparkles,
  Eye,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin
} from 'lucide-react';
import { Resume, User as UserType, WorkExperience, Education } from '../types';
import { useTranslation } from '../utils/translations';

interface ResumeBuilderProps {
  user: UserType;
  onClose: () => void;
  currentLanguage?: string;
}

export default function ResumeBuilder({ user, onClose, currentLanguage = 'en' }: ResumeBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [resume, setResume] = useState<Partial<Resume>>({
    personalInfo: {
      name: user.name,
      email: user.email,
      github: user.githubUrl,
      portfolio: user.portfolioUrl
    },
    skills: [],
    projects: [],
    experience: [],
    education: [],
    certifications: user.certificates,
    template: 'modern'
  });
  
  const t = useTranslation(currentLanguage);

  const steps = [
    { id: 'personal', title: t('resumeBuilder.personalInfo'), icon: User },
    { id: 'summary', title: t('resumeBuilder.summary'), icon: FileText },
    { id: 'experience', title: t('resumeBuilder.experience'), icon: Briefcase },
    { id: 'education', title: t('resumeBuilder.education'), icon: GraduationCap },
    { id: 'skills', title: t('resumeBuilder.skills'), icon: Code },
    { id: 'projects', title: t('resumeBuilder.projects'), icon: Award },
    { id: 'preview', title: t('resumeBuilder.preview'), icon: Eye }
  ];

  const templates = [
    { 
      id: 'modern', 
      name: 'Modern', 
      description: 'Clean and contemporary design with accent colors',
      preview: 'bg-gradient-to-br from-blue-50 to-indigo-100 border-l-4 border-blue-500'
    },
    { 
      id: 'classic', 
      name: 'Classic', 
      description: 'Traditional professional layout in black and white',
      preview: 'bg-white border border-gray-300 shadow-sm'
    },
    { 
      id: 'creative', 
      name: 'Creative', 
      description: 'Bold design with vibrant colors for creative roles',
      preview: 'bg-gradient-to-br from-purple-50 to-pink-100 border-l-4 border-purple-500'
    },
    { 
      id: 'minimal', 
      name: 'Minimal', 
      description: 'Simple and elegant with lots of white space',
      preview: 'bg-gray-50 border border-gray-200'
    }
  ];

  const generateAISummary = () => {
    const summary = `Passionate ${user.careerPath || 'Software Developer'} with hands-on experience in modern web technologies. Completed comprehensive training through SkillPilot's personalized learning path, building ${user.certificates.length} certified projects. Strong foundation in problem-solving and continuous learning, with ${user.completed_lessons} lessons completed and ${user.total_xp} XP earned. Eager to contribute to innovative projects and grow within a collaborative team environment.`;
    
    setResume(prev => ({ ...prev, summary }));
  };

  const addSkill = (skill: string) => {
    if (skill && !resume.skills?.includes(skill)) {
      setResume(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setResume(prev => ({
      ...prev,
      skills: prev.skills?.filter(s => s !== skill) || []
    }));
  };

  const addProject = () => {
    const newProject = {
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: ''
    };
    setResume(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProject]
    }));
  };

  const updateProject = (index: number, field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects?.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      ) || []
    }));
  };

  const removeProject = (index: number) => {
    setResume(prev => ({
      ...prev,
      projects: prev.projects?.filter((_, i) => i !== index) || []
    }));
  };

  // Experience management functions
  const addExperience = () => {
    const newExperience: WorkExperience = {
      company: '',
      position: '',
      startDate: new Date(),
      endDate: undefined,
      description: '',
      current: false,
      achievements: []
    };
    setResume(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newExperience]
    }));
  };

  const updateExperience = (index: number, field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience?.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      ) || []
    }));
  };

  const removeExperience = (index: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience?.filter((_, i) => i !== index) || []
    }));
  };

  const addAchievement = (expIndex: number, achievement: string) => {
    if (achievement.trim()) {
      setResume(prev => ({
        ...prev,
        experience: prev.experience?.map((exp, i) => 
          i === expIndex ? { 
            ...exp, 
            achievements: [...(exp.achievements || []), achievement.trim()]
          } : exp
        ) || []
      }));
    }
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    setResume(prev => ({
      ...prev,
      experience: prev.experience?.map((exp, i) => 
        i === expIndex ? { 
          ...exp, 
          achievements: exp.achievements?.filter((_, ai) => ai !== achIndex) || []
        } : exp
      ) || []
    }));
  };

  // Education management functions
  const addEducation = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      field: '',
      startDate: new Date(),
      endDate: undefined,
      current: false,
      gpa: '',
      honors: []
    };
    setResume(prev => ({
      ...prev,
      education: [...(prev.education || []), newEducation]
    }));
  };

  const updateEducation = (index: number, field: string, value: any) => {
    setResume(prev => ({
      ...prev,
      education: prev.education?.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      ) || []
    }));
  };

  const removeEducation = (index: number) => {
    setResume(prev => ({
      ...prev,
      education: prev.education?.filter((_, i) => i !== index) || []
    }));
  };

  const downloadResume = () => {
    // In a real app, this would generate and download a PDF
    alert('Resume download feature would be implemented with PDF generation library');
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const renderTemplatePreview = () => {
    const template = resume.template || 'modern';
    
    const templateStyles = {
      modern: {
        container: 'bg-white border-l-4 border-blue-500 shadow-lg',
        header: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200',
        name: 'text-2xl font-bold text-blue-900',
        contact: 'text-blue-700',
        section: 'border-l-2 border-blue-200 pl-4 mb-6',
        sectionTitle: 'text-lg font-semibold text-blue-800 mb-3',
        text: 'text-gray-700'
      },
      classic: {
        container: 'bg-white border border-gray-300 shadow-sm',
        header: 'border-b-2 border-black pb-4 mb-6',
        name: 'text-2xl font-bold text-black',
        contact: 'text-gray-800',
        section: 'mb-6',
        sectionTitle: 'text-lg font-bold text-black mb-2 uppercase tracking-wide border-b border-gray-400 pb-1',
        text: 'text-gray-800'
      },
      creative: {
        container: 'bg-gradient-to-br from-purple-50 to-pink-50 border-l-4 border-purple-500 shadow-xl',
        header: 'bg-gradient-to-r from-purple-100 to-pink-100 border-b border-purple-200 rounded-t-lg',
        name: 'text-2xl font-bold text-purple-900',
        contact: 'text-purple-700',
        section: 'bg-white/50 rounded-lg p-4 mb-4 border border-purple-200',
        sectionTitle: 'text-lg font-bold text-purple-800 mb-3',
        text: 'text-gray-700'
      },
      minimal: {
        container: 'bg-white border border-gray-100 shadow-sm',
        header: 'pb-8 mb-8',
        name: 'text-3xl font-light text-gray-900',
        contact: 'text-gray-600',
        section: 'mb-8',
        sectionTitle: 'text-sm font-medium text-gray-900 uppercase tracking-widest mb-4',
        text: 'text-gray-600'
      }
    };

    const styles = templateStyles[template as keyof typeof templateStyles];

    return (
      <div className={`${styles.container} rounded-lg p-8 max-w-2xl mx-auto`}>
        {/* Header */}
        <div className={styles.header}>
          <div className="text-center mb-6">
            <h1 className={styles.name}>{resume.personalInfo?.name || 'Your Name'}</h1>
            <div className={`${styles.contact} text-sm mt-2 space-y-1`}>
              {resume.personalInfo?.email && (
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{resume.personalInfo.email}</span>
                </div>
              )}
              {resume.personalInfo?.phone && (
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{resume.personalInfo.phone}</span>
                </div>
              )}
              {resume.personalInfo?.location && (
                <div className="flex items-center justify-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{resume.personalInfo.location}</span>
                </div>
              )}
              <div className="flex items-center justify-center space-x-4 mt-2">
                {resume.personalInfo?.linkedin && (
                  <div className="flex items-center space-x-1">
                    <Linkedin className="w-4 h-4" />
                    <span className="text-xs">LinkedIn</span>
                  </div>
                )}
                {resume.personalInfo?.github && (
                  <div className="flex items-center space-x-1">
                    <Github className="w-4 h-4" />
                    <span className="text-xs">GitHub</span>
                  </div>
                )}
                {resume.personalInfo?.portfolio && (
                  <div className="flex items-center space-x-1">
                    <Globe className="w-4 h-4" />
                    <span className="text-xs">Portfolio</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Summary */}
        {resume.summary && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional Summary</h2>
            <p className={`${styles.text} leading-relaxed`}>{resume.summary}</p>
          </div>
        )}
        
        {/* Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            {resume.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className={`font-semibold ${styles.text}`}>{exp.position}</h3>
                    <p className={`${styles.contact} font-medium`}>{exp.company}</p>
                  </div>
                  <div className={`${styles.contact} text-sm`}>
                    {formatDate(exp.startDate)} - {exp.current ? 'Present' : exp.endDate ? formatDate(exp.endDate) : 'Present'}
                  </div>
                </div>
                {exp.description && (
                  <p className={`${styles.text} text-sm mb-2`}>{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className={`${styles.text} text-sm space-y-1`}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            {resume.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${styles.text}`}>{edu.degree} in {edu.field}</h3>
                    <p className={`${styles.contact} font-medium`}>{edu.institution}</p>
                    {edu.gpa && (
                      <p className={`${styles.contact} text-sm`}>GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <div className={`${styles.contact} text-sm`}>
                    {formatDate(edu.startDate)} - {edu.current ? 'Present' : edu.endDate ? formatDate(edu.endDate) : 'Present'}
                  </div>
                </div>
                {edu.honors && edu.honors.length > 0 && (
                  <div className={`${styles.text} text-sm mt-1`}>
                    <span className="font-medium">Honors: </span>
                    {edu.honors.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Technical Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <span key={index} className={`px-2 py-1 text-xs rounded ${
                  template === 'modern' ? 'bg-blue-100 text-blue-800' :
                  template === 'creative' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            {resume.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <h3 className={`font-semibold ${styles.text}`}>{project.name}</h3>
                <p className={`${styles.text} text-sm`}>{project.description}</p>
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-1">
                    <span className={`${styles.contact} text-xs font-medium`}>Technologies: </span>
                    <span className={`${styles.text} text-xs`}>{project.technologies.join(', ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderStep = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('resumeBuilder.personalInfo')}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  value={resume.personalInfo?.name || ''}
                  onChange={(e) => setResume(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, name: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={resume.personalInfo?.email || ''}
                  onChange={(e) => setResume(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, email: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  value={resume.personalInfo?.phone || ''}
                  onChange={(e) => setResume(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, phone: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={resume.personalInfo?.location || ''}
                  onChange={(e) => setResume(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, location: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">LinkedIn</label>
                <input
                  type="url"
                  value={resume.personalInfo?.linkedin || ''}
                  onChange={(e) => setResume(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GitHub</label>
                <input
                  type="url"
                  value={resume.personalInfo?.github || ''}
                  onChange={(e) => setResume(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, github: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Portfolio Website</label>
                <input
                  type="url"
                  value={resume.personalInfo?.portfolio || ''}
                  onChange={(e) => setResume(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, portfolio: e.target.value }
                  }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('resumeBuilder.summary')}</h3>
              <button
                onClick={generateAISummary}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Sparkles className="w-4 h-4" />
                <span>{t('resumeBuilder.generateAI')}</span>
              </button>
            </div>
            <textarea
              value={resume.summary || ''}
              onChange={(e) => setResume(prev => ({ ...prev, summary: e.target.value }))}
              placeholder="Write a compelling summary that highlights your skills and experience..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 h-32 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Work Experience</h3>
              <button
                onClick={addExperience}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>
            <div className="space-y-6">
              {resume.experience?.map((exp, index) => (
                <div key={index} className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeExperience(index)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company</label>
                      <input
                        type="text"
                        placeholder="Company Name"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                      <input
                        type="text"
                        placeholder="Job Title"
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                      <input
                        type="month"
                        value={exp.startDate.toISOString().slice(0, 7)}
                        onChange={(e) => updateExperience(index, 'startDate', new Date(e.target.value))}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                      <input
                        type="month"
                        value={exp.endDate ? exp.endDate.toISOString().slice(0, 7) : ''}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                        disabled={exp.current}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExperience(index, 'current', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span>Current Position</span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Job Description</label>
                    <textarea
                      placeholder="Describe your role and responsibilities..."
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Key Achievements</label>
                    <div className="space-y-2">
                      {exp.achievements?.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...(exp.achievements || [])];
                              newAchievements[achIndex] = e.target.value;
                              updateExperience(index, 'achievements', newAchievements);
                            }}
                            className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <button
                            onClick={() => removeAchievement(index, achIndex)}
                            className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addAchievement(index, '')}
                        className="flex items-center space-x-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Achievement</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!resume.experience || resume.experience.length === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No work experience added yet. Click "Add Experience" to get started.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Education</h3>
              <button
                onClick={addEducation}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>
            <div className="space-y-6">
              {resume.education?.map((edu, index) => (
                <div key={index} className="p-6 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Education {index + 1}</h4>
                    <button
                      onClick={() => removeEducation(index)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Institution</label>
                      <input
                        type="text"
                        placeholder="University/School Name"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Degree</label>
                      <input
                        type="text"
                        placeholder="Bachelor's, Master's, etc."
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Field of Study</label>
                      <input
                        type="text"
                        placeholder="Computer Science, Engineering, etc."
                        value={edu.field}
                        onChange={(e) => updateEducation(index, 'field', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">GPA (Optional)</label>
                      <input
                        type="text"
                        placeholder="3.8/4.0"
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
                      <input
                        type="month"
                        value={edu.startDate.toISOString().slice(0, 7)}
                        onChange={(e) => updateEducation(index, 'startDate', new Date(e.target.value))}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End Date</label>
                      <input
                        type="month"
                        value={edu.endDate ? edu.endDate.toISOString().slice(0, 7) : ''}
                        onChange={(e) => updateEducation(index, 'endDate', e.target.value ? new Date(e.target.value) : undefined)}
                        disabled={edu.current}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white disabled:opacity-50"
                      />
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                        <input
                          type="checkbox"
                          checked={edu.current}
                          onChange={(e) => updateEducation(index, 'current', e.target.checked)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span>Currently Enrolled</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Honors & Awards (Optional)</label>
                    <input
                      type="text"
                      placeholder="Dean's List, Magna Cum Laude, etc. (comma separated)"
                      value={edu.honors?.join(', ') || ''}
                      onChange={(e) => updateEducation(index, 'honors', e.target.value.split(',').map(h => h.trim()).filter(h => h))}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              ))}
              
              {(!resume.education || resume.education.length === 0) && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No education added yet. Click "Add Education" to get started.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('resumeBuilder.skills')}</h3>
            <div>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  placeholder={t('resumeBuilder.addSkill')}
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill((e.target as HTMLInputElement).value);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder*="Add a skill"]') as HTMLInputElement;
                    if (input) {
                      addSkill(input.value);
                      input.value = '';
                    }
                  }}
                  className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {resume.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="flex items-center space-x-2 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('resumeBuilder.projects')}</h3>
              <button
                onClick={addProject}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Plus className="w-4 h-4" />
                <span>{t('resumeBuilder.addProject')}</span>
              </button>
            </div>
            <div className="space-y-4">
              {resume.projects?.map((project, index) => (
                <div key={index} className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">Project {index + 1}</h4>
                    <button
                      onClick={() => removeProject(index)}
                      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      type="url"
                      placeholder="Live URL"
                      value={project.url || ''}
                      onChange={(e) => updateProject(index, 'url', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <textarea
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="Technologies used (comma separated)"
                    value={project.technologies?.join(', ') || ''}
                    onChange={(e) => updateProject(index, 'technologies', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'preview':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('resumeBuilder.preview')}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={downloadResume}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('resumeBuilder.downloadPDF')}</span>
                </button>
              </div>
            </div>
            
            {/* Template Selection */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Choose Template</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setResume(prev => ({ ...prev, template: template.id }))}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      resume.template === template.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className={`w-full h-24 rounded mb-3 ${template.preview}`}></div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">{template.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Resume Preview */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {renderTemplatePreview()}
            </div>
          </div>
        );

      default:
        return <div>Step not implemented</div>;
    }
  };

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
            <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('resumeBuilder.title')}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('resumeBuilder.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  currentStep === index
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : currentStep > index
                    ? 'bg-secondary-100 dark:bg-secondary-900/30 text-secondary-700 dark:text-secondary-300'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <step.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{step.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('resumeBuilder.previous')}
          </button>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === steps.length - 1 ? t('resumeBuilder.finish') : t('resumeBuilder.next')}
          </button>
        </div>
      </motion.div>
    </div>
  );
}