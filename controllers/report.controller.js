import { ReportModel } from '../models/report.model.js';
import { errorCatalog } from '../utils/error.catalog.js';
import { validatePermissions } from '../middlewares/auth.middleware.js';

export const ReportController = {
  /**
   * Generar reporte de membresías
   */
  async generateMembershipReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { startDate, endDate, membershipType, status, format = 'json' } = req.query;

      const report = await ReportModel.generateMembershipReport({
        startDate,
        endDate,
        membershipType,
        status
      });

      if (format === 'pdf') {
        // Aquí se implementaría la generación de PDF
        return res.status(200).json({
          success: true,
          message: 'Reporte de membresías generado exitosamente',
          data: report,
          format: 'pdf',
          downloadUrl: `/api/reports/membership/download/${report.id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Reporte de membresías generado exitosamente',
        data: report
      });
    } catch (error) {
      console.error('Error generando reporte de membresías:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Generar reporte financiero
   */
  async generateFinancialReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'finance', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { startDate, endDate, reportType, format = 'json' } = req.query;

      const report = await ReportModel.generateFinancialReport({
        startDate,
        endDate,
        reportType
      });

      if (format === 'pdf') {
        return res.status(200).json({
          success: true,
          message: 'Reporte financiero generado exitosamente',
          data: report,
          format: 'pdf',
          downloadUrl: `/api/reports/financial/download/${report.id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Reporte financiero generado exitosamente',
        data: report
      });
    } catch (error) {
      console.error('Error generando reporte financiero:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Generar reporte de eventos
   */
  async generateEventReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'events', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { startDate, endDate, eventType, status, format = 'json' } = req.query;

      const report = await ReportModel.generateEventReport({
        startDate,
        endDate,
        eventType,
        status
      });

      if (format === 'pdf') {
        return res.status(200).json({
          success: true,
          message: 'Reporte de eventos generado exitosamente',
          data: report,
          format: 'pdf',
          downloadUrl: `/api/reports/events/download/${report.id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Reporte de eventos generado exitosamente',
        data: report
      });
    } catch (error) {
      console.error('Error generando reporte de eventos:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Generar reporte de mantenimiento
   */
  async generateMaintenanceReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'maintenance', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { startDate, endDate, taskType, priority, status, format = 'json' } = req.query;

      const report = await ReportModel.generateMaintenanceReport({
        startDate,
        endDate,
        taskType,
        priority,
        status
      });

      if (format === 'pdf') {
        return res.status(200).json({
          success: true,
          message: 'Reporte de mantenimiento generado exitosamente',
          data: report,
          format: 'pdf',
          downloadUrl: `/api/reports/maintenance/download/${report.id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Reporte de mantenimiento generado exitosamente',
        data: report
      });
    } catch (error) {
      console.error('Error generando reporte de mantenimiento:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Generar reporte de inventario
   */
  async generateInventoryReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'inventory', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { category, supplier, lowStock, format = 'json' } = req.query;

      const report = await ReportModel.generateInventoryReport({
        category,
        supplier,
        lowStock
      });

      if (format === 'pdf') {
        return res.status(200).json({
          success: true,
          message: 'Reporte de inventario generado exitosamente',
          data: report,
          format: 'pdf',
          downloadUrl: `/api/reports/inventory/download/${report.id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Reporte de inventario generado exitosamente',
        data: report
      });
    } catch (error) {
      console.error('Error generando reporte de inventario:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Generar reporte de asistencia
   */
  async generateAttendanceReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { startDate, endDate, memberId, eventId, format = 'json' } = req.query;

      const report = await ReportModel.generateAttendanceReport({
        startDate,
        endDate,
        memberId,
        eventId
      });

      if (format === 'pdf') {
        return res.status(200).json({
          success: true,
          message: 'Reporte de asistencia generado exitosamente',
          data: report,
          format: 'pdf',
          downloadUrl: `/api/reports/attendance/download/${report.id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Reporte de asistencia generado exitosamente',
        data: report
      });
    } catch (error) {
      console.error('Error generando reporte de asistencia:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Generar reporte personalizado
   */
  async generateCustomReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { reportType, filters, columns, format = 'json' } = req.body;

      const report = await ReportModel.generateCustomReport({
        reportType,
        filters,
        columns
      });

      if (format === 'pdf') {
        return res.status(200).json({
          success: true,
          message: 'Reporte personalizado generado exitosamente',
          data: report,
          format: 'pdf',
          downloadUrl: `/api/reports/custom/download/${report.id}`
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Reporte personalizado generado exitosamente',
        data: report
      });
    } catch (error) {
      console.error('Error generando reporte personalizado:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Obtener estadísticas generales
   */
  async getGeneralStatistics(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { period } = req.query;

      const statistics = await ReportModel.getGeneralStatistics(period);

      return res.status(200).json({
        success: true,
        message: 'Estadísticas obtenidas exitosamente',
        data: statistics
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Obtener reportes guardados
   */
  async getSavedReports(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { page = 1, limit = 10, type } = req.query;

      const reports = await ReportModel.getSavedReports({
        page: parseInt(page),
        limit: parseInt(limit),
        type
      });

      return res.status(200).json({
        success: true,
        message: 'Reportes guardados obtenidos exitosamente',
        data: reports
      });
    } catch (error) {
      console.error('Error obteniendo reportes guardados:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Guardar reporte
   */
  async saveReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { name, description, reportType, filters, columns } = req.body;

      const savedReport = await ReportModel.saveReport({
        name,
        description,
        reportType,
        filters,
        columns,
        createdBy: req.user.id
      });

      return res.status(201).json({
        success: true,
        message: 'Reporte guardado exitosamente',
        data: savedReport
      });
    } catch (error) {
      console.error('Error guardando reporte:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Eliminar reporte guardado
   */
  async deleteSavedReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { id } = req.params;

      await ReportModel.deleteSavedReport(id, req.user.id);

      return res.status(200).json({
        success: true,
        message: 'Reporte eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando reporte:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Descargar reporte en PDF
   */
  async downloadReport(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { id } = req.params;

      const pdfBuffer = await ReportModel.generatePDFReport(id);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=report-${id}.pdf`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error descargando reporte:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  },

  /**
   * Exportar reporte a Excel
   */
  async exportToExcel(req, res) {
    try {
      // Verificar permisos
      if (!validatePermissions(req.user, ['admin', 'manager', 'reports'])) {
        return res.status(403).json({
          success: false,
          message: errorCatalog.INSUFFICIENT_PERMISSIONS
        });
      }

      const { reportType, filters } = req.body;

      const excelBuffer = await ReportModel.exportToExcel({
        reportType,
        filters
      });

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename=report-${reportType}-${Date.now()}.xlsx`);
      res.send(excelBuffer);
    } catch (error) {
      console.error('Error exportando a Excel:', error);
      return res.status(500).json({
        success: false,
        message: errorCatalog.INTERNAL_SERVER_ERROR
      });
    }
  }
}; 