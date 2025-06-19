import fetch from 'node-fetch'

let authToken = null;
let userId = null;

const testEndpoints = async () => {
    console.log('🧪 Testing all endpoints...\n');

    // 1. Test User Registration
    console.log('1️⃣ Testing User Registration...');
    try {
        const registerResponse = await fetch('http://localhost:3000/api/v1/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: "María",
                last_name: "García",
                email: "maria@example.com",
                phone: "555-5678",
                DNI: 87654321,
                password: "password123",
                role_id: 2,
                birth_date: "1985-05-15"
            })
        });
        const registerData = await registerResponse.json();
        console.log('Status:', registerResponse.status);
        console.log('Response:', JSON.stringify(registerData, null, 2));
        
        if (registerData.ok && registerData.msg.token) {
            authToken = registerData.msg.token;
            userId = registerData.msg.user.id;
        }
    } catch (error) {
        console.error('❌ Registration Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. Test User Login
    console.log('2️⃣ Testing User Login...');
    try {
        const loginResponse = await fetch('http://localhost:3000/api/v1/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: "maria@example.com",
                password: "password123"
            })
        });
        const loginData = await loginResponse.json();
        console.log('Status:', loginResponse.status);
        console.log('Response:', JSON.stringify(loginData, null, 2));
        
        if (loginData.ok && loginData.msg.token) {
            authToken = loginData.msg.token;
        }
    } catch (error) {
        console.error('❌ Login Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 3. Test User Profile (requires token)
    console.log('3️⃣ Testing User Profile...');
    if (authToken) {
        try {
            const profileResponse = await fetch('http://localhost:3000/api/v1/users/profile', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const profileData = await profileResponse.json();
            console.log('Status:', profileResponse.status);
            console.log('Response:', JSON.stringify(profileData, null, 2));
        } catch (error) {
            console.error('❌ Profile Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping profile test - no auth token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 4. Test Get All Users (requires admin)
    console.log('4️⃣ Testing Get All Users...');
    if (authToken) {
        try {
            const usersResponse = await fetch('http://localhost:3000/api/v1/users', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const usersData = await usersResponse.json();
            console.log('Status:', usersResponse.status);
            console.log('Response:', JSON.stringify(usersData, null, 2));
        } catch (error) {
            console.error('❌ Get Users Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping users test - no auth token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 5. Test Create Member (requires token)
    console.log('5️⃣ Testing Create Member...');
    if (authToken) {
        try {
            const memberResponse = await fetch('http://localhost:3000/api/v1/members', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    DNI: 98765432,
                    first_name: "Carlos",
                    last_name: "López",
                    phone: "555-9999",
                    email: "carlos@example.com",
                    start_date: "2024-01-01",
                    end_date: "2024-12-31"
                })
            });
            const memberData = await memberResponse.json();
            console.log('Status:', memberResponse.status);
            console.log('Response:', JSON.stringify(memberData, null, 2));
        } catch (error) {
            console.error('❌ Create Member Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping member creation test - no auth token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 6. Test Get All Members (requires token)
    console.log('6️⃣ Testing Get All Members...');
    if (authToken) {
        try {
            const membersResponse = await fetch('http://localhost:3000/api/v1/members', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const membersData = await membersResponse.json();
            console.log('Status:', membersResponse.status);
            console.log('Response:', JSON.stringify(membersData, null, 2));
        } catch (error) {
            console.error('❌ Get Members Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping get members test - no auth token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 7. Test Get Member by ID (requires token)
    console.log('7️⃣ Testing Get Member by ID...');
    if (authToken) {
        try {
            const memberResponse = await fetch('http://localhost:3000/api/v1/members/1', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                }
            });
            const memberData = await memberResponse.json();
            console.log('Status:', memberResponse.status);
            console.log('Response:', JSON.stringify(memberData, null, 2));
        } catch (error) {
            console.error('❌ Get Member by ID Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping get member by ID test - no auth token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 8. Test Update Member (requires admin)
    console.log('8️⃣ Testing Update Member...');
    if (authToken) {
        try {
            const updateResponse = await fetch('http://localhost:3000/api/v1/members/1', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    phone: "555-8888",
                    email: "updated@example.com"
                })
            });
            const updateData = await updateResponse.json();
            console.log('Status:', updateResponse.status);
            console.log('Response:', JSON.stringify(updateData, null, 2));
        } catch (error) {
            console.error('❌ Update Member Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping update member test - no auth token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 9. Test Update User Role (requires admin)
    console.log('9️⃣ Testing Update User Role...');
    if (authToken && userId) {
        try {
            const roleResponse = await fetch('http://localhost:3000/api/v1/users/update-role', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({
                    id: userId,
                    role_id: 3
                })
            });
            const roleData = await roleResponse.json();
            console.log('Status:', roleResponse.status);
            console.log('Response:', JSON.stringify(roleData, null, 2));
        } catch (error) {
            console.error('❌ Update Role Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping update role test - no auth token or user ID');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    console.log('✅ All endpoint tests completed!');
}

testEndpoints(); 