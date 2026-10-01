const User = require('../models/User');
const { ROLES, ROLE_PERMISSIONS } = require('../config/constants');
const bcrypt = require('bcryptjs');

const seedOwnerAccount = async () => {
  try {
    const existingOwner = await User.findOne({ isOwner: true });
    
    if (existingOwner) {
      console.log('✅ Owner account already exists');
      return;
    }

    const ownerPassword = await bcrypt.hash(
      process.env.OWNER_PASSWORD || 'ChangeMe@12345',
      parseInt(process.env.BCRYPT_ROUNDS) || 10
    );

    const owner = new User({
      name: process.env.OWNER_NAME || 'Library Owner',
      email: process.env.OWNER_EMAIL || 'owner@library.com',
      passwordHash: ownerPassword,
      role: ROLES.OWNER,
      permissions: ROLE_PERMISSIONS[ROLES.OWNER],
      isOwner: true,
      status: 'ACTIVE'
    });

    await owner.save();
    console.log('✅ Owner account created successfully');
    console.log(`   Email: ${owner.email}`);
    console.log('   Note: Change default password immediately after first login');
  } catch (error) {
    console.error('❌ Error seeding owner account:', error.message);
  }
};

module.exports = { seedOwnerAccount };
