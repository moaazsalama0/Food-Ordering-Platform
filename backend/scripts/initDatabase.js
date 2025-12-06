const pool = require('../config/database');

// Initialize database tables
const initDatabase = async () => {
  try {
    console.log('🚀 Initializing database...');

    // Create ENUM types
    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('customer', 'admin');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE order_status AS ENUM ('pending', 'ready', 'on the way', 'delivered', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE payment_method AS ENUM ('card', 'cash');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await pool.query(`
      DO $$ BEGIN
        CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'refunded');
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role DEFAULT 'customer',
        date_of_birth DATE,
        gender VARCHAR(10),
        phone VARCHAR(20),
        address TEXT,
        city VARCHAR(100),
        zip_code VARCHAR(20),
        profile_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create categories table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create menu_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image TEXT,
        category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
        is_available BOOLEAN DEFAULT true,
        preparation_time INTEGER,
        calories INTEGER,
        allergens TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create orders table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_number VARCHAR(50) UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        total_amount DECIMAL(10,2) NOT NULL,
        status order_status DEFAULT 'pending',
        payment_method payment_method NOT NULL,
        payment_status payment_status DEFAULT 'pending',
        delivery_address TEXT NOT NULL,
        delivery_city VARCHAR(100) NOT NULL,
        delivery_zip VARCHAR(20) NOT NULL,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create order_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        price DECIMAL(10,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create updated_at trigger function
    await pool.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Create triggers for updated_at
    const tables = ['users', 'categories', 'menu_items', 'orders'];
    for (const table of tables) {
      await pool.query(`
        CREATE TRIGGER update_${table}_updated_at BEFORE UPDATE
        ON ${table} FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
      `);
    }

    // Insert default categories
    await pool.query(`
      INSERT INTO categories (name, description, image) VALUES
      ('Burgers', 'Delicious burgers made with fresh ingredients', 'burger-category.jpg'),
      ('Pizza', 'Authentic Italian pizzas with various toppings', 'pizza-category.jpg'),
      ('Desserts', 'Sweet treats to satisfy your cravings', 'dessert-category.jpg'),
      ('Beverages', 'Refreshing drinks to complement your meal', 'beverage-category.jpg'),
      ('Salads', 'Healthy and fresh salads', 'salad-category.jpg'),
      ('Sides', 'Perfect accompaniments to your main course', 'sides-category.jpg')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Insert sample menu items
    await pool.query(`
      INSERT INTO menu_items (name, description, price, image, category_id, preparation_time, calories) VALUES
      ('Classic Burger', 'Juicy beef patty with lettuce, tomato, and our special sauce', 12.99, 'classic-burger.jpg', 1, 15, 650),
      ('Cheese Deluxe', 'Premium beef patty with cheddar cheese, bacon, and caramelized onions', 15.99, 'cheese-deluxe.jpg', 1, 18, 780),
      ('Margherita Pizza', 'Fresh mozzarella, tomato sauce, and basil on thin crust', 14.99, 'margherita-pizza.jpg', 2, 20, 820),
      ('Pepperoni Pizza', 'Classic pepperoni with mozzarella cheese and tomato sauce', 16.99, 'pepperoni-pizza.jpg', 2, 20, 950),
      ('Chocolate Lava Cake', 'Warm chocolate cake with molten center, served with vanilla ice cream', 8.99, 'chocolate-lava.jpg', 3, 10, 420),
      ('Tiramisu', 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone', 7.99, 'tiramisu.jpg', 3, 5, 320),
      ('Caesar Salad', 'Crisp romaine lettuce with parmesan, croutons, and caesar dressing', 9.99, 'caesar-salad.jpg', 5, 8, 280),
      ('Garlic Fries', 'Crispy fries tossed in garlic and herbs', 5.99, 'garlic-fries.jpg', 6, 10, 320)
      ON CONFLICT DO NOTHING;
    `);

    console.log('✅ Database initialized successfully!');
    console.log('📊 Default categories and menu items added.');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// Run initialization if called directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('Database setup complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = initDatabase;