
const defineUserModel = (sequelize , DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },

    mobile: {
      type: DataTypes.STRING,
      allowNull: true,
    },


    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    dob: { // Date of Birth
      type: DataTypes.DATEONLY, // Stores only the date part without time
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fname: { // First Name
      type: DataTypes.STRING,
      allowNull: true,
    },
    lname: { // Last Name
      type: DataTypes.STRING,
      allowNull: true,
    },

    isDeactivated: { // Last Name
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

    isDeleted: { // Last Name
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },

  });
  return User;
}

module.exports = defineUserModel;