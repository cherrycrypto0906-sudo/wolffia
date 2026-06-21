import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'crypto';

import {
  ADMIN_COOKIE_NAME,
  isAdminAuthenticatedRequest,
  isValidAdminSessionToken,
  parseCookies,
  verifyAdminPassword,
} from '../lib/adminAuth.js';

test('parseCookies returns decoded cookie map', () => {
  const cookies = parseCookies('foo=bar; hello=world%20test; empty=');

  assert.deepEqual(cookies, {
    foo: 'bar',
    hello: 'world test',
    empty: '',
  });
});

test('verifyAdminPassword matches ADMIN_PASSWORD exactly', () => {
  process.env.ADMIN_PASSWORD = 'shuu0906';

  assert.equal(verifyAdminPassword('shuu0906'), true);
  assert.equal(verifyAdminPassword('wrong-pass'), false);
});

test('isValidAdminSessionToken accepts the expected session token', () => {
  process.env.ADMIN_PASSWORD = 'shuu0906';
  const expectedToken = crypto.createHmac('sha256', 'shuu0906').update('wolffia-admin').digest('hex');

  assert.equal(isValidAdminSessionToken(expectedToken), true);
  assert.equal(isValidAdminSessionToken('invalid-token'), false);
});

test('isAdminAuthenticatedRequest reads the signed cookie from request headers', () => {
  process.env.ADMIN_PASSWORD = 'shuu0906';
  const expectedToken = crypto.createHmac('sha256', 'shuu0906').update('wolffia-admin').digest('hex');
  const request = {
    headers: {
      cookie: `${ADMIN_COOKIE_NAME}=${expectedToken}; foo=bar`,
    },
  };

  assert.equal(isAdminAuthenticatedRequest(request), true);
  assert.equal(isAdminAuthenticatedRequest({ headers: { cookie: 'foo=bar' } }), false);
});
