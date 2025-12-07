const pool = require('../config/database');

class MenuItem {
  constructor(data) {
    // Map SQL columns to expected frontend format
    this.id = data.dish_id;
    this.name = data.dish_name;
    this.description = data.dish_description;
    this.price = parseFloat(data.price);
    this.img = data.img; // Frontend expects 'img' not 'image'
    this.category_id = data.category_id;
    this.category_name = data.category_name;
    this.is_available = data.is_available;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Get all menu items with filtering
  static async findAll(filters = {}) {
    let query = `
      SELECT d.dish_id, d.dish_name, d.dish_description, d.price, d.img, 
             d.category_id, d.is_available, c.category_name
      FROM dish d
      LEFT JOIN category c ON d.category_id = c.category_id
      WHERE d.is_available = true
    `;
    
    const values = [];
    let paramCount = 0;

    // Add category filter
    if (filters.category && filters.category !== 'All') {
      paramCount++;
      query += ` AND c.category_name = $${paramCount}`;
      values.push(filters.category);
    }

    // Add search filter
    if (filters.search) {
      paramCount++;
      query += ` AND (d.dish_name ILIKE $${paramCount} OR d.dish_description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
    }

    // Add price range filter
    if (filters.minPrice) {
      paramCount++;
      query += ` AND d.price >= $${paramCount}`;
      values.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      paramCount++;
      query += ` AND d.price <= $${paramCount}`;
      values.push(filters.maxPrice);
    }

    query += ` ORDER BY d.dish_id`;

    try {
      const result = await pool.query(query, values);
      return result.rows.map(row => new MenuItem(row));
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Get menu item by ID
  static async findById(id) {
    const query = `
      SELECT d.dish_id, d.dish_name, d.dish_description, d.price, d.img,
             d.category_id, d.is_available, c.category_name
      FROM dish d
      LEFT JOIN category c ON d.category_id = c.category_id
      WHERE d.dish_id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) return null;
      return new MenuItem(result.rows[0]);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Create new menu item
  static async create(itemData) {
    const { name, description, price, image, categoryId } = itemData;
    
    const query = `
      INSERT INTO dish (category_id, dish_name, dish_description, price, img, is_available)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING dish_id, dish_name, dish_description, price, img, category_id, is_available,
        (SELECT category_name FROM category WHERE category_id = $1) as category_name
    `;
    
    const values = [categoryId, name, description, price, image, true];
    
    try {
      const result = await pool.query(query, values);
      return new MenuItem(result.rows[0]);
    } catch (error) {
      console.error('Database insert error:', error);
      throw error;
    }
  }

  // Update menu item
  static async update(id, updateData) {
    const { name, description, price, image, categoryId, isAvailable } = updateData;
    
    const query = `
      UPDATE dish 
      SET dish_name = $1, dish_description = $2, price = $3, img = $4, 
          category_id = $5, is_available = $6
      WHERE dish_id = $7
      RETURNING dish_id, dish_name, dish_description, price, img, category_id, is_available,
        (SELECT category_name FROM category WHERE category_id = $5) as category_name
    `;
    
    const values = [name, description, price, image, categoryId, isAvailable !== undefined ? isAvailable : true, id];
    
    try {
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) return null;
      return new MenuItem(result.rows[0]);
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  // Delete menu item
  static async delete(id) {
    const query = 'DELETE FROM dish WHERE dish_id = $1 RETURNING dish_id';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Database delete error:', error);
      throw error;
    }
  }

  // Toggle availability
  static async toggleAvailability(id) {
    const query = `
      UPDATE dish 
      SET is_available = NOT is_available
      WHERE dish_id = $1
      RETURNING dish_id, dish_name, dish_description, price, img, 
                category_id, is_available
    `;
    
    try {
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) return null;
      return new MenuItem(result.rows[0]);
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }

  // Get menu statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_items,
        COUNT(CASE WHEN is_available = true THEN 1 END) as available_items,
        AVG(price) as avg_price,
        MIN(price) as min_price,
        MAX(price) as max_price,
        (SELECT COUNT(*) FROM category) as total_categories
      FROM dish
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows[0];
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // Get items by category
  static async findByCategory(categoryId) {
    const query = `
      SELECT d.dish_id, d.dish_name, d.dish_description, d.price, d.img,
             d.category_id, d.is_available, c.category_name
      FROM dish d
      LEFT JOIN category c ON d.category_id = c.category_id
      WHERE d.category_id = $1 AND d.is_available = true
      ORDER BY d.dish_id
    `;
    
    try {
      const result = await pool.query(query, [categoryId]);
      return result.rows.map(row => new MenuItem(row));
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }
}

module.exports = MenuItem;