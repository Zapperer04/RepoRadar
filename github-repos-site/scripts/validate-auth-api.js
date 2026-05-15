/**
 * Validation Script for Auth and Profile API
 * Usage: node scripts/validate-auth-api.js
 */

const http = require('http');

const API_BASE = 'http://localhost:5005/api';

async function apiCall(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${path}`;
    const data = body ? JSON.stringify(body) : null;
    
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };

    const req = http.request(url, options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(responseBody) });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseBody });
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Request to ${url} failed: ${err.message}`)));
    if (data) req.write(data);
    req.end();
  });
}

async function runValidation() {
  console.log('🔐 Starting Auth & Profile API Validation...');
  console.log('-----------------------------------------');

  const testEmail = `profile_test_${Date.now()}@example.com`;
  const testUser = {
    email: testEmail,
    username: `prof_${Date.now()}`,
    password: 'password123',
    fullName: 'Profile Tester'
  };

  try {
    // 1. Health Check
    process.stdout.write('Testing /api/health... ');
    const health = await apiCall('/health');
    if (health.status === 200 && (health.data.status === 'ok' || health.data.success)) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL (Status ${health.status})`);
      console.log('Response:', health.data);
    }

    // 2. Signup
    process.stdout.write(`Testing /api/auth/signup (${testEmail})... `);
    const signupRes = await apiCall('/auth/signup', 'POST', testUser);
    if (signupRes.status === 201 && signupRes.data.token) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL (Status ${signupRes.status})`);
      console.log('Response:', signupRes.data);
      return;
    }

    const token = signupRes.data.token;

    // 3. Profile via /api/auth/me
    process.stdout.write('Testing /api/auth/me... ');
    const meRes = await apiCall('/auth/me', 'GET', null, token);
    if (meRes.status === 200 && meRes.data.success && meRes.data.user) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL (Status ${meRes.status})`);
      console.log('Response:', meRes.data);
    }

    // 4. Profile via /api/user/profile (alias/direct)
    process.stdout.write('Testing /api/user/profile... ');
    const profileRes = await apiCall('/user/profile', 'GET', null, token);
    if (profileRes.status === 200 && profileRes.data.user) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL (Status ${profileRes.status})`);
      console.log('Response:', profileRes.data);
    }

    console.log('-----------------------------------------');
    console.log('🏁 Auth & Profile validation sequence finished.');
  } catch (error) {
    console.error('\n❌ CRITICAL FAILURE during validation:');
    console.error(error.message);
  }
}

runValidation();
