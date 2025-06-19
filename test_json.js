import fetch from 'node-fetch'

const testValidJSON = async () => {
    console.log('🧪 Testing JSON formatting...\n');

    // Test 1: Valid JSON
    console.log('1️⃣ Testing Valid JSON...');
    try {
        const validData = {
            first_name: "Juan",
            last_name: "Pérez",
            email: "juan@example.com",
            phone: "555-1234",
            DNI: 12345678,
            password: "password123",
            role_id: 1,
            birth_date: "1990-01-01"
        };

        console.log('Sending valid JSON:', JSON.stringify(validData, null, 2));

        const response = await fetch('http://localhost:3000/api/v1/users/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(validData)
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Valid JSON Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Invalid JSON (missing quotes)
    console.log('2️⃣ Testing Invalid JSON (missing quotes)...');
    try {
        const invalidData = {
            first_name: "Juan",
            last_name: "Pérez",
            email: "juan@example.com",
            phone: "555-1234",
            DNI: 12345678,
            password: "password123",
            role_id: 1,
            birth_date: "1990-01-01"
        };

        // Simulate malformed JSON by removing quotes
        const malformedJSON = JSON.stringify(invalidData).replace(/"/g, '');

        console.log('Sending malformed JSON:', malformedJSON);

        const response = await fetch('http://localhost:3000/api/v1/users/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: malformedJSON
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Invalid JSON Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Invalid JSON (missing colon)
    console.log('3️⃣ Testing Invalid JSON (missing colon)...');
    try {
        const malformedJSON = '{"first_name" "Juan", "last_name": "Pérez"}';

        console.log('Sending malformed JSON:', malformedJSON);

        const response = await fetch('http://localhost:3000/api/v1/users/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: malformedJSON
        });

        const data = await response.json();
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('❌ Invalid JSON Error:', error.message);
    }

    console.log('\n✅ JSON testing completed!');
}

testValidJSON(); 