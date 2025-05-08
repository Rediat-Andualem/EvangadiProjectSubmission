module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
      projectId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      nameOfProject: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      projectDescription: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      projectResource: {
        type: DataTypes.STRING,
        allowNull: true, 
      }
    }, {
      timestamps: true, 
    });
  
    Project.associate = models => {
      Project.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    };
  
    return Project;
  };
  