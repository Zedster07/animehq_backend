

const defineTokens = (sequelize , DataTypes) => {
    const Tokens = sequelize.define('Tokens', {
        
        tvalue: {
            type: DataTypes.STRING,
            allowNull: true,
        },

        ttype: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        geoloc:{
            type: DataTypes.JSON,
            allowNull: true,
        },
        ipaddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        device: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        session: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        UserId:{
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    });
  return Tokens;
}


  
  module.exports = defineTokens;