import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Github, 
  ExternalLink, 
  FileText, 
  Video,
  CheckCircle,
  AlertCircle,
  X,
  Send,
  Loader
} from 'lucide-react';
import { Project, ProjectSubmission as ProjectSubmissionType } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/supabase';

interface ProjectSubmissionProps {
  project: Project;
  onSubmit: (submission: Partial<ProjectSubmissionType>) => void;
  onClose: () => void;
  currentLanguage?: string;
}

export default function ProjectSubmission({ project, onSubmit, onClose, currentLanguage = 'en' }: ProjectSubmissionProps) {
  const [submissionType, setSubmissionType] = useState<'github' | 'live-url' | 'file-upload' | 'video-demo'>('github');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const t = useTranslation(currentLanguage);

  const submissionTypes = [
    {
      id: 'github' as const,
      title: t('projectSubmission.githubRepo'),
      description: 'Share your code repository',
      icon: Github,
      placeholder: 'https://github.com/username/project-name'
    },
    {
      id: 'live-url' as const,
      title: t('projectSubmission.liveDemo'),
      description: 'Share a deployed version',
      icon: ExternalLink,
      placeholder: 'https://your-project.netlify.app'
    },
    {
      id: 'file-upload' as const,
      title: t('projectSubmission.fileUpload'),
      description: 'Upload project files directly',
      icon: Upload,
      placeholder: 'Upload your project files'
    },
    {
      id: 'video-demo' as const,
      title: t('projectSubmission.videoDemo'),
      description: 'Record a demonstration',
      icon: Video,
      placeholder: 'https://youtube.com/watch?v=...'
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...uploadedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to submit a project');
      return;
    }
    
    if (!submissionUrl && submissionType !== 'file-upload') return;
    if (submissionType === 'file-upload' && files.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      // In a real implementation, we would upload files to storage here
      let fileUrls: string[] = [];
      if (submissionType === 'file-upload' && files.length > 0) {
        // Mock file upload - in real app, upload to Supabase Storage
        fileUrls = files.map(file => URL.createObjectURL(file));
      }

      // Update project status in database
      if (project.id) {
        await db.updateProjectProgress(project.id, true);
      }

      // Create submission object
      const submission: Partial<ProjectSubmissionType> = {
        projectId: project.id,
        userId: user.id,
        submissionType,
        submissionUrl: submissionType === 'file-upload' ? fileUrls.join(',') : submissionUrl,
        description,
        submittedAt: new Date(),
        status: 'pending'
      };

      // Update user XP
      if (user && project.xpReward) {
        await db.updateUser(user.id, {
          xp: user.xp + project.xpReward,
          total_xp: user.total_xp + project.xpReward
        });
      }

      // Call the onSubmit callback
      onSubmit(submission);
    } catch (err: any) {
      console.error('❌ Error submitting project:', err);
      setError('Failed to submit project. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = () => {
    if (submissionType === 'file-upload') return files.length > 0;
    return submissionUrl.trim().length > 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto transition-colors"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('projectSubmission.title')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{project.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}
          
          {/* Project Requirements */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">{t('projectSubmission.requirements')}</h3>
            <ul className="space-y-1 text-blue-800 dark:text-blue-200">
              {project.requirements.map((req, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm">{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Submission Type Selection */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('projectSubmission.howToSubmit')}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {submissionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSubmissionType(type.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    submissionType === type.id
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <type.icon className={`w-5 h-5 ${
                      submissionType === type.id ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'
                    }`} />
                    <h4 className={`font-medium ${
                      submissionType === type.id ? 'text-primary-900 dark:text-primary-100' : 'text-gray-900 dark:text-white'
                    }`}>
                      {type.title}
                    </h4>
                  </div>
                  <p className={`text-sm ${
                    submissionType === type.id ? 'text-primary-700 dark:text-primary-300' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {type.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Submission Input */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              {submissionTypes.find(t => t.id === submissionType)?.title}
            </h3>
            
            {submissionType === 'file-upload' ? (
              <div>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <Upload className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Drag and drop your files here, or click to browse
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    accept=".zip,.rar,.tar,.gz,.js,.jsx,.ts,.tsx,.html,.css,.json,.md,.txt,.pdf,.png,.jpg,.jpeg"
                  />
                  <label
                    htmlFor="file-upload"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </label>
                </div>
                
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">Uploaded Files:</h4>
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <input
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder={submissionTypes.find(t => t.id === submissionType)?.placeholder}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('projectSubmission.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project, the technologies used, challenges faced, and what you learned..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={4}
            />
          </div>

          {/* Technologies Used */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">{t('projectSubmission.technologies')}:</h4>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Submission Guidelines */}
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-1">{t('projectSubmission.guidelines')}</h4>
                <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
                  <li>• Ensure your project meets all requirements listed above</li>
                  <li>• Include clear documentation or README file</li>
                  <li>• Test your project thoroughly before submission</li>
                  <li>• Provide working links and ensure they're accessible</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            {t('projectSubmission.cancel')}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid() || isSubmitting}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>{t('projectSubmission.submitting')}</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>{t('projectSubmission.submit')}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}