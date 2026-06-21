import { fetchAllAdminData, fetchSurveyLeads, postAdminResource } from './appsScriptData.js';
import { getResendApiKey } from './resendConfig.js';
import { getEmailSequence } from './emailSequence.js';

const DAY_MS = 24 * 60 * 60 * 1000;

const normalizeDateKey = (value) => {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date');
  }

  return date.toISOString().slice(0, 10);
};

const getDateKey = (value) => {
  if (!value) return '';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
};

const sortNewestFirst = (items, dateField) =>
  [...items].sort((left, right) => new Date(right?.[dateField] || 0).getTime() - new Date(left?.[dateField] || 0).getTime());

export const summarizeOrdersByDate = (orders, date) => {
  const dateKey = normalizeDateKey(date);
  const filtered = orders.filter((order) => getDateKey(order.purchased_at || order.created_at) === dateKey);
  const paidOrders = filtered.filter((order) => String(order.status || '').toLowerCase() === 'paid');
  const pendingOrders = filtered.filter((order) => String(order.status || '').toLowerCase() !== 'paid');
  const productMap = new Map();

  filtered.forEach((order) => {
    const productName = order.product_name || 'Khác';
    const quantity = Number(order.quantity || 1);
    const revenue = Number(order.amount || 0);
    const previous = productMap.get(productName) || { product_name: productName, quantity: 0, revenue: 0 };
    previous.quantity += quantity;
    previous.revenue += revenue;
    productMap.set(productName, previous);
  });

  return {
    date: dateKey,
    total_orders: filtered.length,
    paid_orders: paidOrders.length,
    pending_orders: pendingOrders.length,
    total_revenue: paidOrders.reduce((sum, order) => sum + Number(order.amount || 0), 0),
    top_products: [...productMap.values()].sort((left, right) => right.revenue - left.revenue),
  };
};

export const filterSurveyLeadsByDate = (leads, date, limit = 20, giftInterestOnly = true) => {
  const dateKey = normalizeDateKey(date);
  const filtered = sortNewestFirst(leads, 'submittedAt').filter((lead) => {
    if (getDateKey(lead.submittedAt || lead.created_at) !== dateKey) return false;
    if (!giftInterestOnly) return true;

    const giftValue = String(lead.giftInterest || lead.gift || '').toLowerCase();
    if (giftValue.includes('chưa') || giftValue.includes('không')) {
      return false;
    }

    return giftValue.includes('có') || giftValue.includes('muốn') || giftValue.includes('yes');
  });

  return {
    date: dateKey,
    total_leads: filtered.length,
    leads: filtered.slice(0, Math.max(1, Number(limit || 20))),
  };
};

export const findOrder = (orders, { orderId, transferContent, customerName }) => {
  if (orderId) {
    return orders.find((order) => order.id === orderId) || null;
  }

  if (transferContent) {
    return orders.find((order) => String(order.transfer_content || '').trim() === String(transferContent).trim()) || null;
  }

  if (customerName) {
    const target = String(customerName).trim().toLowerCase();
    return orders.find((order) => String(order.customer_name || '').trim().toLowerCase() === target) || null;
  }

  return null;
};

const sendEmail = async ({ apiKey, to, subject, html, text, scheduledAt }) => {
  const payload = {
    from: 'Wolffia Diệp Châu <onboarding@resend.dev>',
    to: [to],
    subject,
    html,
    text,
  };

  if (scheduledAt) {
    payload.scheduled_at = scheduledAt;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || result?.error || 'Resend send failed');
  }

  return result;
};

export const getTodayOrdersSummary = async (date = new Date().toISOString().slice(0, 10)) => {
  const { orders } = await fetchAllAdminData();
  return summarizeOrdersByDate(orders, date);
};

export const getNewWaitlistLeads = async ({
  date = new Date().toISOString().slice(0, 10),
  limit = 20,
  giftInterestOnly = true,
} = {}) => {
  const leads = await fetchSurveyLeads();
  return filterSurveyLeadsByDate(leads, date, limit, giftInterestOnly);
};

export const setOrderPaid = async ({ orderId, transferContent, customerName }) => {
  const { orders } = await fetchAllAdminData();
  const order = findOrder(orders, { orderId, transferContent, customerName });

  if (!order) {
    throw new Error('Order not found');
  }

  const updatedRecord = {
    ...order,
    quantity: Number(order.quantity || 1),
    amount: Number(order.amount || 0),
    status: 'paid',
    updated_at: new Date().toISOString(),
  };

  const payload = await postAdminResource({
    resource: 'orders',
    action: 'update',
    record: updatedRecord,
  });

  return payload.data || updatedRecord;
};

export const sendFollowupEmailToLead = async ({ email, name, mode = 'cookbook_sequence' }) => {
  if (!email || typeof email !== 'string') {
    throw new Error('Missing email');
  }

  const apiKey = await getResendApiKey();
  if (!apiKey) {
    throw new Error('Missing Resend API key');
  }

  if (mode !== 'cookbook_sequence') {
    throw new Error(`Unsupported mode: ${mode}`);
  }

  const sequence = await getEmailSequence(name || 'bạn');
  const now = new Date();
  const results = [];

  for (let index = 0; index < sequence.length; index += 1) {
    const emailItem = sequence[index];
    let scheduledAt = null;

    if (index === 1) {
      scheduledAt = new Date(now.getTime() + 2 * DAY_MS).toISOString();
    }

    if (index === 2) {
      scheduledAt = new Date(now.getTime() + 3 * DAY_MS).toISOString();
    }

    const sendResult = await sendEmail({
      apiKey,
      to: email,
      subject: emailItem.subject,
      html: emailItem.html,
      text: emailItem.text,
      scheduledAt,
    });

    results.push({
      subject: emailItem.subject,
      id: sendResult.id,
      scheduledAt,
    });
  }

  return {
    sent: true,
    mode,
    email,
    emails: results,
  };
};
