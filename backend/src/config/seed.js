import { sequelize } from './database.js';
import { seedSampleData } from './seeders/sampleData.js';
import { seedAdminUser } from './seeders/adminUser.js';

const seed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Sync database without dropping tables (preserves existing data)
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables synchronized');
    
    // Seed admin user (will skip if exists)
    await seedAdminUser();
    
    // Seed sample data (will skip duplicates)
    await seedSampleData();
    
    console.log('✅ Database seeding completed');
    console.log('📝 Data preserved - no tables were dropped');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seed();
