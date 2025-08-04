// test/debug-endpoint-test.js
// Detailed test script to see what errors are occurring
import puppeteer from 'puppeteer';

const routes = [
  '/',
  '/settings',
  '/settings/profile', 
  '/settings/security',
  '/settings/appearance',
  '/settings/danger-zone',
  '/learn-more',
  '/stories',
  '/passport-lookup',
  '/register',
  '/login',
  '/dashboard'
];

async function debugTest() {
  console.log('🔍 Starting debug endpoint test...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  const results = [];

  for (const route of routes) {
    console.log(`\n🧪 Testing ${route}...`);
    
    // Fresh error tracking for each route
    const routeErrors = [];
    
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        routeErrors.push(`Console Error: ${msg.text()}`);
      }
    });

    page.on('pageerror', (error) => {
      routeErrors.push(`Page Error: ${error.message}`);
    });

    page.on('requestfailed', (request) => {
      routeErrors.push(`Failed Request: ${request.url()}`);
    });
    
    try {
      const response = await page.goto(`http://localhost:5173${route}`, {
        waitUntil: 'networkidle0',
        timeout: 10000
      });

      const status = response.status();
      const success = status < 500;
      
      // Wait a bit for any delayed errors
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for FontAwesome errors specifically
      const faIconsCount = await page.evaluate(() => {
        const faIcons = document.querySelectorAll('svg[data-icon]');
        return faIcons.length;
      });

      // Check for any JavaScript errors in console
      const jsErrors = await page.evaluate(() => {
        return window.console ? window.console.errors || [] : [];
      });

      results.push({
        route,
        status,
        success,
        faIconsFound: faIconsCount,
        errors: [...routeErrors],
        jsErrors
      });

      console.log(`  Status: ${status} ${success ? '✅' : '❌'}`);
      console.log(`  FontAwesome Icons: ${faIconsCount}`);
      
      if (routeErrors.length > 0) {
        console.log(`  ⚠️ Errors detected (${routeErrors.length}):`);
        routeErrors.forEach(error => console.log(`    - ${error}`));
      } else {
        console.log(`  ✅ No errors detected`);
      }

    } catch (error) {
      results.push({
        route,
        success: false,
        error: error.message,
        errors: [...routeErrors]
      });
      console.log(`  ❌ Failed to load: ${error.message}`);
      if (routeErrors.length > 0) {
        console.log(`  Additional errors:`);
        routeErrors.forEach(err => console.log(`    - ${err}`));
      }
    }
    
    // Remove event listeners to prevent accumulation
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.removeAllListeners('requestfailed');
  }

  await browser.close();

  // Summary
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 Final Results: ${passed}/${total} passed (${((passed/total)*100).toFixed(1)}%)`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed routes:');
    failed.forEach(f => console.log(`  - ${f.route}: ${f.error || f.status}`));
  }

  const withErrors = results.filter(r => r.errors && r.errors.length > 0);
  if (withErrors.length > 0) {
    console.log('\n⚠️ Routes with errors:');
    withErrors.forEach(r => {
      console.log(`  - ${r.route} (${r.errors.length} errors)`);
    });
  }

  return failed.length === 0;
}

// Run the test
debugTest()
  .then(success => {
    console.log(success ? '\n🎉 All routes loaded successfully!' : '\n💥 Some routes failed to load!');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Debug test failed:', error);
    process.exit(1);
  });

export default debugTest;
