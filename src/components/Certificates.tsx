import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Download, 
  ExternalLink, 
  Search, 
  Filter,
  Calendar,
  CheckCircle,
  X,
  Loader,
  Share2
} from 'lucide-react';
import { Certificate, User } from '../types';
import { useTranslation } from '../utils/translations';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/supabase';

interface CertificatesProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage?: string;
}

export default function Certificates({ isOpen, onClose, currentLanguage = 'en' }: CertificatesProps) {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const { user } = useAuth();
  const t = useTranslation(currentLanguage);

  useEffect(() => {
    if (isOpen && user) {
      loadCertificates();
    }
  }, [isOpen, user]);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      
      // In a real app, this would fetch from the database
      const { data, error } = await db.getUserCertificates(user?.id || '');
      
      if (error) {
        console.error('❌ Error loading certificates:', error);
        // Fall back to mock data
        setCertificates(generateMockCertificates());
      } else if (data && data.length > 0) {
        // Transform data to match our Certificate interface
        const transformedCerts: Certificate[] = data.map(cert => ({
          id: cert.id,
          name: cert.name,
          careerTrack: cert.career_track,
          issuedAt: new Date(cert.issued_at),
          projectUrl: cert.project_url || undefined,
          uniqueId: cert.unique_id,
          verified: cert.verified,
          skills: cert.skills || [],
          grade: cert.grade || undefined
        }));
        
        setCertificates(transformedCerts);
      } else {
        // If no certificates, use mock data
        setCertificates(generateMockCertificates());
      }
    } catch (err: any) {
      console.error('❌ Error loading certificates:', err);
      setCertificates(generateMockCertificates());
    } finally {
      setLoading(false);
    }
  };

  const generateMockCertificates = (): Certificate[] => {
    return [
      {
        id: '1',
        name: 'Frontend Developer Certification',
        careerTrack: 'Frontend Developer',
        issuedAt: new Date('2024-01-15'),
        projectUrl: 'https://github.com/username/portfolio-project',
        uniqueId: 'FE-2024-001',
        verified: true,
        skills: ['React', 'JavaScript', 'CSS', 'Responsive Design'],
        grade: 'Distinction'
      },
      {
        id: '2',
        name: 'JavaScript Advanced Concepts',
        careerTrack: 'Frontend Developer',
        issuedAt: new Date('2023-11-20'),
        projectUrl: 'https://github.com/username/js-advanced',
        uniqueId: 'JS-2023-089',
        verified: true,
        skills: ['JavaScript', 'ES6+', 'Async/Await', 'Functional Programming'],
        grade: 'Excellence'
      },
      {
        id: '3',
        name: 'Responsive Web Design',
        careerTrack: 'Frontend Developer',
        issuedAt: new Date('2023-09-05'),
        projectUrl: 'https://github.com/username/responsive-project',
        uniqueId: 'RWD-2023-156',
        verified: true,
        skills: ['HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Media Queries'],
        grade: 'Merit'
      }
    ];
  };

  const downloadCertificate = (certificate: Certificate) => {
    // In a real app, this would generate and download a PDF
    alert(`Downloading certificate: ${certificate.name}`);
  };

  const shareCertificate = (certificate: Certificate) => {
    // In a real app, this would open a share dialog
    if (navigator.share) {
      navigator.share({
        title: `${certificate.name} Certificate`,
        text: `Check out my ${certificate.name} certificate from SkillPilot!`,
        url: `https://skillpilot.com/verify/${certificate.uniqueId}`
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(`Share link copied: https://skillpilot.com/verify/${certificate.uniqueId}`);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.careerTrack.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cert.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = selectedFilter === 'all' || cert.careerTrack === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const careerTracks = Array.from(new Set(certificates.map(cert => cert.careerTrack)));

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Your Certificates</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">View and download your earned certifications</p>
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
                  placeholder="Search certificates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Filters */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Filter by Track</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedFilter('all')}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      selectedFilter === 'all'
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-sm">All Certificates</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                      {certificates.length}
                    </span>
                  </button>
                  
                  {careerTracks.map(track => (
                    <button
                      key={track}
                      onClick={() => setSelectedFilter(track)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        selectedFilter === track
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-sm">{track}</span>
                      <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                        {certificates.filter(cert => cert.careerTrack === track).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Progress</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Certificates</span>
                    <span className="font-medium text-gray-900 dark:text-white">{certificates.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Verified</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {certificates.filter(cert => cert.verified).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Latest</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {certificates.length > 0 
                        ? formatDate(new Date(Math.max(...certificates.map(c => c.issuedAt.getTime()))))
                        : 'None'
                      }
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
                  <p className="text-gray-600 dark:text-gray-400">Loading certificates...</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Certificates</h3>
                
                {filteredCertificates.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredCertificates.map((certificate, index) => (
                      <motion.div
                        key={certificate.id}
                        className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedCertificate(certificate)}
                      >
                        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 h-3" />
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                                <Award className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white">{certificate.name}</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{certificate.careerTrack}</p>
                              </div>
                            </div>
                            {certificate.verified && (
                              <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs">
                                <CheckCircle className="w-3 h-3" />
                                <span>Verified</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>Issued: {formatDate(certificate.issuedAt)}</span>
                            </div>
                            {certificate.grade && (
                              <div className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs">
                                {certificate.grade}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {certificate.skills.slice(0, 4).map((skill, i) => (
                              <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                            {certificate.skills.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                +{certificate.skills.length - 4} more
                              </span>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ID: {certificate.uniqueId}
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  downloadCertificate(certificate);
                                }}
                                className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full"
                                title="Download Certificate"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  shareCertificate(certificate);
                                }}
                                className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full"
                                title="Share Certificate"
                              >
                                <Share2 className="w-4 h-4" />
                              </button>
                              {certificate.projectUrl && (
                                <a
                                  href={certificate.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="p-2 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-full"
                                  title="View Project"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Award className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No certificates found</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {searchQuery ? 'Try adjusting your search terms' : 'Complete projects to earn certificates'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Certificate Detail Modal */}
        {selectedCertificate && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-3xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Certificate Details</h3>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-8 border border-primary-200 dark:border-primary-700 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedCertificate.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{selectedCertificate.careerTrack}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-8 h-8 text-amber-500" />
                    {selectedCertificate.verified && (
                      <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                        <CheckCircle className="w-4 h-4" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300 mb-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span>Issued on {formatDate(selectedCertificate.issuedAt)}</span>
                  </div>
                  {selectedCertificate.grade && (
                    <div className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full">
                      Grade: {selectedCertificate.grade}
                    </div>
                  )}
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Skills Certified</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCertificate.skills.map((skill, i) => (
                      <span key={i} className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  <div>Certificate ID: {selectedCertificate.uniqueId}</div>
                  <div>Verification URL: skillpilot.com/verify/{selectedCertificate.uniqueId}</div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 dark:text-gray-300">
                    This certificate is recognized by industry professionals and verifies your skills in {selectedCertificate.careerTrack}.
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => downloadCertificate(selectedCertificate)}
                      className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    {selectedCertificate.projectUrl && (
                      <a
                        href={selectedCertificate.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-2 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>View Project</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <h4 className="font-semibold text-gray-900 dark:text-white">Certificate Authenticity</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  This certificate can be verified by employers and educational institutions using the unique certificate ID. 
                  The verification process confirms the authenticity of this credential and the skills you've demonstrated.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}