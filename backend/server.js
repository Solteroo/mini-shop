import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database setup
const dbPath = `${__dirname}/database.sqlite`;
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err);
  else console.log('Connected to SQLite database');
});

// Initialize database tables
const initializeDatabase = () => {
  db.serialize(() => {
    // Products table
    db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        description TEXT,
        image TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        items TEXT NOT NULL,
        totalPrice REAL NOT NULL,
        customerName TEXT,
        customerEmail TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default products if empty
    db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
      if (!err && row.count === 0) {
        const defaultProducts = [
          { name: 'Laptop', price: 1200, description: 'High-performance laptop', image: 'https://via.placeholder.com/300x200?text=Laptop' },
          { name: 'Phone', price: 800, description: 'Latest smartphone', image: 'https://via.placeholder.com/300x200?text=Phone' },
          { name: 'Headphones', price: 150, description: 'Noise-cancelling headphones', image: 'https://via.placeholder.com/300x200?text=Headphones' },
          { name: 'Tablet', price: 600, description: 'Portable tablet device', image: 'https://via.placeholder.com/300x200?text=Tablet' },
          { name: 'Smartwatch', price: 250, description: 'Smart wearable device', image: 'https://via.placeholder.com/300x200?text=Smartwatch' },
          { name: 'Camera', price: 900, description: 'Digital camera', image: 'https://via.placeholder.com/300x200?text=Camera' }
        ];

        defaultProducts.forEach(product => {
          db.run(
            'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)',
            [product.name, product.price, product.description, product.image],
            (err) => {
              if (err) console.error('Error inserting product:', err);
            }
          );
        });
      }
    });
  });
};

initializeDatabase();

// Routes

// GET all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.json(rows || []);
  });
});

// GET single product
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(row);
  });
});

// POST new product (Admin)
app.post('/api/products', (req, res) => {
  const { name, price, description, image } = req.body;

  // Validation
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Product name is required' });
  }
  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  const finalName = name.trim();
  const finalPrice = parseFloat(price);
  const finalDescription = description ? description.trim() : '';
  const finalImage = image ? image.trim() : 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(finalName);

  db.run(
    'INSERT INTO products (name, price, description, image) VALUES (?, ?, ?, ?)',
    [finalName, finalPrice, finalDescription, finalImage],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        name: finalName,
        price: finalPrice,
        description: finalDescription,
        image: finalImage
      });
    }
  );
});

// DELETE product (Admin)
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ error: 'Invalid product ID' });
  }

  db.run('DELETE FROM products WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  });
});

// POST new order
app.post('/api/orders', (req, res) => {
  const { items, totalPrice, customerName, customerEmail } = req.body;

  // Validation
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order must contain items' });
  }
  if (!totalPrice || isNaN(totalPrice) || parseFloat(totalPrice) <= 0) {
    return res.status(400).json({ error: 'Valid total price is required' });
  }
  if (!customerName || typeof customerName !== 'string' || customerName.trim() === '') {
    return res.status(400).json({ error: 'Customer name is required' });
  }
  if (!customerEmail || typeof customerEmail !== 'string' || !customerEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid customer email is required' });
  }

  const itemsJson = JSON.stringify(items);
  const finalPrice = parseFloat(totalPrice);
  const finalName = customerName.trim();
  const finalEmail = customerEmail.trim();

  db.run(
    'INSERT INTO orders (items, totalPrice, customerName, customerEmail) VALUES (?, ?, ?, ?)',
    [itemsJson, finalPrice, finalName, finalEmail],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Database error', details: err.message });
      }
      res.status(201).json({
        id: this.lastID,
        items: items,
        totalPrice: finalPrice,
        customerName: finalName,
        customerEmail: finalEmail,
        message: 'Order placed successfully'
      });
    }
  );
});

// GET all orders (Admin)
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders ORDER BY createdAt DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    const orders = rows ? rows.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    })) : [];
    res.json(orders);
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
  console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💾 Database: ${dbPath}`);
});
