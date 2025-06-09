module.exports = (sequelize, DataTypes) => {
  const ForumTable = sequelize.define('ForumTable', {
    forumtableId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', 
        key: 'userId', 
      },
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Projects', 
        key: 'projectId', 
      },
    },
    assigned: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    year: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    batch: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    groupAssigned: {
      type: DataTypes.ENUM('Group-1', 'Group-2', 'Group-3', 'Group-4'),
      allowNull: true,
    },
    commentToStudent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    suggestionToEvangadi: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  ForumTable.associate = models => {
    ForumTable.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    ForumTable.belongsTo(models.Project, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
  };

  return ForumTable;
};
