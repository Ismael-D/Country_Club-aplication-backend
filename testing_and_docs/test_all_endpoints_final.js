// Script de pruebas integral final para todos los endpoints del backend
import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api/v1'
const errors = []
const successes = []

// Utilidad para generar datos únicos
const timestamp = Date.now()
const uniqueDNI1 = 10000000 + (timestamp % 90000000)
const uniqueDNI2 = 20000000 + (timestamp % 90000000)
const uniqueDNI3 = 30000000 + (timestamp % 90000000)
const uniqueDNI4 = 40000000 + (timestamp % 90000000)

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
  scheduled_date: '2024-12-31',
  estimated_duration: 120,
  estimated_cost: 500.00,
  requirements: 'Herramientas básicas',
  notes: 'Notas adicionales para la tarea'
}

let authToken = null
let userId = null
let memberId = null
let eventId = null
let employeeId = null
let inventoryId = null
let maintenanceId = null

async function testEndpoint(method, endpoint, data = null, token = null, expectOk = true, description = '') {
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
    
    const testResult = {
      method,
      endpoint,
      status: response.status,
      ok,
      expectedOk: expectOk,
      result,
      description
    }

    if (ok === expectOk) {
      successes.push(testResult)
      console.log(`✅ ${method} ${endpoint} - ${response.status}`)
    } else {
      errors.push(testResult)
      console.log(`❌ ${method} ${endpoint} - ${response.status}`)
    }

    return { status: response.status, data: result }
  } catch (error) {
    const testResult = {
      method,
      endpoint,
      error: error.message,
      expectedOk: expectOk,
      description
    }
    errors.push(testResult)
    console.log(`❌ ${method} ${endpoint} - ERROR: ${error.message}`)
    return { status: 0, data: null }
  }
}

async function runFullApiTests() {
  console.log('🧪 Testing ALL Country Club API endpoints (Final)')
  console.log('='.repeat(60))

  // --- AUTH ---
  console.log('\n🔐 Testing Auth endpoints...')
  await testEndpoint('POST', '/auth/register', testUser, null, true, 'Register user')
  const login = await testEndpoint('POST', '/auth/login', { email: testUser.email, password: testUser.password }, null, true, 'Login user')
  authToken = login.data?.msg?.token
  userId = login.data?.msg?.user?.id
  
  if (!authToken) { 
    console.log('❌ No se pudo obtener token, abortando pruebas.'); 
    return; 
  }

  // Verificar que el registro retorna el ID explícitamente
  if (login.data?.id) {
    console.log(`✅ ID explícito en respuesta: ${login.data.id}`)
  }

  await testEndpoint('POST', '/auth/verify', null, authToken, true, 'Verify token')
  await testEndpoint('GET', '/auth/profile', null, authToken, true, 'Get profile')
  await testEndpoint('PUT', '/auth/change-password', { currentPassword: 'password123', newPassword: 'password1234' }, authToken, true, 'Change password')
  await testEndpoint('POST', '/auth/login', { email: testUser.email, password: 'password123' }, null, false, 'Login with old password (should fail)')
  await testEndpoint('POST', '/auth/login', { email: testUser.email, password: 'password1234' }, null, true, 'Login with new password')

  // --- USUARIOS ---
  console.log('\n👥 Testing Users endpoints...')
  const userRes = await testEndpoint('POST', '/users', { ...testUser, email: `admin2${timestamp}@example.com`, DNI: uniqueDNI4 }, authToken, true, 'Create user')
  if (userRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de usuario: ${userRes.data.id}`)
  }
  
  await testEndpoint('GET', '/users', null, authToken, true, 'Get all users')
  await testEndpoint('GET', `/users/${userId}`, null, authToken, true, 'Get user by ID')
  await testEndpoint('GET', `/users/role/admin`, null, authToken, true, 'Get users by role')

  // --- MIEMBROS ---
  console.log('\n👤 Testing Members endpoints...')
  const memberData = { ...testMember, registrator_id: userId }
  const memberRes = await testEndpoint('POST', '/members', memberData, authToken, true, 'Create member')
  memberId = memberRes.data?.id || memberRes.data?.data?.id
  
  if (memberRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de miembro: ${memberRes.data.id}`)
  }
  
  await testEndpoint('GET', '/members', null, authToken, true, 'Get all members')
  if (memberId) {
    await testEndpoint('GET', `/members/${memberId}`, null, authToken, true, 'Get member by ID')
    await testEndpoint('DELETE', `/members/${memberId}`, null, authToken, true, 'Delete member')
  }
  await testEndpoint('GET', '/members/status/active', null, authToken, true, 'Get members by status')

  // --- EVENTOS ---
  console.log('\n🎉 Testing Events endpoints...')
  const eventData = { ...testEvent, organizer_id: userId }
  const eventRes = await testEndpoint('POST', '/events', eventData, authToken, true, 'Create event')
  eventId = eventRes.data?.id || eventRes.data?.data?.id
  
  if (eventRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de evento: ${eventRes.data.id}`)
  }
  
  await testEndpoint('GET', '/events', null, authToken, true, 'Get all events')
  if (eventId) {
    await testEndpoint('GET', `/events/${eventId}`, null, authToken, true, 'Get event by ID')
    await testEndpoint('DELETE', `/events/${eventId}`, null, authToken, true, 'Delete event')
  }
  await testEndpoint('GET', '/events/upcoming/events', null, authToken, true, 'Get upcoming events')
  await testEndpoint('GET', `/events/status/scheduled`, null, authToken, true, 'Get events by status')
  await testEndpoint('GET', `/events/organizer/${userId}`, null, authToken, true, 'Get events by organizer')

  // --- EMPLEADOS ---
  console.log('\n👷 Testing Employees endpoints...')
  const empRes = await testEndpoint('POST', '/employees', testEmployee, authToken, true, 'Create employee')
  employeeId = empRes.data?.id || empRes.data?.data?.id
  
  if (empRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de empleado: ${empRes.data.id}`)
  }
  
  await testEndpoint('GET', '/employees', null, authToken, true, 'Get all employees')
  if (employeeId) {
    await testEndpoint('GET', `/employees/${employeeId}`, null, authToken, true, 'Get employee by ID')
    await testEndpoint('DELETE', `/employees/${employeeId}`, null, authToken, true, 'Delete employee')
  }

  // --- INVENTARIO ---
  console.log('\n📦 Testing Inventory endpoints...')
  const prodRes = await testEndpoint('POST', '/inventory', testInventory, authToken, true, 'Create inventory product')
  inventoryId = prodRes.data?.id || prodRes.data?.data?.id
  
  if (prodRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de inventario: ${prodRes.data.id}`)
  }
  
  await testEndpoint('GET', '/inventory', null, authToken, true, 'Get all inventory')
  if (inventoryId) {
    await testEndpoint('GET', `/inventory/${inventoryId}`, null, authToken, true, 'Get inventory by ID')
    await testEndpoint('DELETE', `/inventory/${inventoryId}`, null, authToken, true, 'Delete inventory')
  }
  
  await testEndpoint('GET', '/inventory/categories', null, authToken, true, 'Get categories')
  const catRes = await testEndpoint('POST', '/inventory/categories', { name: `Cat${timestamp}` }, authToken, true, 'Create category')
  if (catRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de categoría: ${catRes.data.id}`)
  }
  
  await testEndpoint('GET', '/inventory/suppliers', null, authToken, true, 'Get suppliers')
  const supRes = await testEndpoint('POST', '/inventory/suppliers', { 
    name: `Prov${timestamp}`, 
    contact_person: 'Contacto',
    email: `prov${timestamp}@example.com`,
    phone: '555-2222'
  }, authToken, true, 'Create supplier')
  if (supRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de proveedor: ${supRes.data.id}`)
  }
  
  await testEndpoint('GET', '/inventory/movements', null, authToken, true, 'Get movements')
  await testEndpoint('GET', '/inventory/purchases', null, authToken, true, 'Get purchases')
  await testEndpoint('GET', '/inventory/statistics', null, authToken, true, 'Get statistics')
  await testEndpoint('GET', '/inventory/low-stock', null, authToken, true, 'Get low stock')
  await testEndpoint('GET', '/inventory/expired', null, authToken, true, 'Get expired products')
  await testEndpoint('GET', '/inventory/by-category', null, authToken, true, 'Get products by category')

  // --- MANTENIMIENTO ---
  console.log('\n🔧 Testing Maintenance endpoints...')
  const maintData = { ...testMaintenance, assigned_to: userId }
  const maintRes = await testEndpoint('POST', '/maintenance', maintData, authToken, true, 'Create maintenance task')
  maintenanceId = maintRes.data?.id || maintRes.data?.data?.id
  
  if (maintRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de mantenimiento: ${maintRes.data.id}`)
  }
  
  await testEndpoint('GET', '/maintenance', null, authToken, true, 'Get all maintenance')
  if (maintenanceId) {
    await testEndpoint('GET', `/maintenance/${maintenanceId}`, null, authToken, true, 'Get maintenance by ID')
    await testEndpoint('DELETE', `/maintenance/${maintenanceId}`, null, authToken, true, 'Delete maintenance')
  }
  
  await testEndpoint('GET', '/maintenance/incidents', null, authToken, true, 'Get incidents')
  const incRes = await testEndpoint('POST', '/maintenance/incidents', { 
    title: 'Incidencia de prueba',
    description: 'Descripción detallada de la incidencia con al menos 10 caracteres',
    location: 'Área común',
    priority: 'medium',
    category: 'general'
  }, authToken, true, 'Create incident')
  if (incRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de incidencia: ${incRes.data.id}`)
  }
  
  await testEndpoint('GET', '/maintenance/equipment', null, authToken, true, 'Get equipment')
  const equipRes = await testEndpoint('POST', '/maintenance/equipment', { 
    name: 'Equipo de prueba',
    category: 'herramientas',
    location: 'Almacén',
    status: 'active',
    serial_number: `SN${timestamp}`
  }, authToken, true, 'Create equipment')
  if (equipRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de equipo: ${equipRes.data.id}`)
  }
  
  await testEndpoint('GET', '/maintenance/preventive', null, authToken, true, 'Get preventive maintenance')
  const prevRes = await testEndpoint('POST', '/maintenance/preventive', { 
    equipment_id: 1,
    task_description: 'Descripción detallada de la tarea preventiva con al menos 10 caracteres',
    frequency: 'monthly',
    next_maintenance_date: '2024-12-31',
    estimated_duration: 60,
    estimated_cost: 200.00
  }, authToken, true, 'Create preventive maintenance')
  if (prevRes.data?.id) {
    console.log(`✅ ID explícito en respuesta de mantenimiento preventivo: ${prevRes.data.id}`)
  }
  
  await testEndpoint('GET', '/maintenance/statistics', null, authToken, true, 'Get maintenance statistics')
  await testEndpoint('GET', '/maintenance/pending', null, authToken, true, 'Get pending tasks')
  await testEndpoint('GET', '/maintenance/overdue', null, authToken, true, 'Get overdue tasks')

  // --- REPORTES ---
  console.log('\n📊 Testing Reports endpoints...')
  await testEndpoint('GET', '/reports/membership', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken, true, 'Get membership report')
  await testEndpoint('GET', '/reports/financial', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken, true, 'Get financial report')
  await testEndpoint('GET', '/reports/events', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken, true, 'Get events report')
  await testEndpoint('GET', '/reports/maintenance', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken, true, 'Get maintenance report')
  await testEndpoint('GET', '/reports/inventory', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken, true, 'Get inventory report')
  await testEndpoint('GET', '/reports/attendance', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken, true, 'Get attendance report')
  await testEndpoint('POST', '/reports/custom', { type: 'custom', filters: {} }, authToken, true, 'Create custom report')
  await testEndpoint('GET', '/reports/statistics', null, authToken, true, 'Get general statistics')
  await testEndpoint('GET', '/reports/saved', null, authToken, true, 'Get saved reports')
  await testEndpoint('DELETE', '/reports/saved/1', null, authToken, false, 'Delete non-existent saved report')
  await testEndpoint('GET', '/reports/download/1', null, authToken, false, 'Download non-existent report')
  await testEndpoint('POST', '/reports/export/excel', { data: [] }, authToken, false, 'Export empty data to Excel')

  // --- RESUMEN ---
  console.log('\n' + '='.repeat(60))
  console.log('📋 RESUMEN DE PRUEBAS:')
  console.log(`✅ Éxitos: ${successes.length}`)
  console.log(`❌ Errores: ${errors.length}`)
  console.log(`📊 Total: ${successes.length + errors.length}`)
  
  if (errors.length === 0) {
    console.log('\n🎉 ¡TODOS LOS ENDPOINTS FUNCIONAN CORRECTAMENTE!')
  } else {
    console.log('\n❌ ERRORES ENCONTRADOS:')
    errors.forEach((e, index) => {
      console.log(`\n${index + 1}. ${e.method} ${e.endpoint}`)
      console.log(`   Descripción: ${e.description}`)
      console.log(`   Status: ${e.status || 'N/A'}`)
      if (e.error) {
        console.log(`   Error: ${e.error}`)
      } else if (e.result) {
        console.log(`   Respuesta: ${JSON.stringify(e.result, null, 2)}`)
      }
    })
  }

  // Verificar IDs explícitos
  console.log('\n🔍 VERIFICACIÓN DE IDs EXPLÍCITOS:')
  const responsesWithIds = successes.filter(s => s.result?.id)
  if (responsesWithIds.length > 0) {
    console.log(`✅ ${responsesWithIds.length} respuestas incluyen ID explícito`)
    responsesWithIds.forEach(r => {
      console.log(`   ${r.method} ${r.endpoint}: ID = ${r.result.id}`)
    })
  } else {
    console.log('⚠️ No se encontraron respuestas con ID explícito')
  }
}

runFullApiTests().catch(console.error) 