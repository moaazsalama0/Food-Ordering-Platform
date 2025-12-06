const request = require('supertest');
const app = require('../server');

describe('API Tests', () => {
  // Test health check endpoint
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const res = await request(app)
        .get('/api/health')
        .expect(200);

      expect(res.body.status).toBe('OK');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // Test menu endpoints
  describe('Menu API', () => {
    it('should get all menu items', async () => {
      const res = await request(app)
        .get('/api/menu')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should get menu items with search filter', async () => {
      const res = await request(app)
        .get('/api/menu?search=burger')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('data');
    });
  });

  // Test authentication endpoints
  describe('Auth API', () => {
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      dateOfBirth: '1990-01-01',
      gender: 'male'
    };

    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(testUser.email);
    });

    it('should not register duplicate user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('token');
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  // Test cart calculation
  describe('Cart API', () => {
    it('should calculate cart totals correctly', async () => {
      const cartItems = [
        { id: 1, name: 'Burger', price: 12.99, quantity: 2 },
        { id: 2, name: 'Pizza', price: 14.99, quantity: 1 }
      ];

      const res = await request(app)
        .post('/api/cart/calculate-totals')
        .send({ items: cartItems })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.subtotal).toBe(40.97);
      expect(res.body.data.deliveryFee).toBe(5.99);
      expect(res.body.data).toHaveProperty('total');
    });

    it('should apply coupon discount correctly', async () => {
      const cartItems = [
        { id: 1, name: 'Burger', price: 12.99, quantity: 2 }
      ];

      const res = await request(app)
        .post('/api/cart/calculate-totals')
        .send({ 
          items: cartItems, 
          couponCode: 'FOOD10' 
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.discount).toBe(2.6); // 10% of 25.98
    });
  });

  // Test 404 handler
  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await request(app)
        .get('/api/unknown-route')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });
});

// Close the server after tests
afterAll((done) => {
  app.close(done);
});