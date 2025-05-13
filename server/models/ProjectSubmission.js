module.exports = (sequelize, DataTypes) => {
  const ProjectSubmission = sequelize.define('ProjectSubmission', {
    submittedProjectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {  
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Projects',
        key: 'projectId',
      },
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
      allowNull: true,
      defaultValue: "Individual",
    },
    ProjectUpdateStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
    },
    ReviewersComment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: true,
  });

  ProjectSubmission.associate = models => {
    ProjectSubmission.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE',
    });

    ProjectSubmission.belongsTo(models.Project, {
      foreignKey: 'projectId',
      onDelete: 'CASCADE',
    });
  };

  return ProjectSubmission;
};
