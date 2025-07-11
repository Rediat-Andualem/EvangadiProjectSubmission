import React, { useEffect, useState } from "react";
import styles from "./ProjectRelated.module.css";
import { axiosInstance } from "../../../utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiSmileySadThin } from "react-icons/pi";
import dayjs from "dayjs";
//  for table view
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";
import customParseFormat from "dayjs/plugin/customParseFormat";
import ClipLoader  from 'react-spinners/ClipLoader'
dayjs.extend(customParseFormat);
function ProjectRelated() {
  const [formData, setFormData] = useState({
    ProjectDeadLine: "",
    projectResource: "",
    projectDescription: "",
    nameOfProject: "",
  });
  const [projectCollection, setProjectCollection] = useState([]);
  const [loading , setLoading]=useState(false)
  useEffect(() => {
    getProjects();
  }, []);

  const authHeader = useAuthHeader();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //* get created Project
  const getProjects = async () => {
    try {
      let projectsList = await axiosInstance.get(
        "/projectCreation/getProjectsForStudents",
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      setProjectCollection(projectsList?.data.projects);
    } catch (error) {
      console.log(error.message);
    }
  };

  //* creating project for student
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate deadline format
    const isValidDeadline = dayjs(
      formData.ProjectDeadLine,
      "DD/MM/YYYY",
      true
    ).isValid();
    if (!isValidDeadline) {
      toast.error(
        "Please use the deadline format DD/MM/YYYY, e.g., 13/06/2025"
      );
      return;
    }

    try {
      await axiosInstance.post(
        "/projectCreation/createProjectForStudents",
        formData,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );

      toast.success("Project created successfully! 🎉");

      // Reset form fields after success
      setFormData({
        ProjectDeadLine: "",
        projectResource: "",
        projectDescription: "",
        nameOfProject: "",
      });

      getProjects();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  // *  delete project
  let deleteProject = async (projectId) => {
    try {
      await axiosInstance.delete(
        `/projectCreation/deleteProjectForStudents/${projectId}`,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      getProjects();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

  const toggleShowHideProject = async (projectId, currentStatus) => {
    try {
      await axiosInstance.patch(
        `/projectCreation/updateShowStatus/${projectId}`,
        { ProjectShowStatus: !currentStatus },
        { headers: { Authorization: authHeader } }
      );
      toast.success(
        `Project is now ${!currentStatus ? "shown" : "hidden"} to students`
      );
      getProjects();
    } catch (error) {
      toast.error("Failed to update project show status");
    }
  };

  const toggleAllowLinkUpdate = async (projectId, currentStatus) => {
    try {
      await axiosInstance.patch(
        `/projectSubmission/updateAllowing/${projectId}`,  
        {ProjectUpdateStatus:!currentStatus},
        { headers: { Authorization: authHeader } }
      );
      toast.success(
        `Link updating is now ${!currentStatus ? "allowed" : "prevented"}`
      );
      getProjects();
    } catch (error) {
      toast.error("Failed to update link update permission");
      console.log(error)
    }
  };

  const paginationModel = { page: 0, pageSize: 3 };

  return (
    <div className={styles.mainProject}>
      <h2>Create Project</h2>
      <div className={`${styles.formPart} mt-5 container`}>
        {/* Responsive Image Grid */}
        {/* Submission Form */}
        <form onSubmit={handleSubmit} className={styles.projectForm}>
          <div className="mb-3">
            <label className="form-label">Name of project</label>
            <input
              name="nameOfProject"
              value={formData.nameOfProject}
              onChange={handleChange}
              className="form-control"
              placeholder="Name of project to be displayed for students"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Project Description</label>
            <input
              name="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              className="form-control"
              placeholder="give short description about the project"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Resource Link</label>
            <input
              type="url"
              name="projectResource"
              value={formData.projectResource}
              onChange={handleChange}
              className="form-control"
              placeholder="pass link to the resource eg. https://www.resource.com"
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Project deadline</label>
            <input
              name="ProjectDeadLine"
              value={formData.ProjectDeadLine}
              onChange={handleChange}
              className="form-control"
              placeholder="use this format DD/MM/YYYY eg.13/06/2025"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create Project
          </button>
        </form>
      </div>

      <div className="container mx-auto row ">
        <hr />
        <h4 className="text-center">Created projects</h4>

        {!projectCollection || projectCollection.length === 0 ? (
          <h4>
            No project created so far <PiSmileySadThin />{" "}
          </h4>
        ) : (
          <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
            <DataGrid
              rows={projectCollection?.map((project, index) => {
                const createdAtFormatted = dayjs(project.createdAt).format(
                  "DD/MM/YYYY"
                );

                const createdAt = dayjs(createdAtFormatted, "DD/MM/YYYY");
                const deadline = dayjs(project.ProjectDeadLine, "DD/MM/YYYY");
                const submittedOnTime =
                  createdAt.isSame(deadline) || createdAt.isBefore(deadline);
                return {
                  id: index,
                  submittedProjectName: project.nameOfProject,
                  projectDescription: project.projectDescription,
                  projectResource: project.projectResource,
                  projectDeadLine: project.ProjectDeadLine,
                  ProjectShowStatus: project.ProjectShowStatus,
                  allowLinkUpdate: project.ProjectUpdateStatus,
                  projectId: project.projectId,
                };
              })}
              columns={[
                {
                  field: "submittedProjectName",
                  headerName: "Project Name",
                  width: 140,
                },
                {
                  field: "projectDescription",
                  headerName: "Project Description",
                  width: 200,
                },
                {
                  field: "projectResource",
                  headerName: "Link to project resource",
                  width: 200,
                },
                {
                  field: "projectDeadLine",
                  headerName: "Project deadline",
                  width: 120,
                },
                {
                  field: "ProjectShowStatus",
                  headerName: "project show status",
                  width: 100,
                },
                {
                  field: "action",
                  headerName: "Action",
                  width: 100,
                  renderCell: (params) => (
                    <Button
                      style={{ margin: "5px" }}
                      onClick={() => deleteProject(params.row.projectId)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  ),
                },
                {
                  field: "showhide",
                  headerName: "Show / Hide project for students",
                  width: 170,
                  renderCell: (params) => (
                    <Button
                      style={{ margin: "5px" }}
                      onClick={() =>
                        toggleShowHideProject(
                          params.row.projectId,
                          params.row.ProjectShowStatus
                        )
                      }
                      variant={
                        params.row.ProjectShowStatus ? "danger" : "success"
                      } // red if shown (means clicking hides), green if hidden (means clicking shows)
                    >
                      {params.row.ProjectShowStatus ? "Hide" : "Show"}
                    </Button>
                  ),
                },
                {
                  field: "updateStatus",
                  headerName: "Allow link updating",
                  width: 170,
                  renderCell: (params) => (
                    <Button
                      style={{ margin: "5px" }}
                      onClick={() =>
                        toggleAllowLinkUpdate(
                          params.row.projectId,
                          params.row.allowLinkUpdate
                        )
                      }
                      variant={
                        params.row.allowLinkUpdate ? "danger" : "success"
                      } // red means currently allowed, button says "Prevent"
                    >
                      {params.row.allowLinkUpdate ? "Prevent" : "Allow"}
                    </Button>
                  ),
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
    </div>
  );
}

export default ProjectRelated;
