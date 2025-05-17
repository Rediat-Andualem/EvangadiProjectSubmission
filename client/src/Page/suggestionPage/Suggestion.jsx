import React, { useEffect, useState } from "react";
import styles from "./Suggestion.module.css";
import { axiosInstance } from "../../utility/axiosInstance";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PiSmileySadThin } from "react-icons/pi";

import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "react-bootstrap/Button";

function Suggestion() {
  const [formData, setFormData] = useState({
    studentEmailAdress: "",
    suggestionValue: "",
  });

  const [suggestedStudents, setSuggestedStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [searchBatch, setSearchBatch] = useState("");
  const [searchYear, setSearchYear] = useState("");

  const authHeader = useAuthHeader();

  useEffect(() => {
    allSuggestedUsersFinder();
  }, []);

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

      setFormData({ studentEmailAdress: "", suggestionValue: "" });
      toast.success("Student suggested successfully");
      allSuggestedUsersFinder();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please check the email and try again."
      );
    }
  };

  const allSuggestedUsersFinder = async () => {
    try {
      const response = await axiosInstance.get("/users/findSuggestedStudents", {
        headers: { Authorization: authHeader },
      });
      setSuggestedStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error("Failed to fetch suggested students:", error.message);
    }
  };

  const reverseSuggestion = async (userId) => {
    try {
      await axiosInstance.patch(
        `/users/reverseStudentSuggestion/${userId}`,
        {},
        { headers: { Authorization: authHeader } }
      );
      allSuggestedUsersFinder();
    } catch (error) {
      console.error("Error reversing suggestion:", error);
    }
  };

  const handleSearch = () => {
    const filtered = suggestedStudents.filter((student) => {
      const matchesBatch = searchBatch
        ? student.Batch?.toLowerCase() === searchBatch.toLowerCase()
        : true;
      const matchesYear = searchYear
        ? student.Year?.toString() === searchYear
        : true;
      return matchesBatch && matchesYear;
    });
    setFilteredStudents(filtered);
  };

  const handleClearFilters = () => {
    setSearchBatch("");
    setSearchYear("");
    setFilteredStudents(suggestedStudents);
  };

  const paginationModel = { page: 0, pageSize: 5 };

  return (
    <>
      <h3 className="text-decoration-underline">Suggest student for Evangadi</h3>

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

      <h3 className="text-decoration-underline mt-5">List of suggested students</h3>

      {/* Search Filters */}
      <div className="d-flex gap-3 align-items-end mt-3 mb-3">
        <div>
          <label className="form-label">Search by Batch</label>
          <input
            type="text"
            className="form-control"
            value={searchBatch}
            onChange={(e) => setSearchBatch(e.target.value)}
            placeholder="e.g., Batch 3"
          />
        </div>
        <div>
          <label className="form-label">Search by Year</label>
          <input
            type="text"
            className="form-control"
            value={searchYear}
            onChange={(e) => setSearchYear(e.target.value)}
            placeholder="e.g., 2024"
          />
        </div>
        <div>
          <Button variant="primary" onClick={handleSearch}>Search</Button>
        </div>
        <div>
          <Button variant="secondary" onClick={handleClearFilters}>Clear</Button>
        </div>
      </div>

      <div className="container mb-3">
        {!filteredStudents || filteredStudents.length === 0 ? (
          <h4>
            No suggested student to show <PiSmileySadThin />
          </h4>
        ) : (
          <Paper sx={{ height: "90%", width: "100%", margin: "2%" }}>
            <DataGrid
              rows={filteredStudents.map((student, index) => ({
                id: index,
                userFirstName: student.userFirstName,
                userLastName: student.userLastName,
                userEmail: student.userEmail,
                userPhoneNumber: student.userPhoneNumber,
                Batch: student.Batch,
                Group: student.Group,
                Year: student.Year,
                suggestionLevel:
                  student.suggestedForEvangadi === "0"
                    ? "Perfect"
                    : student.suggestedForEvangadi === "1"
                    ? "Good"
                    : student.suggestedForEvangadi === "2"
                    ? "Reserved"
                    : "",
                updateSuggestion: student.userId,
              }))}
              columns={[
                { field: "userFirstName", headerName: "First Name", width: 140 },
                { field: "userLastName", headerName: "Last Name", width: 140 },
                { field: "userEmail", headerName: "Email", width: 200 },
                { field: "userPhoneNumber", headerName: "Phone", width: 160 },
                { field: "Batch", headerName: "Batch", width: 120 },
                { field: "Group", headerName: "Group", width: 100 },
                { field: "Year", headerName: "Year", width: 100 },
                { field: "suggestionLevel", headerName: "Level", width: 120 },
                {
                  field: "action",
                  headerName: "Reverse",
                  renderCell: (params) => (
                    <Button
                      onClick={() => reverseSuggestion(params.row.updateSuggestion)}
                      variant="danger"
                    >
                      Reverse
                    </Button>
                  ),
                  width: 130,
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

export default Suggestion;
