// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
// import { axiosInstance } from '../../../utility/axiosInstance';
// import ClipLoader from 'react-spinners/ClipLoader'
// import { Button } from '@mui/material';
// const ForumAssignment = () => {
//   const [projects, setProjects] = useState([]);
//   const [formData, setFormData] = useState({
//     Batch: '',
//     Group: '',
//     Year: '',
//   });
//   const [results, setResults] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [Loading,setLoading]=useState(false)
//   const itemsPerPage = 10;
//   const authHeader = useAuthHeader();

//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const res = await axiosInstance.get('/projectCreation/getProjectsForStudents', { headers: { Authorization: authHeader } });
//         setProjects(res.data.projects || []);
//       } catch (error) {
//         console.error('Error fetching projects:', error);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true)
//     try {
//       const res= await axiosInstance.post('/projectSubmission/usersForForum',formData,{headers: {Authorization:authHeader}})
//       setResults(res.data.data || []);
//       setCurrentPage(1);
//       setLoading(false)
//     } catch (error) {
//       console.error('Error fetching filtered results:', error);
//       setLoading(false)
//     }
//   };

//   const AssignToGroup = (id)=>{
//       console.log(`this is the id : ${id}`)
//   }



//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(results.length / itemsPerPage);


// console.log(currentItems)


//   return (
//     <div className="container mt-4">
//       <form className="form-inline mb-4 container w-25" onSubmit={handleSubmit}>
//         <div className="form-group mr-3">
//           <label className="mr-2">Batch</label>
//           <select
//             name="Batch"
//             className="form-control"
//             onChange={handleChange}
//             value={formData.Batch}
//           >
//             <option value="">Select</option>
//             {[
//               'January', 'February', 'March', 'April', 'May', 'June',
//               'July', 'August', 'September', 'October', 'November', 'December'
//             ].map((month) => (
//               <option key={month} value={month}>
//                 {month}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group mr-3">
//           <label className="mr-2">Group</label>
//           <select
//             name="Group"
//             className="form-control"
//             onChange={handleChange}
//             value={formData.Group}
//           >
//             <option value="">Select</option>
//             {['Group 1', 'Group 2', 'Group 3', 'Group 4'].map((group) => (
//               <option key={group} value={group}>
//                 {group}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="form-group mr-3">
//           <label className="mr-2">Year</label>
//           <input
//             type="number"
//             name="Year"
//             className="form-control"
//             placeholder="e.g. 2025"
//             value={formData.Year}
//             onChange={handleChange}
//           />
//         </div>

//         {/* <div className="form-group mr-3">
//           <label className="mr-2">Project</label>
//           <select
//             name="Project"
//             className="form-control"
//             onChange={handleChange}
//             value={formData.Project}
//           >
//             <option value="">Select Project</option>
//             {projects.map((project) => (
//               <option key={project.projectId} value={project.nameOfProject}>
//                 {project.nameOfProject}
//               </option>
//             ))}
//           </select>
//         </div> */}

//        {Loading?  <button type="submit" className="btn btn-primary m-2"><ClipLoader size={1} /></button> : <button type="submit" className="btn btn-primary m-2"> Get list </button>} 
//       </form>

//       <table className="table table-bordered">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>First name</th>
//             <th>Last name</th>
//             <th>Email</th>
//             <th>Phone number</th>
//             <th>Assign</th>
//           </tr>
//         </thead>
//         <tbody>
//           {currentItems.length > 0 ? (
//             currentItems.map((item, index) => (
//               <tr key={index}>
//                 <td>{indexOfFirstItem + index + 1}</td>
//                 <td>{item.firstName}</td>
//                 <td>{item.lastName}</td>
//                 <td>{item.email}</td>
//                 <td>{item.phoneNumber}</td>
//                 <td><Button variant='outlined' onClick={()=>AssignToGroup(item.userID,item.email,item.Batch,item.InitialEvangadiGroup)}>Assign</Button></td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" className="text-center">
//                 No data to display
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {totalPages > 1 && (
//         <nav>
//           <ul className="pagination justify-content-center">
//             {[...Array(totalPages)].map((_, i) => (
//               <li
//                 key={i}
//                 className={`page-item ${i + 1 === currentPage ? 'active' : ''}`}
//               >
//                 <button className="page-link" onClick={() => paginate(i + 1)}>
//                   {i + 1}
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       )}
//     </div>
//   );
// };

// export default ForumAssignment;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { axiosInstance } from '../../../utility/axiosInstance';
import ClipLoader from 'react-spinners/ClipLoader';
import { Button } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForumAssignment = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    Batch: '',
    Group: '',
    Year: '',
  });
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [Loading, setLoading] = useState(false);
  const authHeader = useAuthHeader();
  const itemsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [assignForm, setAssignForm] = useState({
    group: '',
    projectId: ''
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axiosInstance.get('/projectCreation/getProjectsForStudents', {
          headers: { Authorization: authHeader }
        });
        setProjects(res.data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Error fetching projects');
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
    setLoading(true);
    try {
      const res = await axiosInstance.post('/projectSubmission/usersForForum', formData, {
        headers: { Authorization: authHeader }
      });
      setResults(res.data.data || []);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error fetching filtered results:', error);
    }
    setLoading(false);
  };

  const AssignToGroup = (userId, userEmail, batch, year) => {
    setSelectedUser({ userId, userEmail, batch , year});
    setAssignForm({ group: '', projectId: '' });
    setShowModal(true);
  };

  const handleAssignChange = (e) => {
    setAssignForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAssignSubmit = async () => {
    if (!assignForm.group || !assignForm.projectId) {
    toast.error("Please select both group and project");
      return;
    }
    const payload = {
      userId: selectedUser.userId,
      userEmail: selectedUser.userEmail,
      Batch: selectedUser.batch,
      Group: assignForm.group,
      projectId: assignForm.projectId,
      year: selectedUser.year
    };
   
    try {
     const response =  await axiosInstance.post('/projectSubmission/assignProject', payload, {
        headers: { Authorization: authHeader }
      });
      toast.success(response.data.message);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);


  return (
    <div className="container mt-4">
    <ToastContainer position="top-right" autoClose={3000} />
      <form className="form-inline mb-4 container w-25" onSubmit={handleSubmit}>
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

        {Loading ?
          <button type="submit" className="btn btn-primary m-2"><ClipLoader size={1} /></button> :
          <button type="submit" className="btn btn-primary m-2"> Get list </button>
        }
      </form>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>First name</th>
            <th>Last name</th>
            <th>Email</th>
            <th>Phone number</th>
            <th>Assign</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.email}</td>
                <td>{item.phoneNumber}</td>
                <td>
                  <Button variant='outlined' onClick={() => AssignToGroup(item.userID, item.email, item.Batch,item.Year)}>
                    Assign
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No data to display
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

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px' }}>
            <h5>Assign Student</h5>

            <div className="form-group mb-2">
              <label>Group</label>
              <select required className="form-control" name="group" value={assignForm.group} onChange={handleAssignChange}>
                <option  value="">Select Group</option>
                {['Group-1', 'Group-2', 'Group-3', 'Group-4'].map((group) => (
                  <option required key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="form-group mb-2">
              <label>Project</label>
              <select  className="form-control" name="projectId" value={assignForm.projectId} onChange={handleAssignChange}>
                <option  value="">Select Project</option>
                {projects.map((proj) => (
                  <option required key={proj.projectId} value={proj.projectId}>{proj.nameOfProject}</option>
                ))}
              </select>
            </div>

            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary m-2" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary m-2" onClick={handleAssignSubmit}>Assign</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForumAssignment;
