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
  Eye
} from 'lucide-react';
import { Resume, User as UserType } from '../types';
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
    { id: 'skills', title: t('resumeBuilder.skills'), icon: Code },
    { id: 'projects', title: t('resumeBuilder.projects'), icon: Briefcase },
    { id: 'experience', title: t('resumeBuilder.experience'), icon: Briefcase },
    { id: 'education', title: t('resumeBuilder.education'), icon: GraduationCap },
    { id: 'preview', title: t('resumeBuilder.preview'), icon: Eye }
  ];

  const templates = [
    { id: 'modern', name: 'Modern', description: 'Clean and contemporary design' },
    { id: 'classic', name: 'Classic', description: 'Traditional professional layout' },
    { id: 'creative', name: 'Creative', description: 'Bold design for creative roles' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and elegant' }
  ];

  const generateAISummary = () => {
    const summary = `Passionate ${user.careerPath || 'Software Developer'} with hands-on experience in modern web technologies. Completed comprehensive training through SkillPilot's personalized learning path, building ${user.certificates.length} certified projects. Strong foundation in problem-solving and continuous learning, with ${user.completedLessons} lessons completed and ${user.totalXp} XP earned. Eager to contribute to innovative projects and grow within a collaborative team environment.`;
    
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

  const downloadResume = () => {
    // In a real app, this would generate and download a PDF
    alert('Resume download feature would be implemented with PDF generation library');
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                <select
                  value={resume.template}
                  onChange={(e) => setResume(prev => ({ ...prev, template: e.target.value }))}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {templates.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={downloadResume}
                  className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
                >
                  <Download className="w-4 h-4" />
                  <span>{t('resumeBuilder.downloadPDF')}</span>
                </button>
              </div>
            </div>
            
            {/* Resume Preview */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{resume.personalInfo?.name}</h1>
                  <p className="text-gray-600 dark:text-gray-300">{resume.personalInfo?.email}</p>
                  <p className="text-gray-600 dark:text-gray-300">{resume.personalInfo?.phone} • {resume.personalInfo?.location}</p>
                </div>
                
                {resume.summary && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('resumeBuilder.summary')}</h2>
                    <p className="text-gray-700 dark:text-gray-300">{resume.summary}</p>
                  </div>
                )}
                
                {resume.skills && resume.skills.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('resumeBuilder.skills')}</h2>
                    <div className="flex flex-wrap gap-2">
                      {resume.skills.map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {resume.projects && resume.projects.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t('resumeBuilder.projects')}</h2>
                    {resume.projects.map((project, index) => (
                      <div key={index} className="mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">{project.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">{project.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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