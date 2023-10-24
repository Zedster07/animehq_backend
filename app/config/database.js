// config/database.js
const { Sequelize , DataTypes } = require('sequelize');
const config = require('./config');

const { username , password , host , database } = config.db_setups[config.hosting];

const sequelize = new Sequelize(
  database,
  username,
  password,
  {
    host: host,
    dialect: 'mysql',
    port : 3306
  }
);


// AUTH MODELS
const User = require('../models/auth-models/user')(sequelize, DataTypes);
const Role = require('../models/auth-models/role')(sequelize, DataTypes);
const hasRole = require('../models/auth-models/hasRole')(sequelize, DataTypes);
const Tokens = require('../models/auth-models/tokens')(sequelize, DataTypes);
User.belongsToMany(Role, { through: hasRole });
Role.belongsToMany(User, { through: hasRole });

// SUBSCRIPTION MODELS
const MemberSubscription = require('../models/subscription-models/memberSubscription')(sequelize, DataTypes);
const SubscriptionPlan = require('../models/subscription-models/subscriptionPlan')(sequelize, DataTypes);
const SubscriptionPlanFeatures = require('../models/subscription-models/subscriptionPlanFeatures')(sequelize, DataTypes);

SubscriptionPlan.belongsToMany(SubscriptionPlanFeatures, { through: 'SubscriptionPlanPlanFeatures' });
SubscriptionPlanFeatures.belongsToMany(SubscriptionPlan, { through: 'SubscriptionPlanPlanFeatures' });


User.hasMany(MemberSubscription);
SubscriptionPlan.hasMany(MemberSubscription);
MemberSubscription.belongsTo(User);
MemberSubscription.belongsTo(SubscriptionPlan);


const Payment = require('../models/payment-models/payment')(sequelize, DataTypes);
Payment.belongsTo(MemberSubscription);
Payment.belongsTo(SubscriptionPlan);
Payment.belongsTo(User);
User.hasMany(Payment);
SubscriptionPlan.hasMany(Payment);
MemberSubscription.hasMany(Payment);



const Coupon = require('../models/coupon-models/coupon')(sequelize, DataTypes);
Coupon.belongsToMany(Payment, { through: 'CouponUses' });
Payment.belongsToMany(Coupon, { through: 'CouponUses' });


const Message = require('../models/cms-models/message')(sequelize, DataTypes);

module.exports = { 
  sequelize , 
  Message,
  User , 
  Role , 
  hasRole, 
  Tokens , 
  MemberSubscription , 
  SubscriptionPlan , 
  SubscriptionPlanFeatures ,
  Payment,
  Coupon
};