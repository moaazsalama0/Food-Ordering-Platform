const pool = require('../config/database');

class Order {
  constructor(data) {
    this.order_id = data.order_id;
    this.user_id = data.user_id;
    this.add_id = data.add_id;
    this.subtotal = data.subtotal;
    this.delivery_fee = data.delivery_fee;
    this.total_amount = data.total_amount;
    this.current_status = data.current_status;
    this.placed_at = data.placed_at;
    this.estimated_delivery = data.estimated_delivery;
    this.items = data.items || [];
    this.user = data.user || null;
  }

  // Create new order
  static async create(orderData) {
    const {
      userId,
      addId,
      subtotal,
      deliveryFee,
      totalAmount,
      items
    } = orderData;

    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const orderQuery = `
        INSERT INTO orders (user_id, add_id, subtotal, delivery_fee, total_amount, current_status)
        VALUES ($1, $2, $3, $4, $5, 'pending')
        RETURNING *
      `;

      const orderValues = [
        userId, addId, subtotal, deliveryFee, totalAmount
      ];

      const orderResult = await client.query(orderQuery, orderValues);
      const order = orderResult.rows[0];

      const itemQuery = `
        INSERT INTO order_item (order_id, dish_id, quantity, unit_price)
        VALUES ($1, $2, $3, $4)
      `;

      for (const item of items) {
        await client.query(itemQuery, [
          order.order_id, item.dish_id, item.quantity, item.unit_price
        ]);
      }

      await client.query('COMMIT');
      return await this.findById(order.order_id);

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Get a single order by ID
  static async findById(id) {
    const query = `
      SELECT o.*, u.first_name, u.last_name, u.email, u.phone_number
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = $1
    `;

    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;

    const order = new Order(result.rows[0]);
    order.user = {
      first_name: result.rows[0].first_name,
      last_name: result.rows[0].last_name,
      email: result.rows[0].email,
      phone_number: result.rows[0].phone_number
    };

    const itemsQuery = `
      SELECT oi.*, d.dish_name, d.img, d.dish_description
      FROM order_item oi
      LEFT JOIN dish d ON oi.dish_id = d.dish_id
      WHERE oi.order_id = $1
    `;

    const itemsResult = await pool.query(itemsQuery, [id]);
    order.items = itemsResult.rows;

    return order;
  }

  // Get all orders for 1 user
  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT o.*, u.first_name, u.last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE o.user_id = $1
    `;

    const values = [userId];
    let param = 1;

    if (filters.status && filters.status !== 'all') {
      param++;
      query += ` AND o.current_status = $${param}`;
      values.push(filters.status);
    }

    if (filters.startDate) {
      param++;
      query += ` AND o.placed_at >= $${param}`;
      values.push(filters.startDate);
    }

    if (filters.endDate) {
      param++;
      query += ` AND o.placed_at <= $${param}`;
      values.push(filters.endDate);
    }

    query += ` ORDER BY o.placed_at DESC`;

    const result = await pool.query(query, values);
    return result.rows.map(row => new Order(row));
  }

  // ADMIN - Get all orders
  static async findAll(filters = {}) {
    let query = `
      SELECT o.*, u.first_name, u.last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE 1=1
    `;

    const values = [];
    let param = 0;

    if (filters.status && filters.status !== 'all') {
      param++;
      query += ` AND o.current_status = $${param}`;
      values.push(filters.status);
    }

    if (filters.search) {
      param++;
      query += ` AND (CAST(o.order_id AS TEXT) ILIKE $${param} OR u.first_name ILIKE $${param})`;
      values.push(`%${filters.search}%`);
    }

    query += ` ORDER BY o.placed_at DESC`;

    const result = await pool.query(query, values);
    return result.rows.map(row => new Order(row));
  }

  // Update order delivery status
  static async updateStatus(id, status) {
    const query = `
      UPDATE orders
      SET current_status = $1
      WHERE order_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, id]);
    if (result.rows.length === 0) return null;
    return new Order(result.rows[0]);
  }

  // Update order payment status (Payment table is separate)
  static async updatePaymentStatus(id, paymentStatus) {
    const query = `
      UPDATE payment
      SET status_pay = $1
      WHERE order_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [paymentStatus, id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  // Cancel Order
  static async cancel(id) {
    const query = `
      UPDATE orders
      SET current_status = 'cancelled'
      WHERE order_id = $1 AND current_status IN ('pending', 'ready')
      RETURNING *
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return new Order(result.rows[0]);
  }

  // ADMIN statistics
  static async getStats() {
    const query = `
      SELECT
        COUNT(*) AS total_orders,
        COUNT(CASE WHEN current_status = 'pending' THEN 1 END) AS pending,
        COUNT(CASE WHEN current_status = 'ready' THEN 1 END) AS ready,
        COUNT(CASE WHEN current_status = 'on the way' THEN 1 END) AS on_the_way,
        COUNT(CASE WHEN current_status = 'delivered' THEN 1 END) AS delivered,
        COUNT(CASE WHEN current_status = 'cancelled' THEN 1 END) AS cancelled,
        SUM(total_amount) AS total_revenue,
        AVG(total_amount) AS avg_order_value
      FROM orders
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

module.exports = Order;
