'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Trophy, Upload, X, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ExtraCurricular } from '@/db/schema';

export default function ExtraCurricularAdminPage() {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<ExtraCurricular[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<ExtraCurricular | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    logo: '',
    title: '',
    header: '',
    description: '',
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch('/api/extra-curricular');
      const data = await res.json();
      setActivities(data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('folder', 'extra-curricular');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      setFormData({ ...formData, logo: data.url });
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const openEditDialog = (activity: ExtraCurricular) => {
    setEditingActivity(activity);
    setFormData({
      logo: activity.logo,
      title: activity.title,
      header: activity.header,
      description: activity.description,
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingActivity(null);
    setFormData({
      logo: '',
      title: '',
      header: '',
      description: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        await fetch('/api/extra-curricular', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingActivity.id, ...formData }),
        });
      } else {
        await fetch('/api/extra-curricular', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, sortOrder: activities.length }),
        });
      }
      setDialogOpen(false);
      fetchActivities();
    } catch (error) {
      alert('Failed to save activity');
    }
  };

  const deleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    try {
      await fetch(`/api/extra-curricular?id=${id}`, { method: 'DELETE' });
      setActivities(activities.filter(a => a.id !== id));
    } catch (error) {
      alert('Failed to delete activity');
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
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Extra Curricular Activities
          </CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Activity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>{editingActivity ? 'Edit Activity' : 'Add Activity'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Logo / Image</label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    {formData.logo && (
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={formData.logo} alt="Logo" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, logo: '' })}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto"
                    >
                      {uploading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4 mr-2" />
                      )}
                      Upload Image
                    </Button>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Sports, Music, Art"
                    required
                  />
                </div>

                {/* Header */}
                <div>
                  <label className="block text-sm font-medium mb-2">Header</label>
                  <Input
                    value={formData.header}
                    onChange={(e) => setFormData({ ...formData, header: e.target.value })}
                    placeholder="e.g., National Level Winner"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the achievement or activity..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  {editingActivity ? 'Update Activity' : 'Add Activity'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <div key={activity.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img src={activity.logo} alt={activity.title} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">{activity.title}</h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400 truncate">{activity.header}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{activity.description}</p>
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(activity)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => deleteActivity(activity.id)} className="text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {activities.length === 0 && (
              <p className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">
                No extra curricular activities added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
