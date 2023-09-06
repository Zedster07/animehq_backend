
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
    },
    paymentStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'completed',
    },
    payment_gateway: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'paypal_standard',
    },
    discount_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'USD',
    },
    ip_address :{
        type: DataTypes.STRING,
        allowNull: true,
    },
  });

  return Payment;
};

// module.exports = MemberSubscription(sequelize , DataTypes);