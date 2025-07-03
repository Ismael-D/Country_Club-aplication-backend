import Joi from 'joi';

export const reportSchemas = {
  // Esquema para reporte de membresías
  membershipReport: Joi.object({
    query: Joi.object({
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
      membershipType: Joi.string().valid('basic', 'premium', 'vip', 'corporate').optional(),
      status: Joi.string().valid('active', 'inactive', 'suspended', 'expired').optional(),
      format: Joi.string().valid('json', 'pdf').default('json')
    })
  }),

  // Esquema para reporte financiero
  financialReport: Joi.object({
    query: Joi.object({
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
      reportType: Joi.string().valid('payments', 'revenue', 'summary').optional(),
      format: Joi.string().valid('json', 'pdf').default('json')
    })
  }),

  // Esquema para reporte de eventos
  eventReport: Joi.object({
    query: Joi.object({
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
      eventType: Joi.string().valid('social', 'business', 'sports', 'cultural', 'training').optional(),
      status: Joi.string().valid('scheduled', 'in_progress', 'completed', 'cancelled').optional(),
      format: Joi.string().valid('json', 'pdf').default('json')
    })
  }),

  // Esquema para reporte de mantenimiento
  maintenanceReport: Joi.object({
    query: Joi.object({
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
      taskType: Joi.string().valid('preventive', 'corrective', 'emergency', 'inspection').optional(),
      priority: Joi.string().valid('low', 'medium', 'high', 'critical').optional(),
      status: Joi.string().valid('pending', 'in_progress', 'completed', 'cancelled').optional(),
      format: Joi.string().valid('json', 'pdf').default('json')
    })
  }),

  // Esquema para reporte de inventario
  inventoryReport: Joi.object({
    query: Joi.object({
      category: Joi.number().integer().positive().optional(),
      supplier: Joi.number().integer().positive().optional(),
      lowStock: Joi.boolean().optional(),
      format: Joi.string().valid('json', 'pdf').default('json')
    })
  }),

  // Esquema para reporte de asistencia
  attendanceReport: Joi.object({
    query: Joi.object({
      startDate: Joi.date().iso().optional(),
      endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
      memberId: Joi.number().integer().positive().optional(),
      eventId: Joi.number().integer().positive().optional(),
      format: Joi.string().valid('json', 'pdf').default('json')
    })
  }),

  // Esquema para reporte personalizado
  customReport: Joi.object({
    body: Joi.object({
      reportType: Joi.string().valid('members_activity', 'financial_summary', 'event_analysis', 'maintenance_summary', 'inventory_analysis').required(),
      filters: Joi.object({
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
        categories: Joi.array().items(Joi.string()).optional(),
        statuses: Joi.array().items(Joi.string()).optional(),
        types: Joi.array().items(Joi.string()).optional()
      }).optional(),
      columns: Joi.array().items(Joi.string()).optional(),
      format: Joi.string().valid('json', 'pdf').default('json')
    })
  }),

  // Esquema para estadísticas
  statistics: Joi.object({
    query: Joi.object({
      period: Joi.string().valid('day', 'week', 'month', 'quarter', 'year').default('month')
    })
  }),

  // Esquema para obtener reportes guardados
  getSavedReports: Joi.object({
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      type: Joi.string().valid('membership', 'financial', 'events', 'maintenance', 'inventory', 'attendance', 'custom').optional()
    })
  }),

  // Esquema para guardar reporte
  saveReport: Joi.object({
    body: Joi.object({
      name: Joi.string().min(3).max(100).required(),
      description: Joi.string().max(500).optional(),
      reportType: Joi.string().valid('membership', 'financial', 'events', 'maintenance', 'inventory', 'attendance', 'custom').required(),
      filters: Joi.object({
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
        membershipType: Joi.string().valid('basic', 'premium', 'vip', 'corporate').optional(),
        status: Joi.string().optional(),
        eventType: Joi.string().optional(),
        taskType: Joi.string().optional(),
        priority: Joi.string().optional(),
        category: Joi.number().integer().positive().optional(),
        supplier: Joi.number().integer().positive().optional(),
        lowStock: Joi.boolean().optional(),
        memberId: Joi.number().integer().positive().optional(),
        eventId: Joi.number().integer().positive().optional(),
        reportType: Joi.string().optional(),
        categories: Joi.array().items(Joi.string()).optional(),
        statuses: Joi.array().items(Joi.string()).optional(),
        types: Joi.array().items(Joi.string()).optional()
      }).optional(),
      columns: Joi.array().items(Joi.string()).optional()
    })
  }),

  // Esquema para eliminar reporte guardado
  deleteSavedReport: Joi.object({
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    })
  }),

  // Esquema para descargar reporte
  downloadReport: Joi.object({
    params: Joi.object({
      id: Joi.number().integer().positive().required()
    })
  }),

  // Esquema para exportar a Excel
  exportToExcel: Joi.object({
    body: Joi.object({
      reportType: Joi.string().valid('membership', 'financial', 'events', 'maintenance', 'inventory', 'attendance', 'custom').required(),
      filters: Joi.object({
        startDate: Joi.date().iso().optional(),
        endDate: Joi.date().iso().min(Joi.ref('startDate')).optional(),
        membershipType: Joi.string().valid('basic', 'premium', 'vip', 'corporate').optional(),
        status: Joi.string().optional(),
        eventType: Joi.string().optional(),
        taskType: Joi.string().optional(),
        priority: Joi.string().optional(),
        category: Joi.number().integer().positive().optional(),
        supplier: Joi.number().integer().positive().optional(),
        lowStock: Joi.boolean().optional(),
        memberId: Joi.number().integer().positive().optional(),
        eventId: Joi.number().integer().positive().optional(),
        reportType: Joi.string().optional(),
        categories: Joi.array().items(Joi.string()).optional(),
        statuses: Joi.array().items(Joi.string()).optional(),
        types: Joi.array().items(Joi.string()).optional()
      }).optional()
    })
  })
}; 