import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

async function ensureDir(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return;
    } catch (_) {
      // ignore until server is ready
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} did not become ready within ${timeoutMs}ms`);
}

async function capture() {
  const baseUrl = process.env.PREVIEW_URL || 'http://127.0.0.1:8080';
  const outDir = path.resolve('artifacts', 'screenshots');
  await ensureDir(outDir);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await context.newPage();

  await waitForServer(baseUrl);

  // Routes to capture
  const routes = ['/', '/(tabs)'];

  for (const route of routes) {
    const url = new URL(route, baseUrl).toString();
    await page.goto(url, { waitUntil: 'networkidle' });
    // Small settle time for any animations
    await page.waitForTimeout(500);
    const safe = route === '/' ? 'home' : route.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
    const filePath = path.join(outDir, `${safe}.png`);
    await page.screenshot({ path: filePath, fullPage: true });
    // eslint-disable-next-line no-console
    console.log(`Saved ${filePath}`);
  }

  await browser.close();
}

capture().catch(err => {
  console.error(err);
  process.exit(1);
});


