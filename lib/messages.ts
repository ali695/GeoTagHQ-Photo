import fs from 'fs/promises';
import path from 'path';

export async function getMessages(lang: string) {
  try {
    const filePath = path.join(process.cwd(), 'messages', `${lang}.json`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    if (lang !== 'en') {
      return getMessages('en'); // fallback to english
    }
    throw new Error(`Could not find messages for language: ${lang}`);
  }
}
