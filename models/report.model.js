import { db } from '../database/connection.database.js';

export const ReportModel = {
  /**
   * Generar reporte de membresías
   */
  async generateMembershipReport(filters = {}) {
    const { startDate, endDate, membershipType, status } = filters;
    
    let query = `
      SELECT 
        m.id,
        m.first_name,
        m.last_name,
        m.email,
        m.phone,
        m.membership_type,
        m.status,
        m.join_date,
        m.expiration_date,
        m.total_payments,
        m.last_payment_date,
        p.amount as last_payment_amount
      FROM members m
      LEFT JOIN payments p ON m.id = p.member_id 
        AND p.id = (
          SELECT MAX(id) FROM payments 
          WHERE member_id = m.id
        )
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND m.join_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND m.join_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (membershipType) {
      query += ` AND m.membership_type = $${params.length + 1}`;
      params.push(membershipType);
    }
    
    if (status) {
      query += ` AND m.status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` ORDER BY m.join_date DESC`;
    
    const result = await db.query(query, params);
    
    // Calcular estadísticas
    const stats = await this.calculateMembershipStats(filters);
    
    return {
      data: result.rows,
      statistics: stats,
      filters: filters,
      generatedAt: new Date(),
      totalRecords: result.rows.length
    };
  },

  /**
   * Generar reporte financiero
   */
  async generateFinancialReport(filters = {}) {
    const { startDate, endDate, reportType } = filters;
    
    let query = '';
    const params = [];
    
    switch (reportType) {
      case 'payments':
        query = `
          SELECT 
            p.id,
            p.member_id,
            m.first_name,
            m.last_name,
            p.amount,
            p.payment_date,
            p.payment_method,
            p.status,
            p.description
          FROM payments p
          JOIN members m ON p.member_id = m.id
          WHERE 1=1
        `;
        break;
        
      case 'revenue':
        query = `
          SELECT 
            DATE_TRUNC('month', payment_date) as month,
            SUM(amount) as total_revenue,
            COUNT(*) as total_payments,
            AVG(amount) as avg_payment
          FROM payments
          WHERE status = 'completed'
          GROUP BY DATE_TRUNC('month', payment_date)
          ORDER BY month DESC
        `;
        break;
        
      default:
        query = `
          SELECT 
            p.*,
            m.first_name,
            m.last_name,
            m.membership_type
          FROM payments p
          JOIN members m ON p.member_id = m.id
          WHERE 1=1
        `;
    }
    
    if (startDate && reportType !== 'revenue') {
      query += ` AND p.payment_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate && reportType !== 'revenue') {
      query += ` AND p.payment_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (reportType !== 'revenue') {
      query += ` ORDER BY p.payment_date DESC`;
    }
    
    const result = await db.query(query, params);
    
    // Calcular estadísticas financieras
    const stats = await this.calculateFinancialStats(filters);
    
    return {
      data: result.rows,
      statistics: stats,
      filters: filters,
      generatedAt: new Date(),
      totalRecords: result.rows.length
    };
  },

  /**
   * Generar reporte de eventos
   */
  async generateEventReport(filters = {}) {
    const { startDate, endDate, eventType, status } = filters;
    
    let query = `
      SELECT 
        e.id,
        e.title,
        e.description,
        e.event_type,
        e.start_date,
        e.end_date,
        e.location,
        e.capacity,
        e.status,
        e.created_at,
        COUNT(ae.member_id) as attendees_count,
        e.price,
        e.organizer_id,
        u.first_name as organizer_name
      FROM events e
      LEFT JOIN event_attendees ae ON e.id = ae.event_id
      LEFT JOIN users u ON e.organizer_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND e.start_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND e.start_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (eventType) {
      query += ` AND e.event_type = $${params.length + 1}`;
      params.push(eventType);
    }
    
    if (status) {
      query += ` AND e.status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` GROUP BY e.id, u.first_name ORDER BY e.start_date DESC`;
    
    const result = await db.query(query, params);
    
    // Calcular estadísticas de eventos
    const stats = await this.calculateEventStats(filters);
    
    return {
      data: result.rows,
      statistics: stats,
      filters: filters,
      generatedAt: new Date(),
      totalRecords: result.rows.length
    };
  },

  /**
   * Generar reporte de mantenimiento
   */
  async generateMaintenanceReport(filters = {}) {
    const { startDate, endDate, taskType, priority, status } = filters;
    
    let query = `
      SELECT 
        mt.id,
        mt.title,
        mt.description,
        mt.task_type,
        mt.priority,
        mt.status,
        mt.start_date,
        mt.completion_date,
        mt.estimated_hours,
        mt.actual_hours,
        mt.cost,
        mt.assigned_to,
        u.first_name as assigned_name,
        mt.equipment_id,
        e.name as equipment_name,
        mt.created_at
      FROM maintenance_tasks mt
      LEFT JOIN users u ON mt.assigned_to = u.id
      LEFT JOIN equipment e ON mt.equipment_id = e.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND mt.start_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND mt.start_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (taskType) {
      query += ` AND mt.task_type = $${params.length + 1}`;
      params.push(taskType);
    }
    
    if (priority) {
      query += ` AND mt.priority = $${params.length + 1}`;
      params.push(priority);
    }
    
    if (status) {
      query += ` AND mt.status = $${params.length + 1}`;
      params.push(status);
    }
    
    query += ` ORDER BY mt.start_date DESC`;
    
    const result = await db.query(query, params);
    
    // Calcular estadísticas de mantenimiento
    const stats = await this.calculateMaintenanceStats(filters);
    
    return {
      data: result.rows,
      statistics: stats,
      filters: filters,
      generatedAt: new Date(),
      totalRecords: result.rows.length
    };
  },

  /**
   * Generar reporte de inventario
   */
  async generateInventoryReport(filters = {}) {
    const { category, supplier, lowStock } = filters;
    
    let query = `
      SELECT 
        p.id,
        p.name,
        p.description,
        p.category_id,
        c.name as category_name,
        p.supplier_id,
        s.name as supplier_name,
        p.quantity,
        p.min_quantity,
        p.max_quantity,
        p.unit_price,
        p.total_value,
        p.location,
        p.status,
        p.last_updated
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (category) {
      query += ` AND p.category_id = $${params.length + 1}`;
      params.push(category);
    }
    
    if (supplier) {
      query += ` AND p.supplier_id = $${params.length + 1}`;
      params.push(supplier);
    }
    
    if (lowStock === 'true') {
      query += ` AND p.quantity <= p.min_quantity`;
    }
    
    query += ` ORDER BY p.quantity ASC`;
    
    const result = await db.query(query, params);
    
    // Calcular estadísticas de inventario
    const stats = await this.calculateInventoryStats(filters);
    
    return {
      data: result.rows,
      statistics: stats,
      filters: filters,
      generatedAt: new Date(),
      totalRecords: result.rows.length
    };
  },

  /**
   * Generar reporte de asistencia
   */
  async generateAttendanceReport(filters = {}) {
    const { startDate, endDate, memberId, eventId } = filters;
    
    let query = `
      SELECT 
        ae.id,
        ae.event_id,
        e.title as event_title,
        e.start_date as event_date,
        ae.member_id,
        m.first_name,
        m.last_name,
        m.membership_type,
        ae.attendance_status,
        ae.check_in_time,
        ae.check_out_time,
        ae.notes
      FROM event_attendees ae
      JOIN events e ON ae.event_id = e.id
      JOIN members m ON ae.member_id = m.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND e.start_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND e.start_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (memberId) {
      query += ` AND ae.member_id = $${params.length + 1}`;
      params.push(memberId);
    }
    
    if (eventId) {
      query += ` AND ae.event_id = $${params.length + 1}`;
      params.push(eventId);
    }
    
    query += ` ORDER BY e.start_date DESC, m.first_name`;
    
    const result = await db.query(query, params);
    
    // Calcular estadísticas de asistencia
    const stats = await this.calculateAttendanceStats(filters);
    
    return {
      data: result.rows,
      statistics: stats,
      filters: filters,
      generatedAt: new Date(),
      totalRecords: result.rows.length
    };
  },

  /**
   * Generar reporte personalizado
   */
  async generateCustomReport(params = {}) {
    const { reportType, filters, columns } = params;
    
    // Implementar lógica para reportes personalizados
    // Esto dependerá de los tipos de reporte disponibles
    let query = '';
    const queryParams = [];
    
    switch (reportType) {
      case 'members_activity':
        query = `
          SELECT 
            m.id,
            m.first_name,
            m.last_name,
            COUNT(ae.event_id) as events_attended,
            COUNT(p.id) as payments_made,
            SUM(p.amount) as total_paid
          FROM members m
          LEFT JOIN event_attendees ae ON m.id = ae.member_id
          LEFT JOIN payments p ON m.id = p.member_id
          GROUP BY m.id, m.first_name, m.last_name
          ORDER BY events_attended DESC
        `;
        break;
        
      default:
        throw new Error('Tipo de reporte no válido');
    }
    
    const result = await db.query(query, queryParams);
    
    return {
      data: result.rows,
      filters: filters,
      columns: columns,
      generatedAt: new Date(),
      totalRecords: result.rows.length
    };
  },

  /**
   * Obtener estadísticas generales
   */
  async getGeneralStatistics(period = 'month') {
    const stats = {
      members: await this.getMemberStats(period),
      events: await this.getEventStats(period),
      maintenance: await this.getMaintenanceStats(period),
      inventory: await this.getInventoryStats(period),
      financial: await this.getFinancialStats(period)
    };
    
    return stats;
  },

  /**
   * Obtener reportes guardados
   */
  async getSavedReports(params = {}) {
    const { page = 1, limit = 10, type } = params;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        id,
        name,
        description,
        report_type,
        created_at,
        created_by
      FROM saved_reports
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    if (type) {
      query += ` AND report_type = $${queryParams.length + 1}`;
      queryParams.push(type);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(limit, offset);
    
    const result = await db.query(query, queryParams);
    
    // Obtener total de registros
    const countQuery = `
      SELECT COUNT(*) as total
      FROM saved_reports
      WHERE 1=1 ${type ? 'AND report_type = $1' : ''}
    `;
    
    const countResult = await db.query(countQuery, type ? [type] : []);
    
    return {
      reports: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        pages: Math.ceil(countResult.rows[0].total / limit)
      }
    };
  },

  /**
   * Guardar reporte
   */
  async saveReport(params = {}) {
    const { name, description, reportType, filters, columns, createdBy } = params;
    
    const query = `
      INSERT INTO saved_reports (name, description, report_type, filters, columns, created_by, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    
    const result = await db.query(query, [
      name,
      description,
      reportType,
      JSON.stringify(filters),
      JSON.stringify(columns),
      createdBy
    ]);
    
    return result.rows[0];
  },

  /**
   * Eliminar reporte guardado
   */
  async deleteSavedReport(id, userId) {
    const query = `
      DELETE FROM saved_reports 
      WHERE id = $1 AND created_by = $2
    `;
    
    const result = await db.query(query, [id, userId]);
    
    if (result.rowCount === 0) {
      throw new Error('Reporte no encontrado o no tienes permisos para eliminarlo');
    }
    
    return true;
  },

  /**
   * Generar PDF del reporte
   */
  async generatePDFReport(id) {
    // Aquí se implementaría la generación de PDF
    // Por ahora retornamos un buffer vacío
    return Buffer.from('PDF content would be generated here');
  },

  /**
   * Exportar a Excel
   */
  async exportToExcel(params = {}) {
    // Aquí se implementaría la exportación a Excel
    // Por ahora retornamos un buffer vacío
    return Buffer.from('Excel content would be generated here');
  },

  // Métodos auxiliares para calcular estadísticas
  async calculateMembershipStats(filters) {
    const { startDate, endDate, membershipType, status } = filters;
    
    let query = `
      SELECT 
        COUNT(*) as total_members,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_members,
        COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_members,
        COUNT(CASE WHEN status = 'suspended' THEN 1 END) as suspended_members,
        AVG(total_payments) as avg_payments,
        SUM(total_payments) as total_revenue
      FROM members
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND join_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND join_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (membershipType) {
      query += ` AND membership_type = $${params.length + 1}`;
      params.push(membershipType);
    }
    
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  },

  async calculateFinancialStats(filters) {
    const { startDate, endDate } = filters;
    
    let query = `
      SELECT 
        COUNT(*) as total_payments,
        SUM(amount) as total_revenue,
        AVG(amount) as avg_payment,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_payments,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments
      FROM payments
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND payment_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND payment_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  },

  async calculateEventStats(filters) {
    const { startDate, endDate, eventType, status } = filters;
    
    let query = `
      SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_events,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_events,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_events,
        AVG(capacity) as avg_capacity,
        SUM(price) as total_revenue
      FROM events
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND start_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND start_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (eventType) {
      query += ` AND event_type = $${params.length + 1}`;
      params.push(eventType);
    }
    
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  },

  async calculateMaintenanceStats(filters) {
    const { startDate, endDate, taskType, priority, status } = filters;
    
    let query = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        SUM(cost) as total_cost,
        AVG(actual_hours) as avg_hours
      FROM maintenance_tasks
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND start_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND start_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (taskType) {
      query += ` AND task_type = $${params.length + 1}`;
      params.push(taskType);
    }
    
    if (priority) {
      query += ` AND priority = $${params.length + 1}`;
      params.push(priority);
    }
    
    if (status) {
      query += ` AND status = $${params.length + 1}`;
      params.push(status);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  },

  async calculateInventoryStats(filters) {
    const { category, supplier, lowStock } = filters;
    
    let query = `
      SELECT 
        COUNT(*) as total_products,
        SUM(quantity) as total_quantity,
        SUM(total_value) as total_value,
        COUNT(CASE WHEN quantity <= min_quantity THEN 1 END) as low_stock_items,
        AVG(unit_price) as avg_price
      FROM products
      WHERE 1=1
    `;
    
    const params = [];
    
    if (category) {
      query += ` AND category_id = $${params.length + 1}`;
      params.push(category);
    }
    
    if (supplier) {
      query += ` AND supplier_id = $${params.length + 1}`;
      params.push(supplier);
    }
    
    if (lowStock === 'true') {
      query += ` AND quantity <= min_quantity`;
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  },

  async calculateAttendanceStats(filters) {
    const { startDate, endDate, memberId, eventId } = filters;
    
    let query = `
      SELECT 
        COUNT(*) as total_attendances,
        COUNT(CASE WHEN attendance_status = 'present' THEN 1 END) as present_count,
        COUNT(CASE WHEN attendance_status = 'absent' THEN 1 END) as absent_count,
        COUNT(CASE WHEN attendance_status = 'late' THEN 1 END) as late_count
      FROM event_attendees ae
      JOIN events e ON ae.event_id = e.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (startDate) {
      query += ` AND e.start_date >= $${params.length + 1}`;
      params.push(startDate);
    }
    
    if (endDate) {
      query += ` AND e.start_date <= $${params.length + 1}`;
      params.push(endDate);
    }
    
    if (memberId) {
      query += ` AND ae.member_id = $${params.length + 1}`;
      params.push(memberId);
    }
    
    if (eventId) {
      query += ` AND ae.event_id = $${params.length + 1}`;
      params.push(eventId);
    }
    
    const result = await db.query(query, params);
    return result.rows[0];
  },

  // Métodos para estadísticas por período
  async getMemberStats(period) {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN join_date >= NOW() - INTERVAL '1 ${period}' THEN 1 END) as new_this_period
      FROM members
    `;
    
    const result = await db.query(query);
    return result.rows[0];
  },

  async getEventStats(period) {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN start_date >= NOW() - INTERVAL '1 ${period}' THEN 1 END) as this_period
      FROM events
    `;
    
    const result = await db.query(query);
    return result.rows[0];
  },

  async getMaintenanceStats(period) {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN start_date >= NOW() - INTERVAL '1 ${period}' THEN 1 END) as this_period
      FROM maintenance_tasks
    `;
    
    const result = await db.query(query);
    return result.rows[0];
  },

  async getInventoryStats(period) {
    const query = `
      SELECT 
        COUNT(*) as total_products,
        SUM(quantity) as total_quantity,
        COUNT(CASE WHEN quantity <= min_quantity THEN 1 END) as low_stock
      FROM products
    `;
    
    const result = await db.query(query);
    return result.rows[0];
  },

  async getFinancialStats(period) {
    const query = `
      SELECT 
        COUNT(*) as total_payments,
        SUM(amount) as total_revenue,
        COUNT(CASE WHEN payment_date >= NOW() - INTERVAL '1 ${period}' THEN 1 END) as payments_this_period,
        SUM(CASE WHEN payment_date >= NOW() - INTERVAL '1 ${period}' THEN amount ELSE 0 END) as revenue_this_period
      FROM payments
      WHERE status = 'completed'
    `;
    
    const result = await db.query(query);
    return result.rows[0];
  }
}; 
