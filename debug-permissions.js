import fetch from 'node-fetch'
import PERMISSIONS from './config/permissions.js'

const BASE_URL = 'http://localhost:3000/api/v1'

async function debugPermissions() {
  console.log('🔍 Debugging permissions...')
  
  // Crear usuario de prueba
  const timestamp = Date.now()
  const testUser = {
    first_name: 'Test',
    last_name: 'Admin',
    email: `debug${timestamp}@example.com`,
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
  const user = loginData.msg?.user

  console.log('👤 User data:', user)
  console.log('🔑 Token:', token ? 'Present' : 'Missing')

  // Verificar permisos manualmente
  console.log('\n🔍 Checking permissions manually:')
  console.log('User role:', user?.role || 'undefined')
  console.log('MAINTENANCE.CREATE:', PERMISSIONS.hasPermission(user?.role, 'MAINTENANCE', 'CREATE'))
  console.log('MAINTENANCE.READ:', PERMISSIONS.hasPermission(user?.role, 'MAINTENANCE', 'READ'))
  console.log('MAINTENANCE.UPDATE:', PERMISSIONS.hasPermission(user?.role, 'MAINTENANCE', 'UPDATE'))
  console.log('MAINTENANCE.DELETE:', PERMISSIONS.hasPermission(user?.role, 'MAINTENANCE', 'DELETE'))

  // Probar endpoint de mantenimiento
  console.log('\n🧪 Testing maintenance endpoint:')
  const maintResponse = await fetch(`${BASE_URL}/maintenance`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })

  const maintData = await maintResponse.json()
  console.log('Status:', maintResponse.status)
  console.log('Response:', maintData)

  // Verificar qué rol tiene el usuario en el token
  console.log('\n🔍 Checking token payload:')
  const tokenParts = token.split('.')
  if (tokenParts.length === 3) {
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString())
    console.log('Token payload:', payload)
  }
}

debugPermissions().catch(console.error) 