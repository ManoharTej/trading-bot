const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser for screenshots...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to Dashboard...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.waitForTimeout(3000); // Wait for chart to load
  await page.screenshot({ path: 'docs/screenshots/dashboard.png' });
  
  console.log('Navigating to New Order...');
  await page.goto('http://localhost:5173/order', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/screenshots/new_order.png' });
  
  console.log('Navigating to Open Orders...');
  await page.goto('http://localhost:5173/open-orders', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/screenshots/open_orders.png' });

  console.log('Navigating to Order History...');
  await page.goto('http://localhost:5173/history', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/screenshots/order_history.png' });

  console.log('Navigating to Logs...');
  await page.goto('http://localhost:5173/logs', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/screenshots/logs.png' });

  console.log('Navigating to Settings...');
  await page.goto('http://localhost:5173/settings', { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'docs/screenshots/settings.png' });

  await browser.close();
  console.log('All screenshots captured successfully!');
})();
