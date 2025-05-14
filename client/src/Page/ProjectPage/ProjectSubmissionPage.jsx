import React, { useEffect, useState } from "react";
import styles from "./ProjectSubmissionPage.module.css";
import amazon from "../../assets/Amazon.png";
import netflix from "../../assets/netflix.png";
import forum from "../../assets/forum.jpg";
import portfolio from "../../assets/profile.jpg";
import { axiosInstance } from "../../utility/axiosInstance";
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

  // get projects
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
      setProjectCollection(projectsList.data.projects);
    } catch (error) {
      console.log(error.message);
    }
  };

  //  submit projects
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted Project:", formData);
    try {
      let submitProject = await axiosInstance.post(
        "/projectSubmission/submitProject",
        formData,
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      toast.success("Project submitted successfully! 🎉");
      getSubmittedProjects();
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response.data
          ? error.response.data.message
          : "Something went wrong. Please try again."
      );
    }
  };

  let deletePostedProject = async (projectId) => {

    try {
      await axiosInstance.delete(`/projectSubmission/deleteProject/${projectId}`, {     
        headers: {
          Authorization: authHeader,
        },
      }); 
     
      getSubmittedProjects();
    } catch (error) {
      console.error("Error deleting answer:", error);
    }
  };

// projectSubmission/deleteProject/:projectId

  // get submitted projects
  const getSubmittedProjects = async () => {
    try {
      let getSubmittedProjects = await axiosInstance.get(
        "/projectSubmission/getStudentProject",  
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      setSubmittedProjects(getSubmittedProjects.data);
    } catch (error) {
      console.log(error);
    }
  };

  //  list of project name and picture at the top
  const projects = [
    { name: "Netflix", img: netflix },
    { name: "Amazon", img: amazon },
    { name: "Evangadi Forum", img: forum },
    { name: "Portfolio Website", img: portfolio },
  ];

  const paginationModel = { page: 0, pageSize: 3 };

  return (
    <>
      <div className="container mx-auto row m-4">
        {projects?.map((project, index) => (
          <div className="col-6 col-md-3 text-center mb-3" key={index}>
            <img
              src={project.img}
              alt={project.name}
              className={`img-fluid rounded ${styles.projectImg}`}
            />
            <p className="mt-2 fw-bold">{project.name}</p>
          </div>
        ))}
      </div>
      <marquee
        behavior="scroll"
        direction="left"
        className=" fw-bold fst-italic"
      >
        Please submit your projects on time. Certificates and other necessary
        confirmations will only be provided to students who submit their
        projects on time.
      </marquee>

      <div className={`${styles.formPart} mt-5`}>
        {/* Responsive Image Grid */}
        {/* Submission Form */}
        <form onSubmit={handleSubmit} className={styles.projectForm}>
          <div className="mb-3">
            <label className="form-label">Project Name</label>
            <select
              name="submittedProjectName"
              value={formData.submittedProjectName}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="" disabled>
                Select project
              </option>
              {projectCollection?.map((project, index) => (
                <option key={index} value={project.projectId}>
                  {/* {project.ProjectShowStatus ? (`Project name ${<b>${project.nameOfProject} </b>}, Project deadline :  ${project.ProjectDeadLine}` ): ""} */}

                  {project.ProjectShowStatus ? (
                    <>
                      <p className={styles.forBold}>Project name : </p> <p className={styles.forItalic}>{project.nameOfProject}</p>, <p>Submission deadline:</p>
                       <p>{project.ProjectDeadLine}</p>
                    </>
                  ) : null}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">GitHub Code Link</label>
            <input
              type="url"
              name="githubCodeLink"
              value={formData.githubCodeLink}
              onChange={handleChange}
              className="form-control"
              placeholder="https://github.com/your-repo"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Deployed Link</label>
            <input
              type="url"
              name="deployedLink"
              value={formData.deployedLink}
              onChange={handleChange}
              className="form-control"
              placeholder="https://your-project-link.com"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Submit Project
          </button>
        </form>
      </div>

      <div className="text-underline container mx-auto row m-4">
        <hr />
        <h4 className="text-center">Submitted projects</h4>

        {!submittedProjects || submittedProjects.length === 0 ? (
          <h4>
            No project submitted so far <PiSmileySadThin />{" "}
          </h4>
        ) : (
          <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
            <DataGrid
              rows={submittedProjects?.map((project, index) => {
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
                  githubCodeLink: project.githubCodeLink,
                  deployedLink: project.deployedLink,
                  ReviewersComment: project.ReviewersComment,
                  projectSubmitted: createdAtFormatted,
                  projectDeadLine: project.ProjectDeadLine,
                  submissionStatus: submittedOnTime
                    ? "Submitted on time"
                    : "Not submitted on time",
                  submissionStatusColor: submittedOnTime ? "green" : "red",
                  projectActualId : project.submittedProjectId,
                  deleteStatus: project.ProjectUpdateStatus
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
                        padding: "5px 10px",
                        borderRadius: "4px",
                        textAlign: "center",
                        width: "100%",
                      }}
                    >
                      {params.row.submissionStatus}
                    </div>
                  ),
                },
                {
                  field: "action",
                  headerName: "Action",
                  renderCell: (params) => (
               
                    
                      params.row.deleteStatus?(<> <Button
                        style={{ margin: "5px" }}
                        onClick={() => deletePostedProject(params.row.projectActualId)}
                        variant="danger"
                      >
                        Delete
                      </Button></>) :("you can't update")
                    
                      
                    
                  
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
