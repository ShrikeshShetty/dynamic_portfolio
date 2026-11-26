'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientProjectsManager from './ClientProjectsManager';
import InternshipsManager from './InternshipsManager';
import ProfessionalExperienceManager from './ProfessionalExperienceManager';

export default function ExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Experience</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Manage your professional experience, client projects, and internships
        </p>
      </div>

      <Tabs defaultValue="professional-experience" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="professional-experience">Professional Experience</TabsTrigger>
          <TabsTrigger value="client-projects">Client Projects</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
        </TabsList>

        <TabsContent value="professional-experience" className="mt-6">
          <ProfessionalExperienceManager />
        </TabsContent>

        <TabsContent value="client-projects" className="mt-6">
          <ClientProjectsManager />
        </TabsContent>

        <TabsContent value="internships" className="mt-6">
          <InternshipsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
