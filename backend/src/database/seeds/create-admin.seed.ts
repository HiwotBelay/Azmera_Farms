import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../../modules/auth/entities/user.entity';
import { RefreshToken } from '../../modules/auth/entities/refresh-token.entity';
import { UserProfile } from '../../modules/users/entities/user-profile.entity';
import { config } from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file in backend directory
config({ path: path.join(__dirname, '../../../.env') });

async function createAdmin() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, RefreshToken, UserProfile], // Include all related entities
    synchronize: false,
    logging: true,
    ssl: process.env.DATABASE_URL?.includes('ssl') || process.env.DATABASE_URL?.includes('neon') ? {
      rejectUnauthorized: false,
    } : undefined,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established');

    const userRepository = dataSource.getRepository(User);

    // Check if admin already exists
    const existingAdmin = await userRepository.findOne({
      where: { email: 'admin@azemera.com' },
    });

    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists. Updating to ensure admin role...');
      existingAdmin.role = UserRole.ADMIN;
      existingAdmin.isActive = true;
      await userRepository.save(existingAdmin);
      console.log('✅ Admin user updated successfully');
      console.log('📧 Email: admin@azemera.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the password after first login!');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const admin = userRepository.create({
        email: 'admin@azemera.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
        isEmailVerified: true,
        isActive: true,
      });

      await userRepository.save(admin);
      console.log('✅ Admin user created successfully');
      console.log('📧 Email: admin@azemera.com');
      console.log('🔑 Password: admin123');
      console.log('⚠️  Please change the password after first login!');
    }

    await dataSource.destroy();
    console.log('✅ Seed completed');
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the seed
createAdmin();

