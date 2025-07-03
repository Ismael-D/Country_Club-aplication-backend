import { MaintenanceModel } from './models/maintenance.model.js'

async function testModel() {
  try {
    console.log('🧪 Testing MaintenanceModel directly...')
    
    // Probar findAllWithPagination
    console.log('\n🔍 Testing findAllWithPagination...')
    const result = await MaintenanceModel.findAllWithPagination(10, 0, {})
    console.log('✅ findAllWithPagination result:', result)
    
    // Probar getIncidentsWithPagination
    console.log('\n🔍 Testing getIncidentsWithPagination...')
    const incidentsResult = await MaintenanceModel.getIncidentsWithPagination(10, 0, {})
    console.log('✅ getIncidentsWithPagination result:', incidentsResult)
    
    // Probar getEquipmentWithPagination
    console.log('\n🔍 Testing getEquipmentWithPagination...')
    const equipmentResult = await MaintenanceModel.getEquipmentWithPagination(10, 0, {})
    console.log('✅ getEquipmentWithPagination result:', equipmentResult)
    
  } catch (error) {
    console.error('❌ Error testing model:', error)
    console.error('❌ Error stack:', error.stack)
  }
}

testModel() 