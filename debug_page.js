const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  try {
    await page.goto('http://localhost:4173', { waitUntil: 'networkidle', timeout: 5000 });
  } catch (e) {
    console.error("GOTO ERROR:", e.message);
  }
  
  await browser.close();
})();
