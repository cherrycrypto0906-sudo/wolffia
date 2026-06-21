import * as z from 'zod/v4';
import {
  getNewWaitlistLeads,
  getTodayOrdersSummary,
  sendFollowupEmailToLead,
  setOrderPaid,
} from '../lib/businessData.js';
import { runWebsiteBuild, updateHeroLocaleFile } from '../lib/contentUpdate.js';

export const buildToolHandlers = (deps = {}) => {
  const {
    todayOrdersSummary = getTodayOrdersSummary,
    listNewWaitlistLeads = getNewWaitlistLeads,
    updateHeroContent = updateHeroLocaleFile,
    buildWebsite = runWebsiteBuild,
    markOrderPaid = setOrderPaid,
    sendFollowupEmail = sendFollowupEmailToLead,
  } = deps;

  return {
    today_orders_summary: async ({ date }) => todayOrdersSummary(date),
    list_new_waitlist_leads: async ({ date, limit, gift_interest_only }) =>
      listNewWaitlistLeads({
        date,
        limit,
        giftInterestOnly: gift_interest_only,
      }),
    update_hero_content: async ({ headline, subheadline, primary_cta, secondary_cta }) => {
      const updateResult = await updateHeroContent({
        headline,
        subheadline,
        primaryCta: primary_cta,
        secondaryCta: secondary_cta,
      });
      const buildResult = await buildWebsite();

      return {
        ...updateResult,
        build: buildResult,
      };
    },
    mark_order_paid: async ({ order_id, transfer_content, customer_name }) =>
      markOrderPaid({
        orderId: order_id,
        transferContent: transfer_content,
        customerName: customer_name,
      }),
    send_followup_email_to_lead: async ({ email, name, mode }) =>
      sendFollowupEmail({
        email,
        name,
        mode,
      }),
  };
};

export const registerBusinessTools = (server, deps = {}) => {
  const handlers = buildToolHandlers(deps);
  const formatResult = async (fn, args) => {
    const result = await fn(args);
    return {
      content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      structuredContent: result,
    };
  };

  server.registerTool('today_orders_summary', {
    description: 'Summarize today or a specific date orders, paid orders, pending orders, and revenue.',
    inputSchema: {
      date: z.string().optional().describe('Date in YYYY-MM-DD format. Defaults to today.'),
    },
  }, async (args) => formatResult(handlers.today_orders_summary, args));

  server.registerTool('list_new_waitlist_leads', {
    description: 'List survey leads collected from the cookbook waitlist form for a given date.',
    inputSchema: {
      date: z.string().optional().describe('Date in YYYY-MM-DD format. Defaults to today.'),
      limit: z.number().int().min(1).max(100).default(20),
      gift_interest_only: z.boolean().default(true),
    },
  }, async (args) => formatResult(handlers.list_new_waitlist_leads, args));

  server.registerTool('update_hero_content', {
    description: 'Update the public landing page hero copy and rebuild the website.',
    inputSchema: {
      headline: z.string().optional(),
      subheadline: z.string().optional(),
      primary_cta: z.string().optional(),
      secondary_cta: z.string().optional(),
    },
  }, async (args) => formatResult(handlers.update_hero_content, args));

  server.registerTool('mark_order_paid', {
    description: 'Mark a pending order as paid using order ID, transfer content, or customer name.',
    inputSchema: {
      order_id: z.string().optional(),
      transfer_content: z.string().optional(),
      customer_name: z.string().optional(),
    },
  }, async (args) => formatResult(handlers.mark_order_paid, args));

  server.registerTool('send_followup_email_to_lead', {
    description: 'Send the cookbook follow-up email sequence to a lead.',
    inputSchema: {
      email: z.string().email(),
      name: z.string().optional(),
      mode: z.string().default('cookbook_sequence'),
    },
  }, async (args) => formatResult(handlers.send_followup_email_to_lead, args));

  return handlers;
};
