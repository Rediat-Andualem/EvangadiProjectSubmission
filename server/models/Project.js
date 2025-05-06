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
      githubCodeLink: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      deployedLink: {
        type: DataTypes.STRING,
        allowNull: true, 
      },
      projectType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ReviewersComment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
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
  