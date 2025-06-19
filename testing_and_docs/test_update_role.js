import 'dotenv/config'
import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api/v1'

async function testUpdateRole() {
    try {
        console.log('🧪 Testing Update Role Endpoint\n')

        // 1. Login to get token (using admin user)
        console.log('1. Login to get admin token...')
        const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'juan@example.com', // This user has admin role (ID 4)
                password: 'password123'
            })
        })

        if (!loginResponse.ok) {
            const error = await loginResponse.json()
            console.log('❌ Login failed:', error)
            return
        }

        const loginData = await loginResponse.json()
        const token = loginData.msg.token
        console.log('✅ Login successful, token obtained')
        console.log('User role:', loginData.msg.role)

        // 2. Test update role with valid ID
        console.log('\n2. Testing update role with ID 10...')
        const updateResponse = await fetch(`${BASE_URL}/users/update-role`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: 10,
                role_id: 2
            })
        })

        const updateData = await updateResponse.json()
        console.log('Status:', updateResponse.status)
        console.log('Response:', JSON.stringify(updateData, null, 2))

        if (updateResponse.ok) {
            console.log('✅ Update role successful!')
        } else {
            console.log('❌ Update role failed')
        }

        // 3. Test with invalid ID
        console.log('\n3. Testing update role with invalid ID 999...')
        const invalidResponse = await fetch(`${BASE_URL}/users/update-role`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: 999,
                role_id: 2
            })
        })

        const invalidData = await invalidResponse.json()
        console.log('Status:', invalidResponse.status)
        console.log('Response:', JSON.stringify(invalidData, null, 2))

        if (invalidResponse.status === 404) {
            console.log('✅ Correctly returned 404 for invalid ID')
        } else {
            console.log('❌ Unexpected response for invalid ID')
        }

    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

testUpdateRole() 