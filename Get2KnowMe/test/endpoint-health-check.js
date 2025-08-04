// test/endpoint-health-check.js
// Comprehensive test to check all endpoints for server errors
import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define all routes to test
const routes = [
  // Public routes
  '/',
  '/learn-more',
  '/stories',
  '/passport-lookup',
  '/register',
  '/login',
  '/legal/privacy-policy',
  '/legal/terms-of-service',
  '/legal/user-info',
  
  // Settings routes (will test both authenticated and unauthenticated)
  '/settings',
  '/settings/profile',
  '/settings/security',
  '/settings/appearance',
  '/settings/danger-zone',
  
  // Other routes
  '/profile',
  '/create-passport',
  '/parental-consent',
  '/registration-pending',
  '/email-confirmed',
  '/consent-thank-you',
  '/consent-declined',
  '/reset-password',
  '/submit-story',
  '/color-scheme-test'
];

// Configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:5173',
  timeout: 30000,
  screenshotOnError: true,
  verbose: true
};

class EndpointHealthChecker {
  constructor() {
    this.browser = null;
    this.page = null;
    this.server = null;
    this.results = {
      passed: [],
      failed: [],
      warnings: []
    };
  }

  async startDevServer() {
    console.log('🚀 Starting development server...');
    return new Promise((resolve, reject) => {
      this.server = spawn('npm', ['run', 'dev'], {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'pipe'
      });

      let serverReady = false;
      const timeout = setTimeout(() => {
        if (!serverReady) {
          reject(new Error('Server failed to start within timeout'));
        }
      }, 30000);

      this.server.stdout.on('data', (data) => {
        const output = data.toString();
        if (TEST_CONFIG.verbose) {
          console.log(`Server: ${output.trim()}`);
        }
        
        if (output.includes('Local:') || output.includes('localhost:5173')) {
          serverReady = true;
          clearTimeout(timeout);
          setTimeout(resolve, 2000); // Give server a moment to fully initialize
        }
      });

      this.server.stderr.on('data', (data) => {
        console.error(`Server Error: ${data.toString()}`);
      });

      this.server.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }

  async initBrowser() {
    console.log('🌐 Launching browser...');
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    this.page = await this.browser.newPage();
    
    // Set viewport
    await this.page.setViewport({ width: 1280, height: 720 });
    
    // Listen for console errors
    this.page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.error(`Console Error: ${msg.text()}`);
      }
    });

    // Listen for page errors
    this.page.on('pageerror', (error) => {
      console.error(`Page Error: ${error.message}`);
    });

    // Listen for failed requests
    this.page.on('requestfailed', (request) => {
      console.warn(`Failed Request: ${request.url()} - ${request.failure().errorText}`);
    });
  }

  async testRoute(route, authenticated = false) {
    const url = `${TEST_CONFIG.baseUrl}${route}`;
    console.log(`🔍 Testing ${authenticated ? '[AUTH] ' : ''}${route}`);

    try {
      // If testing authenticated routes, simulate login first
      if (authenticated) {
        await this.simulateLogin();
      }

      const response = await this.page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: TEST_CONFIG.timeout
      });

      // Check response status
      const status = response.status();
      if (status >= 500) {
        throw new Error(`Server error: ${status}`);
      }

      // Wait for React to render
      await this.page.waitForTimeout(1000);

      // Check for specific FontAwesome errors
      const fontAwesomeErrors = await this.page.evaluate(() => {
        const errors = [];
        
        // Check console for FontAwesome errors
        if (window.console && window.console.error) {
          // This is a simplified check - in real scenario you'd need to capture console messages
        }
        
        // Check for missing icons (they would show as empty squares or text)
        const iconElements = document.querySelectorAll('[data-icon]');
        iconElements.forEach((element, index) => {
          const icon = element.getAttribute('data-icon');
          const computedStyle = window.getComputedStyle(element);
          
          // Check if icon rendered properly (has content)
          if (!element.textContent && computedStyle.content === 'none') {
            errors.push(`Missing icon: ${icon} at element ${index}`);
          }
        });

        // Check for any React error boundaries
        const errorBoundaries = document.querySelectorAll('[data-error-boundary]');
        if (errorBoundaries.length > 0) {
          errors.push('React error boundary triggered');
        }

        return errors;
      });

      // Check for JavaScript errors
      const jsErrors = await this.page.evaluate(() => {
        return window.jsErrors || [];
      });

      // Take screenshot if there are issues
      if (fontAwesomeErrors.length > 0 || jsErrors.length > 0) {
        if (TEST_CONFIG.screenshotOnError) {
          const screenshotPath = `./test/screenshots/error-${route.replace(/\//g, '-')}-${Date.now()}.png`;
          await this.page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`📸 Screenshot saved: ${screenshotPath}`);
        }
      }

      const result = {
        route,
        authenticated,
        status,
        success: status < 400 && fontAwesomeErrors.length === 0 && jsErrors.length === 0,
        fontAwesomeErrors,
        jsErrors,
        timestamp: new Date().toISOString()
      };

      if (result.success) {
        this.results.passed.push(result);
        console.log(`✅ ${route} - OK`);
      } else {
        this.results.failed.push(result);
        console.log(`❌ ${route} - FAILED`);
        if (fontAwesomeErrors.length > 0) {
          console.log(`   FontAwesome Errors: ${fontAwesomeErrors.join(', ')}`);
        }
        if (jsErrors.length > 0) {
          console.log(`   JS Errors: ${jsErrors.join(', ')}`);
        }
      }

      return result;

    } catch (error) {
      const result = {
        route,
        authenticated,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };

      this.results.failed.push(result);
      console.log(`❌ ${route} - ERROR: ${error.message}`);

      if (TEST_CONFIG.screenshotOnError) {
        try {
          const screenshotPath = `./test/screenshots/error-${route.replace(/\//g, '-')}-${Date.now()}.png`;
          await this.page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`📸 Screenshot saved: ${screenshotPath}`);
        } catch (screenshotError) {
          console.warn(`Failed to take screenshot: ${screenshotError.message}`);
        }
      }

      return result;
    }
  }

  async simulateLogin() {
    // This is a simplified login simulation
    // In a real test, you'd want to use actual test credentials
    try {
      await this.page.goto(`${TEST_CONFIG.baseUrl}/login`);
      
      // Fill in test credentials (you'd need to create a test user)
      await this.page.type('input[name="emailOrUsername"]', 'test@example.com');
      await this.page.type('input[name="password"]', 'TestPassword123!');
      
      // Submit form
      await this.page.click('button[type="submit"]');
      
      // Wait for redirect
      await this.page.waitForNavigation({ timeout: 5000 });
      
      console.log('🔐 Simulated login completed');
    } catch (error) {
      console.warn(`⚠️ Login simulation failed: ${error.message}`);
      // Continue with tests as unauthenticated user
    }
  }

  async runAllTests() {
    console.log('🧪 Starting comprehensive endpoint health check...');
    console.log(`Testing ${routes.length} routes`);

    // Create screenshots directory
    const fs = await import('fs');
    const screenshotDir = './test/screenshots';
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }

    // Test all routes as unauthenticated user
    for (const route of routes) {
      await this.testRoute(route, false);
    }

    // Test protected routes as authenticated user
    const protectedRoutes = ['/settings', '/settings/profile', '/settings/security', '/settings/appearance', '/settings/danger-zone', '/profile', '/create-passport'];
    
    for (const route of protectedRoutes) {
      await this.testRoute(route, true);
    }
  }

  async generateReport() {
    const total = this.results.passed.length + this.results.failed.length;
    const passRate = ((this.results.passed.length / total) * 100).toFixed(1);

    console.log('\n📊 TEST RESULTS SUMMARY');
    console.log('========================');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${this.results.passed.length} (${passRate}%)`);
    console.log(`Failed: ${this.results.failed.length}`);
    console.log(`Warnings: ${this.results.warnings.length}`);

    if (this.results.failed.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.failed.forEach(result => {
        console.log(`  ${result.route} ${result.authenticated ? '[AUTH]' : ''}`);
        if (result.error) {
          console.log(`    Error: ${result.error}`);
        }
        if (result.fontAwesomeErrors && result.fontAwesomeErrors.length > 0) {
          console.log(`    FontAwesome: ${result.fontAwesomeErrors.join(', ')}`);
        }
        if (result.jsErrors && result.jsErrors.length > 0) {
          console.log(`    JS Errors: ${result.jsErrors.join(', ')}`);
        }
      });
    }

    // Save detailed report
    const reportPath = `./test/health-check-report-${Date.now()}.json`;
    const fs = await import('fs');
    fs.writeFileSync(reportPath, JSON.stringify({
      summary: {
        total,
        passed: this.results.passed.length,
        failed: this.results.failed.length,
        passRate: `${passRate}%`,
        timestamp: new Date().toISOString()
      },
      results: this.results
    }, null, 2));

    console.log(`\n📄 Detailed report saved: ${reportPath}`);
    
    return this.results.failed.length === 0;
  }

  async cleanup() {
    console.log('🧹 Cleaning up...');
    
    if (this.browser) {
      await this.browser.close();
    }
    
    if (this.server) {
      this.server.kill();
    }
  }

  async run() {
    try {
      await this.startDevServer();
      await this.initBrowser();
      await this.runAllTests();
      const success = await this.generateReport();
      
      return success;
    } finally {
      await this.cleanup();
    }
  }
}

// Run the test if called directly
const checker = new EndpointHealthChecker();

checker.run()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });

export default EndpointHealthChecker;
