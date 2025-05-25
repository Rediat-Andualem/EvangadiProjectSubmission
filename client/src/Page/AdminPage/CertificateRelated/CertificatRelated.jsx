import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { axiosInstance } from '../../../utility/axiosInstance';
const ProjectFilter = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    Batch: '',
    Group: '',
    Year: '',
    Project: ''
  });
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const authHeader = useAuthHeader();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get('/projectCreation/getProjectsForStudents', { headers: { Authorization: authHeader } });
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/projectSubmission/illegibility', formData , { headers: { Authorization: authHeader } });
      setResults(res.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching filtered results:', error);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <form className="form-inline mb-4" onSubmit={handleSubmit}>
        <div className="form-group mr-3">
          <label className="mr-2">Batch</label>
          <select
            name="Batch"
            className="form-control"
            onChange={handleChange}
            value={formData.Batch}
          >
            <option value="">Select</option>
            {[
              'January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'
            ].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
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
          >
            <option value="">Select</option>
            {['Group 1', 'Group 2', 'Group 3', 'Group 4'].map((group) => (
              <option key={group} value={group}>
                {group}
              </option>
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
          />
        </div>

        <div className="form-group mr-3">
          <label className="mr-2">Project</label>
          <select
            name="Project"
            className="form-control"
            onChange={handleChange}
            value={formData.Project}
          >
            <option value="">Select Project</option>
            {projects.map((project) => (
              <option key={project.projectId} value={project.nameOfProject}>
                {project.nameOfProject}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Fetch</button>
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Batch</th>
            <th>Group</th>
            <th>Year</th>
            <th>Project</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{item.Batch}</td>
                <td>{item.Group}</td>
                <td>{item.Year}</td>
                <td>{item.Project}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            {[...Array(totalPages)].map((_, i) => (
              <li
                key={i}
                className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}
              >
                <button className="page-link" onClick={() => paginate(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default ProjectFilter;
