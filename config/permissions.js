// Configuración de permisos por roles para el Country Club
// Basado en los requisitos especificados

export const PERMISSIONS = {
  // Roles del sistema
  ROLES: {
    ADMIN: 'admin',
    MANAGER: 'manager', 
    EVENT_COORDINATOR: 'event_coordinator'
  },

  // Permisos por módulo
  MODULES: {
    // 1. Gestión de Miembros
    MEMBERS: {
      CREATE: ['admin', 'manager'],
      READ: ['admin', 'manager', 'event_coordinator'],
      UPDATE: ['admin', 'manager'],
      DELETE: ['admin'],
      VERIFY_MEMBERSHIP: ['admin', 'manager'],
      MANAGE_PAYMENTS: ['admin', 'manager']
    },

    // 2. Gestión de Eventos
    EVENTS: {
      CREATE: ['admin', 'event_coordinator'],
      READ: ['admin', 'manager', 'event_coordinator'],
      UPDATE: ['admin', 'event_coordinator'],
      DELETE: ['admin'],
      MANAGE_ATTENDANCE: ['admin', 'event_coordinator'],
      MANAGE_RESOURCES: ['admin', 'event_coordinator'],
      APPROVE_EVENTS: ['admin', 'manager']
    },

    // 3. Mantenimiento del Club
    MAINTENANCE: {
      CREATE: ['admin', 'manager'],
      READ: ['admin', 'manager', 'event_coordinator'],
      UPDATE: ['admin', 'manager'],
      DELETE: ['admin'],
      CREATE_TASKS: ['admin', 'manager'],
      READ_TASKS: ['admin', 'manager', 'event_coordinator'],
      UPDATE_TASKS: ['admin', 'manager'],
      DELETE_TASKS: ['admin'],
      MANAGE_INVENTORY: ['admin', 'manager'],
      CREATE_INCIDENTS: ['admin', 'manager', 'event_coordinator'],
      RESOLVE_INCIDENTS: ['admin', 'manager']
    },

    // 4. Comunicaciones
    COMMUNICATIONS: {
      SEND_NOTIFICATIONS: ['admin', 'manager'],
      READ_NOTIFICATIONS: ['admin', 'manager', 'event_coordinator'],
      CREATE_SURVEYS: ['admin', 'manager'],
      READ_SURVEYS: ['admin', 'manager', 'event_coordinator'],
      RESPOND_SURVEYS: ['admin', 'manager', 'event_coordinator']
    },

    // 5. Reportes y Análisis
    REPORTS: {
      GENERATE_REPORTS: ['admin', 'manager'],
      READ_REPORTS: ['admin', 'manager', 'event_coordinator'],
      EXPORT_DATA: ['admin', 'manager'],
      VIEW_ANALYTICS: ['admin', 'manager']
    },

    // 6. Configuración y Administración
    ADMIN: {
      MANAGE_USERS: ['admin'],
      MANAGE_ROLES: ['admin'],
      SYSTEM_CONFIG: ['admin'],
      VIEW_LOGS: ['admin'],
      BACKUP_DATA: ['admin']
    },

    // 7. Empleados
    EMPLOYEES: {
      CREATE: ['admin'],
      READ: ['admin', 'manager', 'event_coordinator'],
      UPDATE: ['admin'],
      DELETE: ['admin'],
      MANAGE_SCHEDULES: ['admin', 'manager']
    },

    // 8. Inventario
    INVENTORY: {
      CREATE: ['admin', 'manager'],
      READ: ['admin', 'manager', 'event_coordinator'],
      UPDATE: ['admin', 'manager'],
      DELETE: ['admin'],
      REQUEST_ITEMS: ['event_coordinator'],
      APPROVE_REQUESTS: ['admin', 'manager']
    },

    // 9. Proveedores
    SUPPLIERS: {
      CREATE: ['admin', 'manager'],
      READ: ['admin', 'manager', 'event_coordinator'],
      UPDATE: ['admin', 'manager'],
      DELETE: ['admin']
    },

    // 10. Compras
    PURCHASES: {
      CREATE: ['admin', 'manager', 'event_coordinator'],
      READ: ['admin', 'manager'],
      UPDATE: ['admin', 'manager'],
      DELETE: ['admin'],
      APPROVE: ['admin', 'manager']
    }
  },

  // Funciones helper para verificar permisos
  hasPermission: (userRole, module, action) => {
    const modulePermissions = PERMISSIONS.MODULES[module];
    if (!modulePermissions || !modulePermissions[action]) {
      return false;
    }
    return modulePermissions[action].includes(userRole);
  },

  // Verificar si el usuario puede acceder a un módulo completo
  canAccessModule: (userRole, module) => {
    const modulePermissions = PERMISSIONS.MODULES[module];
    if (!modulePermissions) {
      return false;
    }
    
    // Si tiene al menos un permiso de lectura, puede acceder al módulo
    return modulePermissions.READ && modulePermissions.READ.includes(userRole);
  },

  // Obtener todos los permisos de un usuario
  getUserPermissions: (userRole) => {
    const permissions = {};
    
    Object.keys(PERMISSIONS.MODULES).forEach(module => {
      permissions[module] = {};
      Object.keys(PERMISSIONS.MODULES[module]).forEach(action => {
        permissions[module][action] = PERMISSIONS.hasPermission(userRole, module, action);
      });
    });
    
    return permissions;
  },

  // Obtener módulos accesibles para un rol
  getAccessibleModules: (userRole) => {
    const modules = [];
    
    Object.keys(PERMISSIONS.MODULES).forEach(module => {
      if (PERMISSIONS.canAccessModule(userRole, module)) {
        modules.push(module);
      }
    });
    
    return modules;
  }
};

// Middleware para verificar permisos específicos
export const requirePermission = (module, action) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({
        ok: false,
        msg: 'Usuario no autenticado'
      });
    }
    
    if (!PERMISSIONS.hasPermission(userRole, module, action)) {
      return res.status(403).json({
        ok: false,
        msg: `No tienes permisos para ${action} en el módulo ${module}`
      });
    }
    
    next();
  };
};

// Middleware para verificar acceso al módulo
export const requireModuleAccess = (module) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    
    if (!userRole) {
      return res.status(401).json({
        ok: false,
        msg: 'Usuario no autenticado'
      });
    }
    
    if (!PERMISSIONS.canAccessModule(userRole, module)) {
      return res.status(403).json({
        ok: false,
        msg: `No tienes acceso al módulo ${module}`
      });
    }
    
    next();
  };
};

export default PERMISSIONS; 