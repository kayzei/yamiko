import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('yamiko.db');
const JWT_SECRET = process.env.JWT_SECRET || 'yamiko_secret_key_2026';

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer'
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT NOT NULL,
    stock INTEGER DEFAULT 0,
    images TEXT, -- JSON string array
    sizes TEXT,  -- JSON string array
    colors TEXT, -- JSON string array
    is_featured INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    status TEXT DEFAULT 'pending',
    total_price REAL NOT NULL,
    payment_status TEXT DEFAULT 'unpaid',
    payment_method TEXT,
    delivery_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER,
    user_id INTEGER,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL, -- 'low_stock'
    message TEXT NOT NULL,
    product_id INTEGER,
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed initial products if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, category, stock, images, sizes, colors, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const products = [
    ['Silk Evening Gown', 'Elegant silk gown for special occasions.', 1200, 'Fashion', 10, JSON.stringify(['https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800']), JSON.stringify(['S', 'M', 'L']), JSON.stringify(['Gold', 'Rose']), 1],
    ['Stiletto Heels', 'Luxury gold-accented heels.', 850, 'Shoes', 15, JSON.stringify(['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800']), JSON.stringify(['37', '38', '39']), JSON.stringify(['Gold', 'Black']), 1],
    ['Glamour Makeup Kit', 'Complete professional makeup set.', 450, 'Beauty', 20, JSON.stringify(['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=800']), JSON.stringify([]), JSON.stringify([]), 0],
    ['Brazilian Wave Wig', 'High-quality human hair wig.', 2500, 'Hair', 5, JSON.stringify(['https://images.unsplash.com/photo-1595475243692-392820991677?auto=format&fit=crop&q=80&w=800']), JSON.stringify(['12"', '14"', '16"']), JSON.stringify(['Natural Black']), 1],
    ['Designer Handbag', 'Premium leather handbag.', 1500, 'Accessories', 8, JSON.stringify(['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=800']), JSON.stringify([]), JSON.stringify(['Pink', 'Tan']), 0],
  ];

  products.forEach(p => insertProduct.run(...p));
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // --- API Routes ---

  // Auth
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = db.prepare('INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)').run(name, email, hashedPassword, phone);
      const token = jwt.sign({ id: result.lastInsertRowid, email, role: 'customer' }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, name, email, role: 'customer' } });
    } catch (e) {
      res.status(400).json({ error: 'Email already exists' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any;
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // Products
  app.get('/api/products', (req, res) => {
    const { category, featured } = req.query;
    let query = 'SELECT * FROM products';
    const params: any[] = [];

    if (category || featured) {
      query += ' WHERE';
      if (category) {
        query += ' category = ?';
        params.push(category);
      }
      if (featured) {
        if (category) query += ' AND';
        query += ' is_featured = 1';
      }
    }

    const products = db.prepare(query).all(...params).map((p: any) => ({
      ...p,
      images: JSON.parse(p.images),
      sizes: JSON.parse(p.sizes),
      colors: JSON.parse(p.colors)
    }));
    res.json(products);
  });

  app.get('/api/products/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id) as any;
    if (product) {
      res.json({
        ...product,
        images: JSON.parse(product.images),
        sizes: JSON.parse(product.sizes),
        colors: JSON.parse(product.colors)
      });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });

  // Orders
  app.post('/api/orders', (req, res) => {
    const { userId, items, totalPrice, paymentMethod, address } = req.body;
    const transaction = db.transaction(() => {
      const orderResult = db.prepare(`
        INSERT INTO orders (user_id, total_price, payment_method, delivery_address)
        VALUES (?, ?, ?, ?)
      `).run(userId, totalPrice, paymentMethod, address);

      const orderId = orderResult.lastInsertRowid;
      const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `);

      for (const item of items) {
        insertItem.run(orderId, item.id, item.quantity, item.price);
        
        // Update stock
        db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?').run(item.quantity, item.id);
        
        // Check for low stock alert
        const product = db.prepare('SELECT name, stock FROM products WHERE id = ?').get(item.id) as any;
        if (product && product.stock <= 5) {
          db.prepare('INSERT INTO alerts (type, message, product_id) VALUES (?, ?, ?)').run(
            'low_stock',
            `Low stock alert: ${product.name} has only ${product.stock} units left.`,
            item.id
          );
        }
      }

      return orderId;
    });

    try {
      const orderId = transaction();
      res.json({ orderId, status: 'success' });
    } catch (e) {
      res.status(500).json({ error: 'Order failed' });
    }
  });

  // Admin Analytics
  app.get('/api/admin/stats', (req, res) => {
    const totalSales = db.prepare('SELECT SUM(total_price) as total FROM orders WHERE payment_status = "paid"').get() as any;
    const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as any;
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as any;
    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 5').all();
    const alerts = db.prepare('SELECT * FROM alerts WHERE is_read = 0 ORDER BY created_at DESC').all();

    res.json({
      totalSales: totalSales.total || 0,
      orderCount: orderCount.count,
      productCount: productCount.count,
      recentOrders,
      alerts
    });
  });

  app.post('/api/admin/alerts/read', (req, res) => {
    const { id } = req.body;
    db.prepare('UPDATE alerts SET is_read = 1 WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Yamiko Fashions Server running on http://localhost:${PORT}`);
  });
}

startServer();
