const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Validation for creating an order
const orderValidation = [
  body('addId').isInt().withMessage('Address ID is required'),
  body('subtotal').isFloat({ min: 0 }).withMessage('Subtotal must be number'),
  body('deliveryFee').isFloat({ min: 0 }).withMessage('Delivery fee must be number'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total must be number'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
];

// CREATE ORDER
router.post('/', auth, orderValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      addId,
      subtotal,
      deliveryFee,
      totalAmount,
      items
    } = req.body;

    const order = await Order.create({
      userId: req.user.id,
      addId,
      subtotal,
      deliveryFee,
      totalAmount,
      items
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// GET logged user's orders
router.get('/my-orders', auth, async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    const filters = {
      status: status || 'all',
      startDate: startDate || null,
      endDate: endDate || null
    };

    const orders = await Order.findByUserId(req.user.id, filters);

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// GET single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// CANCEL ORDER
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!['pending', 'ready'].includes(order.current_status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled in current status'
      });
    }

    const cancelledOrder = await Order.cancel(req.params.id);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: cancelledOrder
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all orders (admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const { status, search } = req.query;

    const filters = {
      status: status || 'all',
      search: search || ''
    };

    const orders = await Order.findAll(filters);

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// Update order status (admin only)
router.patch('/admin/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['pending', 'ready', 'on the way', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.updateStatus(req.params.id, status);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating status'
    });
  }
});

// Update payment status (admin only)
router.patch('/admin/:id/payment-status', adminAuth, async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    if (!['pending', 'completed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    const order = await Order.updatePaymentStatus(req.params.id, paymentStatus);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: order
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status'
    });
  }
});

// Get statistics (admin only)
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Order.getStats();

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    });
  }
});

module.exports = router;
