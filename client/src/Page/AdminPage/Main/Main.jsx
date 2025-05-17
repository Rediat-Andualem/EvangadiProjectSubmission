import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import styles from "./Main.module.css";
import StudentsRelated from "../studentsRelated/StudentRelated";
import ProjectRelated from "../projectRelated/ProjectRelated";
import UserRelated from "../userRelated/UserRelated"
import Suggestion from "../../suggestionPage/Suggestion";
function Main() {
  const [activeComponent, setActiveComponent] = useState(null);

  const renderComponent = () => {
    switch (activeComponent) {
      case "studentForAdmin":
        return <StudentsRelated />;
      case "ProjectsForAdmin":
        return <ProjectRelated />;
      case "studentRelated":
        return <UserRelated />;
      case "studentSuggestion":
        return <Suggestion />;
      default:
        return (
          <div>
            <h1 className="text-center text-decoration-underline">Select an option from the left</h1>
            <ul>
              <li >
                To review student projects and view their status, select
                "Student Related".
              </li>
              <li>
                To create a project or manage all project-related tasks, select
                "Project Related".
              </li>
            </ul>
          </div>
        );
    }
  };

  return (
    <div className={styles.buttonList}>
      {/* Left Column - Buttons */}
      <div className={styles.sidebar}>
        <Button
          onClick={() => setActiveComponent("studentForAdmin")}
          className={styles.forButton}
          variant="outline-success"
        >
          Submission related
        </Button>
        <Button
          onClick={() => setActiveComponent("ProjectsForAdmin")}
          className={styles.forButton}
          variant="outline-success"
        >
          Project Related
        </Button>
        <Button
          onClick={() => setActiveComponent("studentRelated")}
          className={styles.forButton}
          variant="outline-success"
        >
          User Related
        </Button>
        <Button
          onClick={() => setActiveComponent("studentSuggestion")}
          className={styles.forButton}
          variant="outline-success"
        >
     Student Suggestion
        </Button>
      </div>

      {/* Right Column - Dynamic Content */}
      <div className={styles.contentArea}>{renderComponent()}</div>
    </div>
  );
}

export default Main;
