
const defineRole = (sequelize , DataTypes) => {
  const Role = sequelize.define('Role', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Role;
};



module.exports = defineRole;