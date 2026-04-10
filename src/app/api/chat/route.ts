import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { heroSection, aboutSection, skills, projects, clientProjects, contactLinks, education, extraCurricular, resume } from '@/db/schema';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json() as { message: string; history: Message[] };

    // Fetch all portfolio data
    const [hero, about, allSkills, allProjects, allClientProjects, allContactLinks, allEducation, allExtraCurricular, resumeData] = await Promise.all([
      db.select().from(heroSection).limit(1),
      db.select().from(aboutSection).limit(1),
      db.select().from(skills),
      db.select().from(projects),
      db.select().from(clientProjects),
      db.select().from(contactLinks),
      db.select().from(education),
      db.select().from(extraCurricular),
      db.select().from(resume).limit(1),
    ]);

    const lowerMessage = message.toLowerCase().trim();
    let response = '';
    let hasMatch = false;

    // Helper function to get contact info
    const getContactInfo = () => {
      if (hero[0]) {
        return `Email: ${hero[0].email}\nGitHub: ${hero[0].github}\nLinkedIn: ${hero[0].linkedin}`;
      }
      return "Contact information is not available at the moment.";
    };

    // Greetings - only match standalone greetings, not words like 'his', 'history', etc.
    const greetings = ['hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'greetings'];
    const isGreeting = greetings.some(g => lowerMessage.includes(g)) ||
                       (lowerMessage.match(/\bhi\b/) && !lowerMessage.includes('his') && !lowerMessage.includes('history'));
    if (isGreeting && lowerMessage.split(' ').length <= 3) {
      response = `Hello! I'm the portfolio assistant. I can tell you about Shrikesh's skills, projects, experience, and how to contact him. What would you like to know?`;
      hasMatch = true;
    }

    // How many projects - numeric answer
    if (!hasMatch && lowerMessage.includes('how many') && (lowerMessage.includes('project') || lowerMessage.includes('work'))) {
      if (about[0]?.projectCount) {
        response = `Shrikesh has worked on ${about[0].projectCount} projects.`;
      } else if (allProjects.length > 0) {
        response = `Shrikesh has worked on ${allProjects.length} projects.`;
      } else {
        response = "Project information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // How many technologies - numeric answer
    if (!hasMatch && lowerMessage.includes('how many') && (lowerMessage.includes('technology') || lowerMessage.includes('tech'))) {
      if (about[0]?.technologyCount) {
        response = `Shrikesh knows ${about[0].technologyCount} technologies.`;
      } else if (allSkills.length > 0) {
        response = `Shrikesh knows ${allSkills.length} technologies.`;
      } else {
        response = "Technology information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // How many years of experience/coding
    if (!hasMatch && lowerMessage.includes('how many') && (lowerMessage.includes('year') || lowerMessage.includes('experience') || lowerMessage.includes('coding'))) {
      if (about[0]?.codingYears) {
        response = `Shrikesh has ${about[0].codingYears} years of coding experience.`;
      } else {
        response = "Experience information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // How many client projects
    if (!hasMatch && lowerMessage.includes('how many') && lowerMessage.includes('client')) {
      if (allClientProjects.length > 0) {
        response = `Shrikesh has completed ${allClientProjects.length} client projects.`;
      } else {
        response = "Client project information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // Skills, technologies, programming languages, frameworks
    const skillKeywords = ['skill', 'technology', 'tech stack', 'programming', 'language', 'framework', 'frontend', 'backend', 'tools', 'know', 'expertise', 'proficient', 'can do', 'able to', 'capabilities', 'what do you use', 'what languages', 'what frameworks'];
    if (!hasMatch && skillKeywords.some(k => lowerMessage.includes(k))) {
      if (allSkills.length > 0) {
        const frontendSkills = allSkills.filter(s => s.category === 'frontend').map(s => s.name);
        const backendSkills = allSkills.filter(s => s.category === 'backend').map(s => s.name);
        const toolsSkills = allSkills.filter(s => s.category === 'tools').map(s => s.name);

        response = `Shrikesh has expertise in:\n\nFrontend: ${frontendSkills.join(', ') || 'Not specified'}\n\nBackend: ${backendSkills.join(', ') || 'Not specified'}\n\nTools & Technologies: ${toolsSkills.join(', ') || 'Not specified'}`;
      } else {
        response = "Skills information hasn't been added yet. Please check back later!";
      }
      hasMatch = true;
    }

    // Projects, work, portfolio, built, created
    const projectKeywords = ['project', 'work', 'portfolio', 'built', 'created', 'developed', 'made', 'application', 'app', 'website', 'what have you built', 'what have you made', 'showcase', 'examples'];
    if (!hasMatch && projectKeywords.some(k => lowerMessage.includes(k)) && !lowerMessage.includes('client') && !lowerMessage.includes('how many')) {
      if (allProjects.length > 0) {
        response = `Shrikesh has worked on ${allProjects.length} project(s):\n\n${allProjects.map((p, i) => `${i + 1}. ${p.title} - ${p.techStack}`).join('\n\n')}`;
      } else {
        response = "Projects haven't been added yet. Please check back later!";
      }
      hasMatch = true;
    }

    // Client projects, freelance, clients
    const clientKeywords = ['client', 'freelance', 'client project', 'for clients', 'client work', 'real world', 'professional work', 'commercial'];
    if (!hasMatch && clientKeywords.some(k => lowerMessage.includes(k)) && !lowerMessage.includes('how many')) {
      if (allClientProjects.length > 0) {
        response = `Shrikesh has completed ${allClientProjects.length} client project(s):\n\n${allClientProjects.map((p, i) => `${i + 1}. ${p.title} for ${p.clientName}`).join('\n\n')}`;
      } else {
        response = "Client projects haven't been added yet. Please check back later!";
      }
      hasMatch = true;
    }

    // Contact, email, reach, connect, social
    const contactKeywords = ['contact', 'email', 'reach', 'connect', 'social', 'linkedin', 'github', 'phone', 'call', 'message', 'get in touch', 'how to contact', 'where to find', 'email address', 'mail'];
    if (!hasMatch && contactKeywords.some(k => lowerMessage.includes(k))) {
      if (hero[0]) {
        response = `You can contact Shrikesh through:\n\n${getContactInfo()}`;
      } else {
        response = "Contact information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // Resume, CV, download resume
    const resumeKeywords = ['resume', 'cv', 'curriculum vitae', 'download resume', 'view resume', 'give resume', 'his resume', 'your resume'];
    if (!hasMatch && resumeKeywords.some(k => lowerMessage.includes(k))) {
      const resumeUrl = hero[0]?.resumeUrl || resumeData[0]?.fileUrl;
      if (resumeUrl) {
        response = `You can view or download Shrikesh's resume here:\n\n[View Resume](${resumeUrl})`;
      } else {
        response = "Resume hasn't been uploaded yet. Please check back later!";
      }
      hasMatch = true;
    }

    // Education details - check this FIRST before about/degree keywords
    const educationKeywords = ['education', 'educational qualification', 'academic background', 'schooling', 'college details', 'education details', 'qualification'];
    if (!hasMatch && educationKeywords.some(k => lowerMessage.includes(k))) {
      if (allEducation.length > 0) {
        response = `Shrikesh's educational background:\n\n${allEducation.map((e, i) => `${i + 1}. ${e.level} - ${e.stream}\n   College: ${e.collegeName}\n   Year: ${e.academicYear}\n   CGPA/Percentage: ${e.cgpaOrPercentage}`).join('\n\n')}`;
      } else {
        response = "Education information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // About, intro, who, background, experience
    const aboutKeywords = ['about', 'who', 'introduce', 'background', 'experience', 'tell me about', 'who is', 'what do you do', 'yourself', 'bio', 'summary', 'profile', 'overview', 'career', 'years of experience', 'coding years'];
    if (!hasMatch && aboutKeywords.some(k => lowerMessage.includes(k))) {
      if (hero[0] && about[0]) {
        response = `${hero[0].introLine} I'm a ${hero[0].role}.\n\n${about[0].description}\n\nI have ${about[0].codingYears} years of coding experience and have worked on ${about[0].projectCount} projects using ${about[0].technologyCount} technologies.`;
      } else {
        response = "About information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // Location, where, city, place, live, stay, address, from
    const locationKeywords = ['location', 'where', 'city', 'place', 'live', 'stay', 'address', 'from', 'where are you', 'where do you', 'located', 'based'];
    if (!hasMatch && locationKeywords.some(k => lowerMessage.includes(k))) {
      if (about[0]?.location) {
        response = `Shrikesh is located in ${about[0].location}.`;
      } else {
        response = "Location information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // Birthday, birth, date of birth, born, age
    const birthdayKeywords = ['birthday', 'birth', 'date of birth', 'born', 'age', 'when were you born', 'birthdate'];
    if (!hasMatch && birthdayKeywords.some(k => lowerMessage.includes(k))) {
      if (about[0]?.birthday) {
        response = `Shrikesh's birthday is on ${about[0].birthday}.`;
      } else {
        response = "Birthday information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // Phone, mobile, number, call
    const phoneKeywords = ['phone', 'mobile', 'number', 'phone number', 'mobile number', 'call you', 'contact number'];
    if (!hasMatch && phoneKeywords.some(k => lowerMessage.includes(k))) {
      if (about[0]?.phone) {
        response = `You can reach Shrikesh at ${about[0].phone}.`;
      } else {
        response = "Phone information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // Degree - only match if education wasn't matched
    const degreeKeywords = ['degree', 'what degree', 'hold a degree'];
    if (!hasMatch && degreeKeywords.some(k => lowerMessage.includes(k))) {
      if (about[0]?.degree) {
        response = `Shrikesh holds a ${about[0].degree}.`;
      } else {
        response = "Degree information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // Extra curricular activities
    const activityKeywords = ['extra curricular', 'extracurricular', 'activities', 'hobby', 'hobbies', 'interest', 'interests', 'achievement', 'achievements'];
    if (!hasMatch && activityKeywords.some(k => lowerMessage.includes(k))) {
      if (allExtraCurricular.length > 0) {
        response = `Shrikesh's extra curricular activities:\n\n${allExtraCurricular.map((a, i) => `${i + 1}. ${a.title}\n   ${a.header}\n   ${a.description}`).join('\n\n')}`;
      } else {
        response = "Extra curricular activities haven't been added yet.";
      }
      hasMatch = true;
    }

    // Name, who is, what is your name
    const nameKeywords = ['your name', 'what is your name', 'shrikesh', 'who is shrikesh', 'full name'];
    if (!hasMatch && nameKeywords.some(k => lowerMessage.includes(k))) {
      if (hero[0]) {
        response = `This portfolio belongs to Shrikesh Uday Shetty. ${hero[0].introLine} He is a ${hero[0].role}.`;
      } else {
        response = "This portfolio belongs to Shrikesh Uday Shetty.";
      }
      hasMatch = true;
    }

    // Role, job, position, title, work as
    const roleKeywords = ['role', 'job', 'position', 'title', 'work as', 'what do you do', 'profession', 'designation', 'developer', 'engineer'];
    if (!hasMatch && roleKeywords.some(k => lowerMessage.includes(k))) {
      if (hero[0]?.role) {
        response = `Shrikesh works as a ${hero[0].role}.`;
      } else {
        response = "Role information hasn't been added yet.";
      }
      hasMatch = true;
    }

    // Help, what can you do
    const helpKeywords = ['help', 'what can you do', 'what do you know', 'options', 'menu', 'commands'];
    if (!hasMatch && helpKeywords.some(k => lowerMessage.includes(k))) {
      response = `I can help you learn about Shrikesh's:\n\n- Skills and technologies\n- Projects and work\n- Client projects\n- Contact information\n- Background and experience\n- Education\n- Extra curricular activities\n\nWhat would you like to know?`;
      hasMatch = true;
    }

    // No match - provide fallback with contact info
    if (!hasMatch) {
      response = `Currently I don't have an answer for that. You can contact Shrikesh directly:\n${getContactInfo()}`;
    }

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ message: 'Sorry, something went wrong. Please try again.' });
  }
}
