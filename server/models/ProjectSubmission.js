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
    approvalForCertificate: {
      type: DataTypes.ENUM('0','1'),
      allowNull: true,
      defaultValue: "0",
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
    MemoForEvangadi: {
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
