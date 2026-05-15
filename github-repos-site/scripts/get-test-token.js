const http = require('http');

const API_BASE = 'http://localhost:5005/api';

async function signup(email, username, password) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ email, username, password, fullName: 'Test Account' });
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(`${API_BASE}/auth/signup`, options, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function run() {
  const email = `test_${Date.now()}@example.com`;
  console.log(`Creating test user: ${email}`);
  try {
    const res = await signup(email, `user_${Date.now()}`, 'password123');
    if (res.token) {
      console.log('✅ Token obtained successfully:');
      console.log(res.token);
      console.log('\nYou can now run:');
      console.log(`AUTH_TOKEN=${res.token} npm run validate:saved`);
    } else {
      console.error('❌ Failed to get token:', res);
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

run();
