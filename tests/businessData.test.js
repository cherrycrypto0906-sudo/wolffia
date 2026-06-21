import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

import { filterSurveyLeadsByDate, summarizeOrdersByDate } from '../lib/businessData.js';
import { applyHeroContentPatch, updateHeroLocaleFile } from '../lib/contentUpdate.js';

test('summarizeOrdersByDate counts paid, pending, and revenue correctly', () => {
  const result = summarizeOrdersByDate([
    { product_name: 'Gói dùng thử', quantity: 1, amount: 49000, status: 'paid', purchased_at: '2026-06-21T01:00:00.000Z' },
    { product_name: 'Combo 3 hộp', quantity: 2, amount: 135000, status: 'pending_payment', purchased_at: '2026-06-21T05:00:00.000Z' },
    { product_name: 'Gói dùng thử', quantity: 1, amount: 49000, status: 'paid', purchased_at: '2026-06-21T10:00:00.000Z' },
    { product_name: 'Combo 5 hộp', quantity: 1, amount: 210000, status: 'paid', purchased_at: '2026-06-20T10:00:00.000Z' },
  ], '2026-06-21');

  assert.equal(result.date, '2026-06-21');
  assert.equal(result.total_orders, 3);
  assert.equal(result.paid_orders, 2);
  assert.equal(result.pending_orders, 1);
  assert.equal(result.total_revenue, 98000);
  assert.deepEqual(result.top_products[0], {
    product_name: 'Combo 3 hộp',
    quantity: 2,
    revenue: 135000,
  });
});

test('filterSurveyLeadsByDate returns newest matching leads first', () => {
  const result = filterSurveyLeadsByDate([
    { name: 'A', giftInterest: 'Có, mình muốn nhận cookbook', submittedAt: '2026-06-21T02:00:00.000Z' },
    { name: 'B', giftInterest: 'Hiện tại mình chưa có nhu cầu', submittedAt: '2026-06-21T03:00:00.000Z' },
    { name: 'C', giftInterest: 'Có, gửi mình nhé', submittedAt: '2026-06-21T04:00:00.000Z' },
    { name: 'D', giftInterest: 'Có, gửi mình nhé', submittedAt: '2026-06-20T04:00:00.000Z' },
  ], '2026-06-21', 5, true);

  assert.equal(result.total_leads, 2);
  assert.equal(result.leads[0].name, 'C');
  assert.equal(result.leads[1].name, 'A');
});

test('applyHeroContentPatch updates only allowed hero fields', () => {
  const locale = {
    hero: {
      headlinePrefix: 'Old title',
      headlineHighlight: 'old highlight',
      subheadline: 'Old subheadline',
      ctaMain: 'Old CTA',
      ctaSub: 'Old CTA 2',
    },
  };

  const result = applyHeroContentPatch(locale, {
    headline: 'Flash sale cuối tuần 30%',
    primaryCta: 'Mua ngay hôm nay',
  });

  assert.equal(result.preview.headline, 'Flash sale cuối tuần 30%');
  assert.equal(result.preview.primary_cta, 'Mua ngay hôm nay');
  assert.equal(result.preview.secondary_cta, 'Old CTA 2');
  assert.equal(result.next.hero.headlineHighlight, '');
});

test('updateHeroLocaleFile writes the patched locale file', async () => {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'wolffia-hero-'));
  const localePath = path.join(tmpDir, 'vi.json');

  await writeFile(localePath, JSON.stringify({
    hero: {
      headlinePrefix: 'Old title',
      headlineHighlight: 'old highlight',
      subheadline: 'Old subheadline',
      ctaMain: 'Old CTA',
      ctaSub: 'Old CTA 2',
    },
  }), 'utf8');

  const result = await updateHeroLocaleFile({
    subheadline: 'Bản mới cho chiến dịch hôm nay',
  }, localePath);

  const saved = JSON.parse(await readFile(localePath, 'utf8'));
  assert.equal(result.updated, true);
  assert.equal(saved.hero.subheadline, 'Bản mới cho chiến dịch hôm nay');
});
