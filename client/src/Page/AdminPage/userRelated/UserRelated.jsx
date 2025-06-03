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
// import Modal from "react-bootstrap/Modal";

// function UserRelated() {
//   const [users, setUsers] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(null);
//   const authHeader = useAuthHeader();

//   useEffect(() => {
//     getUsers();
//   }, []);

//   const getUsers = async () => {
//     try {
//       const response = await axiosInstance.get("/users/allUsers", {
//         headers: { Authorization: authHeader },
//       });
//       setUsers(response.data);
//     } catch (error) {
//       console.log(error.message);
//     }
//   };

//   const handleShowModal = (userId) => {
//     setSelectedUserId(userId);
//     setShowModal(true);
//   };

//   const handleCloseModal = () => {
//     setSelectedUserId(null);
//     setShowModal(false);
//   };

//   const confirmDeleteUser = async () => {
//     try {
//       await axiosInstance.delete(`/users/deleteUser/${selectedUserId}`, {
//         headers: { Authorization: authHeader },
//       });
//       toast.success("User deleted successfully");
//       getUsers();
//     } catch (error) {
//       toast.error("Failed to delete user");
//     } finally {
//       handleCloseModal();
//     }
//   };

//   const filteredUsers = users.filter((user) =>
//     user.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const paginationModel = { page: 0, pageSize: 3 };

//   return (
//     <>
//       <div className={`${styles.formPart} mt-5`}></div>
//       <div className="text-underline container mx-auto row m-4">
//         <hr />
//         <h4 className="text-center">Students list</h4>
//      {!users || users.length === 0 ? (
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
//                           onClick={() => handleShowModal(params.row.deleteStatus)}
//                           variant="danger"
//                         >
//                           Delete
//                         </Button>
//                       ) : (
//                         "Can't update"
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

//       {/* Confirm Delete Modal */}
//       <Modal show={showModal} onHide={handleCloseModal} centered>
//         <Modal.Header closeButton>
//           <Modal.Title>Are you sure you want to delete this user?</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           This action will not be reverted.
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseModal}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={confirmDeleteUser}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// }

// export default UserRelated;
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
import MoonLoader from "react-spinners/MoonLoader"; // <-- Add this if not already imported

function UserRelated() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false); // <-- Add loading state

  const authHeader = useAuthHeader();

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axiosInstance.get("/users/allUsers", {
        headers: { Authorization: authHeader },
      });
      setUsers(response.data);
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false); // Stop loading regardless of success/failure
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

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
            <MoonLoader color="#FF8500" />
          </div>
        ) : users.length === 0 ? (
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
        <Modal.Body>This action will not be reverted.</Modal.Body>
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
