const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Public
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ 'orderInfo.orderDate': -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { customer, orderInfo } = req.body;

    const order = new Order({
      customer,
      orderInfo
    });

    const createdOrder = await order.save();

    // Emit WebSocket event
    const io = req.app.get('io');
    if (io) {
      io.emit('new-order', createdOrder);
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Public
exports.updateOrder = async (req, res) => {
  try {
    const { customer, orderInfo } = req.body;

    let order = await Order.findById(req.params.id);

    if (order) {
      order.customer = customer || order.customer;
      order.orderInfo = orderInfo || order.orderInfo;

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Public
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const orderId = order._id;
      await order.deleteOne();

      // Emit WebSocket event
      const io = req.app.get('io');
      if (io) {
        io.emit('order-deleted', orderId);
      }

      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
