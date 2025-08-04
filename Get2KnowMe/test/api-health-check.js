// test/api-health-check.js
// Simple API endpoint health checker
import axios from 'axios';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API endpoints to test
const apiEndpoints = [
  { method: 'GET', path: '/api/health', auth: false },
  { method: 'GET', path: '/api/users/profile', auth: true },
  { method: 'GET', path: '/api/passport/public/test123', auth: false },
  { method: 'GET', path: '/api/stories', auth: false },
  // Add more API endpoints as needed
];

class APIHealthChecker {
  constructor() {
    this.baseUrl = 'http://localhost:3001'; // Adjust to your server port
    this.server = null;
    this.authToken = null;
    this.results = {
      passed: [],
      failed: []
    };
  }

  async startServer() {
    console.log('🚀 Starting server...');
    return new Promise((resolve, reject) => {
      this.server = spawn('npm', ['run', 'start'], {
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
        console.log(`Server: ${output.trim()}`);
        
        if (output.includes('Server running') || output.includes('listening')) {
          serverReady = true;
          clearTimeout(timeout);
          setTimeout(resolve, 2000);
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

  async testEndpoint(endpoint) {
    const url = `${this.baseUrl}${endpoint.path}`;
    console.log(`🔍 Testing ${endpoint.method} ${endpoint.path}`);

    try {
      const config = {
        method: endpoint.method,
        url,
        timeout: 10000,
        validateStatus: (status) => status < 500 // Don't throw on 4xx errors
      };

      if (endpoint.auth && this.authToken) {
        config.headers = {
          'Authorization': `Bearer ${this.authToken}`
        };
      }

      const response = await axios(config);
      
      const result = {
        endpoint: endpoint.path,
        method: endpoint.method,
        status: response.status,
        success: response.status < 500,
        responseTime: response.config.metadata?.endTime - response.config.metadata?.startTime || 0,
        timestamp: new Date().toISOString()
      };

      if (result.success) {
        this.results.passed.push(result);
        console.log(`✅ ${endpoint.method} ${endpoint.path} - ${response.status}`);
      } else {
        this.results.failed.push({
          ...result,
          error: `HTTP ${response.status}: ${response.statusText}`
        });
        console.log(`❌ ${endpoint.method} ${endpoint.path} - ${response.status}`);
      }

      return result;

    } catch (error) {
      const result = {
        endpoint: endpoint.path,
        method: endpoint.method,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };

      this.results.failed.push(result);
      console.log(`❌ ${endpoint.method} ${endpoint.path} - ERROR: ${error.message}`);
      
      return result;
    }
  }

  async runTests() {
    console.log('🧪 Starting API health check...');

    for (const endpoint of apiEndpoints) {
      await this.testEndpoint(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  generateReport() {
    const total = this.results.passed.length + this.results.failed.length;
    const passRate = total > 0 ? ((this.results.passed.length / total) * 100).toFixed(1) : 0;

    console.log('\n📊 API TEST RESULTS');
    console.log('===================');
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${this.results.passed.length} (${passRate}%)`);
    console.log(`Failed: ${this.results.failed.length}`);

    if (this.results.failed.length > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.failed.forEach(result => {
        console.log(`  ${result.method} ${result.endpoint}`);
        console.log(`    Error: ${result.error}`);
      });
    }

    return this.results.failed.length === 0;
  }

  cleanup() {
    if (this.server) {
      this.server.kill();
    }
  }

  async run() {
    try {
      await this.startServer();
      await this.runTests();
      return this.generateReport();
    } finally {
      this.cleanup();
    }
  }
}

// Export for use in other tests
export default APIHealthChecker;

// Run if called directly
const checker = new APIHealthChecker();

checker.run()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('API test runner failed:', error);
    process.exit(1);
  });
