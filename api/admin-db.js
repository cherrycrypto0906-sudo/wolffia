import { FORM_DESTINATION } from '../lib/backendConfig.js';

const buildUrl = (resource, action = 'list') => {
  const url = new URL(FORM_DESTINATION);
  url.searchParams.set('resource', resource);
  url.searchParams.set('action', action);
  return url.toString();
};

const extractRedirectUrl = (text) => {
  const match = text.match(/<A HREF="([^"]+)"/i) || text.match(/href="([^"]+)"/i);
  return match ? match[1].replace(/&amp;/g, '&') : '';
};

const fetchJsonFromAppsScript = async (url, options = {}, depth = 0) => {
  const response = await fetch(url, { redirect: 'manual', ...options });
  const text = await response.text();

  if (response.status >= 300 && response.status < 400) {
    const redirectUrl = response.headers.get('location') || extractRedirectUrl(text);
    if (redirectUrl && depth < 3) {
      return fetchJsonFromAppsScript(redirectUrl, options, depth + 1);
    }
  }

  if (text.trim().startsWith('<')) {
    const redirectUrl = extractRedirectUrl(text);
    if (redirectUrl && depth < 3) {
      return fetchJsonFromAppsScript(redirectUrl, options, depth + 1);
    }
  }

  return JSON.parse(text);
};

const normalizePayload = (payload) => {
  if (payload?.ok === true) return payload;
  if (payload?.status === 'success') {
    return {
      ok: true,
      data: payload.data || null,
      message: payload.message || 'Success',
    };
  }
  return payload;
};

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const resource = req.query.resource || 'all';
      const payload = normalizePayload(await fetchJsonFromAppsScript(buildUrl(resource)));
      return res.status(payload?.ok ? 200 : 500).json(payload);
    }

    if (req.method === 'POST') {
      const payload = normalizePayload(await fetchJsonFromAppsScript(FORM_DESTINATION, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body || {}),
      }));
      return res.status(payload?.ok ? 200 : 500).json(payload);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message || 'Unexpected server error' });
  }
}
