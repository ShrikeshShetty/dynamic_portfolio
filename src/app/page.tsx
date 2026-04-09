import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ClientProjectsSection from '@/components/sections/ClientProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ResumeSection from '@/components/sections/ResumeSection';
import { db } from '@/db';
import { heroSection, aboutSection, skills, projects, clientProjects, contactLinks, resume } from '@/db/schema';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch all data in parallel
  const [heroData, aboutData, skillsData, projectsData, clientProjectsData, contactLinksData, resumeData] = await Promise.all([
    db.select().from(heroSection).limit(1).then(res => res[0] || null),
    db.select().from(aboutSection).limit(1).then(res => res[0] || null),
    db.select().from(skills),
    db.select().from(projects),
    db.select().from(clientProjects),
    db.select().from(contactLinks),
    db.select().from(resume).limit(1).then(res => res[0] || null),
  ]);

  return (
    <>
      <HeroSection heroData={heroData} />
      <AboutSection aboutData={aboutData} />
      <SkillsSection skills={skillsData} />
      <ProjectsSection projects={projectsData} />
      <ClientProjectsSection clientProjects={clientProjectsData} />
      <ContactSection contactLinks={contactLinksData} />
      <ResumeSection resume={resumeData} />
    </>
  );
}
