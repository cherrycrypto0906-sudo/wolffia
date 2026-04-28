import { FORM_DESTINATION } from '../lib/backendConfig.js';

const buildUrl = (resource) => {
  const url = new URL(FORM_DESTINATION);
  url.searchParams.set('resource', resource);
  url.searchParams.set('action', 'list');
  return url.toString();
};

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase();

const extractRedirectUrl = (text) => {
  const match = String(text || '').match(/<A HREF="([^"]+)"/i) || String(text || '').match(/href="([^"]+)"/i);
  return match ? match[1].replace(/&amp;/g, '&') : '';
};

const fetchJsonFromAppsScript = async (url, depth = 0) => {
  const response = await fetch(url, { redirect: 'manual' });
  const text = await response.text();

  if (response.status >= 300 && response.status < 400) {
    const redirectUrl = response.headers.get('location') || extractRedirectUrl(text);
    if (redirectUrl && depth < 3) {
      return fetchJsonFromAppsScript(redirectUrl, depth + 1);
    }
  }

  if (text.trim().startsWith('<')) {
    const redirectUrl = extractRedirectUrl(text);
    if (redirectUrl && depth < 3) {
      return fetchJsonFromAppsScript(redirectUrl, depth + 1);
    }
  }

  return JSON.parse(text);
};

const updateOrderStatus = async (order) => {
  await fetch(FORM_DESTINATION, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resource: 'orders',
      action: 'update',
      record: {
        ...order,
        quantity: Number(order.quantity || 1),
        amount: Number(order.amount || 0),
        status: 'paid',
        updated_at: new Date().toISOString(),
      },
    }),
    redirect: 'manual',
  });
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({
      ok: true,
      message: 'SePay webhook endpoint is ready',
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body || {};
    const transferType = String(payload.transferType || '').toLowerCase();
    const transferAmount = Number(payload.transferAmount || 0);
    const content = payload.content || payload.code || payload.description || '';

    if (transferType !== 'in' || !transferAmount || !content) {
      return res.status(200).json({ success: true, matched: false, reason: 'Ignored transaction' });
    }

    const ordersPayload = await fetchJsonFromAppsScript(buildUrl('orders'));
    const orders = ordersPayload?.data || [];
    const normalizedContent = normalizeText(content);

    const matchedOrder = orders.find((order) => {
      const normalizedOrderContent = normalizeText(order.transfer_content);

      return (
        Number(order.amount || 0) === transferAmount &&
        normalizedOrderContent &&
        normalizedContent.includes(normalizedOrderContent) &&
        String(order.status || '').toLowerCase() !== 'paid'
      );
    });

    if (!matchedOrder) {
      return res.status(200).json({
        success: true,
        matched: false,
        transactionId: payload?.id || payload?.code || null,
      });
    }

    await updateOrderStatus(matchedOrder);

    return res.status(200).json({
      success: true,
      matched: true,
      orderId: matchedOrder.id,
      transactionId: payload?.id || payload?.code || null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || 'Unexpected server error',
    });
  }
}
