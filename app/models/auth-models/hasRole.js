
const defineHasRoleModel = (sequelize , DataTypes) => {
  const hasRole = sequelize.define('hasRole', {
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    organization: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  hasRole.associate = (models) => {
    const User = models.User;
    const Role = models.Role;

    User.belongsToMany(Role, { through: hasRole });
    Role.belongsToMany(User, { through: hasRole });
  };

  return hasRole;
};

module.exports = defineHasRoleModel;