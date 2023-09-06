
module.exports =  (sequelize, DataTypes) => {
  const SubscriptionPlanFeatures = sequelize.define('SubscriptionPlanFeatures', {
    featureName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return SubscriptionPlanFeatures;
};

// module.exports = SubscriptionPlanFeatures(sequelize , DataTypes)