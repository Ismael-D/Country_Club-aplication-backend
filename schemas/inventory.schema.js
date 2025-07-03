import Joi from 'joi'

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA PRODUCTOS
// =====================================================

const createProductSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no puede exceder 200 caracteres',
            'any.required': 'El nombre es obligatorio'
        }),

    description: Joi.string()
        .min(10)
        .max(1000)
        .optional()
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder 1000 caracteres'
        }),

    sku: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'El SKU debe tener al menos 3 caracteres',
            'string.max': 'El SKU no puede exceder 50 caracteres',
            'any.required': 'El SKU es obligatorio'
        }),

    category_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID de categoría debe ser un número',
            'number.integer': 'El ID de categoría debe ser un número entero',
            'number.positive': 'El ID de categoría debe ser positivo',
            'any.required': 'La categoría es obligatoria'
        }),

    supplier_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de proveedor debe ser un número',
            'number.integer': 'El ID de proveedor debe ser un número entero',
            'number.positive': 'El ID de proveedor debe ser positivo'
        }),

    unit_price: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .required()
        .messages({
            'number.base': 'El precio unitario debe ser un número',
            'number.precision': 'El precio unitario debe tener máximo 2 decimales',
            'number.min': 'El precio unitario no puede ser negativo',
            'number.max': 'El precio unitario no puede exceder $100,000',
            'any.required': 'El precio unitario es obligatorio'
        }),

    cost_price: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El precio de costo debe ser un número',
            'number.precision': 'El precio de costo debe tener máximo 2 decimales',
            'number.min': 'El precio de costo no puede ser negativo',
            'number.max': 'El precio de costo no puede exceder $100,000'
        }),

    min_stock: Joi.number()
        .integer()
        .min(0)
        .max(100000)
        .required()
        .messages({
            'number.base': 'El stock mínimo debe ser un número',
            'number.integer': 'El stock mínimo debe ser un número entero',
            'number.min': 'El stock mínimo no puede ser negativo',
            'number.max': 'El stock mínimo no puede exceder 100,000',
            'any.required': 'El stock mínimo es obligatorio'
        }),

    max_stock: Joi.number()
        .integer()
        .min(0)
        .max(1000000)
        .optional()
        .messages({
            'number.base': 'El stock máximo debe ser un número',
            'number.integer': 'El stock máximo debe ser un número entero',
            'number.min': 'El stock máximo no puede ser negativo',
            'number.max': 'El stock máximo no puede exceder 1,000,000'
        }),

    current_stock: Joi.number()
        .integer()
        .min(0)
        .max(1000000)
        .default(0)
        .messages({
            'number.base': 'El stock actual debe ser un número',
            'number.integer': 'El stock actual debe ser un número entero',
            'number.min': 'El stock actual no puede ser negativo',
            'number.max': 'El stock actual no puede exceder 1,000,000'
        }),

    unit_of_measure: Joi.string()
        .valid('units', 'kg', 'liters', 'meters', 'boxes', 'pairs', 'sets', 'pieces', 'bottles', 'cans', 'bags', 'rolls', 'sheets', 'other')
        .required()
        .messages({
            'any.only': 'Unidad de medida no válida',
            'any.required': 'La unidad de medida es obligatoria'
        }),

    barcode: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'El código de barras no puede exceder 50 caracteres'
        }),

    location: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .messages({
            'string.min': 'La ubicación debe tener al menos 3 caracteres',
            'string.max': 'La ubicación no puede exceder 100 caracteres'
        }),

    expiry_date: Joi.date()
        .min('now')
        .optional()
        .messages({
            'date.base': 'La fecha de vencimiento debe ser una fecha válida',
            'date.min': 'La fecha de vencimiento no puede ser anterior a hoy'
        }),

    status: Joi.string()
        .valid('active', 'inactive', 'discontinued')
        .default('active')
        .messages({
            'any.only': 'El estado debe ser: active, inactive o discontinued'
        })
})

const updateProductSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(200)
        .optional()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no puede exceder 200 caracteres'
        }),

    description: Joi.string()
        .min(10)
        .max(1000)
        .optional()
        .messages({
            'string.min': 'La descripción debe tener al menos 10 caracteres',
            'string.max': 'La descripción no puede exceder 1000 caracteres'
        }),

    sku: Joi.string()
        .min(3)
        .max(50)
        .optional()
        .messages({
            'string.min': 'El SKU debe tener al menos 3 caracteres',
            'string.max': 'El SKU no puede exceder 50 caracteres'
        }),

    category_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de categoría debe ser un número',
            'number.integer': 'El ID de categoría debe ser un número entero',
            'number.positive': 'El ID de categoría debe ser positivo'
        }),

    supplier_id: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de proveedor debe ser un número',
            'number.integer': 'El ID de proveedor debe ser un número entero',
            'number.positive': 'El ID de proveedor debe ser positivo'
        }),

    unit_price: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El precio unitario debe ser un número',
            'number.precision': 'El precio unitario debe tener máximo 2 decimales',
            'number.min': 'El precio unitario no puede ser negativo',
            'number.max': 'El precio unitario no puede exceder $100,000'
        }),

    cost_price: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El precio de costo debe ser un número',
            'number.precision': 'El precio de costo debe tener máximo 2 decimales',
            'number.min': 'El precio de costo no puede ser negativo',
            'number.max': 'El precio de costo no puede exceder $100,000'
        }),

    min_stock: Joi.number()
        .integer()
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El stock mínimo debe ser un número',
            'number.integer': 'El stock mínimo debe ser un número entero',
            'number.min': 'El stock mínimo no puede ser negativo',
            'number.max': 'El stock mínimo no puede exceder 100,000'
        }),

    max_stock: Joi.number()
        .integer()
        .min(0)
        .max(1000000)
        .optional()
        .messages({
            'number.base': 'El stock máximo debe ser un número',
            'number.integer': 'El stock máximo debe ser un número entero',
            'number.min': 'El stock máximo no puede ser negativo',
            'number.max': 'El stock máximo no puede exceder 1,000,000'
        }),

    current_stock: Joi.number()
        .integer()
        .min(0)
        .max(1000000)
        .optional()
        .messages({
            'number.base': 'El stock actual debe ser un número',
            'number.integer': 'El stock actual debe ser un número entero',
            'number.min': 'El stock actual no puede ser negativo',
            'number.max': 'El stock actual no puede exceder 1,000,000'
        }),

    unit_of_measure: Joi.string()
        .valid('units', 'kg', 'liters', 'meters', 'boxes', 'pairs', 'sets', 'pieces', 'bottles', 'cans', 'bags', 'rolls', 'sheets', 'other')
        .optional()
        .messages({
            'any.only': 'Unidad de medida no válida'
        }),

    barcode: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'El código de barras no puede exceder 50 caracteres'
        }),

    location: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .messages({
            'string.min': 'La ubicación debe tener al menos 3 caracteres',
            'string.max': 'La ubicación no puede exceder 100 caracteres'
        }),

    expiry_date: Joi.date()
        .optional()
        .messages({
            'date.base': 'La fecha de vencimiento debe ser una fecha válida'
        }),

    status: Joi.string()
        .valid('active', 'inactive', 'discontinued')
        .optional()
        .messages({
            'any.only': 'El estado debe ser: active, inactive o discontinued'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA CATEGORÍAS
// =====================================================

const createCategorySchema = Joi.object({
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

    color: Joi.string()
        .pattern(/^#[0-9A-F]{6}$/i)
        .optional()
        .messages({
            'string.pattern.base': 'El color debe ser un código hexadecimal válido (ej: #FF0000)'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA PROVEEDORES
// =====================================================

const createSupplierSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(200)
        .required()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no puede exceder 200 caracteres',
            'any.required': 'El nombre es obligatorio'
        }),

    contact_person: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            'string.min': 'El nombre del contacto debe tener al menos 3 caracteres',
            'string.max': 'El nombre del contacto no puede exceder 100 caracteres',
            'any.required': 'El nombre del contacto es obligatorio'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'El email debe tener un formato válido',
            'any.required': 'El email es obligatorio'
        }),

    phone: Joi.string()
        .min(7)
        .max(20)
        .required()
        .messages({
            'string.min': 'El teléfono debe tener al menos 7 caracteres',
            'string.max': 'El teléfono no puede exceder 20 caracteres',
            'any.required': 'El teléfono es obligatorio'
        }),

    address: Joi.string()
        .min(10)
        .max(300)
        .optional()
        .messages({
            'string.min': 'La dirección debe tener al menos 10 caracteres',
            'string.max': 'La dirección no puede exceder 300 caracteres'
        }),

    tax_id: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'El ID fiscal no puede exceder 50 caracteres'
        }),

    payment_terms: Joi.string()
        .valid('immediate', 'net_15', 'net_30', 'net_45', 'net_60', 'net_90')
        .default('net_30')
        .messages({
            'any.only': 'Los términos de pago deben ser: immediate, net_15, net_30, net_45, net_60 o net_90'
        }),

    status: Joi.string()
        .valid('active', 'inactive', 'suspended')
        .default('active')
        .messages({
            'any.only': 'El estado debe ser: active, inactive o suspended'
        })
})

const updateSupplierSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(200)
        .optional()
        .messages({
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.max': 'El nombre no puede exceder 200 caracteres'
        }),

    contact_person: Joi.string()
        .min(3)
        .max(100)
        .optional()
        .messages({
            'string.min': 'El nombre del contacto debe tener al menos 3 caracteres',
            'string.max': 'El nombre del contacto no puede exceder 100 caracteres'
        }),

    email: Joi.string()
        .email()
        .optional()
        .messages({
            'string.email': 'El email debe tener un formato válido'
        }),

    phone: Joi.string()
        .min(7)
        .max(20)
        .optional()
        .messages({
            'string.min': 'El teléfono debe tener al menos 7 caracteres',
            'string.max': 'El teléfono no puede exceder 20 caracteres'
        }),

    address: Joi.string()
        .min(10)
        .max(300)
        .optional()
        .messages({
            'string.min': 'La dirección debe tener al menos 10 caracteres',
            'string.max': 'La dirección no puede exceder 300 caracteres'
        }),

    tax_id: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'El ID fiscal no puede exceder 50 caracteres'
        }),

    payment_terms: Joi.string()
        .valid('immediate', 'net_15', 'net_30', 'net_45', 'net_60', 'net_90')
        .optional()
        .messages({
            'any.only': 'Los términos de pago deben ser: immediate, net_15, net_30, net_45, net_60 o net_90'
        }),

    status: Joi.string()
        .valid('active', 'inactive', 'suspended')
        .optional()
        .messages({
            'any.only': 'El estado debe ser: active, inactive o suspended'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA MOVIMIENTOS
// =====================================================

const createMovementSchema = Joi.object({
    product_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del producto debe ser un número',
            'number.integer': 'El ID del producto debe ser un número entero',
            'number.positive': 'El ID del producto debe ser positivo',
            'any.required': 'El ID del producto es obligatorio'
        }),

    movement_type: Joi.string()
        .valid('in', 'out', 'purchase', 'sale', 'adjustment', 'transfer', 'return', 'damage', 'expiry')
        .required()
        .messages({
            'any.only': 'El tipo de movimiento debe ser: in, out, purchase, sale, adjustment, transfer, return, damage o expiry',
            'any.required': 'El tipo de movimiento es obligatorio'
        }),

    quantity: Joi.number()
        .integer()
        .min(1)
        .max(100000)
        .required()
        .messages({
            'number.base': 'La cantidad debe ser un número',
            'number.integer': 'La cantidad debe ser un número entero',
            'number.min': 'La cantidad debe ser al menos 1',
            'number.max': 'La cantidad no puede exceder 100,000',
            'any.required': 'La cantidad es obligatoria'
        }),

    unit_price: Joi.number()
        .precision(2)
        .min(0)
        .max(100000)
        .optional()
        .messages({
            'number.base': 'El precio unitario debe ser un número',
            'number.precision': 'El precio unitario debe tener máximo 2 decimales',
            'number.min': 'El precio unitario no puede ser negativo',
            'number.max': 'El precio unitario no puede exceder $100,000'
        }),

    reference_number: Joi.string()
        .max(50)
        .optional()
        .messages({
            'string.max': 'El número de referencia no puede exceder 50 caracteres'
        }),

    notes: Joi.string()
        .max(500)
        .optional()
        .messages({
            'string.max': 'Las notas no pueden exceder 500 caracteres'
        })
})

// =====================================================
// ESQUEMAS DE VALIDACIÓN PARA COMPRAS
// =====================================================

const createPurchaseSchema = Joi.object({
    supplier_id: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'El ID del proveedor debe ser un número',
            'number.integer': 'El ID del proveedor debe ser un número entero',
            'number.positive': 'El ID del proveedor debe ser positivo',
            'any.required': 'El ID del proveedor es obligatorio'
        }),

    purchase_number: Joi.string()
        .min(3)
        .max(50)
        .required()
        .messages({
            'string.min': 'El número de compra debe tener al menos 3 caracteres',
            'string.max': 'El número de compra no puede exceder 50 caracteres',
            'any.required': 'El número de compra es obligatorio'
        }),

    total_amount: Joi.number()
        .precision(2)
        .min(0)
        .max(1000000)
        .required()
        .messages({
            'number.base': 'El monto total debe ser un número',
            'number.precision': 'El monto total debe tener máximo 2 decimales',
            'number.min': 'El monto total no puede ser negativo',
            'number.max': 'El monto total no puede exceder $1,000,000',
            'any.required': 'El monto total es obligatorio'
        }),

    purchase_date: Joi.date()
        .max('now')
        .required()
        .messages({
            'date.base': 'La fecha de compra debe ser una fecha válida',
            'date.max': 'La fecha de compra no puede ser futura',
            'any.required': 'La fecha de compra es obligatoria'
        }),

    expected_delivery: Joi.date()
        .min('now')
        .optional()
        .messages({
            'date.base': 'La fecha de entrega esperada debe ser una fecha válida',
            'date.min': 'La fecha de entrega esperada no puede ser anterior a hoy'
        }),

    notes: Joi.string()
        .max(1000)
        .optional()
        .messages({
            'string.max': 'Las notas no pueden exceder 1000 caracteres'
        })
})

const updatePurchaseStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'approved', 'ordered', 'received', 'cancelled', 'completed')
        .required()
        .messages({
            'any.only': 'El estado debe ser: pending, approved, ordered, received, cancelled o completed',
            'any.required': 'El estado es obligatorio'
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
    category: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de categoría debe ser un número',
            'number.integer': 'El ID de categoría debe ser un número entero',
            'number.positive': 'El ID de categoría debe ser positivo'
        }),

    supplier: Joi.number()
        .integer()
        .positive()
        .optional()
        .messages({
            'number.base': 'El ID de proveedor debe ser un número',
            'number.integer': 'El ID de proveedor debe ser un número entero',
            'number.positive': 'El ID de proveedor debe ser positivo'
        }),

    status: Joi.string()
        .valid('active', 'inactive', 'discontinued')
        .optional()
        .messages({
            'any.only': 'El estado debe ser: active, inactive o discontinued'
        }),

    low_stock: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'El filtro de bajo stock debe ser true o false'
        }),

    search: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'El término de búsqueda debe tener al menos 2 caracteres',
            'string.max': 'El término de búsqueda no puede exceder 100 caracteres'
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

export const inventorySchemas = {
    createProduct: createProductSchema,
    updateProduct: updateProductSchema,
    createCategory: createCategorySchema,
    createSupplier: createSupplierSchema,
    updateSupplier: updateSupplierSchema,
    createMovement: createMovementSchema,
    createPurchase: createPurchaseSchema,
    updatePurchaseStatus: updatePurchaseStatusSchema,
    search: searchSchema,
    filter: filterSchema
} 