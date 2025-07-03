import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api/v1'

async function testSimple() {
  console.log('🧪 Testing simple endpoint...')
  
  // Probar endpoint de usuarios (que funciona)
  console.log('\n🧪 Testing users endpoint:')
  const usersResponse = await fetch(`${BASE_URL}/users`)
  console.log('Users status:', usersResponse.status)
  
  // Probar endpoint de mantenimiento sin token
  console.log('\n🧪 Testing maintenance endpoint without token:')
  const maintResponse = await fetch(`${BASE_URL}/maintenance`)
  console.log('Maintenance status:', maintResponse.status)
  const maintData = await maintResponse.json()
  console.log('Maintenance response:', maintData)
  
  // Probar endpoint de mantenimiento con token inválido
  console.log('\n🧪 Testing maintenance endpoint with invalid token:')
  const maintInvalidResponse = await fetch(`${BASE_URL}/maintenance`, {
    headers: {
      'Authorization': 'Bearer invalid-token',
      'Content-Type': 'application/json'
    }
  })
  console.log('Maintenance with invalid token status:', maintInvalidResponse.status)
  const maintInvalidData = await maintInvalidResponse.json()
  console.log('Maintenance with invalid token response:', maintInvalidData)
}

testSimple().catch(console.error) 