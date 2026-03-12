const pool = require('../src/config/database');
const User = require('../src/models/User');
const Service = require('../src/models/Service');
const bcryptjs = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminEmail = 'admin@servicehub.com';
    const existingAdmin = await User.findByEmail(adminEmail);
    if (!existingAdmin) {
      const hashedPassword = await bcryptjs.hash('admin123', 10);
      await pool.query(
        'INSERT INTO admin_users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4)',
        [adminEmail, hashedPassword, 'Admin User', 'admin']
      );
      console.log('✓ Admin user created (admin@servicehub.com / admin123)');
    }

    // Services
    const services = [
      {
        name: 'Home Cleaning',
        description: 'Professional deep cleaning and maintenance for your living space',
        price: 99.99,
        duration_minutes: 120,
        category: 'Cleaning',
        image_url: 'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=500',
      },
      {
        name: 'Electrical Repair',
        description: 'Expert electricians for repairs, installations, and safety checks',
        price: 149.99,
        duration_minutes: 60,
        category: 'Repair',
        image_url: 'https://images.unsplash.com/photo-1581577143566-ae8a0e4ce6ba?w=500',
      },
      {
        name: 'Plumbing Service',
        description: 'Expert solutions for leaks, clogs, and bathroom renovations',
        price: 129.99,
        duration_minutes: 90,
        category: 'Repair',
        image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500',
      },
      {
        name: 'Car Detailing',
        description: 'Professional detailing and maintenance at your doorstep',
        price: 179.99,
        duration_minutes: 150,
        category: 'Automotive',
        image_url: 'https://images.unsplash.com/photo-1601584942197-04bbb2b033d7?w=500',
      },
      {
        name: 'Painting Service',
        description: 'Interior and exterior painting with premium quality finishes',
        price: 199.99,
        duration_minutes: 240,
        category: 'Renovation',
        image_url: 'https://images.unsplash.com/photo-1589939705066-5470d902c8c0?w=500',
      },
      {
        name: 'Lawn Care',
        description: 'Complete lawn maintenance, landscaping, and garden design',
        price: 89.99,
        duration_minutes: 60,
        category: 'Gardening',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
      },
      {
        name: 'HVAC Maintenance',
        description: 'Air conditioning and heating system installation and maintenance',
        price: 159.99,
        duration_minutes: 120,
        category: 'Repair',
        image_url: 'https://images.unsplash.com/photo-1580632747212-446353693236?w=500',
      },
      {
        name: 'Pet Grooming',
        description: 'Professional pet grooming and spa services for your beloved pets',
        price: 99.99,
        duration_minutes: 90,
        category: 'Pet Care',
        image_url: 'https://images.unsplash.com/photo-1576201665529-2a63b1e02e98?w=500',
      },
    ];

    for (const service of services) {
      const existing = await pool.query(
        'SELECT * FROM services WHERE name = $1',
        [service.name]
      );
      if (existing.rows.length === 0) {
        await Service.create(
          service.name,
          service.description,
          service.price,
          service.duration_minutes,
          service.category,
          service.image_url
        );
      }
    }

    console.log('✓ Services created');
    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedDatabase();
