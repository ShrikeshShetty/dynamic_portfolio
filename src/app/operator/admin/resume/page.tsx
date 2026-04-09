'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Loader2, Trash2, FileText, Download } from 'lucide-react';
import type { Resume } from '@/db/schema';

export default function ResumeAdminPage() {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await fetch('/api/resume');
      const data = await res.json();
      setResume(data);
    } catch (error) {
      console.error('Failed to fetch resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'resume');

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadRes.json();

      await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: uploadData.url,
          fileName: file.name,
        }),
      });

      fetchResume();
    } catch (error) {
      alert('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete the resume?')) return;
    try {
      await fetch('/api/resume', { method: 'DELETE' });
      setResume(null);
    } catch (error) {
      alert('Failed to delete resume');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>
        <CardContent>
          {resume ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <FileText className="w-12 h-12 text-primary-600" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {resume.fileName || 'Resume'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Uploaded on {resume.updatedAt ? new Date(resume.updatedAt).toLocaleDateString() : 'Unknown'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" asChild>
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Download className="w-4 h-4 mr-2" />
                      View
                    </a>
                  </Button>
                  <Button variant="outline" onClick={handleDelete} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <input
                    type="file"
                    id="resume-upload-new"
                    accept="application/pdf"
                    onChange={handleUpload}
                    className="hidden"
                  />
                  <label htmlFor="resume-upload-new" className="inline-block cursor-pointer">
                    <Button variant="outline" disabled={uploading} asChild>
                      <span>
                        {uploading ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        Upload New Resume
                      </span>
                    </Button>
                  </label>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                No resume uploaded yet
              </p>
              <input
                type="file"
                id="resume-upload"
                accept="application/pdf"
                onChange={handleUpload}
                className="hidden"
              />
              <label htmlFor="resume-upload" className="inline-block cursor-pointer">
                <Button disabled={uploading} asChild>
                  <span>
                    {uploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload Resume (PDF)
                  </span>
                </Button>
              </label>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
