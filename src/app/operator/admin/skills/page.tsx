'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, Save, X } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/lib/constants';
import type { Skill } from '@/db/schema';

export default function SkillsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeCategory, setActiveCategory] = useState<keyof typeof SKILL_CATEGORIES>('frontend');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      const data = await res.json();
      setSkills(data);
    } catch (error) {
      console.error('Failed to fetch skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: activeCategory,
          name: 'New Skill',
          percentage: 50,
          order: skills.filter(s => s.category === activeCategory).length,
        }),
      });
      const newSkill = await res.json();
      setSkills([...skills, newSkill]);
    } catch (error) {
      alert('Failed to add skill');
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    setSkills(skills.map(s => s.id === id ? { ...s, ...updates } : s));
    try {
      await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
    } catch (error) {
      console.error('Failed to update skill:', error);
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await fetch(`/api/skills?id=${id}`, { method: 'DELETE' });
      setSkills(skills.filter(s => s.id !== id));
    } catch (error) {
      alert('Failed to delete skill');
    }
  };

  const categorySkills = skills.filter(s => s.category === activeCategory);

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
        <CardHeader>
          <CardTitle>Skills Management</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.keys(SKILL_CATEGORIES) as Array<keyof typeof SKILL_CATEGORIES>).map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                onClick={() => setActiveCategory(cat)}
                size="sm"
              >
                {SKILL_CATEGORIES[cat]}
              </Button>
            ))}
          </div>

          {/* Skills List */}
          <div className="space-y-4 mb-6">
            {categorySkills.map((skill) => (
              <div key={skill.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 flex flex-col sm:flex-row gap-4">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                      placeholder="Skill name"
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        value={skill.percentage}
                        onChange={(e) => updateSkill(skill.id, { percentage: parseInt(e.target.value) || 0 })}
                        className="w-20"
                      />
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSkill(skill.id)}
                    className="text-red-500 hover:text-red-700 self-end sm:self-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {categorySkills.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No skills added yet for this category.
            </p>
          )}

          <Button onClick={addSkill} className="w-full sm:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
