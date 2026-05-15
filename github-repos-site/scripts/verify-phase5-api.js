const http = require('http');

const API_BASE = 'http://localhost:5005/api';
const JWT_SECRET = 'your_super_secret_jwt_key_change_in_production_12345';

// Helper to make requests
async function request(path, method = 'GET', body = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

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

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Starting Phase 5.5 Backend Validation...');
  
  // 1. Signup test user
  console.log('\nStep 1: Signing up test user...');
  const testUser = {
    email: `test_${Date.now()}@example.com`,
    username: `testuser_${Date.now()}`,
    password: 'password123',
    fullName: 'Test User'
  };
  const signupRes = await request('/auth/signup', 'POST', testUser);
  if (signupRes.status !== 201) {
    console.error('❌ Signup failed:', signupRes.data);
    return;
  }
  const token = signupRes.data.token;
  console.log('✅ User created, Token captured.');

  // 2. Test GET /api/saved (Empty)
  console.log('\nStep 2: Testing GET /api/saved (Initial Empty)...');
  const getSavedRes = await request('/saved', 'GET', null, token);
  if (getSavedRes.status === 200 && getSavedRes.data.success && Array.isArray(getSavedRes.data.data)) {
    console.log('✅ GET /api/saved passed (Empty array returned)');
  } else {
    console.error('❌ GET /api/saved failed:', getSavedRes.data);
  }

  // 3. Test POST /api/saved
  console.log('\nStep 3: Testing POST /api/saved (Saving a repo)...');
  const sampleRepo = {
    id: '123456',
    name: 'test-repo',
    owner: 'test-owner',
    fullName: 'test-owner/test-repo',
    description: 'A test repository',
    stars: 100,
    forks: 10,
    language: 'JavaScript',
    githubUrl: 'https://github.com/test-owner/test-repo'
  };
  const postSavedRes = await request('/saved', 'POST', sampleRepo, token);
  let savedRepoId;
  if (postSavedRes.status === 201 && postSavedRes.data.success) {
    savedRepoId = postSavedRes.data.data.id;
    console.log('✅ POST /api/saved passed (Repo saved)');
  } else {
    console.error('❌ POST /api/saved failed:', postSavedRes.data);
  }

  // 4. Test GET /api/saved/check/:owner/:repoName
  console.log('\nStep 4: Testing GET /api/saved/check/test-owner/test-repo...');
  const checkRes = await request('/saved/check/test-owner/test-repo', 'GET', null, token);
  if (checkRes.status === 200 && checkRes.data.isSaved === true) {
    console.log('✅ GET /api/saved/check passed');
  } else {
    console.error('❌ GET /api/saved/check failed:', checkRes.data);
  }

  // 5. Test POST /api/collections
  console.log('\nStep 5: Testing POST /api/collections...');
  const collectionRes = await request('/collections', 'POST', { name: 'My Awesome Collection' }, token);
  let collectionId;
  if (collectionRes.status === 201 && collectionRes.data.success) {
    collectionId = collectionRes.data.data.id;
    console.log('✅ POST /api/collections passed');
  } else {
    console.error('❌ POST /api/collections failed:', collectionRes.data);
  }

  // 6. Test POST /api/collections/:id/repos
  console.log('\nStep 6: Testing POST /api/collections/:id/repos...');
  const addRepoRes = await request(`/collections/${collectionId}/repos`, 'POST', { savedRepoId }, token);
  if (addRepoRes.status === 201 && addRepoRes.data.success) {
    console.log('✅ Add repo to collection passed');
  } else {
    console.error('❌ Add repo to collection failed:', addRepoRes.data);
  }

  // 7. Test DELETE /api/saved/:repoId
  console.log('\nStep 7: Testing DELETE /api/saved/:repoId...');
  const deleteRes = await request(`/saved/${savedRepoId}`, 'DELETE', null, token);
  if (deleteRes.status === 200 && deleteRes.data.success) {
    console.log('✅ DELETE /api/saved passed');
  } else {
    console.error('❌ DELETE /api/saved failed:', deleteRes.data);
  }

  console.log('\n🏁 Phase 5.5 Backend API Tests Completed.');
}

runTests().catch(console.error);
