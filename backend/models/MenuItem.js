const pool = require('../config/database');

class MenuItem {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.price = data.price;
    this.image = data.image;
    this.category_id = data.category_id;
    this.category_name = data.category_name;
    this.is_available = data.is_available;
    this.preparation_time = data.preparation_time;
    this.calories = data.calories;
    this.allergens = data.allergens;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  // Create new menu item
  static async create(itemData) {
    const { name, description, price, image, categoryId, preparationTime, calories, allergens } = itemData;
    
    const query = `
      INSERT INTO menu_items (name, description, price, image, category_id, preparation_time, calories, allergens)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *, 
        (SELECT name FROM categories WHERE id = $5) as category_name
    `;
    
    const values = [
      name, description, price, image, categoryId, 
      preparationTime, calories, allergens
    ];
    
    const result = await pool.query(query, values);
    return new MenuItem(result.rows[0]);
  }

  // Get all menu items with filtering
  static async findAll(filters = {}) {
    let query = `
      SELECT mi.*, c.name as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.is_available = true
    `;
    
    const values = [];
    let paramCount = 0;

    // Add category filter
    if (filters.category && filters.category !== 'All') {
      paramCount++;
      query += ` AND c.name = $${paramCount}`;
      values.push(filters.category);
    }

    // Add search filter
    if (filters.search) {
      paramCount++;
      query += ` AND (mi.name ILIKE $${paramCount} OR mi.description ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
    }

    // Add price range filter
    if (filters.minPrice) {
      paramCount++;
      query += ` AND mi.price >= $${paramCount}`;
      values.push(filters.minPrice);
    }

    if (filters.maxPrice) {
      paramCount++;
      query += ` AND mi.price <= $${paramCount}`;
      values.push(filters.maxPrice);
    }

    query += ` ORDER BY mi.created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows.map(row => new MenuItem(row));
  }

  // Get menu item by ID
  static async findById(id) {
    const query = `
      SELECT mi.*, c.name as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    return new MenuItem(result.rows[0]);
  }

  // Update menu item
  static async update(id, updateData) {
    const { name, description, price, image, categoryId, preparationTime, calories, allergens, isAvailable } = updateData;
    
    const query = `
      UPDATE menu_items 
      SET name = $1, description = $2, price = $3, image = $4, 
          category_id = $5, preparation_time = $6, calories = $7, 
          allergens = $8, is_available = $9, updated_at = CURRENT_TIMESTAMP
      WHERE id = $10
      RETURNING *, 
        (SELECT name FROM categories WHERE id = $5) as category_name
    `;
    
    const values = [
      name, description, price, image, categoryId,
      preparationTime, calories, allergens, isAvailable, id
    ];
    
    const result = await pool.query(query, values);
    
    if (result.rows.length === 0) return null;
    return new MenuItem(result.rows[0]);
  }

  // Delete menu item
  static async delete(id) {
    const query = 'DELETE FROM menu_items WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);
    
    return result.rows.length > 0;
  }

  // Toggle availability
  static async toggleAvailability(id) {
    const query = `
      UPDATE menu_items 
      SET is_available = NOT is_available, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    return new MenuItem(result.rows[0]);
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
        (SELECT COUNT(*) FROM categories) as total_categories
      FROM menu_items
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Get items by category
  static async findByCategory(categoryId) {
    const query = `
      SELECT mi.*, c.name as category_name
      FROM menu_items mi
      LEFT JOIN categories c ON mi.category_id = c.id
      WHERE mi.category_id = $1 AND mi.is_available = true
      ORDER BY mi.created_at DESC
    `;
    
    const result = await pool.query(query, [categoryId]);
    return result.rows.map(row => new MenuItem(row));
  }
}

module.exports = MenuItem;