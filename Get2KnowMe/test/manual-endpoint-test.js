// test/manual-endpoint-test.js
// Manual test instructions and simple checker without external dependencies

console.log('🧪 MANUAL ENDPOINT TESTING GUIDE');
console.log('================================\n');

console.log('1. Start your development server:');
console.log('   npm run dev:all\n');

console.log('2. Open your browser and test these URLs:');

const routes = [
  'http://localhost:5173/',
  'http://localhost:5173/settings',
  'http://localhost:5173/settings/profile',
  'http://localhost:5173/settings/security',
  'http://localhost:5173/settings/appearance', 
  'http://localhost:5173/settings/danger-zone',
  'http://localhost:5173/learn-more',
  'http://localhost:5173/stories',
  'http://localhost:5173/passport-lookup',
  'http://localhost:5173/register',
  'http://localhost:5173/login'
];

routes.forEach((route, index) => {
  console.log(`   ${index + 1}. ${route}`);
});

console.log('\n3. For each page, check for:');
console.log('   ✅ Page loads without 500 errors');
console.log('   ✅ FontAwesome icons display correctly (not empty squares)');
console.log('   ✅ No console errors in browser DevTools');
console.log('   ✅ No "faTimes is not defined" or similar FontAwesome errors');

console.log('\n4. To check console errors:');
console.log('   - Open DevTools (F12)');
console.log('   - Go to Console tab');
console.log('   - Look for red error messages');

console.log('\n5. To check for missing icons:');
console.log('   - Look for empty squares or missing symbols');
console.log('   - Icons should show as proper symbols, not text');

console.log('\n6. Problem areas to focus on:');
console.log('   - Settings pages (especially Security)');
console.log('   - Password validation indicators');
console.log('   - Navigation dropdown menus');
console.log('   - Settings overview page');

console.log('\n🚀 Quick automated test (requires dev server running):');
console.log('   You can also run: npm run test:quick');
console.log('   (after installing: npm install puppeteer --save-dev)');

// Simple fetch-based test if Node.js fetch is available
if (typeof fetch !== 'undefined' || require) {
  console.log('\n🔍 Running basic connectivity test...');
  
  async function testBasicConnectivity() {
    try {
      // Try to use node-fetch if available, otherwise skip
      let fetch;
      try {
        fetch = (await import('node-fetch')).default;
      } catch {
        console.log('   ⚠️ node-fetch not available, skipping automated test');
        return;
      }

      const testUrls = [
        'http://localhost:5173',
        'http://localhost:3001/api/health'
      ];

      for (const url of testUrls) {
        try {
          const response = await fetch(url, { 
            timeout: 5000,
            headers: { 'User-Agent': 'endpoint-test' }
          });
          console.log(`   ${response.ok ? '✅' : '❌'} ${url} - ${response.status}`);
        } catch (error) {
          console.log(`   ❌ ${url} - ${error.message}`);
        }
      }
    } catch (error) {
      console.log('   ⚠️ Basic connectivity test failed:', error.message);
    }
  }

  // Run if this is a Node.js environment
  if (typeof window === 'undefined') {
    testBasicConnectivity();
  }
}

console.log('\n📋 CHECKLIST:');
console.log('=============');
console.log('□ Dev server is running (npm run dev:all)');
console.log('□ Home page loads correctly'); 
console.log('□ Settings overview page loads');
console.log('□ Settings/Security page loads (key test!)');
console.log('□ Settings/Appearance page loads');
console.log('□ All FontAwesome icons display properly');
console.log('□ No console errors in browser');
console.log('□ Password validation icons work (check/times)');
console.log('□ Navigation dropdown icons work');

export { routes };
