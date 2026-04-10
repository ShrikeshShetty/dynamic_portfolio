import { pgTable, text, timestamp, jsonb, integer, varchar, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Hero Section
export const heroSection = pgTable('hero_section', {
  id: varchar('id', { length: 36 }).primaryKey().default('default'),
  introLine: text('intro_line').notNull().default("Hi, I''m Shrikesh Uday Shetty"),
  role: text('role').notNull().default('Full Stack Developer'),
  description: text('description').notNull(),
  email: text('email').notNull().default('shrikesh123shetty@gmail.com'),
  github: text('github').notNull().default('https://github.com/ShrikeshShetty'),
  linkedin: text('linkedin').notNull().default('https://www.linkedin.com/in/shrikesh-shetty-3a6695295/'),
  resumeUrl: text('resume_url'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// About Section
export const aboutSection = pgTable('about_section', {
  id: varchar('id', { length: 36 }).primaryKey().default('default'),
  imageUrl: text('image_url'),
  description: text('description').notNull(),
  birthday: text('birthday').notNull(),
  phone: text('phone').notNull(),
  location: text('location').notNull(),
  degree: text('degree').notNull(),
  email: text('email').notNull(),
  projectCount: integer('project_count').notNull().default(0),
  technologyCount: integer('technology_count').notNull().default(0),
  codingYears: integer('coding_years').notNull().default(0),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Skills
export const skills = pgTable('skills', {
  id: varchar('id', { length: 36 }).primaryKey(),
  category: varchar('category', { length: 50 }).notNull(), // 'frontend', 'backend', 'tools'
  name: text('name').notNull(),
  percentage: integer('percentage').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Projects
export const projects = pgTable('projects', {
  id: varchar('id', { length: 36 }).primaryKey(),
  youtubeLink: text('youtube_link'),
  title: text('title').notNull(),
  techStack: text('tech_stack').notNull(),
  githubLink: text('github_link'),
  description: text('description'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Client Projects
export const clientProjects = pgTable('client_projects', {
  id: varchar('id', { length: 36 }).primaryKey(),
  coverImageUrl: text('cover_image_url').notNull(),
  title: text('title').notNull(),
  clientName: text('client_name').notNull(),
  description: text('description').notNull(),
  liveUrl: text('live_url'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Internships
export const internships = pgTable('internships', {
  id: varchar('id', { length: 36 }).primaryKey(),
  companyLogo: text('company_logo').notNull(),
  companyName: text('company_name').notNull(),
  role: text('role').notNull(),
  projectLead: text('project_lead').notNull(),
  isTeamProject: boolean('is_team_project').notNull().default(false),
  teamSize: integer('team_size'),
  offerLetterUrl: text('offer_letter_url').notNull(),
  certificateUrl: text('certificate_url').notNull(),
  lorUrl: text('lor_url'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Certifications
export const certifications = pgTable('certifications', {
  id: varchar('id', { length: 36 }).primaryKey(),
  title: text('title').notNull(),
  issuedBy: text('issued_by').notNull(),
  certificateUrl: text('certificate_url').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Contact Links
export const contactLinks = pgTable('contact_links', {
  id: varchar('id', { length: 36 }).primaryKey(),
  type: varchar('type', { length: 20 }).notNull(), // 'email', 'github', 'linkedin'
  url: text('url').notNull(),
  displayText: text('display_text'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Resume
export const resume = pgTable('resume', {
  id: varchar('id', { length: 36 }).primaryKey().default('default'),
  fileUrl: text('file_url').notNull(),
  fileName: text('file_name'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Education
export const education = pgTable('education', {
  id: varchar('id', { length: 36 }).primaryKey(),
  level: varchar('level', { length: 20 }).notNull(), // 'HSC', 'UG', 'PG'
  stream: text('stream').notNull(),
  collegeName: text('college_name').notNull(),
  academicYear: text('academic_year').notNull(),
  cgpaOrPercentage: text('cgpa_or_percentage').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Extra Curricular Activities
export const extraCurricular = pgTable('extra_curricular', {
  id: varchar('id', { length: 36 }).primaryKey(),
  logo: text('logo').notNull(),
  title: text('title').notNull(),
  header: text('header').notNull(),
  description: text('description').notNull(),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Type exports
export type HeroSection = typeof heroSection.$inferSelect;
export type AboutSection = typeof aboutSection.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ClientProject = typeof clientProjects.$inferSelect;
export type Internship = typeof internships.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type ContactLink = typeof contactLinks.$inferSelect;
export type Resume = typeof resume.$inferSelect;
export type Education = typeof education.$inferSelect;
export type ExtraCurricular = typeof extraCurricular.$inferSelect;
