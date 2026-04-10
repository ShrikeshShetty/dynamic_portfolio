'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CONTACT_TYPES } from '@/lib/constants';
import type { ContactLink } from '@/db/schema';

export default function ContactLinksAdminPage() {
  const [loading, setLoading] = useState(true);
  const [contactLinks, setContactLinks] = useState<ContactLink[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<ContactLink | null>(null);
  const [formData, setFormData] = useState({
    type: 'email' as keyof typeof CONTACT_TYPES,
    url: '',
    displayText: '',
  });

  useEffect(() => {
    fetchContactLinks();
  }, []);

  const fetchContactLinks = async () => {
    try {
      const res = await fetch('/api/contact-links');
      const data = await res.json();
      setContactLinks(data);
    } catch (error) {
      console.error('Failed to fetch contact links:', error);
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (link: ContactLink) => {
    setEditingLink(link);
    setFormData({
      type: link.type as keyof typeof CONTACT_TYPES,
      url: link.url,
      displayText: link.displayText || '',
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingLink(null);
    setFormData({
      type: 'email',
      url: '',
      displayText: '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingLink) {
        await fetch('/api/contact-links', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingLink.id, ...formData }),
        });
      } else {
        await fetch('/api/contact-links', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, order: contactLinks.length }),
        });
      }
      setDialogOpen(false);
      fetchContactLinks();
    } catch (error) {
      alert('Failed to save contact link');
    }
  };

  const deleteContactLink = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact link?')) return;
    try {
      await fetch(`/api/contact-links?id=${id}`, { method: 'DELETE' });
      setContactLinks(contactLinks.filter(l => l.id !== id));
    } catch (error) {
      alert('Failed to delete contact link');
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
          <CardTitle>Contact Links</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog} className="w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add Contact Link
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md mx-4">
              <DialogHeader>
                <DialogTitle>{editingLink ? 'Edit Contact Link' : 'Add Contact Link'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as keyof typeof CONTACT_TYPES })}
                    className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                  >
                    {(Object.keys(CONTACT_TYPES) as Array<keyof typeof CONTACT_TYPES>).map((type) => (
                      <option key={type} value={type}>
                        {CONTACT_TYPES[type]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <Input
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder={formData.type === 'email' ? 'your@email.com' : 'https://...'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Display Text (optional)</label>
                  <Input
                    value={formData.displayText}
                    onChange={(e) => setFormData({ ...formData, displayText: e.target.value })}
                    placeholder="Text to display instead of URL"
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingLink ? 'Update Link' : 'Add Link'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactLinks.map((link) => (
              <div key={link.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex-1 min-w-0">
                  <span className="inline-block px-2 py-1 text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded mb-1">
                    {CONTACT_TYPES[link.type as keyof typeof CONTACT_TYPES] || link.type}
                  </span>
                  <p className="text-gray-900 dark:text-white truncate">{link.displayText || link.url}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(link)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => deleteContactLink(link.id)} className="text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            {contactLinks.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No contact links added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
