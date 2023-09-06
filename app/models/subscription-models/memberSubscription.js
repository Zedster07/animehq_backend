
module.exports = (sequelize, DataTypes) => {
  const MemberSubscription = sequelize.define('MemberSubscription', {
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    months: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discountCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscription_status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'active',
    },
  });

  return MemberSubscription;
};

// module.exports = MemberSubscription(sequelize , DataTypes);