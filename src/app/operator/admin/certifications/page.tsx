'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Edit, Upload, FileText, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { Certification } from '@/db/schema';

export default function CertificationsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    issuedBy: '',
    certificateUrl: '',
  });

  useEffect(() => {
    fetchCertifications();
  }, []);

  const fetchCertifications = async () => {
    try {
      const res = await fetch('/api/certifications');
      const data = await res.json();
      setCertifications(data);
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'certifications');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      setFormData({ ...formData, certificateUrl: data.url });
    } catch (error) {
      alert('Failed to upload certificate');
    } finally {
      setUploading(false);
    }
  };

  const openEditDialog = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      title: cert.title,
      issuedBy: cert.issuedBy,
      certificateUrl: cert.certificateUrl,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuedBy: '',
      certificateUrl: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCert) {
        await fetch('/api/certifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCert.id, ...formData }),
        });
      } else {
        await fetch('/api/certifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, order: certifications.length }),
        });
      }
      setDialogOpen(false);
      fetchCertifications();
    } catch (error) {
      alert('Failed to save certification');
    }
  };

  const deleteCertification = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certification?')) return;
    try {
      await fetch(`/api/certifications?id=${id}`, { method: 'DELETE' });
      setCertifications(certifications.filter(c => c.id !== id));
    } catch (error) {
      alert('Failed to delete certification');
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Certifications</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your certifications and achievements</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle>All Certifications</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>{editingCert ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., AWS Certified Developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Issued By</label>
                  <Input
                    value={formData.issuedBy}
                    onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })}
                    placeholder="e.g., Amazon Web Services"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Certificate (PDF)</label>
                  <div className="flex items-center gap-4">
                    {formData.certificateUrl && (
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Uploaded
                      </span>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload PDF
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={!formData.certificateUrl}>
                  {editingCert ? 'Update Certification' : 'Add Certification'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">{cert.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{cert.issuedBy}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" asChild>
                    <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(cert)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteCertification(cert.id)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {certifications.length === 0 && (
              <p className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">
                No certifications added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
