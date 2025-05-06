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
      defaultValue: '0',
    },
  }, {
    timestamps: true,
  });

  User.associate = models => {
    User.hasMany(models.Advert, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Project, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });
  };

  // Function to ensure the super admin exists
  User.ensureSuperAdminExists = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);

    await User.findOrCreate({
      where: { userEmail: "rediat_ta@ch.iitr.ac.in" },
      defaults: {
        userFirstName: "Rediat",
        userLastName: "",
        userEmail: "rediat_ta@ch.iitr.ac.in",
        userPhoneNumber: "",
        Group: "admin",
        Batch: "admin",
        Year: "admin",
        password: hashedPassword,
        role: '1',
      },
    });
  };

  return User;
};
