import { FORM_DESTINATION, assertBackendConfig } from './backendConfig.js';

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

const buildRedirectOptions = (url, options = {}) => {
  const nextUrl = new URL(url, FORM_DESTINATION).toString();
  const nextOptions = { ...options };
  const method = String(nextOptions.method || 'GET').toUpperCase();

  if (method !== 'GET' && method !== 'HEAD') {
    nextOptions.method = 'GET';
    delete nextOptions.body;

    if (nextOptions.headers) {
      const headers = { ...nextOptions.headers };
      delete headers['Content-Type'];
      delete headers['content-type'];
      nextOptions.headers = headers;
    }
  }

  return { nextUrl, nextOptions };
};

const fetchJsonFromAppsScript = async (url, options = {}, depth = 0) => {
  const response = await fetch(url, { redirect: 'manual', ...options });
  const text = await response.text();

  if (response.status >= 300 && response.status < 400) {
    const redirectUrl = response.headers.get('location') || extractRedirectUrl(text);
    if (redirectUrl && depth < 3) {
      const { nextUrl, nextOptions } = buildRedirectOptions(redirectUrl, options);
      return fetchJsonFromAppsScript(nextUrl, nextOptions, depth + 1);
    }
  }

  if (text.trim().startsWith('<')) {
    const redirectUrl = extractRedirectUrl(text);
    if (redirectUrl && depth < 3) {
      const { nextUrl, nextOptions } = buildRedirectOptions(redirectUrl, options);
      return fetchJsonFromAppsScript(nextUrl, nextOptions, depth + 1);
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

const assertPayload = (payload, fallbackMessage) => {
  if (!payload?.ok) {
    throw new Error(payload?.message || fallbackMessage);
  }

  return payload;
};

export const fetchAdminResource = async (resource, action = 'list') => {
  assertBackendConfig();
  const payload = normalizePayload(await fetchJsonFromAppsScript(buildUrl(resource, action)));
  return assertPayload(payload, `Failed to fetch ${resource}`);
};

export const postAdminResource = async (body) => {
  assertBackendConfig();
  const payload = normalizePayload(await fetchJsonFromAppsScript(FORM_DESTINATION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  }));

  return assertPayload(payload, 'Failed to update admin resource');
};

export const fetchAllAdminData = async () => {
  const payload = await fetchAdminResource('all');
  return {
    products: payload.data?.products || [],
    customers: payload.data?.customers || [],
    orders: payload.data?.orders || [],
  };
};

export const fetchSurveyLeads = async () => {
  const payload = await fetchAdminResource('survey_leads');
  return payload.data || [];
};
