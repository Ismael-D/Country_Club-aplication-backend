import PERMISSIONS from './permissions.js';

// Configuración del entorno
const ENV = process.env.NODE_ENV || 'development';

// Configuración de la base de datos
const DATABASE_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'countryclub',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Configuración del servidor
const SERVER_CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  }
};

// Configuración de JWT
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

// Configuración de validación
const VALIDATION_CONFIG = {
  passwordMinLength: 6,
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneRegex: /^[\+]?[1-9][\d]{0,15}$/
};

// Configuración de archivos
const FILE_CONFIG = {
  uploadPath: process.env.UPLOAD_PATH || './uploads',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
};

// Configuración de paginación
const PAGINATION_CONFIG = {
  defaultLimit: 10,
  maxLimit: 100,
  defaultPage: 1
};

// Configuración de notificaciones
const NOTIFICATION_CONFIG = {
  email: {
    enabled: process.env.EMAIL_ENABLED === 'true',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  sms: {
    enabled: process.env.SMS_ENABLED === 'true',
    provider: process.env.SMS_PROVIDER,
    apiKey: process.env.SMS_API_KEY
  }
};

// Configuración de reportes
const REPORT_CONFIG = {
  outputPath: process.env.REPORT_OUTPUT_PATH || './reports',
  formats: ['pdf', 'excel', 'csv'],
  retentionDays: 30
};

// Configuración de logs
const LOG_CONFIG = {
  level: process.env.LOG_LEVEL || 'info',
  file: process.env.LOG_FILE || './logs/app.log',
  maxSize: process.env.LOG_MAX_SIZE || '10m',
  maxFiles: process.env.LOG_MAX_FILES || 5
};

// Configuración del club
const CLUB_CONFIG = {
  name: process.env.CLUB_NAME || 'Country Club Premium',
  address: process.env.CLUB_ADDRESS || 'Dirección del Club',
  phone: process.env.CLUB_PHONE || '+1234567890',
  email: process.env.CLUB_EMAIL || 'info@club.com',
  website: process.env.CLUB_WEBSITE || 'https://club.com',
  timezone: process.env.CLUB_TIMEZONE || 'America/New_York'
};

// Configuración de módulos
const MODULES_CONFIG = {
  members: {
    autoGenerateMembershipNumber: true,
    membershipNumberPrefix: 'MEM-',
    defaultMembershipDuration: 365, // días
    allowMultipleMemberships: false
  },
  events: {
    maxAttendees: 100,
    requireApproval: false,
    allowPublicRegistration: true,
    autoCancelUnpaid: true
  },
  maintenance: {
    alertThreshold: 10,
    autoAssignTasks: false,
    requireApproval: true
  },
  communications: {
    maxRecipients: 1000,
    allowScheduledMessages: true,
    requireApproval: false
  }
};

// Configuración de seguridad
const SECURITY_CONFIG = {
  bcryptRounds: 12,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por ventana
  },
  session: {
    secret: process.env.SESSION_SECRET || 'session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
  }
};

// Exportar todas las configuraciones
export {
  ENV,
  DATABASE_CONFIG,
  SERVER_CONFIG,
  JWT_CONFIG,
  VALIDATION_CONFIG,
  FILE_CONFIG,
  PAGINATION_CONFIG,
  NOTIFICATION_CONFIG,
  REPORT_CONFIG,
  LOG_CONFIG,
  CLUB_CONFIG,
  MODULES_CONFIG,
  SECURITY_CONFIG,
  PERMISSIONS
};

// Configuración por defecto
export default {
  env: ENV,
  database: DATABASE_CONFIG,
  server: SERVER_CONFIG,
  jwt: JWT_CONFIG,
  validation: VALIDATION_CONFIG,
  file: FILE_CONFIG,
  pagination: PAGINATION_CONFIG,
  notification: NOTIFICATION_CONFIG,
  report: REPORT_CONFIG,
  log: LOG_CONFIG,
  club: CLUB_CONFIG,
  modules: MODULES_CONFIG,
  security: SECURITY_CONFIG,
  permissions: PERMISSIONS
}; 