'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Edit, Upload, X, Users, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { Internship } from '@/db/schema';

export default function InternshipsManager() {
  const [loading, setLoading] = useState(true);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const offerLetterRef = useRef<HTMLInputElement>(null);
  const certificateRef = useRef<HTMLInputElement>(null);
  const lorRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    companyLogo: '',
    companyName: '',
    role: '',
    projectLead: '',
    isTeamProject: false,
    teamSize: 0,
    offerLetterUrl: '',
    certificateUrl: '',
    lorUrl: '',
  });

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      const res = await fetch('/api/internships');
      const data = await res.json();
      setInternships(data);
    } catch (error) {
      console.error('Failed to fetch internships:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(field);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'internships');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      setFormData({ ...formData, [field]: data.url });
    } catch (error) {
      alert('Failed to upload file');
    } finally {
      setUploading(null);
    }
  };

  const openEditDialog = (internship: Internship) => {
    setEditingInternship(internship);
    setFormData({
      companyLogo: internship.companyLogo,
      companyName: internship.companyName,
      role: internship.role,
      projectLead: internship.projectLead,
      isTeamProject: internship.isTeamProject,
      teamSize: internship.teamSize || 0,
      offerLetterUrl: internship.offerLetterUrl,
      certificateUrl: internship.certificateUrl,
      lorUrl: internship.lorUrl || '',
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingInternship(null);
    setFormData({
      companyLogo: '',
      companyName: '',
      role: '',
      projectLead: '',
      isTeamProject: false,
      teamSize: 0,
      offerLetterUrl: '',
      certificateUrl: '',
      lorUrl: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInternship) {
        await fetch('/api/internships', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingInternship.id, ...formData }),
        });
      } else {
        await fetch('/api/internships', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, order: internships.length }),
        });
      }
      setDialogOpen(false);
      fetchInternships();
    } catch (error) {
      alert('Failed to save internship');
    }
  };

  const deleteInternship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this internship?')) return;
    try {
      await fetch(`/api/internships?id=${id}`, { method: 'DELETE' });
      setInternships(internships.filter(i => i.id !== id));
    } catch (error) {
      alert('Failed to delete internship');
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
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <CardTitle>Internships</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Internship
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>{editingInternship ? 'Edit Internship' : 'Add Internship'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Logo */}
                <div>
                  <label className="block text-sm font-medium mb-2">Company Logo</label>
                  <div className="flex items-center gap-4">
                    {formData.companyLogo && (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        <img src={formData.companyLogo} alt="Logo" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, companyLogo: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'companyLogo')}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={uploading === 'companyLogo'}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      {uploading === 'companyLogo' ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload
                    </Button>
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <Input
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-2">Role / Position</label>
                  <Input
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>

                {/* Project Lead */}
                <div>
                  <label className="block text-sm font-medium mb-2">Project Lead</label>
                  <Input
                    value={formData.projectLead}
                    onChange={(e) => setFormData({ ...formData, projectLead: e.target.value })}
                    required
                  />
                </div>

                {/* Team Project Toggle */}
                <div className="col-span-1 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="team-project"
                      checked={formData.isTeamProject}
                      onCheckedChange={(checked: boolean) => setFormData({ ...formData, isTeamProject: checked })}
                    />
                    <Label htmlFor="team-project" className="flex items-center gap-2">
                      {formData.isTeamProject ? <Users className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      {formData.isTeamProject ? 'Team Project' : 'Individual Project'}
                    </Label>
                  </div>
                </div>

                {/* Team Size */}
                {formData.isTeamProject && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Team Members</label>
                    <Input
                      type="number"
                      min={2}
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                )}

                {/* Offer Letter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Offer Letter (PDF) *</label>
                  <div className="flex items-center gap-2">
                    {formData.offerLetterUrl && (
                      <span className="text-sm text-green-600">Uploaded</span>
                    )}
                    <input
                      ref={offerLetterRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'offerLetterUrl')}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={uploading === 'offerLetterUrl'}
                      onClick={() => offerLetterRef.current?.click()}
                    >
                      {uploading === 'offerLetterUrl' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Certificate */}
                <div>
                  <label className="block text-sm font-medium mb-2">Certificate (PDF) *</label>
                  <div className="flex items-center gap-2">
                    {formData.certificateUrl && (
                      <span className="text-sm text-green-600">Uploaded</span>
                    )}
                    <input
                      ref={certificateRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'certificateUrl')}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={uploading === 'certificateUrl'}
                      onClick={() => certificateRef.current?.click()}
                    >
                      {uploading === 'certificateUrl' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* LOR */}
                <div>
                  <label className="block text-sm font-medium mb-2">LOR (PDF) - Optional</label>
                  <div className="flex items-center gap-2">
                    {formData.lorUrl && (
                      <span className="text-sm text-green-600">Uploaded</span>
                    )}
                    <input
                      ref={lorRef}
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileUpload(e, 'lorUrl')}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={uploading === 'lorUrl'}
                      onClick={() => lorRef.current?.click()}
                    >
                      {uploading === 'lorUrl' ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={!formData.offerLetterUrl || !formData.certificateUrl}>
                {editingInternship ? 'Update Internship' : 'Add Internship'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {internships.map((internship) => (
            <div key={internship.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={internship.companyLogo} alt={internship.companyName} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{internship.companyName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{internship.role}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {internship.isTeamProject ? `Team of ${internship.teamSize}` : 'Individual'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(internship)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => deleteInternship(internship.id)} className="text-red-500">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          {internships.length === 0 && (
            <p className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">
              No internships added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
