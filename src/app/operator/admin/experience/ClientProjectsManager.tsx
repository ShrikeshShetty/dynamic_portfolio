'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Edit, Upload, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { ClientProject } from '@/db/schema';

export default function ClientProjectsManager() {
  const [loading, setLoading] = useState(true);
  const [clientProjects, setClientProjects] = useState<ClientProject[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ClientProject | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    coverImageUrl: '',
    title: '',
    clientName: '',
    description: '',
    liveUrl: '',
  });

  useEffect(() => {
    fetchClientProjects();
  }, []);

  const fetchClientProjects = async () => {
    try {
      const res = await fetch('/api/client-projects');
      const data = await res.json();
      setClientProjects(data);
    } catch (error) {
      console.error('Failed to fetch client projects:', error);
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
      uploadFormData.append('folder', 'client-projects');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await res.json();
      setFormData({ ...formData, coverImageUrl: data.url });
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const openEditDialog = (project: ClientProject) => {
    setEditingProject(project);
    setFormData({
      coverImageUrl: project.coverImageUrl,
      title: project.title,
      clientName: project.clientName,
      description: project.description,
      liveUrl: project.liveUrl || '',
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingProject(null);
    setFormData({
      coverImageUrl: '',
      title: '',
      clientName: '',
      description: '',
      liveUrl: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await fetch('/api/client-projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProject.id, ...formData }),
        });
      } else {
        await fetch('/api/client-projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, order: clientProjects.length }),
        });
      }
      setDialogOpen(false);
      fetchClientProjects();
    } catch (error) {
      alert('Failed to save client project');
    }
  };

  const deleteClientProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client project?')) return;
    try {
      await fetch(`/api/client-projects?id=${id}`, { method: 'DELETE' });
      setClientProjects(clientProjects.filter(p => p.id !== id));
    } catch (error) {
      alert('Failed to delete client project');
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
        <CardTitle>Client Projects</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Client Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md mx-4">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Client Project' : 'Add Client Project'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Cover Image</label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  {formData.coverImageUrl && (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={formData.coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
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
                    Upload
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Client Name</label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Live Website URL (optional)</label>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.liveUrl}
                  onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full">
                {editingProject ? 'Update Project' : 'Add Project'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientProjects.map((project) => (
            <div key={project.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
              <img src={project.coverImageUrl} alt={project.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate">{project.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{project.clientName}</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(project)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteClientProject(project.id)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {clientProjects.length === 0 && (
            <p className="col-span-2 text-center text-gray-500 dark:text-gray-400 py-8">
              No client projects added yet.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
