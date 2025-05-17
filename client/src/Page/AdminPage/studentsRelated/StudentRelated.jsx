import React, { useEffect, useState } from "react";
import styles from "./StudentRelated.module.css";
import { axiosInstance } from "../../../utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import Accordion from "react-bootstrap/Accordion";
import dayjs from "dayjs";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PiSmileySadThin } from "react-icons/pi";
function StudentRelated() {
  const [fullInfo, setFullInfo] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 15;

  const authHeader = useAuthHeader();
  const paginationModel = { pageSize: 5, page: 0 };
  const navigate = useNavigate();

  useEffect(() => {
    getFullSubmissionInfo();
  }, []);

  const openCommentModal = (projectId) => {
    setCurrentProjectId(projectId);
    setShowCommentModal(true);
  };

  const submitComment = async () => {
    if (!commentText.trim()) {
      toast.error("Comment cannot be empty", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axiosInstance.post(
        `/projectSubmission/projectComment/${currentProjectId}`,
        { comment: commentText },
        {
          headers: { Authorization: authHeader },
        }
      );

      setCommentText("");
      setShowCommentModal(false);
      getFullSubmissionInfo();
    } catch (error) {
      console.error("Failed to submit comment", error);
      toast.error("Failed to submit comment", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  const getFullSubmissionInfo = async () => {
    try {
      const infoContent = await axiosInstance.get(
        "/projectSubmission/fullInfo",
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      setFullInfo(infoContent?.data || []);
    } catch (error) {
      console.log(error.message);
    }
  };

  const groupedData = fullInfo.reduce((acc, project) => {
    const key = `${project.Batch} - ${project.Group} - ${project.Year}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(project);
    return acc;
  }, {});

  const filteredAndGrouped = Object.entries(groupedData)
    .map(([groupKey, submittedProjects]) => {
      const filteredProjects = submittedProjects.filter((project) =>
        project.email.toLowerCase().includes(searchEmail.toLowerCase())
      );
      return { groupKey, filteredProjects };
    })
    .filter(({ filteredProjects }) => filteredProjects.length > 0);

  const totalPages = Math.ceil(filteredAndGrouped.length / itemsPerPage);

  const paginatedData = filteredAndGrouped.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  return (
    <div className={`container mt-4 ${styles.studentRelated}`}>
      <h3 className="mb-4">Submitted Projects</h3>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Search by Email"
          value={searchEmail}
          onChange={(e) => {
            setSearchEmail(e.target.value);
            setCurrentPage(0); // Reset to first page on search
          }}
          style={{
            padding: "8px",
            width: "250px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {paginatedData.length === 0 ? (
       <h4>
                  No project submitted so far! <PiSmileySadThin />{" "}
                </h4>
      ) : (
        <>
          <Accordion defaultActiveKey="0">
            {paginatedData.map(({ groupKey, filteredProjects }, index) => (
              <Accordion.Item eventKey={index.toString()} key={groupKey}>
                <Accordion.Header>{groupKey}</Accordion.Header>
                <Accordion.Body>
                  <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
                    <DataGrid
                      rows={filteredProjects?.map((project, idx) => {
                        const createdAtFormatted = dayjs(project.createdAt).format("DD/MM/YYYY");
                        const createdAt = dayjs(createdAtFormatted, "DD/MM/YYYY");
                        const deadline = dayjs(project.ProjectDeadLine, "DD/MM/YYYY");
                        const submittedOnTime =
                          createdAt.isSame(deadline) || createdAt.isBefore(deadline);

                        return {
                          id: idx,
                          username: project.username,
                          userPhoneNumber: project.userPhoneNumber,
                          userEmail: project.email,
                          nameOfProject: project.nameOfProject,
                          ReviewersComment: project.ReviewersComment,
                          deployedLink: project.deployedLink,
                          githubCodeLink: project.githubCodeLink,
                          submittedDate: createdAtFormatted,
                          projectDeadLine: project.ProjectDeadLine,
                          submissionStatus: submittedOnTime
                            ? "Submitted on time"
                            : "Not submitted on time",
                          submissionStatusColor: submittedOnTime ? "green" : "red",
                          projectActualId: project.submittedProjectId,
                          deleteStatus: project.ProjectUpdateStatus,
                        };
                      })}
                      columns={[
                        { field: "username", headerName: "Student Name", width: 150 },
                        { field: "userPhoneNumber", headerName: "Phone No", width: 150 },
                        { field: "userEmail", headerName: "Email", width: 150 },
                        { field: "nameOfProject", headerName: "Project Name", width: 150 },
                        { field: "githubCodeLink", headerName: "GitHub Link", width: 200 },
                        { field: "deployedLink", headerName: "Live Site", width: 200 },
                        { field: "ReviewersComment", headerName: "Instructor Comment", width: 200 },
                        { field: "submittedDate", headerName: "Submitted Date", width: 130 },
                        { field: "projectDeadLine", headerName: "Deadline", width: 120 },
                        {
                          field: "submissionStatus",
                          headerName: "Status",
                          width: 170,
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
                          width: 150,
                          renderCell: (params) =>
                              <Button
                                style={{ margin: "5px" }}
                                onClick={() => openCommentModal(params.row.projectActualId)}
                                variant="info"
                              >
                                Give Comment
                              </Button>
                            
                        },
                      ]}
                      initialState={{ pagination: { paginationModel } }}
                      pageSizeOptions={[5, 10]}
                      checkboxSelection={false}
                      sx={{ border: 2 }}
                    />
                  </Paper>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
              >
                Previous
              </Button>
              <span>
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                disabled={currentPage === totalPages - 1}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Comment Modal */}
      {showCommentModal && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              boxShadow: "0 0 10px rgba(0,0,0,0.3)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h5>Give Comment</h5>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              style={{ marginBottom: "10px", resize: "none" }}
              placeholder="Enter your comment"
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button variant="secondary" onClick={() => setShowCommentModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={submitComment}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentRelated;
