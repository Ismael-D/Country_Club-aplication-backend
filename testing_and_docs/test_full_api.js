// Script de pruebas integral para todos los endpoints del backend
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

let authToken = null
let userId = null
let memberId = null
let eventId = null
let employeeId = null
let inventoryId = null
let maintenanceId = null
let reportId = null

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
  console.log('🧪 Testing ALL Country Club API endpoints')
  console.log('='.repeat(60))

  // --- AUTH ---
  await testEndpoint('POST', '/auth/register', testUser)
  const login = await testEndpoint('POST', '/auth/login', { email: testUser.email, password: testUser.password })
  authToken = login.data?.msg?.token
  userId = login.data?.msg?.user?.id
  if (!authToken) { console.log('❌ No se pudo obtener token, abortando pruebas.'); return; }

  await testEndpoint('POST', '/auth/verify', null, authToken)
  await testEndpoint('GET', '/auth/profile', null, authToken)
  await testEndpoint('PUT', '/auth/change-password', { currentPassword: 'password123', newPassword: 'password1234' }, authToken)
  // Intento de login con contraseña antigua (debe fallar)
  await testEndpoint('POST', '/auth/login', { email: testUser.email, password: 'password123' }, null, false)
  // Login con nueva contraseña
  await testEndpoint('POST', '/auth/login', { email: testUser.email, password: 'password1234' })

  // --- USUARIOS ---
  await testEndpoint('POST', '/users', { ...testUser, email: `admin2${timestamp}@example.com`, DNI: uniqueDNI3 }, authToken)
  await testEndpoint('GET', '/users', null, authToken)
  await testEndpoint('GET', `/users/${userId}`, null, authToken)
  await testEndpoint('PUT', `/users/${userId}`, { first_name: 'Updated' }, authToken)
  await testEndpoint('GET', `/users/role/admin`, null, authToken)

  // --- MIEMBROS ---
  const memberData = { ...testMember, registrator_id: userId }
  const memberRes = await testEndpoint('POST', '/members', memberData, authToken)
  memberId = memberRes.data?.data?.id
  await testEndpoint('GET', '/members', null, authToken)
  await testEndpoint('GET', `/members/${memberId}`, null, authToken)
  await testEndpoint('PUT', `/members/${memberId}`, { phone: '555-9999' }, authToken)
  await testEndpoint('GET', '/members/status/active', null, authToken)
  await testEndpoint('GET', '/members/status/active', null, authToken)
  await testEndpoint('DELETE', `/members/${memberId}`, null, authToken)

  // --- EVENTOS ---
  const eventData = { ...testEvent, organizer_id: userId }
  const eventRes = await testEndpoint('POST', '/events', eventData, authToken)
  eventId = eventRes.data?.data?.id
  await testEndpoint('GET', '/events', null, authToken)
  await testEndpoint('GET', `/events/${eventId}`, null, authToken)
  await testEndpoint('PUT', `/events/${eventId}`, { location: 'Updated Hall' }, authToken)
  await testEndpoint('GET', '/events/upcoming/events', null, authToken)
  await testEndpoint('GET', `/events/status/scheduled`, null, authToken)
  await testEndpoint('GET', `/events/organizer/${userId}`, null, authToken)
  await testEndpoint('DELETE', `/events/${eventId}`, null, authToken)

  // --- EMPLEADOS ---
  const employeeData = { dni: uniqueDNI3, first_name: 'Empleado', last_name: 'Test', phone: '555-0000', email: `emp${timestamp}@example.com`, position: 'Limpieza', salary: 1000, hire_date: '2024-01-01' }
  const empRes = await testEndpoint('POST', '/employees', employeeData, authToken)
  employeeId = empRes.data?.data?.id
  await testEndpoint('GET', '/employees', null, authToken)
  await testEndpoint('GET', `/employees/${employeeId}`, null, authToken)
  await testEndpoint('PUT', `/employees/${employeeId}`, { phone: '555-1111' }, authToken)
  await testEndpoint('DELETE', `/employees/${employeeId}`, null, authToken)

  // --- INVENTARIO ---
  // Productos
  const prodData = { name: `Producto${timestamp}`, description: 'desc', category_id: 1, supplier_id: 1, stock: 10, price: 100 }
  const prodRes = await testEndpoint('POST', '/inventory', prodData, authToken)
  inventoryId = prodRes.data?.data?.id
  await testEndpoint('GET', '/inventory', null, authToken)
  await testEndpoint('GET', `/inventory/${inventoryId}`, null, authToken)
  await testEndpoint('PUT', `/inventory/${inventoryId}`, { stock: 20 }, authToken)
  await testEndpoint('DELETE', `/inventory/${inventoryId}`, null, authToken)
  // Categorías
  await testEndpoint('GET', '/inventory/categories', null, authToken)
  await testEndpoint('POST', '/inventory/categories', { name: `Cat${timestamp}` }, authToken)
  // Proveedores
  await testEndpoint('GET', '/inventory/suppliers', null, authToken)
  await testEndpoint('POST', '/inventory/suppliers', { name: `Prov${timestamp}`, contact: '555-2222' }, authToken)
  // Movimientos
  await testEndpoint('GET', '/inventory/movements', null, authToken)
  // Compras
  await testEndpoint('GET', '/inventory/purchases', null, authToken)
  // Estadísticas y reportes
  await testEndpoint('GET', '/inventory/statistics', null, authToken)
  await testEndpoint('GET', '/inventory/low-stock', null, authToken)
  await testEndpoint('GET', '/inventory/expired', null, authToken)
  await testEndpoint('GET', '/inventory/by-category', null, authToken)

  // --- MANTENIMIENTO ---
  const maintData = { title: 'Tarea', description: 'desc', assigned_to: userId, due_date: '2024-12-31', status: 'pending' }
  const maintRes = await testEndpoint('POST', '/maintenance', maintData, authToken)
  maintenanceId = maintRes.data?.data?.id
  await testEndpoint('GET', '/maintenance', null, authToken)
  await testEndpoint('GET', `/maintenance/${maintenanceId}`, null, authToken)
  await testEndpoint('PUT', `/maintenance/${maintenanceId}`, { status: 'completed' }, authToken)
  await testEndpoint('DELETE', `/maintenance/${maintenanceId}`, null, authToken)
  // Incidencias
  await testEndpoint('GET', '/maintenance/incidents', null, authToken)
  await testEndpoint('POST', '/maintenance/incidents', { title: 'Incidencia', description: 'desc', reported_by: userId }, authToken)
  // Equipos
  await testEndpoint('GET', '/maintenance/equipment', null, authToken)
  await testEndpoint('POST', '/maintenance/equipment', { name: 'Equipo', type: 'Herramienta', status: 'active' }, authToken)
  // Preventivo
  await testEndpoint('GET', '/maintenance/preventive', null, authToken)
  await testEndpoint('POST', '/maintenance/preventive', { title: 'Prev', description: 'desc', scheduled_date: '2024-12-01' }, authToken)
  // Estadísticas
  await testEndpoint('GET', '/maintenance/statistics', null, authToken)
  await testEndpoint('GET', '/maintenance/pending', null, authToken)
  await testEndpoint('GET', '/maintenance/overdue', null, authToken)

  // --- REPORTES ---
  await testEndpoint('GET', '/reports/membership', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('GET', '/reports/financial', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('GET', '/reports/events', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('GET', '/reports/maintenance', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('GET', '/reports/inventory', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('GET', '/reports/attendance', { start_date: '2024-01-01', end_date: '2024-12-31' }, authToken)
  await testEndpoint('POST', '/reports/custom', { type: 'custom', filters: {} }, authToken)
  await testEndpoint('GET', '/reports/statistics', null, authToken)
  await testEndpoint('GET', '/reports/saved', null, authToken)
  await testEndpoint('POST', '/reports/save', { name: 'Reporte', data: {} }, authToken)
  await testEndpoint('DELETE', '/reports/saved/1', null, authToken, false)
  await testEndpoint('GET', '/reports/download/1', null, authToken, false)
  await testEndpoint('POST', '/reports/export/excel', { data: [] }, authToken, false)

  // --- RESUMEN ---
  console.log('\nResumen de errores:')
  if (errors.length === 0) {
    console.log('✅ Todos los endpoints respondieron correctamente')
  } else {
    errors.forEach(e => {
      console.log(`❌ ${e.method} ${e.endpoint} | status: ${e.status || ''} | error: ${e.error || JSON.stringify(e.result)}`)
    })
  }
}

runFullApiTests().catch(console.error) 