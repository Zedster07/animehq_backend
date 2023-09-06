
module.exports =  (sequelize, DataTypes) => {
  const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    isRecommended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    planOrder: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    discounts: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });
  return SubscriptionPlan;
};

// module.exports = SubscriptionPlan(sequelize, DataTypes);