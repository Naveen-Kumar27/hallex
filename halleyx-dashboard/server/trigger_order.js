require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

// This script simulates a new order being created to trigger the WebSocket notification
// usage: node trigger_order.js

const triggerOrder = async () => {
    try {
        console.log('🚀 Triggering a mock order to test WebSockets...');
        
        // We use axios to post to our own API, which will then emit the socket event
        // Note: Since we secured the routes, we would normally need a token.
        // For a simple demo, we can either:
        // A) Use the database model directly (bypass API)
        // B) Use a hardcoded token
        
        // Let's go with (A) to keep it simple and internal
        const connectDB = require('./src/config/db');
        const Order = require('./src/models/Order');
        const { Server } = require('socket.io');
        const http = require('http');
        
        await connectDB();
        
        const mockOrder = {
            customer: {
                name: "Real-time Tester",
                email: "test@socket.io"
            },
            orderInfo: {
                totalAmount: (Math.random() * 500 + 50).toFixed(2),
                orderDate: new Date(),
                status: "Completed",
                items: [
                    { name: "WebSocket Token", quantity: 1, price: 99.99 }
                ]
            }
        };

        // Note: This script won't have access to the running 'io' instance of the dev server
        // unless it's integrated into the server or we use a separate emitter.
        // INSTEAD: Let's just instruct the user to use the 'Create Order' button in the UI
        // or provide a simple CURL command if they have a token.
        
        console.log('Actually, the easiest way to test is to use the "Create Order" modal in your dashboard!');
        console.log('1. Log in to http://localhost:3000');
        console.log('2. Go to the Orders page.');
        console.log('3. Click "Add New Order".');
        console.log('4. Watch for the toast notification in the top right!');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

triggerOrder();
