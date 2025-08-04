// test/quick-endpoint-test.js
// Quick test script to check for FontAwesome and server errors
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
  '/dashboard',
  '/email-confirmed',
  '/policy/UserInfo',
  '/policy/terms-of-service',
  '/profile',
  '/my-passport',
  '/create-passport',
  '/reset-password',
  '/parental-consent',
  '/consent',
  '/consent/declined',
  '/registration-pending',
  '/submit-story'
];

async function quickTest() {
  console.log('🚀 Starting quick endpoint test...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Track errors
  const errors = [];
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', (error) => {
    errors.push(`Page Error: ${error.message}`);
  });

  page.on('requestfailed', (request) => {
    errors.push(`Failed Request: ${request.url()}`);
  });

  const results = [];

  for (const route of routes) {
    console.log(`Testing ${route}...`);
    
    try {
      const response = await page.goto(`http://localhost:5173${route}`, {
        waitUntil: 'networkidle0',
        timeout: 10000
      });

      const status = response.status();
      const success = status < 500;
      
      // Check for FontAwesome errors specifically
      const faErrors = await page.evaluate(() => {
        const faIcons = document.querySelectorAll('svg[data-icon]');
        return faIcons.length; // Count of rendered FontAwesome icons
      });

      results.push({
        route,
        status,
        success,
        faIconsFound: faErrors,
        hasErrors: errors.length > 0
      });

      console.log(`  ${success ? '✅' : '❌'} ${route} - Status: ${status}, FA Icons: ${faErrors}`);
      
      if (errors.length > 0) {
        console.log(`  ⚠️ Errors detected: ${errors.length}`);
        errors.splice(0); // Clear errors for next test
      }

    } catch (error) {
      results.push({
        route,
        success: false,
        error: error.message
      });
      console.log(`  ❌ ${route} - Error: ${error.message}`);
    }
  }

  await browser.close();

  // Summary
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 Results: ${passed}/${total} passed (${((passed/total)*100).toFixed(1)}%)`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ Failed routes:');
    failed.forEach(f => console.log(`  - ${f.route}: ${f.error || f.status}`));
  }

  return failed.length === 0;
}

// Run the test
quickTest()
  .then(success => {
    console.log(success ? '\n🎉 All tests passed!' : '\n💥 Some tests failed!');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });

export default quickTest;
