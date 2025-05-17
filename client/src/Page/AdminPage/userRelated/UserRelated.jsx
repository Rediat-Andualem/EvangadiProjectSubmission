// import React, { useEffect, useState } from "react";
// import styles from "./User.module.css";
// import { axiosInstance } from "../../../utility/axiosInstance";
// import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { PiSmileySadThin } from "react-icons/pi";

// // For table view
// import { DataGrid } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";
// import Button from "react-bootstrap/Button";

// function UserRelated() {
//   const [formData, setFormData] = useState({
//     studentEmailAdress: "",
//     suggestionValue: "",
//   });

//   const [users, setUser] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [suggestedStudents, setSuggestedStudents] = useState([]);
//   const authHeader = useAuthHeader();

//   useEffect(() => {
//     getUsers();
//     allSuggestedUsersFinder();
//   }, []);

//   // ✅ Get users from API
//   const getUsers = async () => {
//     try {
//       let projectsList = await axiosInstance.get("/users/allUsers", {
//         headers: {
//           Authorization: authHeader,
//         },
//       });
//       setUser(projectsList.data);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   // ✅ Delete user by ID
//   let deleteUser = async (userId) => {
//     try {
//       await axiosInstance.delete(`/users/deleteUser/${userId}`, {
//         headers: {
//           Authorization: authHeader,
//         },
//       });
//       getUsers();
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };


// let ReverseSuggestion = async (userId) => {
//   try {
//     await axiosInstance.patch(
//       `/users/reverseStudentSuggestion/${userId}`,
//       {}, // No request body
//       {
//         headers: {
//           Authorization: authHeader,
//         },
//       }
//     );

//     allSuggestedUsersFinder();
//   } catch (error) {
//     console.error("Error reversing user suggestion:", error);
//   }
// };



//   // ✅ Filter users by email (case-insensitive)
//   const filteredUsers = users.filter((user) =>
//     user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const suggestion = await axiosInstance.post(
//         "/users/suggestStudent",
//         formData,
//         {
//           headers: { Authorization: authHeader },
//         }
//       );

//       setFormData({
//         studentEmailAdress: "",
//         suggestionValue: "",
//       });
//       toast.success("student suggested successfully");

//       //  toast.success('student suggestion successful!')
//     } catch (error) {
//       toast.error(
//         error.response.data.message
//           ? error.response.data.message
//           : "something went wrong, please check the email and try again"
//       );
//     }
//   };
//   const allSuggestedUsersFinder = async () => {
//     try {
//       const response = await axiosInstance.get("/users/findSuggestedStudents", {
//         headers: { Authorization: authHeader }, 
//       });
//       setSuggestedStudents(response.data);
//     } catch (error) {
//       console.error("Failed to fetch suggested students:", error.message);
//     }
//   };

//   const paginationModel = { page: 0, pageSize: 3 };




//   return (
//     <>
//       <div className={`${styles.formPart} mt-5`}></div>
//       <div className="text-underline container mx-auto row m-4">
//         <hr />
//         <h4 className="text-center">Students list</h4>

//         {!users || users.length === 0 ? (
//           <h4>
//             No User to show <PiSmileySadThin />{" "}
//           </h4>
//         ) : (
//           <>
//             {/* ✅ Search box */}
//             <div className="d-flex justify-content-end mb-3">
//               <input
//                 type="text"
//                 placeholder="Search student by email"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="form-control w-25"
//               />
//             </div>
//             <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
//               <DataGrid
//                 rows={filteredUsers?.map((singleUser, index) => ({
//                   id: index,
//                   userFirstName: singleUser.userFirstName,
//                   userLastName: singleUser.userLastName,
//                   userEmail: singleUser.userEmail,
//                   userPhoneNumber: singleUser.userPhoneNumber,
//                   Batch: singleUser.Batch,
//                   Group: singleUser.Group,
//                   Year: singleUser.Year,
//                   deleteStatus: singleUser.userId,
//                 }))}
//                 columns={[
//                   {
//                     field: "userFirstName",
//                     headerName: "First Name",
//                     width: 140,
//                   },
//                   {
//                     field: "userLastName",
//                     headerName: "Last Name",
//                     width: 200,
//                   },
//                   { field: "userEmail", headerName: "Email", width: 200 },
//                   {
//                     field: "userPhoneNumber",
//                     headerName: "Phone number",
//                     width: 200,
//                   },
//                   {
//                     field: "Batch",
//                     headerName: "Batch",
//                     width: 120,
//                   },
//                   {
//                     field: "Group",
//                     headerName: "Group",
//                     width: 100,
//                   },
//                   {
//                     field: "Year",
//                     headerName: "Year",
//                     width: 100,
//                   },
//                   {
//                     field: "action",
//                     headerName: "Action",
//                     renderCell: (params) =>
//                       params.row.deleteStatus ? (
//                         <Button
//                           style={{ margin: "5px" }}
//                           onClick={() => deleteUser(params.row.deleteStatus)}
//                           variant="danger"
//                         >
//                           Delete
//                         </Button>
//                       ) : (
//                         "you can't update"
//                       ),
//                     width: 150,
//                   },
//                 ]}
//                 initialState={{ pagination: { paginationModel } }}
//                 pageSizeOptions={[5, 10]}
//                 checkboxSelection={false}
//                 sx={{ border: 2 }}
//               />
//             </Paper>
//                 <hr />
//       <h3>List of suggested students</h3>
//       {!suggestedStudents || suggestedStudents.length === 0 ? (  <h4>
//             No suggested student to show <PiSmileySadThin />{" "}
//           </h4>) : ( <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
//               <DataGrid
//                 rows={suggestedStudents?.map((singleSuggestion, index) => ({
//                   id: index,
//                   userFirstName: singleSuggestion.userFirstName,
//                   userLastName: singleSuggestion.userLastName,
//                   userEmail: singleSuggestion.userEmail,
//                   userPhoneNumber: singleSuggestion.userPhoneNumber,
//                   Batch: singleSuggestion.Batch,
//                   Group: singleSuggestion.Group,
//                   Year: singleSuggestion.Year,
//                   updateSuggestion: singleSuggestion.userId,
//                 }))}
//                 columns={[
//                   {
//                     field: "userFirstName",
//                     headerName: "First Name",
//                     width: 140,
//                   },
//                   {
//                     field: "userLastName",
//                     headerName: "Last Name",
//                     width: 200,
//                   },
//                   { field: "userEmail", headerName: "Email", width: 200 },
//                   {
//                     field: "userPhoneNumber",
//                     headerName: "Phone number",
//                     width: 200,
//                   },
//                   {
//                     field: "Batch",
//                     headerName: "Batch",
//                     width: 120,
//                   },
//                   {
//                     field: "Group",
//                     headerName: "Group",
//                     width: 100,
//                   },
//                   {
//                     field: "Year",
//                     headerName: "Year",
//                     width: 100,
//                   },
//                   {
//                     field: "action",
//                     headerName: "Reverse suggestion",
//                     renderCell: (params) =>
//                       <Button
//                           style={{ margin: "5px" }}
//                           onClick={() => ReverseSuggestion(params.row.updateSuggestion)}
//                           variant="danger"
//                         >
//                           Reverse
//                         </Button>,
                      
//                     width: 150,
//                   },
//                 ]}
//                 initialState={{ pagination: { paginationModel } }}
//                 pageSizeOptions={[5, 10]}
//                 checkboxSelection={false}
//                 sx={{ border: 2 }}
//               />
//             </Paper>) }
                 
//           </>
//         )}
//       </div>
//       <hr />
//       <h3>Suggest student for Evangadi</h3>

//       <div className={`${styles.formPart} mt-5`}>
//         <form onSubmit={handleSubmit} className={styles.projectForm}>
//           <div className="mb-3">
//             <label className="form-label">Email address of student</label>
//             <input
//               name="studentEmailAdress"
//               value={formData.studentEmailAdress}
//               onChange={handleChange}
//               className="form-control"
//               placeholder="pass student email address"
//               required
//             />
//           </div>

//           <div className="mb-3">
//             <label className="form-label">Suggest Category</label>
//             <select
//               name="suggestionValue"
//               value={formData.suggestionValue}
//               onChange={handleChange}
//               className="form-select"
//               required
//             >
//               <option value="" disabled>
//                 Select category
//               </option>
//               <option value="0">Perfect</option>
//               <option value="1">Good</option>
//               <option value="2">Reserved</option>
//             </select>
//           </div>

//           <button type="submit" className="btn btn-primary w-100">
//             Suggest student
//           </button>
//         </form>
//       </div>

  
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//     </>
//   );
// }

// export default UserRelated;
// --------------------------------------------------------------------
import React, { useEffect, useState } from "react";
import styles from "./User.module.css";
import { axiosInstance } from "../../../utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiSmileySadThin } from "react-icons/pi";

// For table view
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";

function UserRelated() {
  const [formData, setFormData] = useState({
    studentEmailAdress: "",
    suggestionValue: "",
  });

  const [users, setUser] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestedSearchTerm, setSuggestedSearchTerm] = useState("");
  const [suggestedStudents, setSuggestedStudents] = useState([]);
  const authHeader = useAuthHeader();

  useEffect(() => {
    getUsers();
    allSuggestedUsersFinder();
  }, []);

  const getUsers = async () => {
    try {
      let projectsList = await axiosInstance.get("/users/allUsers", {
        headers: {
          Authorization: authHeader,
        },
      });
      setUser(projectsList.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  let deleteUser = async (userId) => {
    try {
      await axiosInstance.delete(`/users/deleteUser/${userId}`, {
        headers: {
          Authorization: authHeader,
        },
      });
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  let ReverseSuggestion = async (userId) => {
    try {
      await axiosInstance.patch(
        `/users/reverseStudentSuggestion/${userId}`,
        {},
        {
          headers: {
            Authorization: authHeader,
          },
        }
      );
      allSuggestedUsersFinder();
    } catch (error) {
      console.error("Error reversing user suggestion:", error);
    }
  };

  // ✅ Filter users by email (case-insensitive)
  const filteredUsers = users.filter((user) =>
    user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Filter suggested students by email (case-insensitive)
  const filteredSuggestedStudents = suggestedStudents.filter((student) =>
    student.userEmail.toLowerCase().includes(suggestedSearchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/users/suggestStudent", formData, {
        headers: { Authorization: authHeader },
      });

      setFormData({
        studentEmailAdress: "",
        suggestionValue: "",
      });

      toast.success("Student suggested successfully");
      allSuggestedUsersFinder();
    } catch (error) {
      toast.error(
        error.response?.data?.message
          ? error.response.data.message
          : "Something went wrong. Please check the email and try again."
      );
    }
  };

  const allSuggestedUsersFinder = async () => {
    try {
      const response = await axiosInstance.get("/users/findSuggestedStudents", {
        headers: { Authorization: authHeader },
      });
      setSuggestedStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch suggested students:", error.message);
    }
  };

  const paginationModel = { page: 0, pageSize: 3 };

  return (
    <>
      <div className={`${styles.formPart}`}></div>
      <div className="text-underline container mx-auto row ">
        <h4 className="text-center">Students list</h4>

        {!users || users.length === 0 ? (
          <h4>
            No User to show <PiSmileySadThin />
          </h4>
        ) : (
          <>
            <div className="d-flex justify-content-end mb-3">
              <input
                type="text"
                placeholder="Search student by email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control w-25"
              />
            </div>

            <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
              <DataGrid
                rows={filteredUsers.map((singleUser, index) => ({
                  id: index,
                  userFirstName: singleUser.userFirstName,
                  userLastName: singleUser.userLastName,
                  userEmail: singleUser.userEmail,
                  userPhoneNumber: singleUser.userPhoneNumber,
                  Batch: singleUser.Batch,
                  Group: singleUser.Group,
                  Year: singleUser.Year,
                  deleteStatus: singleUser.userId,
                }))}
                columns={[
                  { field: "userFirstName", headerName: "First Name", width: 140 },
                  { field: "userLastName", headerName: "Last Name", width: 200 },
                  { field: "userEmail", headerName: "Email", width: 200 },
                  { field: "userPhoneNumber", headerName: "Phone number", width: 200 },
                  { field: "Batch", headerName: "Batch", width: 120 },
                  { field: "Group", headerName: "Group", width: 100 },
                  { field: "Year", headerName: "Year", width: 100 },
                  {
                    field: "action",
                    headerName: "Action",
                    renderCell: (params) =>
                      params.row.deleteStatus ? (
                        <Button
                          style={{ margin: "5px" }}
                          onClick={() => deleteUser(params.row.deleteStatus)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      ) : (
                        "you can't update"
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

            <hr />
            <h3>List of suggested students</h3>

            {/* ✅ Search box for suggested students */}
            <div className="d-flex justify-content-end mb-3">
              <input
                type="text"
                placeholder="Search suggested student by email"
                value={suggestedSearchTerm}
                onChange={(e) => setSuggestedSearchTerm(e.target.value)}
                className="form-control w-25"
              />
            </div>

            {!filteredSuggestedStudents || filteredSuggestedStudents.length === 0 ? (
              <h4>
                No suggested student to show <PiSmileySadThin />
              </h4>
            ) : (
              <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
                <DataGrid
                  rows={filteredSuggestedStudents.map((student, index) => ({
                    id: index,
                    userFirstName: student.userFirstName,
                    userLastName: student.userLastName,
                    userEmail: student.userEmail,
                    userPhoneNumber: student.userPhoneNumber,
                    Batch: student.Batch,
                    Group: student.Group,
                    Year: student.Year,
                    updateSuggestion: student.userId,
                  }))}
                  columns={[
                    { field: "userFirstName", headerName: "First Name", width: 140 },
                    { field: "userLastName", headerName: "Last Name", width: 200 },
                    { field: "userEmail", headerName: "Email", width: 200 },
                    { field: "userPhoneNumber", headerName: "Phone number", width: 200 },
                    { field: "Batch", headerName: "Batch", width: 120 },
                    { field: "Group", headerName: "Group", width: 100 },
                    { field: "Year", headerName: "Year", width: 100 },
                    {
                      field: "action",
                      headerName: "Reverse suggestion",
                      renderCell: (params) => (
                        <Button
                          style={{ margin: "5px" }}
                          onClick={() => ReverseSuggestion(params.row.updateSuggestion)}
                          variant="danger"
                        >
                          Reverse
                        </Button>
                      ),
                      width: 180,
                    },
                  ]}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection={false}
                  sx={{ border: 2 }}
                />
              </Paper>
            )}
          </>
        )}
      </div>

      <hr />
      <h3>Suggest student for Evangadi</h3>

      <div className={`${styles.formPart} mt-5`}>
        <form onSubmit={handleSubmit} className={styles.projectForm}>
          <div className="mb-3">
            <label className="form-label">Email address of student</label>
            <input
              name="studentEmailAdress"
              value={formData.studentEmailAdress}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter student email address"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Suggest Category</label>
            <select
              name="suggestionValue"
              value={formData.suggestionValue}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="" disabled>Select category</option>
              <option value="0">Perfect</option>
              <option value="1">Good</option>
              <option value="2">Reserved</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Suggest student
          </button>
        </form>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </>
  );
}

export default UserRelated;
