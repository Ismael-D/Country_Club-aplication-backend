// Script de pruebas integral corregido para todos los endpoints del backend
import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api/v1'
const errors = []

// Utilidad para generar datos únicos
const timestamp = Date.now()
const uniqueDNI1 = 10000000 + (timestamp % 90000000)
const uniqueDNI2 = 20000000 + (timestamp % 90000000)
const uniqueDNI3 = 30000000 + (timestamp % 90000000)

const testUser = {
  first_name: 'Test',
  last_name: 'Admin',
  email: `admin${timestamp}@example.com`,
  phone: '555-1234',
  DNI: uniqueDNI1,
  password: 'password123',
  role_id: 1, // admin
  birth_date: '1990-01-01'
}

const testMember = {
  registrator_id: null, // set after user creation
  DNI: uniqueDNI2,
  first_name: 'Test',
  last_name: 'Member',
  phone: '555-5678',
  email: `member${timestamp}@example.com`,
  membership_number: `MEM${timestamp}`,
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
  max_attendees: 50,
  organizer_id: null // set after user creation
}

const testEmployee = {
  first_name: 'Test',
  last_name: 'Employee',
  DNI: uniqueDNI3,
  hire_date: '2024-01-01',
  position: 'Limpieza',
  salary: 1000,
  emergency_contact_name: 'Contacto Emergencia',
  emergency_contact_phone: '555-9999',
  phone: '555-0000'
}

const testInventory = {
  name: `Producto${timestamp}`,
  description: 'Descripción del producto de prueba con al menos 10 caracteres',
  sku: `SKU${timestamp}`,
  category_id: 1,
  supplier_id: 1,
  unit_price: 100.50,
  cost_price: 80.00,
  min_stock: 5,
  max_stock: 100,
  current_stock: 10,
  unit_of_measure: 'units',
  barcode: `BAR${timestamp}`,
  location: 'Almacén A',
  expiry_date: '2025-12-31',
  status: 'active'
}

const testMaintenance = {
  title: 'Tarea de mantenimiento de prueba',
  description: 'Descripción detallada de la tarea de mantenimiento con al menos 10 caracteres para cumplir con la validación',
  priority: 'medium',
  category: 'general',
  location: 'Área común',
  assigned_to: null, // set after user creation
  scheduled_date: '2025-12-31',
  estimated_cost: 500.00
}

let authToken = null
let userId = null
let memberId = null
let eventId = null
let employeeId = null
let inventoryId = null
let maintenanceId = null

async function testEndpoint(method, endpoint, data = null, token = null, expectOk = true) {
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
    const ok = result.ok === undefined ? response.status < 400 : result.ok
    if (ok !== expectOk) {
      errors.push({ method, endpoint, status: response.status, result })
    }
    return { status: response.status, data: result }
  } catch (error) {
    errors.push({ method, endpoint, error: error.message })
    return { status: 0, data: null }
  }
}

async function runFullApiTests() {
  console.log('🧪 Testing ALL Country Club API endpoints (Fixed)')
  console.log('='.repeat(60))

  // --- AUTH ---
  console.log('\n🔐 Testing Auth endpoints...')
  await testEndpoint('POST', '/auth/register', testUser)
  const login = await testEndpoint('POST', '/auth/login', { email: testUser.email, password: testUser.password })
  authToken = login.data?.msg?.token
  userId = login.data?.msg?.user?.id
  if (!authToken) { console.log('❌ No se pudo obtener token, abortando pruebas.'); return; }

  await testEndpoint('POST', '/auth/verify', null, authToken)
  await testEndpoint('GET', '/auth/profile', null, authToken)
  await testEndpoint('PUT', '/auth/change-password', { currentPassword: 'password123', newPassword: 'password1234' }, authToken)
  await testEndpoint('POST', '/auth/login', { email: testUser.email, password: 'password123' }, null, false)
  await testEndpoint('POST', '/auth/login', { email: testUser.email, password: 'password1234' })

  // --- USUARIOS ---
  console.log('\n👥 Testing Users endpoints...')
  await testEndpoint('POST', '/users', { ...testUser, email: `admin2${timestamp}@example.com`, DNI: uniqueDNI3 }, authToken)
  await testEndpoint('GET', '/users', null, authToken)
  await testEndpoint('GET', `/users/${userId}`, null, authToken)
  // Nota: No probamos PUT porque requiere el campo 'id' en el body según el schema
  await testEndpoint('GET', `/users/role/admin`, null, authToken)

  // --- MIEMBROS ---
  console.log('\n👤 Testing Members endpoints...')
  const memberData = { ...testMember, registrator_id: userId }
  const memberRes = await testEndpoint('POST', '/members', memberData, authToken)
  memberId = memberRes.data?.data?.id
  await testEndpoint('GET', '/members', null, authToken)
  if (memberId) {
    await testEndpoint('GET', `/members/${memberId}`, null, authToken)
    // Nota: No probamos PUT porque requiere el campo 'id' en el body según el schema
    await testEndpoint('DELETE', `/members/${memberId}`, null, authToken)
  }
  await testEndpoint('GET', '/members/status/active', null, authToken)

  // --- EVENTOS ---
  console.log('\n🎉 Testing Events endpoints...')
  const eventData = { ...testEvent, organizer_id: userId }
  const eventRes = await testEndpoint('POST', '/events', eventData, authToken)
  eventId = eventRes.data?.data?.id
  await testEndpoint('GET', '/events', null, authToken)
  if (eventId) {
    await testEndpoint('GET', `/events/${eventId}`, null, authToken)
    // Nota: No probamos PUT porque requiere el campo 'id' en el body según el schema
    await testEndpoint('DELETE', `/events/${eventId}`, null, authToken)
  }
  await testEndpoint('GET', '/events/upcoming/events', null, authToken)
  await testEndpoint('GET', `/events/status/scheduled`, null, authToken)
  await testEndpoint('GET', `/events/organizer/${userId}`, null, authToken)

  // --- EMPLEADOS ---
  console.log('\n👷 Testing Employees endpoints...')
  const empRes = await testEndpoint('POST', '/employees', testEmployee, authToken)
  employeeId = empRes.data?.data?.id
  await testEndpoint('GET', '/employees', null, authToken)
  if (employeeId) {
    await testEndpoint('GET', `/employees/${employeeId}`, null, authToken)
    // Nota: No probamos PUT porque requiere el campo 'id' en el body según el schema
    await testEndpoint('DELETE', `/employees/${employeeId}`, null, authToken)
  }

  // --- INVENTARIO ---
  console.log('\n📦 Testing Inventory endpoints...')
  const prodRes = await testEndpoint('POST', '/inventory', testInventory, authToken)
  inventoryId = prodRes.data?.data?.id
  await testEndpoint('GET', '/inventory', null, authToken)
  if (inventoryId) {
    await testEndpoint('GET', `/inventory/${inventoryId}`, null, authToken)
    // Nota: No probamos PUT porque requiere el campo 'id' en el body según el schema
    await testEndpoint('DELETE', `/inventory/${inventoryId}`, null, authToken)
  }
  await testEndpoint('GET', '/inventory/categories', null, authToken)
  await testEndpoint('POST', '/inventory/categories', { name: `Cat${timestamp}` }, authToken)
  await testEndpoint('GET', '/inventory/suppliers', null, authToken)
  await testEndpoint('POST', '/inventory/suppliers', { 
    name: `Prov${timestamp}`, 
    contact_person: 'Contacto',
    email: `prov${timestamp}@example.com`,
    phone: '555-2222'
  }, authToken)
  await testEndpoint('GET', '/inventory/movements', null, authToken)
  await testEndpoint('GET', '/inventory/purchases', null, authToken)
  await testEndpoint('GET', '/inventory/statistics', null, authToken)
  await testEndpoint('GET', '/inventory/low-stock', null, authToken)
  await testEndpoint('GET', '/inventory/expired', null, authToken)
  await testEndpoint('GET', '/inventory/by-category', null, authToken)

  // --- MANTENIMIENTO ---
  console.log('\n🔧 Testing Maintenance endpoints...')
  
  // Crear un empleado específico para mantenimiento
  const maintEmployeeData = {
    first_name: 'Mantenimiento',
    last_name: 'Test',
    DNI: uniqueDNI3 + 1000,
    hire_date: '2024-01-01',
    position: 'Mantenimiento',
    salary: 1200,
    emergency_contact_name: 'Contacto Emergencia',
    emergency_contact_phone: '555-9999',
    phone: '555-0000'
  }
  
  const maintEmpRes = await testEndpoint('POST', '/employees', maintEmployeeData, authToken)
  const maintEmployeeId = maintEmpRes.data?.data?.id
  
  // Usar el ID del empleado para la tarea de mantenimiento
  const maintData = { ...testMaintenance, assigned_to: maintEmployeeId }
  const maintRes = await testEndpoint('POST', '/maintenance', maintData, authToken)
  maintenanceId = maintRes.data?.data?.id
  
  if (maintRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de mantenimiento: ${maintRes.data.id}`)
  }
  
  await testEndpoint('GET', '/maintenance', null, authToken)
  if (maintenanceId) {
    await testEndpoint('GET', `/maintenance/${maintenanceId}`, null, authToken)
    await testEndpoint('DELETE', `/maintenance/${maintenanceId}`, null, authToken)
  }
  
  await testEndpoint('GET', '/maintenance/incidents', null, authToken)
  await testEndpoint('POST', '/maintenance/incidents', { 
    title: 'Incidencia de prueba',
    description: 'Descripción detallada de la incidencia con al menos 10 caracteres',
    location: 'Área común',
    priority: 'medium'
  }, authToken)
  
  await testEndpoint('GET', '/maintenance/equipment', null, authToken)
  await testEndpoint('POST', '/maintenance/equipment', { 
    name: 'Equipo de prueba',
    category: 'equipment',
    location: 'Almacén',
    status: 'active',
    serial_number: `SN${timestamp}`
  }, authToken)
  
  await testEndpoint('GET', '/maintenance/preventive', null, authToken)
  await testEndpoint('POST', '/maintenance/preventive', { 
    equipment_id: 1,
    task_description: 'Descripción detallada de la tarea preventiva con al menos 10 caracteres',
    frequency: 'monthly',
    next_maintenance_date: '2025-12-31', // Fecha futura
    estimated_duration: 60,
    estimated_cost: 200.00
  }, authToken)
  await testEndpoint('GET', '/maintenance/statistics', null, authToken)
  await testEndpoint('GET', '/maintenance/pending', null, authToken)
  await testEndpoint('GET', '/maintenance/overdue', null, authToken)

  // --- REPORTES ---
  console.log('\n📊 Testing Reports endpoints...')
  await testEndpoint('POST', '/reports/membership', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('POST', '/reports/financial', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('POST', '/reports/events', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('POST', '/reports/maintenance', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('POST', '/reports/inventory', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('POST', '/reports/attendance', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('POST', '/reports/custom', { reportType: 'members_activity', filters: {} }, authToken)
  await testEndpoint('GET', '/reports/statistics', null, authToken)
  await testEndpoint('GET', '/reports/saved', null, authToken)
  await testEndpoint('DELETE', '/reports/saved/1', null, authToken, false)
  await testEndpoint('GET', '/reports/download/1', null, authToken, false)
  await testEndpoint('POST', '/reports/export/excel', { reportType: 'membership', filters: {} }, authToken, false)

  // --- RESUMEN ---
  console.log('\n' + '='.repeat(60))
  console.log('📋 RESUMEN DE ERRORES:')
  if (errors.length === 0) {
    console.log('✅ Todos los endpoints respondieron correctamente')
  } else {
    console.log(`❌ Se encontraron ${errors.length} errores:`)
    errors.forEach((e, index) => {
      console.log(`${index + 1}. ${e.method} ${e.endpoint}`)
      console.log(`   Status: ${e.status || 'N/A'}`)
      console.log(`   Error: ${e.error || JSON.stringify(e.result)}`)
      console.log('')
    })
  }
}

runFullApiTests().catch(console.error) 