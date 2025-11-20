import bcrypt from 'bcryptjs';
import User from '../../models/User.js';

export const seedAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingAdmin = await User.findOne({ where: { email: 'admin@airline.com' } });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@airline.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully');
    console.log('   Email: admin@airline.com');
    console.log('   Password: admin123');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
};

export default seedAdminUser;

