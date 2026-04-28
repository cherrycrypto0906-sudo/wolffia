import { readFile } from 'node:fs/promises';

const RESEND_CONFIG_PATH = new URL('../resend_config.txt', import.meta.url);

let cachedKey = '';

const extractKey = (text) => {
  const match = String(text || '').match(/RESEND_API_KEY\s*=\s*(.+)/);
  return match ? match[1].trim() : '';
};

export const getResendApiKey = async () => {
  if (process.env.RESEND_API_KEY?.trim()) {
    return process.env.RESEND_API_KEY.trim();
  }

  if (cachedKey) {
    return cachedKey;
  }

  const configText = await readFile(RESEND_CONFIG_PATH, 'utf8');
  cachedKey = extractKey(configText);
  return cachedKey;
};
