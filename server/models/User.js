
const bcrypt = require('bcrypt');
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    userNameId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "User Name Already Taken",
      },
      validate: {
        notEmpty: { msg: "User Name cannot be empty" },
        is: {
          args: /^[a-zA-Z0-9_!@#$%^&*()+=\-{}\[\]|\\:;"'<>,.?/~`]*$/,
          msg: "User name should only contain alphabets and special characters",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: "You can't create an account with this email",
      },
      validate: {
        notEmpty: { msg: "Email cannot be empty" },
        isEmail: { msg: "Invalid Email Address" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Password cannot be empty" },
        len: {
          args: [6, undefined],
          msg: "Password should be at least 6 characters long",
        },
        is: {
          args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
          msg: "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 6 characters long",
        },
      },
    },
    role: {
      type: DataTypes.ENUM("0","1", "2", "3", "4"),
      defaultValue: '0',
    },
    sq1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sqa1: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Answer cannot be empty" },
      }
    },
    passwordUpdateLink: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    passwordUpdateLinkCreatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    passwordAttempt: {
      type: DataTypes.STRING,
    }
  }, {
    timestamps: true,
  });

  User.associate = models => {
    User.hasMany(models.Advert, {
      foreignKey: 'userNameId',
      onDelete: 'CASCADE',
    });
    User.hasMany(models.Job, {
      foreignKey: 'userNameId',
      onDelete: 'CASCADE',
    });
  };
  // Function to ensure the super admin exists
  const ensureSuperAdminExists = async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('ProjectSubmissionAdmin@524334', salt);

    await User.findOrCreate({
      where: { email: "rediat_ta@ch.iitr.ac.in" },
      defaults: {
        userName: "Rediat",
        email: "rediat_ta@ch.iitr.ac.in",
        sq1: "what is the most precious item you purchased?",
        sqa1: "gold",
        role: '1',
        password: hashedPassword,
      },
    });
  };

  // Hook to ensure the super admin exists after the User model is synchronized
  sequelize.sync().then(() => {
    ensureSuperAdminExists()
      .then(() => console.log(""))
      .catch(err => console.error("Error ensuring super admin:", err));
  });
  return User;
};
