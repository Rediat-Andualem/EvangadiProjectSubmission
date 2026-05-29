// import React, { useState } from "react";
// import Button from "react-bootstrap/Button";
// import styles from "./Main.module.css";
// import StudentsRelated from "../studentsRelated/StudentRelated";
// import ProjectRelated from "../projectRelated/ProjectRelated";
// import UserRelated from "../userRelated/UserRelated";
// import Suggestion from "../../suggestionPage/Suggestion";
// import BatchWiseCompletion from "../BatchWiseCompletion/BatchWiseCompletion";
// import OverallCompletion from "../OverAllCompletion/OverallCompletion";
// import ForumAssigning from "../ForumAssignement/ForumAssignement";
// import ProjectAssigned from "../ViewProjectAssigned/VewAssignedStudents";
// function Main() {
//   const [activeComponent, setActiveComponent] = useState(null);

//   const renderComponent = () => {
//     switch (activeComponent) {
//       case "studentForAdmin":
//         return <StudentsRelated />;
//       case "ProjectsForAdmin":
//         return <ProjectRelated />;
//       case "studentRelated":
//         return <UserRelated />;
//       case "studentSuggestion":
//         return <Suggestion />;
//       case "batchwiseCompletion":
//         return <BatchWiseCompletion />;
//       case "overallCompletion":
//         return <OverallCompletion />;
//       case "forumAssign":
//         return <ForumAssigning />;
//       case "viewProjectAssigned":
//         return <ProjectAssigned />;
//       default:
//         return (
//           <div>
//             <h1 className="text-center text-decoration-underline m-3">
//               Select an option from the left
//             </h1>
//             <ul className="m-5 fw-bold">
//               <li className="m-3">
//                 To review or view student projects and check their status,
//                 select "Submission Related".
//               </li>
//               <li className="m-3">
//                 To create a project or manage all project-related tasks, select
//                 "Project Related".
//               </li>
//               <li className="m-3">
//                 For user-related management, select "User Related".
//               </li>
//               <li className="m-3">
//                 To assign students for a particular project use, select "Group
//                 assign for project"
//               </li>
//               <li className="m-3">
//                 To view project assigned students, select "View project assigned
//                 students"
//               </li>
//               <li className="m-3">
//                 To see all students who have completed a particular project
//                 successful , select "Batch wise completion"
//               </li>
//               <li className="m-3">
//                 To see all students who have completed all given projects ,
//                 select " over all completion"
//               </li>
//               <li className="m-3">
//                 To view student suggestions for Evangadi and related topics,
//                 select "Student Suggestion".
//               </li>
//             </ul>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className={styles.buttonList}>
//       {/* Left Column - Buttons */}
//       <div className={styles.sidebar}>
//         <Button
//           onClick={() => setActiveComponent("studentForAdmin")}
//           className={styles.forButton}
//           variant="outline-success"
//         >
//           Submission related
//         </Button>
//         <Button
//           onClick={() => setActiveComponent("ProjectsForAdmin")}
//           className={styles.forButton}
//           variant="outline-success"
//         >
//           Project Related
//         </Button>
//         <Button
//           onClick={() => setActiveComponent("studentRelated")}
//           className={styles.forButton}
//           variant="outline-success"
//         >
//           User Related
//         </Button>
//         <Button
//           onClick={() => setActiveComponent("forumAssign")}
//           className={styles.forButton}
//           variant="outline-success"
//         >
//           Group assign for Project
//         </Button>
//         <Button
//           onClick={() => setActiveComponent("viewProjectAssigned")}
//           className={styles.forButton}
//           variant="outline-success"
//         >
//           View Project Assigned Students
//         </Button>
//         <Button
//           onClick={() => setActiveComponent("batchwiseCompletion")}
//           className={styles.forButton}
//           variant="outline-success"
//         >
//           Batch wise completion
//         </Button>
//         <Button
//           onClick={() => setActiveComponent("overallCompletion")}
//           className={styles.forButton}
//           variant="outline-success"
//         >
//           Overall completion
//         </Button>
//         <Button
//           onClick={() => setActiveComponent("studentSuggestion")}
//           className={styles.forButton}
//           variant="outline-success"
//         >
//           Student Suggestion
//         </Button>
//       </div>

//       {/* Right Column - Dynamic Content */}
//       <div className={styles.contentArea}>{renderComponent()}</div>
//     </div>
//   );
// }

// export default Main;
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import styles from "./Main.module.css";

import {
  FaUserGraduate,
  FaProjectDiagram,
  FaUsers,
  FaClipboardCheck,
  FaLayerGroup,
  FaChartLine,
  FaComments,
  FaRobot,
} from "react-icons/fa";

import StudentsRelated from "../studentsRelated/StudentRelated";
import ProjectRelated from "../projectRelated/ProjectRelated";
import UserRelated from "../userRelated/UserRelated";
import Suggestion from "../../suggestionPage/Suggestion";
import BatchWiseCompletion from "../BatchWiseCompletion/BatchWiseCompletion";
import OverallCompletion from "../OverAllCompletion/OverallCompletion";
import ForumAssigning from "../ForumAssignement/ForumAssignement";
import ProjectAssigned from "../ViewProjectAssigned/VewAssignedStudents";

function Main() {
  const [activeComponent, setActiveComponent] = useState(null);

  const menuItems = [
    {
      key: "studentForAdmin",
      label: "Submission Related",
      icon: <FaClipboardCheck />,
    },
    {
      key: "ProjectsForAdmin",
      label: "Project Related",
      icon: <FaProjectDiagram />,
    },
    {
      key: "studentRelated",
      label: "User Related",
      icon: <FaUsers />,
    },
    {
      key: "forumAssign",
      label: "Group Assign",
      icon: <FaLayerGroup />,
    },
    {
      key: "viewProjectAssigned",
      label: "Assigned Students",
      icon: <FaUserGraduate />,
    },
    {
      key: "batchwiseCompletion",
      label: "Batch Completion",
      icon: <FaChartLine />,
    },
    {
      key: "overallCompletion",
      label: "Overall Completion",
      icon: <FaRobot />,
    },
    {
      key: "studentSuggestion",
      label: "Student Suggestion",
      icon: <FaComments />,
    },
  ];

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
        return <ForumAssigning />;

      case "viewProjectAssigned":
        return <ProjectAssigned />;

      default:
        return (
          <div className={styles.welcomeSection}>
            <div className={styles.glow}></div>

            <div className={styles.heroIcon}>
              <FaRobot />
            </div>

            <h1 className={styles.mainTitle}>AI Powered Admin Dashboard</h1>

            <p className={styles.subtitle}>
              Manage projects, monitor student progress, assign groups, and
              analyze completions from one intelligent workspace.
            </p>

            <div className={styles.cardGrid}>
              <div className={styles.infoCard}>
                <FaClipboardCheck />
                <span>Track Submissions</span>
              </div>

              <div className={styles.infoCard}>
                <FaProjectDiagram />
                <span>Manage Projects</span>
              </div>

              <div className={styles.infoCard}>
                <FaUsers />
                <span>Control Users</span>
              </div>

              <div className={styles.infoCard}>
                <FaChartLine />
                <span>View Analytics</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={styles.buttonList}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.logoSection}>
          <div className={styles.logoCircle}>
            <FaRobot />
          </div>

          <h2>Admin AI</h2>
        </div>

        <div className={styles.menuContainer}>
          {menuItems.map((item) => (
            <Button
              key={item.key}
              onClick={() => setActiveComponent(item.key)}
              className={`${styles.forButton} ${
                activeComponent === item.key ? styles.activeButton : ""
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className={styles.contentArea}>{renderComponent()}</div>
    </div>
  );
}

export default Main;
