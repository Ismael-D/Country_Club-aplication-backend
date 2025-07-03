import Joi from 'joi'

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA TAREAS DE MANTENIMIENTO
// =====================================================

const createTaskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'El título debe tener al menos 3 caracteres',
            'string.max': 'El título no puede exceder 200 caracteres',
            'any.required': 'El título es obligatorio'
        }),

    description: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder 1000 caracteres',
            'any.required': 'La descripción es obligatoria'
        }),

    priority: Joi.string()
        .valid('low', 'medium', 'high', 'urgent')
        .default('medium')
        .messages({
            'any.only': 'La prioridad debe ser: low, medium, high o urgent'
        }),

    category: Joi.string()
        .valid('electrical', 'plumbing', 'hvac', 'structural', 'landscaping', 'equipment', 'general', 'cleaning', 'security', 'other')
        .required()
        .messages({
            'any.only': 'Categoría no válida',
            'any.required': 'La categoría es obligatoria'
        }),

    location: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'La ubicación debe tener al menos 3 caracteres',
            'string.max': 'La ubicación no puede exceder 100 caracteres',
            'any.required': 'La ubicación es obligatoria'
        }),

    assigned_to: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID del asignado debe ser un número',
            'number.integer': 'El ID del asignado debe ser un número entero',
            'number.positive': 'El ID del asignado debe ser positivo'
        }),

    scheduled_date: Joi.date()
        .min('now')
        .required()
        .messages({
            'date.base': 'La fecha programada debe ser una fecha válida',
            'date.min': 'La fecha programada no puede ser anterior a hoy',
            'any.required': 'La fecha programada es obligatoria'
        }),

    estimated_duration: Joi.number()
        .integer()
        .min(1)
        .max(480)
        .optional()
        .messages({
            'number.base': 'La duración estimada debe ser un número',
            'number.integer': 'La duración estimada debe ser un número entero',
            'number.min': 'La duración estimada debe ser al menos 1 minuto',
            'number.max': 'La duración estimada no puede exceder 480 minutos (8 horas)'
        }),

    estimated_cost: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El costo estimado debe ser un número',
            'number.precision': 'El costo estimado debe tener máximo 2 decimales',
            'number.min': 'El costo estimado no puede ser negativo',
            'number.max': 'El costo estimado no puede exceder $100,000'
        }),

    requirements: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Los requisitos no pueden exceder 500 caracteres'
        }),

    notes: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Las notas no pueden exceder 1000 caracteres'
        })
})

const updateTaskSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(200)
        .optional()
        .messages({
            'string.min': 'El título debe tener al menos 3 caracteres',
            'string.max': 'El título no puede exceder 200 caracteres'
        }),

    description: Joi.string()
        .min(10)
        .max(1000)
        .optional()
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder 1000 caracteres'
        }),

    priority: Joi.string()
        .valid('low', 'medium', 'high', 'urgent')
        .optional()
        .messages({
            'any.only': 'La prioridad debe ser: low, medium, high o urgent'
        }),

    category: Joi.string()
        .valid('electrical', 'plumbing', 'hvac', 'structural', 'landscaping', 'equipment', 'general', 'cleaning', 'security', 'other')
        .optional()
        .messages({
            'any.only': 'Categoría no válida'
        }),

    location: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .messages({
            'string.min': 'La ubicación debe tener al menos 3 caracteres',
            'string.max': 'La ubicación no puede exceder 100 caracteres'
        }),

    assigned_to: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID del asignado debe ser un número',
            'number.integer': 'El ID del asignado debe ser un número entero',
            'number.positive': 'El ID del asignado debe ser positivo'
        }),

    scheduled_date: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha programada debe ser una fecha válida'
        }),

    estimated_duration: Joi.number()
        .integer()
        .min(1)
        .max(480)
        .optional()
        .messages({
            'number.base': 'La duración estimada debe ser un número',
            'number.integer': 'La duración estimada debe ser un número entero',
            'number.min': 'La duración estimada debe ser al menos 1 minuto',
            'number.max': 'La duración estimada no puede exceder 480 minutos (8 horas)'
        }),

    estimated_cost: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El costo estimado debe ser un número',
            'number.precision': 'El costo estimado debe tener máximo 2 decimales',
            'number.min': 'El costo estimado no puede ser negativo',
            'number.max': 'El costo estimado no puede exceder $100,000'
        }),

    status: Joi.string()
        .valid('pending', 'assigned', 'in_progress', 'completed', 'cancelled')
        .optional()
        .messages({
            'any.only': 'El estado debe ser: pending, assigned, in_progress, completed o cancelled'
        }),

    requirements: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Los requisitos no pueden exceder 500 caracteres'
        }),

    notes: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Las notas no pueden exceder 1000 caracteres'
        }),

    actual_duration: Joi.number()
        .integer()
        .min(1)
        .max(480)
        .optional()
        .messages({
            'number.base': 'La duración real debe ser un número',
            'number.integer': 'La duración real debe ser un número entero',
            'number.min': 'La duración real debe ser al menos 1 minuto',
            'number.max': 'La duración real no puede exceder 480 minutos (8 horas)'
        }),

    actual_cost: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El costo real debe ser un número',
            'number.precision': 'El costo real debe tener máximo 2 decimales',
            'number.min': 'El costo real no puede ser negativo',
            'number.max': 'El costo real no puede exceder $100,000'
        }),

    completion_notes: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Las notas de completado no pueden exceder 1000 caracteres'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA INCIDENCIAS
// =====================================================

const createIncidentSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'El título debe tener al menos 3 caracteres',
            'string.max': 'El título no puede exceder 200 caracteres',
            'any.required': 'El título es obligatorio'
        }),

    description: Joi.string()
        .min(10)
        .max(1000)
        .required()
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder 1000 caracteres',
            'any.required': 'La descripción es obligatoria'
        }),

    priority: Joi.string()
        .valid('low', 'medium', 'high', 'urgent')
        .default('medium')
        .messages({
            'any.only': 'La prioridad debe ser: low, medium, high o urgent'
        }),

    location: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'La ubicación debe tener al menos 3 caracteres',
            'string.max': 'La ubicación no puede exceder 100 caracteres',
            'any.required': 'La ubicación es obligatoria'
        }),

    equipment_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID del equipo debe ser un número',
            'number.integer': 'El ID del equipo debe ser un número entero',
            'number.positive': 'El ID del equipo debe ser positivo'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA EQUIPOS
// =====================================================

const createEquipmentSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no puede exceder 100 caracteres',
            'any.required': 'El nombre es obligatorio'
        }),

    description: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder 500 caracteres'
        }),

    category: Joi.string()
        .valid('electrical', 'plumbing', 'hvac', 'structural', 'landscaping', 'equipment', 'security', 'cleaning', 'kitchen', 'recreation', 'other')
        .required()
        .messages({
            'any.only': 'Categoría no válida',
            'any.required': 'La categoría es obligatoria'
        }),

    model: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'El modelo no puede exceder 100 caracteres'
        }),

    serial_number: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'El número de serie no puede exceder 50 caracteres'
        }),

    location: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'La ubicación debe tener al menos 3 caracteres',
            'string.max': 'La ubicación no puede exceder 100 caracteres',
            'any.required': 'La ubicación es obligatoria'
        }),

    purchase_date: Joi.date()
        .max('now')
        .optional()
        .messages({
            'date.base': 'La fecha de compra debe ser una fecha válida',
            'date.max': 'La fecha de compra no puede ser futura'
        }),

    warranty_expiry: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha de vencimiento de garantía debe ser una fecha válida'
        }),

    status: Joi.string()
        .valid('active', 'maintenance', 'retired', 'broken')
        .default('active')
        .messages({
            'any.only': 'El estado debe ser: active, maintenance, retired o broken'
        })
})

const updateEquipmentSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no puede exceder 100 caracteres'
        }),

    description: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder 500 caracteres'
        }),

    category: Joi.string()
        .valid('electrical', 'plumbing', 'hvac', 'structural', 'landscaping', 'equipment', 'security', 'cleaning', 'kitchen', 'recreation', 'other')
        .optional()
        .messages({
            'any.only': 'Categoría no válida'
        }),

    model: Joi.string()
        .max(100)
        .optional()
        .messages({
            'string.max': 'El modelo no puede exceder 100 caracteres'
        }),

    serial_number: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'El número de serie no puede exceder 50 caracteres'
        }),

    location: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .messages({
            'string.min': 'La ubicación debe tener al menos 3 caracteres',
            'string.max': 'La ubicación no puede exceder 100 caracteres'
        }),

    purchase_date: Joi.date()
        .max('now')
        .optional()
        .messages({
            'date.base': 'La fecha de compra debe ser una fecha válida',
            'date.max': 'La fecha de compra no puede ser futura'
        }),

    warranty_expiry: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha de vencimiento de garantía debe ser una fecha válida'
        }),

    status: Joi.string()
        .valid('active', 'maintenance', 'retired', 'broken')
        .optional()
        .messages({
            'any.only': 'El estado debe ser: active, maintenance, retired o broken'
        }),

    last_maintenance_date: Joi.date()
        .max('now')
        .optional()
        .messages({
            'date.base': 'La fecha del último mantenimiento debe ser una fecha válida',
            'date.max': 'La fecha del último mantenimiento no puede ser futura'
        }),

    next_maintenance_date: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha del próximo mantenimiento debe ser una fecha válida'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA MANTENIMIENTO PREVENTIVO
// =====================================================

const createPreventiveSchema = Joi.object({
    equipment_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del equipo debe ser un número',
            'number.integer': 'El ID del equipo debe ser un número entero',
            'number.positive': 'El ID del equipo debe ser positivo',
            'any.required': 'El ID del equipo es obligatorio'
        }),

    task_description: Joi.string()
        .min(10)
        .max(500)
        .required()
        .messages({
            'string.min': 'La descripción de la tarea debe tener al menos 10 caracteres',
            'string.max': 'La descripción de la tarea no puede exceder 500 caracteres',
            'any.required': 'La descripción de la tarea es obligatoria'
        }),

    frequency: Joi.string()
        .valid('daily', 'weekly', 'monthly', 'quarterly', 'biannual', 'annual')
        .required()
        .messages({
            'any.only': 'La frecuencia debe ser: daily, weekly, monthly, quarterly, biannual o annual',
            'any.required': 'La frecuencia es obligatoria'
        }),

    estimated_duration: Joi.number()
        .integer()
        .min(1)
        .max(480)
        .optional()
        .messages({
            'number.base': 'La duración estimada debe ser un número',
            'number.integer': 'La duración estimada debe ser un número entero',
            'number.min': 'La duración estimada debe ser al menos 1 minuto',
            'number.max': 'La duración estimada no puede exceder 480 minutos (8 horas)'
        }),

    estimated_cost: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El costo estimado debe ser un número',
            'number.precision': 'El costo estimado debe tener máximo 2 decimales',
            'number.min': 'El costo estimado no puede ser negativo',
            'number.max': 'El costo estimado no puede exceder $100,000'
        }),

    next_maintenance_date: Joi.date()
        .min('now')
        .required()
        .messages({
            'date.base': 'La fecha del próximo mantenimiento debe ser una fecha válida',
            'date.min': 'La fecha del próximo mantenimiento no puede ser anterior a hoy',
            'any.required': 'La fecha del próximo mantenimiento es obligatoria'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA BÚSQUEDA
// =====================================================

const searchSchema = Joi.object({
    q: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'El término de búsqueda debe tener al menos 2 caracteres',
            'string.max': 'El término de búsqueda no puede exceder 100 caracteres',
            'any.required': 'El término de búsqueda es obligatorio'
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'La página debe ser un número',
            'number.integer': 'La página debe ser un número entero',
            'number.min': 'La página debe ser al menos 1'
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.base': 'El límite debe ser un número',
            'number.integer': 'El límite debe ser un número entero',
            'number.min': 'El límite debe ser al menos 1',
            'number.max': 'El límite no puede exceder 100'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA FILTROS
// =====================================================

const filterSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'assigned', 'in_progress', 'completed', 'cancelled')
        .optional()
        .messages({
            'any.only': 'El estado debe ser: pending, assigned, in_progress, completed o cancelled'
        }),

    priority: Joi.string()
        .valid('low', 'medium', 'high', 'urgent')
        .optional()
        .messages({
            'any.only': 'La prioridad debe ser: low, medium, high o urgent'
        }),

    category: Joi.string()
        .valid('electrical', 'plumbing', 'hvac', 'structural', 'landscaping', 'equipment', 'general', 'cleaning', 'security', 'other')
        .optional()
        .messages({
            'any.only': 'Categoría no válida'
        }),

    assigned_to: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID del asignado debe ser un número',
            'number.integer': 'El ID del asignado debe ser un número entero',
            'number.positive': 'El ID del asignado debe ser positivo'
        }),

    date_from: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha desde debe ser una fecha válida'
        }),

    date_to: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha hasta debe ser una fecha válida'
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            'number.base': 'La página debe ser un número',
            'number.integer': 'La página debe ser un número entero',
            'number.min': 'La página debe ser al menos 1'
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            'number.base': 'El límite debe ser un número',
            'number.integer': 'El límite debe ser un número entero',
            'number.min': 'El límite debe ser al menos 1',
            'number.max': 'El límite no puede exceder 100'
        })
})

export const maintenanceSchemas = {
    createTask: createTaskSchema,
    updateTask: updateTaskSchema,
    createIncident: createIncidentSchema,
    createEquipment: createEquipmentSchema,
    updateEquipment: updateEquipmentSchema,
    createPreventive: createPreventiveSchema,
    search: searchSchema,
    filter: filterSchema
} 