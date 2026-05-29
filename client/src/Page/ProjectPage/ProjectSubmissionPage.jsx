import React, { useEffect, useState } from "react";
import styles from "./ProjectSubmissionPage.module.css";
import amazon from "../../assets/Amazon.png";
import chatGpt from "../../assets/ChatGPT.png";
import netflix from "../../assets/netflix.png";
import forum from "../../assets/forum.png";
import portfolio from "../../assets/profile.png";
import { axiosInstance } from "../../utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiSmileySadThin } from "react-icons/pi";
import dayjs from "dayjs";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

function ProjectSubmissionPage() {
  const [formData, setFormData] = useState({
    submittedProjectName: "",
    githubCodeLink: "",
    deployedLink: "",
    projectType: "",
    ReviewersComment: "",
  });
  const [projectCollection, setProjectCollection] = useState([]);
  const [submittedProjects, setSubmittedProjects] = useState([]);

  useEffect(() => {
    getProjects();
    getSubmittedProjects();
  }, []);

  const authHeader = useAuthHeader();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getProjects = async () => {
    try {
      let projectsList = await axiosInstance.get(
        "/projectCreation/getProjectsForStudents",
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );
      setProjectCollection(projectsList.data.projects);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedFormData = {
      ...formData,
      githubCodeLink: formData.githubCodeLink.trim(),
      deployedLink: formData.deployedLink.trim(),
    };

    try {
      let submitProject = await axiosInstance.post(
        "/projectSubmission/submitProject",
        trimmedFormData,
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );

      toast.success("Project submitted successfully!");

      setFormData({
        submittedProjectName: "",
        githubCodeLink: "",
        deployedLink: "",
        projectType: "",
        ReviewersComment: "",
      });

      getSubmittedProjects();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  let deletePostedProject = async (projectId) => {
    try {
      await axiosInstance.delete(
        `/projectSubmission/deleteProject/${projectId}`,
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );

      getSubmittedProjects();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const getSubmittedProjects = async () => {
    try {
      let getSubmittedProjects = await axiosInstance.get(
        "/projectSubmission/getStudentProject",
        {
          headers: {
            Authorization: authHeader,
          },
        },
      );
      setSubmittedProjects(getSubmittedProjects.data);
    } catch (error) {
      console.log(error);
    }
  };

  const projects = [
    { name: "AI Integrated Netflix Clone", img: netflix },
    { name: "ChatGpt", img: chatGpt },
    { name: "AI Integrated Evangadi Forum", img: forum },
    { name: "Portfolio Website", img: portfolio },
  ];

  const paginationModel = { page: 0, pageSize: 3 };

  return (
    <>
      <div className={styles.aiBackground}></div>

      {/* Animated Alert Banner */}
      <div className={styles.alertBanner}>
        <marquee
          behavior="scroll"
          direction="left"
          className={styles.marqueeText}
        >
          ✨ Please submit your projects on time. Certificates and other
          necessary confirmations will only be provided to students who submit
          their projects on time. ✨
        </marquee>
      </div>

      {/* Two Column Layout: Projects Left, Form Right */}
      <div className={styles.twoColumnSection}>
        {/* Left Column - Project Showcase Grid */}
        <div className={styles.leftColumn}>
          <div className={styles.projectShowcaseLeft}>
            <div className={styles.leftColumnHeader}>
              <h3>Featured Main Projects To Be Submitted</h3>
              {/* <p>Explore and submit your work</p> */}
            </div>
            <div className={styles.projectGrid}>
              {projects?.map((project, index) => (
                <div className={styles.projectCard} key={index}>
                  <div className={styles.projectCardInner}>
                    <img
                      src={project.img}
                      alt={project.name}
                      className={styles.projectImg}
                    />
                    <p className={styles.projectName}>{project.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Submission Form */}
        <div className={styles.rightColumn}>
          <form onSubmit={handleSubmit} className={styles.projectForm}>
            <div className={styles.formHeader}>
              <h2>Submit Your Project</h2>
              <p>Share your amazing work with us</p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Project Name</label>
              <select
                name="submittedProjectName"
                value={formData.submittedProjectName}
                onChange={handleChange}
                className={styles.formControl}
                required
              >
                <option value="" disabled>
                  Select project
                </option>
                {projectCollection?.map((project, index) => (
                  <option key={index} value={project.projectId}>
                    {project.ProjectShowStatus ? (
                      <>
                        <p className={styles.forBold}>Project name : </p>{" "}
                        <p className={styles.forItalic}>
                          {project.nameOfProject}
                        </p>
                        , <p>Submission deadline:</p>
                        <p>{project.ProjectDeadLine}</p>
                      </>
                    ) : null}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>GitHub Code Link</label>
              <input
                type="url"
                name="githubCodeLink"
                value={formData.githubCodeLink}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="https://github.com/your-repo"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Deployed Link</label>
              <input
                type="url"
                name="deployedLink"
                value={formData.deployedLink}
                onChange={handleChange}
                className={styles.formControl}
                placeholder="https://your-project-link.com"
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn}>
              <span>Submit Project</span>
              <div className={styles.shimmer}></div>
            </button>
          </form>
        </div>
      </div>

      {/* Submitted Projects Section */}
      <div className={styles.submittedSection}>
        <div className={styles.sectionHeader}>
          <h3 style={{ color: "white" }}>Your Submitted Projects</h3>
          <div className={styles.headerLine}></div>
        </div>

        {!submittedProjects || submittedProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <PiSmileySadThin className={styles.emptyIcon} />
            <p>No project submitted so far</p>
          </div>
        ) : (
          <Paper
            sx={{
              height: "90%",
              width: "100%",
              margin: "2%",
              backgroundColor: "rgba(255,255,255,0.95)",
              borderRadius: "20px",
              overflow: "hidden",
            }}
          >
            <DataGrid
              rows={submittedProjects?.map((project, index) => {
                const createdAtFormatted = dayjs(project.createdAt).format(
                  "DD/MM/YYYY",
                );

                const createdAt = dayjs(createdAtFormatted, "DD/MM/YYYY");
                const deadline = dayjs(project.ProjectDeadLine, "DD/MM/YYYY");

                const submittedOnTime =
                  createdAt.isSame(deadline) || createdAt.isBefore(deadline);

                return {
                  id: index,
                  submittedProjectName: project.nameOfProject,
                  githubCodeLink: project.githubCodeLink,
                  deployedLink: project.deployedLink,
                  ReviewersComment: project.ReviewersComment,
                  projectSubmitted: createdAtFormatted,
                  projectDeadLine: project.ProjectDeadLine,
                  submissionStatus: submittedOnTime
                    ? "Submitted on time"
                    : "Not submitted on time",
                  submissionStatusColor: submittedOnTime
                    ? "#10b981"
                    : "#ef4444",
                  projectActualId: project.submittedProjectId,
                  deleteStatus: project.ProjectUpdateStatus,
                };
              })}
              columns={[
                {
                  field: "submittedProjectName",
                  headerName: "Project Name",
                  width: 140,
                },
                {
                  field: "githubCodeLink",
                  headerName: "GitHub Link",
                  width: 200,
                },
                { field: "deployedLink", headerName: "Live Site", width: 200 },
                {
                  field: "ReviewersComment",
                  headerName: "Instructor Comment",
                  width: 200,
                },
                {
                  field: "projectSubmitted",
                  headerName: "Submitted Date",
                  width: 120,
                },
                {
                  field: "projectDeadLine",
                  headerName: "Deadline",
                  width: 100,
                },
                {
                  field: "submissionStatus",
                  headerName: "Status",
                  width: 175,
                  renderCell: (params) => (
                    <div
                      style={{
                        backgroundColor: params.row.submissionStatusColor,
                        color: "white",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        textAlign: "center",
                        width: "100%",
                        fontWeight: "500",
                      }}
                    >
                      {params.row.submissionStatus}
                    </div>
                  ),
                },
                {
                  field: "action",
                  headerName: "Action",
                  renderCell: (params) =>
                    params.row.deleteStatus ? (
                      <Button
                        onClick={() =>
                          deletePostedProject(params.row.projectActualId)
                        }
                        className={styles.deleteBtn}
                      >
                        Delete
                      </Button>
                    ) : (
                      <span className={styles.noAction}>Cannot modify</span>
                    ),
                  width: 150,
                },
              ]}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[5, 10]}
              checkboxSelection={false}
              sx={{ border: 2 }}
            />
          </Paper>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default ProjectSubmissionPage;
