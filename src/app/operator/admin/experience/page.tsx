'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientProjectsManager from './ClientProjectsManager';
import InternshipsManager from './InternshipsManager';

export default function ExperiencePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Experience</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your client projects and internships</p>
      </div>

      <Tabs defaultValue="client-projects" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="client-projects">Client Projects</TabsTrigger>
          <TabsTrigger value="internships">Internships</TabsTrigger>
        </TabsList>

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
