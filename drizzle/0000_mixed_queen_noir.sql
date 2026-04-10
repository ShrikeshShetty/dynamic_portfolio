CREATE TABLE IF NOT EXISTS "about_section" (
	"id" varchar(36) PRIMARY KEY DEFAULT 'default' NOT NULL,
	"image_url" text,
	"description" text NOT NULL,
	"birthday" text NOT NULL,
	"phone" text NOT NULL,
	"location" text NOT NULL,
	"degree" text NOT NULL,
	"email" text NOT NULL,
	"project_count" integer DEFAULT 0 NOT NULL,
	"technology_count" integer DEFAULT 0 NOT NULL,
	"coding_years" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certifications" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"issued_by" text NOT NULL,
	"certificate_url" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_projects" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"cover_image_url" text NOT NULL,
	"title" text NOT NULL,
	"client_name" text NOT NULL,
	"description" text NOT NULL,
	"live_url" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_links" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"url" text NOT NULL,
	"display_text" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "education" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"level" varchar(20) NOT NULL,
	"stream" text NOT NULL,
	"college_name" text NOT NULL,
	"academic_year" text NOT NULL,
	"cgpa_or_percentage" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "extra_curricular" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"logo" text NOT NULL,
	"title" text NOT NULL,
	"header" text NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hero_section" (
	"id" varchar(36) PRIMARY KEY DEFAULT 'default' NOT NULL,
	"intro_line" text DEFAULT 'Hi, I''m Shrikesh Uday Shetty' NOT NULL,
	"role" text DEFAULT 'Full Stack Developer' NOT NULL,
	"description" text NOT NULL,
	"email" text DEFAULT 'shrikesh123shetty@gmail.com' NOT NULL,
	"github" text DEFAULT 'https://github.com/ShrikeshShetty' NOT NULL,
	"linkedin" text DEFAULT 'https://www.linkedin.com/in/shrikesh-shetty-3a6695295/' NOT NULL,
	"resume_url" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "internships" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"company_logo" text NOT NULL,
	"company_name" text NOT NULL,
	"role" text NOT NULL,
	"project_lead" text NOT NULL,
	"is_team_project" boolean DEFAULT false NOT NULL,
	"team_size" integer,
	"offer_letter_url" text NOT NULL,
	"certificate_url" text NOT NULL,
	"lor_url" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"youtube_link" text,
	"title" text NOT NULL,
	"tech_stack" text NOT NULL,
	"github_link" text,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume" (
	"id" varchar(36) PRIMARY KEY DEFAULT 'default' NOT NULL,
	"file_url" text NOT NULL,
	"file_name" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"category" varchar(50) NOT NULL,
	"name" text NOT NULL,
	"percentage" integer NOT NULL,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
