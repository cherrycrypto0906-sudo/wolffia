import { fetchAdminResource, postAdminResource } from '../lib/appsScriptData.js';
import { isAdminAuthenticatedRequest } from '../lib/adminAuth.js';

export default async function handler(req, res) {
  try {
    if (!isAdminAuthenticatedRequest(req)) {
      return res.status(401).json({ ok: false, message: 'Unauthorized admin request' });
    }

    if (req.method === 'GET') {
      const resource = req.query.resource || 'all';
      const payload = await fetchAdminResource(resource);
      return res.status(payload?.ok ? 200 : 500).json(payload);
    }

    if (req.method === 'POST') {
      const payload = await postAdminResource(req.body || {});
      return res.status(payload?.ok ? 200 : 500).json(payload);
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ ok: false, message: error.message || 'Unexpected server error' });
  }
}
