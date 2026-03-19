// server/src/seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Administrator = require('./models/Administrator');
const PlasticContribution = require('./models/plasticContribution');
const Incentive = require('./models/Incentive');
const { calculateIncentivePoints } = require('./utils/incentiveCalculator');

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Administrator.deleteMany({});
    await PlasticContribution.deleteMany({});
    await Incentive.deleteMany({});

    console.log('Cleared existing data');

    // Create admin
    const admin = await Administrator.create({
      name: 'Super Admin',
      email: process.env.ADMIN_EMAIL || 'admin@recycling.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123',
      role: 'super_admin',
      permissions: ['manage_users', 'manage_contributions', 'manage_incentives', 'view_reports', 'manage_admins']
    });

    console.log('Admin created');

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '+260 97 123 4567',
        address: 'Lusaka, Zambia',
        totalPoints: 1250,
        totalContributions: 15,
        totalWeight: 45.5,
        rewardTier: 'Gold'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '+260 96 765 4321',
        address: 'Ndola, Zambia',
        totalPoints: 850,
        totalContributions: 10,
        totalWeight: 32.8,
        rewardTier: 'Silver'
      },
      {
        name: 'Peter Mwamba',
        email: 'peter@example.com',
        password: 'password123',
        phone: '+260 95 555 1234',
        address: 'Kitwe, Zambia',
        totalPoints: 2200,
        totalContributions: 25,
        totalWeight: 78.2,
        rewardTier: 'Platinum'
      }
    ]);

    console.log('Sample users created');

    // Create sample contributions
    const plasticTypes = ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'OTHER'];
    const statuses = ['pending', 'approved', 'rejected'];

    const contributions = [];
    for (let i = 0; i < 30; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      const plasticType = plasticTypes[Math.floor(Math.random() * plasticTypes.length)];
      const quantity = Math.random() * 10 + 0.5;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const points = calculateIncentivePoints(plasticType, quantity);

      const contribution = await PlasticContribution.create({
        user: user._id,
        plasticType,
        quantity,
        unit: 'kg',
        status,
        collectionPoint: ['Lusaka', 'Ndola', 'Kitwe', 'Livingstone'][Math.floor(Math.random() * 4)],
        collectionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        pointsEarned: points,
        notes: status === 'rejected' ? 'Quality issues' : undefined,
        approvedBy: status === 'approved' ? admin._id : undefined,
        approvedDate: status === 'approved' ? new Date() : undefined
      });

      contributions.push(contribution);

      // Create incentive for approved contributions
      if (status === 'approved') {
        await Incentive.create({
          user: user._id,
          contribution: contribution._id,
          pointsEarned: points,
          rewardType: 'POINTS',
          rewardValue: points,
          rewardStatus: 'AWARDED',
          description: `Points earned for ${quantity.toFixed(1)}kg of ${plasticType} plastic`,
          awardedDate: contribution.approvedDate
        });

        // Update user totals
        user.totalPoints += points;
        user.totalWeight += quantity;
        user.totalContributions += 1;
        user.updateRewardTier();
        await user.save();
      }
    }

    console.log(`Created ${contributions.length} sample contributions`);

    // Create some redeemed incentives
    const awardedIncentives = await Incentive.find({ rewardStatus: 'AWARDED' }).limit(5);
    for (const incentive of awardedIncentives) {
      incentive.rewardStatus = 'REDEEMED';
      incentive.redeemedDate = new Date();
      incentive.redeemedBy = admin._id;
      await incentive.save();
    }

    console.log('Sample incentives created');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();