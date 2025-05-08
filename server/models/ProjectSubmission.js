module.exports = (sequelize, DataTypes) => {
  const ProjectSubmission = sequelize.define('ProjectSubmission', {
    submittedProjectId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    submittedProjectName: {
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
  };

  return ProjectSubmission;
};
