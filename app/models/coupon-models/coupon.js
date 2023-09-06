
module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    maxUses: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    maxUsesPerUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    planIncluded: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    coupon_type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'percent'
    },
    coupon_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    coupon_status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
  });

  return Coupon;
};

// module.exports = MemberSubscription(sequelize , DataTypes);