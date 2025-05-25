import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import styles from "./Main.module.css";
import StudentsRelated from "../studentsRelated/StudentRelated";
import ProjectRelated from "../projectRelated/ProjectRelated";
import UserRelated from "../userRelated/UserRelated";
import Suggestion from "../../suggestionPage/Suggestion";
import BatchWiseCompletion from "../BatchWiseCompletion/BatchWiseCompletion";
import OverallCompletion from "../OverAllCompletion/OverallCompletion";
import ForumAssigning from "../ForumAssigning/ForumAssigning"
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
      case "batchwiseCompletion":
        return <BatchWiseCompletion />;
      case "overallCompletion":
        return <OverallCompletion />;
      case "forumAssign":
        return <ForumAssigning/>;
      default:
        return (
          <div>
            <h1 className="text-center text-decoration-underline m-3">
              Select an option from the left
            </h1>
            <ul className="m-5 fw-bold">
              <li className="m-3">
                To review or view student projects and check their status,
                select "Submission Related".
              </li>
              <li className="m-3">
                To create a project or manage all project-related tasks, select
                "Project Related".
              </li>
              <li className="m-3">For user-related management, select "User Related".</li>
              <li className="m-3">
                To view student suggestions for Evangadi and related topics,
                select "Student Suggestion".
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
          onClick={() => setActiveComponent("forumAssign")}
          className={styles.forButton}
          variant="outline-success"
        >
        Group assign for Forum
        </Button>
        <Button
          onClick={() => setActiveComponent("batchwiseCompletion")}
          className={styles.forButton}
          variant="outline-success"
        >
          Batch wise  completion
        </Button>
        <Button
          onClick={() => setActiveComponent("overallCompletion")}
          className={styles.forButton}
          variant="outline-success"
        >
          Overall completion
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
