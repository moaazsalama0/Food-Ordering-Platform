const express = require('express');
const { auth, optionalAuth } = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Get cart items (requires authentication)
router.get('/', auth, async (req, res) => {
  try {
    // For authenticated users, you might want to store cart in database
    // For now, we'll return an empty cart or use session/localStorage on frontend
    
    res.json({
      success: true,
      data: {
        items: [],
        total: 0,
        itemCount: 0
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cart'
    });
  }
});

// Add item to cart
router.post('/add', optionalAuth, async (req, res) => {
  try {
    const { itemId, quantity = 1 } = req.body;

    if (!itemId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item ID or quantity'
      });
    }

    // Get menu item details
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    if (!menuItem.is_available) {
      return res.status(400).json({
        success: false,
        message: 'Menu item is not available'
      });
    }

    // For authenticated users, you might want to store in database
    // For now, we'll return the item data for frontend to handle
    
    const cartItem = {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      category: menuItem.category_name,
      quantity: parseInt(quantity),
      subtotal: menuItem.price * quantity
    };

    res.json({
      success: true,
      message: 'Item added to cart',
      data: cartItem
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding item to cart'
    });
  }
});

// Remove item from cart
router.delete('/remove/:itemId', optionalAuth, async (req, res) => {
  try {
    const { itemId } = req.params;

    // For authenticated users, remove from database
    // For now, just return success for frontend to handle

    res.json({
      success: true,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while removing item from cart'
    });
  }
});

// Update item quantity in cart
router.put('/update/:itemId', optionalAuth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid quantity'
      });
    }

    // Get menu item details
    const menuItem = await MenuItem.findById(itemId);
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    const cartItem = {
      id: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      category: menuItem.category_name,
      quantity: parseInt(quantity),
      subtotal: menuItem.price * quantity
    };

    res.json({
      success: true,
      message: 'Cart item updated',
      data: cartItem
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cart'
    });
  }
});

// Clear cart
router.delete('/clear', optionalAuth, async (req, res) => {
  try {
    // For authenticated users, clear from database
    // For now, just return success for frontend to handle

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while clearing cart'
    });
  }
});

// Calculate cart totals
router.post('/calculate-totals', async (req, res) => {
  try {
    const { items, couponCode } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid cart items'
      });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    // Apply coupon if valid
    let discount = 0;
    if (couponCode) {
      const validCoupons = {
        'FOOD10': 10,
        'SAVE20': 20,
        'WELCOME15': 15
      };

      if (validCoupons[couponCode.toUpperCase()]) {
        discount = (subtotal * validCoupons[couponCode.toUpperCase()]) / 100;
      }
    }

    // Calculate delivery fee
    const deliveryFee = subtotal > 50 ? 0 : 5.99;

    // Calculate tax (8%)
    const tax = (subtotal - discount) * 0.08;

    // Calculate total
    const total = subtotal - discount + deliveryFee + tax;

    res.json({
      success: true,
      data: {
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        deliveryFee: Math.round(deliveryFee * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
      }
    });
  } catch (error) {
    console.error('Calculate totals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while calculating totals'
    });
  }
});

module.exports = router;