import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api/v1'

async function testMiddleware() {
  console.log('🧪 Testing middleware execution...')
  
  // Crear usuario de prueba
  const timestamp = Date.now()
  const testUser = {
    first_name: 'Test',
    last_name: 'Admin',
    email: `middleware${timestamp}@example.com`,
    phone: '555-1234',
    DNI: 10000000 + (timestamp % 90000000),
    password: 'password123',
    role_id: 1, // admin
    birth_date: '1990-01-01'
  }

  // Registrar y hacer login
  await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  })

  const login = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: testUser.email, password: testUser.password })
  })

  const loginData = await login.json()
  const token = loginData.msg?.token

  console.log('🔑 Token obtained:', token ? 'Yes' : 'No')

  // Probar endpoint sin token
  console.log('\n🧪 Testing without token:')
  const noTokenResponse = await fetch(`${BASE_URL}/maintenance`)
  console.log('Status without token:', noTokenResponse.status)

  // Probar endpoint con token
  console.log('\n🧪 Testing with token:')
  const withTokenResponse = await fetch(`${BASE_URL}/maintenance`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  console.log('Status with token:', withTokenResponse.status)
  const responseData = await withTokenResponse.json()
  console.log('Response data:', responseData)

  // Probar endpoint de usuarios (que debería funcionar)
  console.log('\n🧪 Testing users endpoint (should work):')
  const usersResponse = await fetch(`${BASE_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  console.log('Users status:', usersResponse.status)
  const usersData = await usersResponse.json()
  console.log('Users response:', usersData)
}

testMiddleware().catch(console.error) 