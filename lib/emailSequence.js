import { readFile } from 'node:fs/promises';

const EMAIL_SEQUENCE_PATH = new URL('../My-brain/email_sequence.md', import.meta.url);

const parseSections = (content) => {
  const matches = [...content.matchAll(/##\s+Email\s+\d+\s+-\s+([^\n]+)\n([\s\S]*?)(?=\n##\s+Email\s+\d+\s+-|$)/g)];

  return matches.map((match) => {
    const title = match[1].trim();
    const body = match[2].trim();
    const subjectMatch = body.match(/\*\*Subject:\*\*\s*(.+)/);
    const subject = subjectMatch ? subjectMatch[1].trim() : title;
    const contentWithoutSubject = body.replace(/\*\*Subject:\*\*\s*.+\n*/g, '').trim();

    return {
      title,
      subject,
      text: contentWithoutSubject,
    };
  });
};

const toHtml = (text, name) => {
  const replaced = text
    .replace(/\[Ten\]/gi, name || 'bạn')
    .split(/\n\n+/)
    .map((paragraph) => `<p>${paragraph.replace(/\n/g, '<br />')}</p>`)
    .join('');

  return `<div style="font-family:Arial,sans-serif;font-size:16px;line-height:1.6;color:#243424">${replaced}</div>`;
};

let cachedSequence = null;

export const getEmailSequence = async (name = 'bạn') => {
  if (!cachedSequence) {
    const fileContent = await readFile(EMAIL_SEQUENCE_PATH, 'utf8');
    cachedSequence = parseSections(fileContent);
  }

  return cachedSequence.map((item) => ({
    ...item,
    text: item.text.replace(/\[Ten\]/gi, name),
    html: toHtml(item.text, name),
  }));
};
