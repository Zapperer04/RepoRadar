const http = require('http');

const API_BASE = 'http://localhost:5005/api';

const endpoints = [
  { name: 'Health', path: '/health' },
  { name: 'Root Repos', path: '/repos' },
  { name: 'Search', path: '/repos/search?q=react' },
  { name: 'Hidden Gems', path: '/repos/hidden-gems' },
  { name: 'Trending', path: '/repos/trending' },
  { name: 'Domains', path: '/repos/domains' },
  { name: 'Domain: Frontend', path: '/repos/domain/Frontend' },
  { name: 'Repo Details', path: '/repos/facebook/react' },
  { name: 'Similar Repos', path: '/repos/facebook/react/similar' }
];

async function testEndpoint(endpoint) {
  return new Promise((resolve) => {
    const url = `${API_BASE}${endpoint.path}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const result = {
          name: endpoint.name,
          status: res.statusCode,
          pass: res.statusCode === 200
        };

        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            result.success = json.success;
            result.source = json.source;
            result.count = json.count;
            result.hasData = !!json.data;
            if (Array.isArray(json.data) && json.data.length > 0) {
              result.firstRepo = json.data[0].fullName;
            } else if (json.data && json.data.fullName) {
              result.firstRepo = json.data.fullName;
            }
          } catch (e) {
            result.pass = false;
            result.error = 'Invalid JSON';
          }
        } else {
          result.error = `Status ${res.statusCode}`;
        }
        resolve(result);
      });
    }).on('error', (err) => {
      resolve({
        name: endpoint.name,
        status: 0,
        pass: false,
        error: err.message
      });
    });
  });
}

async function run() {
  console.log('🚀 Starting Backend API Validation...');
  console.log('-----------------------------------');
  
  const results = [];
  for (const endpoint of endpoints) {
    const result = await testEndpoint(endpoint);
    results.push(result);
    const status = result.pass ? '✅ PASS' : '❌ FAIL';
    const source = result.source ? `[${result.source}]` : '';
    console.log(`${status} ${result.name.padEnd(20)}: ${source} ${result.error || ''}`);
  }

  console.log('-----------------------------------');
  const allPassed = results.every(r => r.pass);
  console.log(`Summary: ${results.filter(r => r.pass).length}/${results.length} endpoints passed.`);
  
  if (allPassed) {
    console.log('🏆 All core API contracts verified!');
    process.exit(0);
  } else {
    console.log('⚠️ Some validation tests failed.');
    process.exit(1);
  }
}

run();
