import fetch from 'node-fetch'

let adminToken = null;
let adminUserId = null;

const testAdminEndpoints = async () => {
    console.log('👑 Testing Admin Endpoints...\n');

    // 1. Create Admin User
    console.log('1️⃣ Creating Admin User...');
    try {
        const registerResponse = await fetch('http://localhost:3000/api/v1/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                first_name: "Admin",
                last_name: "Test",
                email: "admin@test.com",
                phone: "555-0000",
                DNI: 11111111,
                password: "admin123",
                role_id: 1, // admin role
                birth_date: "1980-01-01"
            })
        });
        const registerData = await registerResponse.json();
        console.log('Status:', registerResponse.status);
        console.log('Response:', JSON.stringify(registerData, null, 2));
        
        if (registerData.ok && registerData.msg.token) {
            adminToken = registerData.msg.token;
            adminUserId = registerData.msg.user.id;
        }
    } catch (error) {
        console.error('❌ Admin Registration Error:', error.message);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 2. Test Get All Users (Admin only)
    console.log('2️⃣ Testing Get All Users (Admin)...');
    if (adminToken) {
        try {
            const usersResponse = await fetch('http://localhost:3000/api/v1/users', {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            const usersData = await usersResponse.json();
            console.log('Status:', usersResponse.status);
            console.log('Response:', JSON.stringify(usersData, null, 2));
        } catch (error) {
            console.error('❌ Get Users Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping get users test - no admin token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 3. Test Update Member (Admin only)
    console.log('3️⃣ Testing Update Member (Admin)...');
    if (adminToken) {
        try {
            const updateResponse = await fetch('http://localhost:3000/api/v1/members/1', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
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
        console.log('⚠️ Skipping update member test - no admin token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 4. Test Update User Role (Admin only)
    console.log('4️⃣ Testing Update User Role (Admin)...');
    if (adminToken && adminUserId) {
        try {
            const roleResponse = await fetch('http://localhost:3000/api/v1/users/update-role', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    id: adminUserId,
                    role_id: 2 // change to manager
                })
            });
            const roleData = await roleResponse.json();
            console.log('Status:', roleResponse.status);
            console.log('Response:', JSON.stringify(roleData, null, 2));
        } catch (error) {
            console.error('❌ Update Role Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping update role test - no admin token or user ID');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 5. Test Delete User (Admin only)
    console.log('5️⃣ Testing Delete User (Admin)...');
    if (adminToken && adminUserId) {
        try {
            const deleteResponse = await fetch(`http://localhost:3000/api/v1/users/${adminUserId}`, {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            const deleteData = await deleteResponse.json();
            console.log('Status:', deleteResponse.status);
            console.log('Response:', JSON.stringify(deleteData, null, 2));
        } catch (error) {
            console.error('❌ Delete User Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping delete user test - no admin token or user ID');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // 6. Test Delete Member (Admin only)
    console.log('6️⃣ Testing Delete Member (Admin)...');
    if (adminToken) {
        try {
            const deleteResponse = await fetch('http://localhost:3000/api/v1/members/3', {
                method: 'DELETE',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            const deleteData = await deleteResponse.json();
            console.log('Status:', deleteResponse.status);
            console.log('Response:', JSON.stringify(deleteData, null, 2));
        } catch (error) {
            console.error('❌ Delete Member Error:', error.message);
        }
    } else {
        console.log('⚠️ Skipping delete member test - no admin token');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    console.log('✅ All admin endpoint tests completed!');
}

testAdminEndpoints(); 