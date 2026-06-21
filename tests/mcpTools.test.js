import test from 'node:test';
import assert from 'node:assert/strict';

import { buildToolHandlers } from '../mcp-server/registerTools.js';

test('today_orders_summary delegates to the orders summary dependency', async () => {
  const handlers = buildToolHandlers({
    todayOrdersSummary: async (date) => ({ date, total_orders: 3 }),
  });

  const result = await handlers.today_orders_summary({ date: '2026-06-21' });
  assert.deepEqual(result, { date: '2026-06-21', total_orders: 3 });
});

test('list_new_waitlist_leads maps MCP args to dependency args', async () => {
  const handlers = buildToolHandlers({
    listNewWaitlistLeads: async (args) => args,
  });

  const result = await handlers.list_new_waitlist_leads({
    date: '2026-06-21',
    limit: 5,
    gift_interest_only: false,
  });

  assert.deepEqual(result, {
    date: '2026-06-21',
    limit: 5,
    giftInterestOnly: false,
  });
});

test('update_hero_content updates content then triggers build', async () => {
  const callLog = [];
  const handlers = buildToolHandlers({
    updateHeroContent: async (args) => {
      callLog.push(['update', args]);
      return { updated: true, preview: { headline: args.headline } };
    },
    buildWebsite: async () => {
      callLog.push(['build']);
      return { ok: true };
    },
  });

  const result = await handlers.update_hero_content({ headline: 'Flash sale' });

  assert.equal(result.updated, true);
  assert.equal(result.build.ok, true);
  assert.deepEqual(callLog, [
    ['update', { headline: 'Flash sale', subheadline: undefined, primaryCta: undefined, secondaryCta: undefined }],
    ['build'],
  ]);
});

test('mark_order_paid maps MCP args to dependency args', async () => {
  const handlers = buildToolHandlers({
    markOrderPaid: async (args) => args,
  });

  const result = await handlers.mark_order_paid({
    order_id: 'abc',
    transfer_content: 'SEVQR-123',
    customer_name: 'Châu',
  });

  assert.deepEqual(result, {
    orderId: 'abc',
    transferContent: 'SEVQR-123',
    customerName: 'Châu',
  });
});

test('send_followup_email_to_lead delegates to the email dependency', async () => {
  const handlers = buildToolHandlers({
    sendFollowupEmail: async (args) => ({ sent: true, ...args }),
  });

  const result = await handlers.send_followup_email_to_lead({
    email: 'hello@example.com',
    name: 'Châu',
    mode: 'cookbook_sequence',
  });

  assert.deepEqual(result, {
    sent: true,
    email: 'hello@example.com',
    name: 'Châu',
    mode: 'cookbook_sequence',
  });
});
