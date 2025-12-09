const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(data) {
    this.id = data.user_id || data.id;
    this.first_name = data.first_name;
    this.last_name = data.last_name;
    this.name = `${data.first_name || ''} ${data.last_name || ''}`.trim();
    this.email = data.email;
    this.password = data.pass_word || data.password;
    this.role = data.role || 'customer';
    this.phone = data.phone_number || data.phone;
    this.created_at = data.created_at;
  }

  // Hash password
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Compare password
  static async comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Create new user
  static async create(userData) {
    const { name, email, password, dateOfBirth, gender, phone } = userData;
    
    // Split name into first and last
    const names = name.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';

    const hashedPassword = await this.hashPassword(password);

    const query = `
      INSERT INTO users (first_name, last_name, email, pass_word, phone_number, role)   
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, first_name, last_name, email, phone_number, role
    `;

    // Helper to generate an 11-digit Egyptian-like phone number starting with 010
    const genPhone = () => {
      const suffix = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
      return '010' + suffix; // produces 11-digit number like 01012345678
    };

    // Try to insert, retrying if we get a unique-constraint collision on phone
    const maxAttempts = 5;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const phoneToUse = phone || genPhone();
      const values = [
        firstName,
        lastName,
        email,
        hashedPassword,
        phoneToUse,
        'customer'
      ];

      try {
        const result = await pool.query(query, values);
        return new User(result.rows[0]);
      } catch (err) {
        // If duplicate phone and we generated it, retry with a new generated phone
        if (err.code === '23505' && !phone) {
          if (attempt === maxAttempts - 1) throw err;
          continue; // try again
        }

        // Other errors or provided phone duplicates should be propagated to caller
        throw err;
      }
    }
  }

  // Find user by email
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  // Find user by phone
  static async findByPhone(phone) {
    const query = 'SELECT * FROM users WHERE phone_number = $1';
    const result = await pool.query(query, [phone]);

    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE user_id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  // Update user profile
  static async update(id, updateData) {
    const { name, phone, address, city, zipCode, profileImage } = updateData;
    
    // Split name if provided
    let firstName, lastName;
    if (name) {
      const names = name.split(' ');
      firstName = names[0] || '';
      lastName = names.slice(1).join(' ') || '';
    }

    const query = `
      UPDATE users
      SET 
        ${firstName ? 'first_name = $1,' : ''}
        ${lastName ? 'last_name = $2,' : ''}
        phone_number = $3
      WHERE user_id = $4
      RETURNING user_id, first_name, last_name, email, phone_number, role
    `;

    const values = [firstName, lastName, phone, id].filter(v => v !== undefined);
    const result = await pool.query(query, values);

    if (result.rows.length === 0) return null;
    return new User(result.rows[0]);
  }

  // Update password
  static async updatePassword(id, newPassword) {
    const hashedPassword = await this.hashPassword(newPassword);

    const query = `
      UPDATE users
      SET pass_word = $1
      WHERE user_id = $2
    `;

    await pool.query(query, [hashedPassword, id]);
    return true;
  }

  // Get all users (admin only)
  static async findAll() {
    const query = 'SELECT user_id, first_name, last_name, email, role FROM users ORDER BY user_id';
    const result = await pool.query(query);

    return result.rows.map(row => new User(row));
  }

  // Delete user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE user_id = $1 RETURNING user_id';
    const result = await pool.query(query, [id]);

    return result.rows.length > 0;
  }

  // Get user statistics
  static async getStats() {
    const query = `
      SELECT
        COUNT(*) as total_users,
        COUNT(CASE WHEN role = 'customer' THEN 1 END) as customers,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins
      FROM users
    `;

    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = User;