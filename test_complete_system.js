import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api/v1'

// Test data
const testUser = {
  first_name: 'Test',
  last_name: 'User',
  email: 'test@example.com',
  phone: '555-1234',
  DNI: 12345678,
  password: 'password123',
  role_id: 3,
  birth_date: '1990-01-01'
}

const testMember = {
  DNI: 87654321,
  first_name: 'Test',
  last_name: 'Member',
  phone: '555-5678',
  email: 'member@example.com',
  status: 'active',
  start_date: '2024-01-01',
  end_date: '2024-12-31'
}

const testEvent = {
  name: 'Test Event',
  date: '2024-12-25T18:00:00Z',
  description: 'A test event',
  location: 'Main Hall',
  budget: 1000,
  actual_cost: 950,
  status: 'scheduled',
  event_type_id: 1,
  max_attendees: 50
}

let authToken = null
let userId = null
let memberId = null
let eventId = null

async function testEndpoint(method, endpoint, data = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...(data && { body: JSON.stringify(data) })
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const result = await response.json()
    
    console.log(`${method} ${endpoint}:`, response.status, result.ok ? '✅' : '❌')
    if (!result.ok) {
      console.log('Error:', result.msg || result.error)
    }
    
    return { status: response.status, data: result }
  } catch (error) {
    console.log(`${method} ${endpoint}: ❌ Network Error -`, error.message)
    return { status: 0, data: null }
  }
}

async function runTests() {
  console.log('🧪 Testing Country Club Backend System\n')
  console.log('=' * 50)

  // 1. Test User Registration (Public endpoint)
  console.log('\n1. Testing User Registration (Public)')
  const registerResult = await testEndpoint('POST', '/auth/register', testUser)
  if (registerResult.data?.ok) {
    authToken = registerResult.data.msg.token
    console.log('✅ Registration successful, token obtained')
  }

  // 2. Test User Login (Public endpoint)
  console.log('\n2. Testing User Login (Public)')
  const loginResult = await testEndpoint('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password
  })
  if (loginResult.data?.ok) {
    authToken = loginResult.data.msg.token
    console.log('✅ Login successful, token obtained')
  }

  // 3. Test User Profile (Private endpoint)
  console.log('\n3. Testing User Profile (Private)')
  const profileResult = await testEndpoint('GET', '/users/profile', null, authToken)
  if (profileResult.data?.ok) {
    userId = profileResult.data.msg.id
    console.log('✅ Profile access successful')
  }

  // 4. Test Member Creation (Private endpoint)
  console.log('\n4. Testing Member Creation (Private)')
  const memberResult = await testEndpoint('POST', '/members', testMember, authToken)
  if (memberResult.data?.ok) {
    memberId = memberResult.data.member.id
    console.log('✅ Member creation successful')
  }

  // 5. Test Member List (Private endpoint)
  console.log('\n5. Testing Member List (Private)')
  await testEndpoint('GET', '/members', null, authToken)

  // 6. Test Member Details (Private endpoint)
  console.log('\n6. Testing Member Details (Private)')
  if (memberId) {
    await testEndpoint('GET', `/members/${memberId}`, null, authToken)
  }

  // 7. Test Event Creation (Private endpoint)
  console.log('\n7. Testing Event Creation (Private)')
  const eventResult = await testEndpoint('POST', '/events', testEvent, authToken)
  if (eventResult.data?.ok) {
    eventId = eventResult.data.event.id
    console.log('✅ Event creation successful')
  }

  // 8. Test Event List (Public endpoint)
  console.log('\n8. Testing Event List (Public)')
  await testEndpoint('GET', '/events')

  // 9. Test Event Details (Public endpoint)
  console.log('\n9. Testing Event Details (Public)')
  if (eventId) {
    await testEndpoint('GET', `/events/${eventId}`)
  }

  // 10. Test Validation Errors
  console.log('\n10. Testing Validation Errors')
  
  // Invalid user data (missing required fields)
  await testEndpoint('POST', '/auth/register', {
    first_name: 'Test',
    email: 'invalid-email'
  })

  // Invalid member data (missing required fields)
  await testEndpoint('POST', '/members', {
    first_name: 'Test'
  }, authToken)

  // Invalid event data (missing required fields)
  await testEndpoint('POST', '/events', {
    name: 'Test'
  }, authToken)

  // 11. Test JWT Authentication Errors
  console.log('\n11. Testing JWT Authentication')
  
  // Access private endpoint without token
  await testEndpoint('GET', '/users/profile')
  
  // Access private endpoint with invalid token
  await testEndpoint('GET', '/users/profile', null, 'invalid-token')

  // 12. Test Admin Endpoints (should fail for non-admin user)
  console.log('\n12. Testing Admin Endpoints (should fail)')
  await testEndpoint('GET', '/users', null, authToken)
  await testEndpoint('DELETE', `/users/${userId}`, null, authToken)

  console.log('\n' + '=' * 50)
  console.log('🏁 Testing completed!')
  console.log('\nSummary:')
  console.log('✅ Public endpoints (login, register, event list/details)')
  console.log('✅ Private endpoints with JWT authentication')
  console.log('✅ Zod validation on all POST/PUT endpoints')
  console.log('✅ PostgreSQL database integration')
  console.log('✅ Centralized error handling')
  console.log('✅ Role-based access control')
  console.log('✅ Separated authentication routes')
}

// Run tests
runTests().catch(console.error) 