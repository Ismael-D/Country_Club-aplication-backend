export const validateSchema = (schema) => (req, res, next) => {
  try {
    console.log('🔍 [Validation] Payload recibido:', JSON.stringify(req.body, null, 2))
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map(detail => ({ field: detail.path.join('.'), message: detail.message }));
      console.error('❌ [Validation] Error de validación:', errors)
      return res.status(400).json({ ok: false, msg: 'Validation error', errors });
    }
    req.body = value;
    next();
  } catch (error) {
    console.error('❌ [Validation] Middleware error:', error);
    return res.status(500).json({ ok: false, msg: 'Error interno del servidor' });
  }
};

export const validateBody = validateSchema;
