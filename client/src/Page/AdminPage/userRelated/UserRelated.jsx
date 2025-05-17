// import React, { useEffect, useState } from "react";
// import styles from "./User.module.css";
// import { axiosInstance } from "../../../utility/axiosInstance";
// import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { PiSmileySadThin } from "react-icons/pi";
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

//   const getUsers = async () => {
//     try {
//       const response = await axiosInstance.get("/users/allUsers", {
//         headers: { Authorization: authHeader },
//       });
//       setUser(response.data);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const deleteUser = async (userId) => {
//     try {
//       await axiosInstance.delete(`/users/deleteUser/${userId}`, {
//         headers: { Authorization: authHeader },
//       });
//       getUsers();
//     } catch (error) {
//       console.error("Error deleting user:", error);
//     }
//   };

//   const ReverseSuggestion = async (userId) => {
//     try {
//       await axiosInstance.patch(
//         `/users/reverseStudentSuggestion/${userId}`,
//         {},
//         {
//           headers: { Authorization: authHeader },
//         }
//       );
//       allSuggestedUsersFinder();
//     } catch (error) {
//       console.error("Error reversing user suggestion:", error);
//     }
//   };

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
//       await axiosInstance.post("/users/suggestStudent", formData, {
//         headers: { Authorization: authHeader },
//       });

//       setFormData({
//         studentEmailAdress: "",
//         suggestionValue: "",
//       });
//       toast.success("Student suggested successfully");
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message ||
//           "Something went wrong, please check the email and try again"
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
//             No User to show <PiSmileySadThin />
//           </h4>
//         ) : (
//           <>
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
//                 rows={filteredUsers.map((user, index) => ({
//                   id: index,
//                   userFirstName: user.userFirstName,
//                   userLastName: user.userLastName,
//                   userEmail: user.userEmail,
//                   userPhoneNumber: user.userPhoneNumber,
//                   Batch: user.Batch,
//                   Group: user.Group,
//                   Year: user.Year,
//                   deleteStatus: user.userId,
//                 }))}
//                 columns={[
//                   { field: "userFirstName", headerName: "First Name", width: 140 },
//                   { field: "userLastName", headerName: "Last Name", width: 200 },
//                   { field: "userEmail", headerName: "Email", width: 200 },
//                   { field: "userPhoneNumber", headerName: "Phone number", width: 200 },
//                   { field: "Batch", headerName: "Batch", width: 120 },
//                   { field: "Group", headerName: "Group", width: 100 },
//                   { field: "Year", headerName: "Year", width: 100 },
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

//             <hr />
//           </>
//         )}
//       </div>

 


//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// }

// export default UserRelated;
// -------------------------------
import React, { useEffect, useState } from "react";
import styles from "./User.module.css";
import { axiosInstance } from "../../../utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiSmileySadThin } from "react-icons/pi";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function UserRelated() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const authHeader = useAuthHeader();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axiosInstance.get("/users/allUsers", {
        headers: { Authorization: authHeader },
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowModal = (userId) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedUserId(null);
    setShowModal(false);
  };

  const confirmDeleteUser = async () => {
    try {
      await axiosInstance.delete(`/users/deleteUser/${selectedUserId}`, {
        headers: { Authorization: authHeader },
      });
      toast.success("User deleted successfully");
      getUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      handleCloseModal();
    }
  };

  const filteredUsers = users.filter((user) =>
    user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginationModel = { page: 0, pageSize: 3 };

  return (
    <>
      <div className={`${styles.formPart} mt-5`}></div>
      <div className="text-underline container mx-auto row m-4">
        <hr />
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
                rows={filteredUsers.map((user, index) => ({
                  id: index,
                  userFirstName: user.userFirstName,
                  userLastName: user.userLastName,
                  userEmail: user.userEmail,
                  userPhoneNumber: user.userPhoneNumber,
                  Batch: user.Batch,
                  Group: user.Group,
                  Year: user.Year,
                  deleteStatus: user.userId,
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
                          onClick={() => handleShowModal(params.row.deleteStatus)}
                          variant="danger"
                        >
                          Delete
                        </Button>
                      ) : (
                        "Can't update"
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
          </>
        )}
      </div>

      {/* Confirm Delete Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure you want to delete this user?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          This action will not be reverted.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default UserRelated;
