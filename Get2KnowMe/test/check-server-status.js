#!/usr/bin/env node
// test/check-server-status.js
// Simple server status checker

import http from 'http';
import https from 'https';

const endpoints = [
  { name: 'Dev Server (Frontend)', url: 'http://localhost:5173' },
  { name: 'API Server', url: 'http://localhost:3001' },
  { name: 'API Health Check', url: 'http://localhost:3001/api/health' }
];

function checkEndpoint(url) {
  return new Promise((resolve) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === 'https:' ? https : http;
    
    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'GET',
      timeout: 5000
    }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        success: res.statusCode < 500,
        message: `HTTP ${res.statusCode}`
      });
    });

    req.on('error', (error) => {
      resolve({
        url,
        success: false,
        message: error.message
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        success: false,
        message: 'Timeout'
      });
    });

    req.end();
  });
}

async function checkAllEndpoints() {
  console.log('🔍 Checking server status...\n');

  for (const endpoint of endpoints) {
    const result = await checkEndpoint(endpoint.url);
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${endpoint.name}`);
    console.log(`   ${endpoint.url} - ${result.message}\n`);
  }

  console.log('💡 Tips:');
  console.log('  - If frontend fails: Run "npm run dev"');
  console.log('  - If API fails: Run "npm run server:dev"');
  console.log('  - To start both: Run "npm run dev:all"');
}

// Run the check
checkAllEndpoints();

export { checkAllEndpoints };
