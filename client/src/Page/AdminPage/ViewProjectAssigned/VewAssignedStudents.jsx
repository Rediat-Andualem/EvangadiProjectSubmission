import React, { useEffect, useState } from 'react';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { axiosInstance } from '../../../utility/axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProjectAssigned() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    Batch: '',
    Group: '',
    Year: '',
    projectId: ''
  });
  const [results, setResults] = useState([]);
  const authHeader = useAuthHeader();

  const [showModal, setShowModal] = useState(false);
  const [currentForumId, setCurrentForumId] = useState(null);
  const [commentType, setCommentType] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false); // For delete confirmation

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get('/projectCreation/getProjectsForStudents', {
           headers: { Authorization: authHeader }
        });
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects.');
      }
    };
    fetchProjects();
  }, [authHeader]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post('/projectSubmission/getAssignedStudents', formData, {
        headers: { Authorization: authHeader }
      });
      setResults(res.data.data || []);
    } catch (error) {
      console.error('Error fetching filtered results:', error);
      toast.error('Failed to fetch assigned students.');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const openModal = (forumtableId, type, projectId, userId) => {
    setCurrentForumId(forumtableId);
    setCommentType(type);
    setCommentText('');
    setCurrentProjectId(projectId);
    setCurrentUserId(userId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentForumId(null);
    setCommentType(null);
    setCurrentProjectId(null);
    setCurrentUserId(null);
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) {
      toast.warn('Comment cannot be empty.');
      return;
    }

    const endpoint =
      commentType === 'suggestion'
        ? '/projectSubmission/addSuggestionToEvangadi'
        : '/projectSubmission/addCommentToStudent';

    try {
      await axiosInstance.post(
        endpoint,
        {
          forumtableId: currentForumId,
          message: commentText,
          projectId: currentProjectId,
          userId: currentUserId
        },
        { headers: { Authorization: authHeader } }
      );

      const res = await axiosInstance.post('/projectSubmission/getAssignedStudents', formData, {
        headers: { Authorization: authHeader }
      });
      setResults(res.data.data || []);
      closeModal();
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast.error('Something went wrong while submitting comment.');
    }
  };

  const openDeleteModal = (forumId) => {
    setCurrentForumId(forumId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCurrentForumId(null);
  };



  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/projectSubmission/deleteAssigned/${currentForumId}`, {
        headers: { Authorization: authHeader }
      });
      const res = await axiosInstance.post('/projectSubmission/getAssignedStudents', formData, {
        headers: { Authorization: authHeader }
      });
      setResults(res.data.data || []);
      toast.success('Deleted successfully.');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete.');
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer />
      <h3>List Of Project Assigned Students</h3>
      <hr />

      {/* FILTER FORM */}
      <form className="form-inline mb-4 w-50" onSubmit={handleSubmit}>
        {/* (Form fields as is...) */}
        <div className="form-group mr-3">
          <label className="mr-2">Batch</label>
          <select
            name="Batch"
            className="form-control"
            onChange={handleChange}
            value={formData.Batch}
            required
          >
            <option value="">Select</option>
            {[ 'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="form-group mr-3">
          <label className="mr-2">Group</label>
          <select
            name="Group"
            className="form-control"
            onChange={handleChange}
            value={formData.Group}
            required
          >
            <option value="">Select</option>
            {['Group-1', 'Group-2', 'Group-3', 'Group-4'].map((group) => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        <div className="form-group mr-3">
          <label className="mr-2">Project</label>
          <select
            name="projectId"
            className="form-control"
            onChange={handleChange}
            value={formData.projectId}
            required
          >
            <option value="">Select</option>
            {projects?.map((p, i) => (
              <option key={i} value={p.projectId}>{p.nameOfProject}</option>
            ))}
          </select>
        </div>

        <div className="form-group mr-3">
          <label className="mr-2">Year</label>
          <input
            type="number"
            name="Year"
            className="form-control"
            placeholder="e.g. 2025"
            value={formData.Year}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-success m-2">Get list</button>
      </form>

      {/* RESULT TABLE */}
      {results.length > 0 && (
        <div className="mt-4">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Suggestion to Evangadi</th>
                <th>Comment to Student</th>
                <th className='text-center'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, index) => (
                <tr key={index}>
                  <td>{item.User?.userFirstName}</td>
                  <td>{item.User?.userLastName}</td>
                  <td>{item.User?.userEmail}</td>
                  <td>{item.suggestionToEvangadi || 'No suggestion'}</td>
                  <td>{item.commentToStudent || 'No comment'}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info m-2"
                      onClick={() => openModal(item.forumtableId, 'suggestion', item.projectId, item.userId)}
                    >
                      Edit Suggestion
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary m-2"
                      onClick={() => openModal(item.forumtableId, 'comment', item.projectId, item.userId)}
                    >
                      Edit Comment
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger m-2"
                      onClick={() => openDeleteModal(item.forumtableId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* COMMENT MODAL */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {commentType === 'suggestion' ? 'Suggestion to Evangadi' : 'Comment to Student'}
                </h5>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                  placeholder="Enter your message here"
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleCommentSubmit}>Submit</button>
                <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this record?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={handleDelete}>Yes</button>
                <button className="btn btn-secondary" onClick={closeDeleteModal}>No</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectAssigned;
