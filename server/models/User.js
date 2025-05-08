const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    userPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Group: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Batch: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Year: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("0", "1", "2", "3", "4"), 
    },
  }, {
    timestamps: true,
  });

  // Define associations
  User.associate = (models) => {
    User.hasMany(models.ProjectSubmission, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  // Static method to ensure super admin exists
  User.ensureSuperAdminExists = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);

    await User.findOrCreate({
      where: { userEmail: "rediat_ta@ch.iitr.ac.in" },
      defaults: {
        userFirstName: "Rediat",
        userLastName: "",
        userPhoneNumber: "",
        Group: "admin",
        Batch: "admin",
        Year: "admin",
        password: hashedPassword,
        role: "1", // adjust as per role meaning
      },
    });
  };

  return User;
};
