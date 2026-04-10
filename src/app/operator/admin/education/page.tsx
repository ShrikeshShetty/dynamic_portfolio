'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Loader2, GraduationCap, GripVertical, Save } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Education } from '@/db/schema';

const EDUCATION_LEVELS = [
  { value: 'HSC', label: 'HSC (Higher Secondary)' },
  { value: 'UG', label: 'UG (Undergraduate)' },
  { value: 'PG', label: 'PG (Postgraduate)' },
] as const;

interface SortableEducationItemProps {
  edu: Education;
  updateEducation: (id: string, updates: Partial<Education>) => void;
  deleteEducation: (id: string) => void;
}

function SortableEducationItem({ edu, updateEducation, deleteEducation }: SortableEducationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: edu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-transparent hover:border-primary-200 dark:hover:border-primary-800 transition-all">
      <div className="flex items-start gap-3 mb-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-2 p-2 cursor-grab hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </button>

        {/* Level Badge */}
        <div className="flex-1 min-w-0">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
            edu.level === 'PG' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400' :
            edu.level === 'UG' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400' :
            'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400'
          }`}>
            {edu.level}
          </span>
        </div>

        {/* Delete Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteEducation(edu.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Level Select */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Education Level
          </label>
          <select
            value={edu.level}
            onChange={(e) => updateEducation(edu.id, { level: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {EDUCATION_LEVELS.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {/* Stream */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stream / Course
          </label>
          <Input
            value={edu.stream}
            onChange={(e) => updateEducation(edu.id, { stream: e.target.value })}
            placeholder="e.g., Computer Science"
          />
        </div>

        {/* College Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            College / Institution Name
          </label>
          <Input
            value={edu.collegeName}
            onChange={(e) => updateEducation(edu.id, { collegeName: e.target.value })}
            placeholder="e.g., MIT, Harvard"
          />
        </div>

        {/* Academic Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Academic Year
          </label>
          <Input
            value={edu.academicYear}
            onChange={(e) => updateEducation(edu.id, { academicYear: e.target.value })}
            placeholder="e.g., 2020-2024"
          />
        </div>

        {/* CGPA/Percentage */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            CGPA / Percentage
          </label>
          <Input
            value={edu.cgpaOrPercentage}
            onChange={(e) => updateEducation(edu.id, { cgpaOrPercentage: e.target.value })}
            placeholder="e.g., 8.5 CGPA or 85%"
          />
        </div>
      </div>
    </div>
  );
}

export default function EducationAdminPage() {
  const [loading, setLoading] = useState(true);
  const [educationList, setEducationList] = useState<Education[]>([]);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await fetch('/api/education');
      const data = await res.json();
      setEducationList(data);
    } catch (error) {
      console.error('Failed to fetch education:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setEducationList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
      setHasChanges(true);
    }
  };

  const saveOrder = async () => {
    setSaving(true);
    try {
      // Update sortOrder for all items
      await Promise.all(
        educationList.map((edu, index) =>
          fetch('/api/education', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              id: edu.id, 
              sortOrder: index,
              level: edu.level,
              stream: edu.stream,
              collegeName: edu.collegeName,
              academicYear: edu.academicYear,
              cgpaOrPercentage: edu.cgpaOrPercentage,
            }),
          })
        )
      );
      setHasChanges(false);
      alert('Order saved successfully!');
    } catch (error) {
      alert('Failed to save order');
    } finally {
      setSaving(false);
    }
  };

  const addEducation = async () => {
    try {
      const res = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'UG',
          stream: 'New Stream',
          collegeName: 'College Name',
          academicYear: '2020-2024',
          cgpaOrPercentage: '8.5 CGPA',
          sortOrder: educationList.length,
        }),
      });
      const newEducation = await res.json();
      setEducationList([...educationList, newEducation]);
    } catch (error) {
      alert('Failed to add education');
    }
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    setEducationList(educationList.map(e => e.id === id ? { ...e, ...updates } : e));
    setHasChanges(true);
  };

  const deleteEducation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await fetch(`/api/education?id=${id}`, { method: 'DELETE' });
      setEducationList(educationList.filter(e => e.id !== id));
      setHasChanges(true);
    } catch (error) {
      alert('Failed to delete education');
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
        <CardHeader className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            <CardTitle>Education Management</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            {hasChanges && (
              <Button onClick={saveOrder} disabled={saving} variant="default" className="w-full sm:w-auto">
                {saving ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save Order
              </Button>
            )}
            <Button onClick={addEducation} className="w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Education
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Drag and drop items to reorder them. Click "Save Order" to save changes.
          </p>

          {educationList.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No education entries added yet.
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={educationList.map(e => e.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {educationList.map((edu) => (
                    <SortableEducationItem
                      key={edu.id}
                      edu={edu}
                      updateEducation={updateEducation}
                      deleteEducation={deleteEducation}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
