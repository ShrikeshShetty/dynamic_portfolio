import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { heroSection, aboutSection, skills, projects, clientProjects, contactLinks } from '@/db/schema';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json() as { message: string; history: Message[] };

    // Fetch all portfolio data
    const [hero, about, allSkills, allProjects, allClientProjects, allContactLinks] = await Promise.all([
      db.select().from(heroSection).limit(1),
      db.select().from(aboutSection).limit(1),
      db.select().from(skills),
      db.select().from(projects),
      db.select().from(clientProjects),
      db.select().from(contactLinks),
    ]);

    // Build context for the AI
    const context = {
      hero: hero[0] || null,
      about: about[0] || null,
      skills: allSkills,
      projects: allProjects,
      clientProjects: allClientProjects,
      contactLinks: allContactLinks,
    };

    // Create a system prompt with the portfolio data
    const systemPrompt = `You are a helpful assistant for Shrikesh Uday Shetty's portfolio website. 
You have access to the following information about the portfolio owner. Answer questions based on this data.
Be friendly, concise, and helpful. If you don't know something based on the provided data, say so.

Portfolio Data:
${JSON.stringify(context, null, 2)}

Remember:
- Be professional but friendly
- Keep responses concise
- If asked about something not in the data, politely say you don't have that information
- You can recommend contacting through the provided contact links for more details`;

    // For now, use a simple rule-based response system
    // In production, you would call OpenAI or another LLM API here
    const lowerMessage = message.toLowerCase();
    let response = '';

    if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('tech stack')) {
      if (allSkills.length > 0) {
        const frontendSkills = allSkills.filter(s => s.category === 'frontend').map(s => s.name);
        const backendSkills = allSkills.filter(s => s.category === 'backend').map(s => s.name);
        const toolsSkills = allSkills.filter(s => s.category === 'tools').map(s => s.name);
        
        response = `Shrikesh has expertise in:\n\n**Frontend:** ${frontendSkills.join(', ') || 'Not specified'}\n\n**Backend:** ${backendSkills.join(', ') || 'Not specified'}\n\n**Tools & Technologies:** ${toolsSkills.join(', ') || 'Not specified'}`;
      } else {
        response = "Skills information hasn't been added yet. Please check back later!";
      }
    } else if (lowerMessage.includes('project') || lowerMessage.includes('work')) {
      if (allProjects.length > 0) {
        response = `Shrikesh has worked on ${allProjects.length} project(s):\n\n${allProjects.map((p, i) => `${i + 1}. **${p.title}** - ${p.techStack}`).join('\n\n')}`;
      } else {
        response = "Projects haven't been added yet. Please check back later!";
      }
    } else if (lowerMessage.includes('client')) {
      if (allClientProjects.length > 0) {
        response = `Shrikesh has completed ${allClientProjects.length} client project(s):\n\n${allClientProjects.map((p, i) => `${i + 1}. **${p.title}** for ${p.clientName}`).join('\n\n')}`;
      } else {
        response = "Client projects haven't been added yet. Please check back later!";
      }
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
      if (hero[0]) {
        response = `You can contact Shrikesh through:\n\n- Email: ${hero[0].email}\n- GitHub: ${hero[0].github}\n- LinkedIn: ${hero[0].linkedin}`;
      } else {
        response = "Contact information hasn't been added yet.";
      }
    } else if (lowerMessage.includes('about') || lowerMessage.includes('who') || lowerMessage.includes('introduce')) {
      if (hero[0] && about[0]) {
        response = `${hero[0].introLine} I'm a ${hero[0].role}.\n\n${about[0].description}\n\nI have ${about[0].codingYears} years of coding experience and have worked on ${about[0].projectCount} projects using ${about[0].technologyCount} technologies.`;
      } else {
        response = "About information hasn't been added yet.";
      }
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      response = `Hello! I'm the portfolio assistant. I can tell you about Shrikesh's skills, projects, experience, and how to contact him. What would you like to know?`;
    } else {
      response = `I can help you learn about Shrikesh's:\n\n- Skills and technologies\n- Projects and work\n- Client projects\n- Contact information\n- Background and experience\n\nWhat would you like to know?`;
    }

    return NextResponse.json({ message: response });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ message: 'Sorry, something went wrong. Please try again.' });
  }
}
