import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import EducationSection from '@/components/sections/EducationSection';
import ExtraCurricularSection from '@/components/sections/ExtraCurricularSection';
import ContactSection from '@/components/sections/ContactSection';
import { db } from '@/db';
import { heroSection, aboutSection, skills, projects, clientProjects, internships, certifications, education, extraCurricular, contactLinks } from '@/db/schema';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch all data in parallel
  const [heroData, aboutData, skillsData, projectsData, clientProjectsData, internshipsData, certificationsData, educationData, extraCurricularData, contactLinksData] = await Promise.all([
    db.select().from(heroSection).limit(1).then(res => res[0] || null),
    db.select().from(aboutSection).limit(1).then(res => res[0] || null),
    db.select().from(skills),
    db.select().from(projects),
    db.select().from(clientProjects),
    db.select().from(internships),
    db.select().from(certifications),
    db.select().from(education),
    db.select().from(extraCurricular),
    db.select().from(contactLinks),
  ]);

  return (
    <>
      <HeroSection heroData={heroData} />
      <AboutSection aboutData={aboutData} />
      <EducationSection education={educationData} />
      <SkillsSection skills={skillsData} />
      <ProjectsSection projects={projectsData} />
      <ExperienceSection clientProjects={clientProjectsData} internships={internshipsData} />
      <CertificationsSection certifications={certificationsData} />
      <ExtraCurricularSection activities={extraCurricularData} />
      <ContactSection contactLinks={contactLinksData} />
    </>
  );
}
