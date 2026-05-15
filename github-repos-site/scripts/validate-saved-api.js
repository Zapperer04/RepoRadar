/**
 * Validation Script for Authenticated Saved & Collections API
 * Usage: AUTH_TOKEN=your_jwt_token node scripts/validate-saved-api.js
 */

const http = require('http');

const API_BASE = 'http://localhost:5005/api';
const AUTH_TOKEN = process.env.AUTH_TOKEN;

if (!AUTH_TOKEN) {
  console.error('❌ ERROR: AUTH_TOKEN environment variable is missing.');
  console.log('\nTo use this script:');
  console.log('1. Login to RepoRadar in your browser.');
  console.log('2. Open DevTools > Application > Local Storage.');
  console.log('3. Copy the value of "authToken".');
  console.log('4. Run: AUTH_TOKEN=your_token_here node scripts/validate-saved-api.js');
  process.exit(1);
}

async function apiCall(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTH_TOKEN}`
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => reject(new Error(`Request to ${url} failed: ${err.message}`)));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runValidation() {
  console.log('🚀 Starting Authenticated API Validation...');
  console.log('-----------------------------------------');

  try {
    // 1. GET /api/saved
    process.stdout.write('Testing GET /api/saved... ');
    const savedRes = await apiCall('/saved');
    if (savedRes.status === 200) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL (Status ${savedRes.status})`);
      console.error(savedRes.data);
    }

    // 2. POST /api/saved
    process.stdout.write('Testing POST /api/saved... ');
    const sampleRepo = {
      fullName: 'facebook/react',
      owner: 'facebook',
      name: 'react',
      description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
      stars: 200000,
      forks: 40000,
      language: 'JavaScript',
      githubUrl: 'https://github.com/facebook/react',
      hiddenGemScore: 95
    };
    const postRes = await apiCall('/saved', 'POST', sampleRepo);
    let savedRepoId;
    if (postRes.status === 201 || (postRes.status === 409)) {
      console.log(postRes.status === 201 ? '✅ PASS (Created)' : '✅ PASS (Already exists)');
      // If 409, we need to find the ID to test delete later, but for now we proceed
      savedRepoId = postRes.data.data?.id;
    } else {
      console.log(`❌ FAIL (Status ${postRes.status})`);
    }

    // 3. GET /api/saved/check
    process.stdout.write('Testing GET /api/saved/check/facebook/react... ');
    const checkRes = await apiCall('/saved/check/facebook/react');
    if (checkRes.status === 200 && checkRes.data.isSaved) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL`);
    }

    // 4. GET /api/collections
    process.stdout.write('Testing GET /api/collections... ');
    const collRes = await apiCall('/collections');
    if (collRes.status === 200) {
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL`);
    }

    // 5. POST /api/collections
    process.stdout.write('Testing POST /api/collections... ');
    const postCollRes = await apiCall('/collections', 'POST', { name: 'Validation Test Collection' });
    let collId;
    if (postCollRes.status === 201) {
      collId = postCollRes.data.data.id;
      console.log('✅ PASS');
    } else {
      console.log(`❌ FAIL`);
    }

    if (collId && savedRepoId) {
      // 6. POST /api/collections/:id/repos
      process.stdout.write(`Testing POST /api/collections/${collId}/repos... `);
      const addRepoRes = await apiCall(`/collections/${collId}/repos`, 'POST', { savedRepoId });
      if (addRepoRes.status === 201) {
        console.log('✅ PASS');
      } else {
        console.log(`❌ FAIL (${addRepoRes.status})`);
      }
    }

    if (collId) {
      // 7. DELETE /api/collections/:id
      process.stdout.write(`Testing DELETE /api/collections/${collId}... `);
      const delCollRes = await apiCall(`/collections/${collId}`, 'DELETE');
      if (delCollRes.status === 200) {
        console.log('✅ PASS');
      } else {
        console.log(`❌ FAIL`);
      }
    }

    console.log('-----------------------------------------');
    console.log('🏁 Validation sequence finished.');
  } catch (error) {
    console.error('\n❌ CRITICAL FAILURE during validation:');
    console.error(error.message);
    console.log('\nIs the server running at http://localhost:5005?');
  }
}

runValidation();
