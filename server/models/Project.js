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
      },
      ProjectShowStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: true, 
        defaultValue : true
      },
      ProjectDeadLine: {
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
    
      Project.hasMany(models.ProjectSubmission, {
        foreignKey: 'submittedProjectName',
        onDelete: 'CASCADE',
      });
    };
    
    
  
    return Project;
  };
  