const pool = require('../config/database');

class Order {
  constructor(data) {
    this.id = data.id;
    this.order_number = data.order_number;
    this.user_id = data.user_id;
    this.total_amount = data.total_amount;
    this.status = data.status;
    this.payment_method = data.payment_method;
    this.payment_status = data.payment_status;
    this.delivery_address = data.delivery_address;
    this.delivery_city = data.delivery_city;
    this.delivery_zip = data.delivery_zip;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.items = data.items || [];
    this.user = data.user || null;
  }

  // Generate unique order number
  static generateOrderNumber() {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp.slice(-6)}-${random}`;
  }

  // Create new order
  static async create(orderData) {
    const {
      userId,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      deliveryCity,
      deliveryZip,
      notes,
      items
    } = orderData;

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Create order
      const orderQuery = `
        INSERT INTO orders (order_number, user_id, total_amount, payment_method, 
                          delivery_address, delivery_city, delivery_zip, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;
      
      const orderNumber = this.generateOrderNumber();
      const orderValues = [
        orderNumber, userId, totalAmount, paymentMethod,
        deliveryAddress, deliveryCity, deliveryZip, notes
      ];
      
      const orderResult = await client.query(orderQuery, orderValues);
      const order = orderResult.rows[0];
      
      // Create order items
      const itemQuery = `
        INSERT INTO order_items (order_id, menu_item_id, quantity, price)
        VALUES ($1, $2, $3, $4)
      `;
      
      for (const item of items) {
        await client.query(itemQuery, [
          order.id, item.id, item.quantity, item.price
        ]);
      }
      
      await client.query('COMMIT');
      
      // Fetch complete order with items
      const completeOrder = await this.findById(order.id);
      return completeOrder;
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get order by ID
  static async findById(id) {
    const query = `
      SELECT o.*, 
             u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = $1
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    
    const order = new Order(result.rows[0]);
    order.user = {
      name: result.rows[0].user_name,
      email: result.rows[0].user_email,
      phone: result.rows[0].user_phone
    };
    
    // Get order items
    const itemsQuery = `
      SELECT oi.*, mi.name, mi.image, mi.description
      FROM order_items oi
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = $1
    `;
    
    const itemsResult = await pool.query(itemsQuery, [id]);
    order.items = itemsResult.rows;
    
    return order;
  }

  // Get orders by user ID
  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT o.*, 
             u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.user_id = $1
    `;
    
    const values = [userId];
    let paramCount = 1;

    // Add status filter
    if (filters.status && filters.status !== 'all') {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      values.push(filters.status);
    }

    // Add date range filter
    if (filters.startDate) {
      paramCount++;
      query += ` AND o.created_at >= $${paramCount}`;
      values.push(filters.startDate);
    }

    if (filters.endDate) {
      paramCount++;
      query += ` AND o.created_at <= $${paramCount}`;
      values.push(filters.endDate);
    }

    query += ` ORDER BY o.created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows.map(row => new Order(row));
  }

  // Get all orders (admin)
  static async findAll(filters = {}) {
    let query = `
      SELECT o.*, 
             u.name as user_name, u.email as user_email
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE 1=1
    `;
    
    const values = [];
    let paramCount = 0;

    // Add status filter
    if (filters.status && filters.status !== 'all') {
      paramCount++;
      query += ` AND o.status = $${paramCount}`;
      values.push(filters.status);
    }

    // Add search filter
    if (filters.search) {
      paramCount++;
      query += ` AND (o.order_number ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`;
      values.push(`%${filters.search}%`);
    }

    query += ` ORDER BY o.created_at DESC`;

    const result = await pool.query(query, values);
    return result.rows.map(row => new Order(row));
  }

  // Update order status
  static async updateStatus(id, status) {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [status, id]);
    
    if (result.rows.length === 0) return null;
    return new Order(result.rows[0]);
  }

  // Update payment status
  static async updatePaymentStatus(id, paymentStatus) {
    const query = `
      UPDATE orders 
      SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    
    const result = await pool.query(query, [paymentStatus, id]);
    
    if (result.rows.length === 0) return null;
    return new Order(result.rows[0]);
  }

  // Get order statistics
  static async getStats() {
    const query = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready_orders,
        COUNT(CASE WHEN status = 'on the way' THEN 1 END) as on_the_way_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_order_value,
        COUNT(CASE WHEN DATE(created_at) = CURRENT_DATE THEN 1 END) as orders_today
      FROM orders
    `;
    
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Cancel order
  static async cancel(id) {
    const query = `
      UPDATE orders 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status IN ('pending', 'ready')
      RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) return null;
    return new Order(result.rows[0]);
  }
}

module.exports = Order;