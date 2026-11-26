'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Trash2,
  Loader2,
  Edit,
  Upload,
  X,
  Briefcase,
  Building2,
  Calendar,
  FileText,
  Award,
  Lock,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { ProfessionalExperience } from '@/db/schema';

export default function ProfessionalExperienceManager() {
  const [loading, setLoading] = useState(true);
  const [experiences, setExperiences] = useState<ProfessionalExperience[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<ProfessionalExperience | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const offerLetterRef = useRef<HTMLInputElement>(null);
  const experienceLetterRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    companyName: '',
    companyLogo: '',
    role: '',
    responsibilities: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    offerLetterUrl: '',
    experienceLetterUrl: '',
  });

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/professional-experience');
      const data = await res.json();
      setExperiences(data);
    } catch (error) {
      console.error('Failed to fetch professional experiences:', error);
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
      uploadFormData.append('folder', 'professional-experience');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setFormData((prev) => ({ ...prev, [field]: data.url }));
    } catch (error) {
      alert('Failed to upload file');
    } finally {
      setUploading(null);
    }
  };

  const openEditDialog = (exp: ProfessionalExperience) => {
    setEditingExperience(exp);
    setFormData({
      companyName: exp.companyName,
      companyLogo: exp.companyLogo || '',
      role: exp.role,
      responsibilities: exp.responsibilities,
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      isCurrent: exp.isCurrent,
      offerLetterUrl: exp.offerLetterUrl || '',
      experienceLetterUrl: exp.experienceLetterUrl || '',
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingExperience(null);
    setFormData({
      companyName: '',
      companyLogo: '',
      role: '',
      responsibilities: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      offerLetterUrl: '',
      experienceLetterUrl: '',
    });
    setDialogOpen(true);
  };

  const handleCurrentJobToggle = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isCurrent: checked,
      endDate: checked ? '' : prev.endDate,
      // If currently working, experience letter is not applicable
      experienceLetterUrl: checked ? '' : prev.experienceLetterUrl,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.isCurrent && !formData.endDate) {
      alert('Please enter an end date or check "Currently working here".');
      return;
    }

    try {
      if (editingExperience) {
        await fetch('/api/professional-experience', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingExperience.id, ...formData }),
        });
      } else {
        await fetch('/api/professional-experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, order: experiences.length }),
        });
      }
      setDialogOpen(false);
      fetchExperiences();
    } catch (error) {
      alert('Failed to save professional experience');
    }
  };

  const deleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this professional experience?')) return;
    try {
      await fetch(`/api/professional-experience?id=${id}`, { method: 'DELETE' });
      setExperiences((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      alert('Failed to delete professional experience');
    }
  };

  const canUploadExperienceLetter = !formData.isCurrent && Boolean(formData.endDate && formData.endDate.trim().length > 0);

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
        <div>
          <CardTitle>Professional Experience</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your full-time and contract jobs, roles, responsibilities, and letters.
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Job Experience
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            <DialogHeader>
              <DialogTitle>
                {editingExperience ? 'Edit Professional Experience' : 'Add Professional Experience'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              {/* Company Logo */}
              <div>
                <label className="block text-sm font-medium mb-2">Company Logo (Optional)</label>
                <div className="flex items-center gap-4">
                  {formData.companyLogo ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <img
                        src={formData.companyLogo}
                        alt="Logo"
                        className="w-full h-full object-contain p-2"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, companyLogo: '' })}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400">
                      <Building2 className="w-7 h-7" />
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
                    Upload Logo
                  </Button>
                </div>
              </div>

              {/* Company Name & Role */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name *</label>
                  <Input
                    placeholder="e.g. Google, Microsoft, Tech Corp"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role / Job Title *</label>
                  <Input
                    placeholder="e.g. Software Engineer, Tech Lead"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium mb-1">Responsibilities & Achievements *</label>
                <Textarea
                  placeholder="Describe your core responsibilities, key projects delivered, technologies used, and impact..."
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              {/* Currently Working Checkbox / Switch */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="current-job" className="text-sm font-semibold cursor-pointer">
                      Currently working here
                    </Label>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Check this if this is your active job. End date will be set to "Present".
                    </p>
                  </div>
                  <Switch
                    id="current-job"
                    checked={formData.isCurrent}
                    onCheckedChange={handleCurrentJobToggle}
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date *</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    End Date {formData.isCurrent ? '(Present)' : '*'}
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    disabled={formData.isCurrent}
                    required={!formData.isCurrent}
                    className={formData.isCurrent ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-800' : ''}
                  />
                  {formData.isCurrent && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 inline-block font-medium">
                      Marked as Present (Active Job)
                    </span>
                  )}
                </div>
              </div>

              {/* Document Uploads */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-500" />
                  Documents & Verification
                </h4>

                {/* Offer Letter Upload */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="block text-sm font-medium text-slate-900 dark:text-white">
                        Offer Letter (PDF / Document)
                      </span>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Upload your signed offer letter for verification.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {formData.offerLetterUrl ? (
                        <>
                          <a
                            href={formData.offerLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Uploaded
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 h-8 px-2 hover:bg-red-50 dark:hover:bg-red-950/40"
                            onClick={() => setFormData({ ...formData, offerLetterUrl: '' })}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      ) : null}

                      <input
                        ref={offerLetterRef}
                        type="file"
                        accept=".pdf,image/*,.doc,.docx"
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
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : (
                          <Upload className="w-4 h-4 mr-1.5" />
                        )}
                        {formData.offerLetterUrl ? 'Replace' : 'Upload Offer Letter'}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Experience Letter Upload */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    canUploadExperienceLetter
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/80'
                      : 'bg-slate-100/60 dark:bg-slate-900/40 border-dashed border-slate-300 dark:border-slate-800 opacity-80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="block text-sm font-medium text-slate-900 dark:text-white">
                          Experience Letter / Relieving Letter (PDF)
                        </span>
                        {!canUploadExperienceLetter && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                            <Lock className="w-3 h-3" />
                            Requires End Date
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {formData.isCurrent
                          ? 'Not applicable while you are currently working at this company.'
                          : !formData.endDate
                          ? 'Enter job end date above to enable uploading your experience letter.'
                          : 'Upload experience letter received upon completing this role.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {formData.experienceLetterUrl && canUploadExperienceLetter ? (
                        <>
                          <a
                            href={formData.experienceLetterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium hover:underline bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Uploaded
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </a>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 h-8 px-2 hover:bg-red-50 dark:hover:bg-red-950/40"
                            onClick={() => setFormData({ ...formData, experienceLetterUrl: '' })}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </>
                      ) : null}

                      <input
                        ref={experienceLetterRef}
                        type="file"
                        accept=".pdf,image/*,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'experienceLetterUrl')}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant={canUploadExperienceLetter ? 'outline' : 'secondary'}
                        size="sm"
                        disabled={!canUploadExperienceLetter || uploading === 'experienceLetterUrl'}
                        onClick={() => experienceLetterRef.current?.click()}
                        title={
                          !canUploadExperienceLetter
                            ? 'Please enter job end date first to upload experience letter'
                            : 'Upload experience letter'
                        }
                      >
                        {uploading === 'experienceLetterUrl' ? (
                          <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                        ) : !canUploadExperienceLetter ? (
                          <Lock className="w-4 h-4 mr-1.5 text-slate-400" />
                        ) : (
                          <Upload className="w-4 h-4 mr-1.5" />
                        )}
                        {formData.experienceLetterUrl ? 'Replace' : 'Upload Experience Letter'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full">
                {editingExperience ? 'Update Job Experience' : 'Save Job Experience'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex-shrink-0 flex items-center justify-center">
                    {exp.companyLogo ? (
                      <img
                        src={exp.companyLogo}
                        alt={exp.companyName}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-slate-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 dark:text-white truncate">
                        {exp.companyName}
                      </h3>
                      {exp.isCurrent && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          Active Job
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400 truncate">
                      {exp.role}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {exp.startDate || 'N/A'} - {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'}
                      </span>
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-3 bg-white/60 dark:bg-slate-900/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                  {exp.responsibilities}
                </p>

                {/* Documents status */}
                <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Offer Letter:</span>
                    {exp.offerLetterUrl ? (
                      <a
                        href={exp.offerLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-0.5 hover:underline"
                      >
                        Available <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Not uploaded</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                    <Award className="w-3.5 h-3.5" />
                    <span>Experience Letter:</span>
                    {exp.isCurrent ? (
                      <span className="text-slate-400 italic">Current Job</span>
                    ) : exp.experienceLetterUrl ? (
                      <a
                        href={exp.experienceLetterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-0.5 hover:underline"
                      >
                        Available <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Not uploaded</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(exp)}>
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteExperience(exp.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}

          {experiences.length === 0 && (
            <div className="col-span-2 text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Briefcase className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                No professional experience added yet.
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Click &quot;Add Job Experience&quot; to add your employment details and letters.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
