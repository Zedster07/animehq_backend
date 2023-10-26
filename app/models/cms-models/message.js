
module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {

      msg_receiver: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },

      msg_sender: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },

      msg_type: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0
      },

      msg_subject: {
          type: DataTypes.STRING,
          allowNull: true,
      },

      msg_content: {
          type: DataTypes.STRING,
          allowNull: false,
      },

      msg_date: {
          type: DataTypes.DATE,
          allowNull: true,
      },

      msg_status: {
          type: DataTypes.INTEGER,
          allowNull: false,
      },

      msg_seen: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue:0
      },

        msg_reason: {
            type: DataTypes.STRING,
            allowNull: true,
        },


        msg_contentType: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        msg_contentName: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        msg_contentID: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },

    });
  
    return Message;
  };
  
  // module.exports = MemberSubscription(sequelize , DataTypes);