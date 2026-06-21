import { readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERO_KEYS = {
  headline: 'headlinePrefix',
  subheadline: 'subheadline',
  primaryCta: 'ctaMain',
  secondaryCta: 'ctaSub',
};

export const applyHeroContentPatch = (localeJson, patch) => {
  const next = structuredClone(localeJson);
  next.hero = next.hero || {};
  const changedFields = [];

  if (typeof patch.headline === 'string' && patch.headline.trim()) {
    next.hero.headlinePrefix = patch.headline.trim();
    next.hero.headlineHighlight = '';
    changedFields.push('headline');
  }

  if (typeof patch.subheadline === 'string' && patch.subheadline.trim()) {
    next.hero.subheadline = patch.subheadline.trim();
    changedFields.push('subheadline');
  }

  if (typeof patch.primaryCta === 'string' && patch.primaryCta.trim()) {
    next.hero.ctaMain = patch.primaryCta.trim();
    changedFields.push('primary_cta');
  }

  if (typeof patch.secondaryCta === 'string' && patch.secondaryCta.trim()) {
    next.hero.ctaSub = patch.secondaryCta.trim();
    changedFields.push('secondary_cta');
  }

  if (changedFields.length === 0) {
    throw new Error('No valid hero fields provided');
  }

  return {
    next,
    changedFields,
    preview: {
      headline: next.hero.headlineHighlight
        ? `${next.hero.headlinePrefix} ${next.hero.headlineHighlight}`.trim()
        : next.hero.headlinePrefix,
      subheadline: next.hero.subheadline,
      primary_cta: next.hero.ctaMain,
      secondary_cta: next.hero.ctaSub,
    },
  };
};

export const updateHeroLocaleFile = async (patch, localePath = new URL('../src/locales/vi.json', import.meta.url)) => {
  const current = JSON.parse(await readFile(localePath, 'utf8'));
  const { next, changedFields, preview } = applyHeroContentPatch(current, patch);
  await writeFile(localePath, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  return { updated: true, changed_fields: changedFields, preview };
};

export const runWebsiteBuild = async (cwd = new URL('..', import.meta.url)) =>
  new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build'], {
      cwd: cwd instanceof URL ? fileURLToPath(cwd) : cwd,
      stdio: 'pipe',
      shell: false,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(stderr || stdout || 'Build failed'));
        return;
      }

      resolve({
        ok: true,
        output: stdout.trim(),
      });
    });
  });
