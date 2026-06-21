import crypto from 'crypto';

export const ADMIN_COOKIE_NAME = 'wolffia_admin_session';

const SESSION_SCOPE = 'wolffia-admin';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

const getAdminPassword = () => process.env.ADMIN_PASSWORD?.trim() || '';

const safeEqual = (left, right) => {
  const leftBuffer = Buffer.from(String(left || ''));
  const rightBuffer = Buffer.from(String(right || ''));

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
};

const buildSessionToken = (secret = getAdminPassword()) => {
  if (!secret) return '';

  return crypto.createHmac('sha256', secret).update(SESSION_SCOPE).digest('hex');
};

const serializeCookie = (name, value, options = {}) => {
  const parts = [`${name}=${encodeURIComponent(value)}`];

  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
  if (options.path) parts.push(`Path=${options.path}`);
  if (options.httpOnly) parts.push('HttpOnly');
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`);
  if (options.secure) parts.push('Secure');

  return parts.join('; ');
};

const appendSetCookie = (res, cookieValue) => {
  const existing = res.getHeader('Set-Cookie');

  if (!existing) {
    res.setHeader('Set-Cookie', cookieValue);
    return;
  }

  if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, cookieValue]);
    return;
  }

  res.setHeader('Set-Cookie', [existing, cookieValue]);
};

export const parseCookies = (cookieHeader = '') =>
  cookieHeader
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((acc, item) => {
      const separatorIndex = item.indexOf('=');
      if (separatorIndex === -1) return acc;

      const key = item.slice(0, separatorIndex).trim();
      const value = item.slice(separatorIndex + 1).trim();

      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});

export const isAdminAuthConfigured = () => Boolean(getAdminPassword());

export const verifyAdminPassword = (password) => {
  const adminPassword = getAdminPassword();
  if (!adminPassword) return false;

  return safeEqual(password, adminPassword);
};

export const isValidAdminSessionToken = (token, secret = getAdminPassword()) => {
  if (!secret || !token) return false;

  return safeEqual(token, buildSessionToken(secret));
};

export const isAdminAuthenticatedRequest = (req) => {
  const cookies = parseCookies(req.headers?.cookie || '');
  return isValidAdminSessionToken(cookies[ADMIN_COOKIE_NAME]);
};

export const setAdminSessionCookie = (res) => {
  appendSetCookie(
    res,
    serializeCookie(ADMIN_COOKIE_NAME, buildSessionToken(), {
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    })
  );
};

export const clearAdminSessionCookie = (res) => {
  appendSetCookie(
    res,
    serializeCookie(ADMIN_COOKIE_NAME, '', {
      maxAge: 0,
      path: '/',
      httpOnly: true,
      sameSite: 'Lax',
      secure: process.env.NODE_ENV === 'production',
    })
  );
};

export const requireAdminAuth = (req, res, next) => {
  if (!isAdminAuthConfigured()) {
    return res.status(500).json({ ok: false, message: 'Missing ADMIN_PASSWORD environment variable' });
  }

  if (!isAdminAuthenticatedRequest(req)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized admin request' });
  }

  return next();
};
