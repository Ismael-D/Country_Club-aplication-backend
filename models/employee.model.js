import { db } from '../database/connection.database.js'

const EmployeeModel = {
  async create(data) {
    const query = `INSERT INTO employees (first_name, last_name, DNI, hire_date, position, salary, emergency_contact_name, emergency_contact_phone, phone)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`;
    const values = [
      data.first_name,
      data.last_name,
      data.DNI,
      data.hire_date,
      data.position,
      data.salary,
      data.emergency_contact_name,
      data.emergency_contact_phone,
      data.phone
    ];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async findAll({ search, position, page = 1, limit = 10 }) {
    let query = 'SELECT * FROM employees';
    const values = [];
    const conditions = [];
    if (search) {
      conditions.push('(first_name ILIKE $' + (values.length + 1) + ' OR last_name ILIKE $' + (values.length + 1) + ' OR CAST(DNI AS TEXT) ILIKE $' + (values.length + 1) + ')');
      values.push(`%${search}%`);
    }
    if (position) {
      conditions.push('position = $' + (values.length + 1));
      values.push(position);
    }
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    query += ' ORDER BY id DESC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(limit, (page - 1) * limit);
    const result = await db.query(query, values);
    return result.rows;
  },

  async findById(id) {
    const query = 'SELECT * FROM employees WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async update(id, data) {
    const fields = [];
    const values = [];
    let idx = 1;
    for (const key of [
      'first_name','last_name','DNI','hire_date','position','salary','emergency_contact_name','emergency_contact_phone','phone']) {
      if (data[key] !== undefined) {
        fields.push(`${key} = $${idx}`);
        values.push(data[key]);
        idx++;
      }
    }
    if (fields.length === 0) return null;
    const query = `UPDATE employees SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
    values.push(id);
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async remove(id) {
    const query = 'DELETE FROM employees WHERE id = $1 RETURNING *';
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async getMaintenanceTasks(employeeId) {
    const query = `SELECT * FROM maintenance_tasks WHERE assigned_to = $1 ORDER BY scheduled_date DESC`;
    const result = await db.query(query, [employeeId]);
    return result.rows;
  }
};

export default EmployeeModel; 