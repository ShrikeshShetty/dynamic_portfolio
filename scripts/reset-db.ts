import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local explicitly
config({ path: resolve(__dirname, '../.env.local') });

import { neon } from '@neondatabase/serverless';

async function resetDatabase() {
  const sql = neon(process.env.DATABASE_URL!);

  console.log('Dropping all tables...');
  
  // Drop all tables
  await sql`DROP TABLE IF EXISTS resume CASCADE;`;
  await sql`DROP TABLE IF EXISTS contact_links CASCADE;`;
  await sql`DROP TABLE IF EXISTS client_projects CASCADE;`;
  await sql`DROP TABLE IF EXISTS projects CASCADE;`;
  await sql`DROP TABLE IF EXISTS skills CASCADE;`;
  await sql`DROP TABLE IF EXISTS about_section CASCADE;`;
  await sql`DROP TABLE IF EXISTS hero_section CASCADE;`;
  
  console.log('All tables dropped successfully!');
  console.log('Now run: npm run db:push');
}

resetDatabase().catch(console.error);
