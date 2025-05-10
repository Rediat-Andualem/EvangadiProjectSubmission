import React, { useState } from 'react';
import styles from './ProjectSubmissionPage.module.css';
import amazon from '../../assets/Amazon.png'
import netflix from '../../assets/netflix.png'
import forum from '../../assets/forum.jpg' 
import portfolio from '../../assets/profile.jpg'
function ProjectSubmissionPage() {
  const [formData, setFormData] = useState({
    submittedProjectName: '',
    githubCodeLink: '',
    deployedLink: '',
    projectType: '',
    ReviewersComment: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted Project:', formData);
  };

  const projects = [
    { name: 'Netflix', img: netflix },
    { name: 'Amazon', img: amazon },
    { name: 'Evangadi Forum', img: forum},
    { name: 'Portfolio Website', img: portfolio }
  ];

  return (
    <>
          <div className="container mx-auto row m-4">
        {projects.map((project, index) => (
          <div className="col-6 col-md-3 text-center mb-3" key={index}>
            <img
              src={project.img}
              alt={project.name}
              className={`img-fluid rounded ${styles.projectImg}`}
            />
            <p className="mt-2 fw-bold">{project.name}</p>
          </div>
        ))}
      </div>
    <div className= {`${styles.formPart} mt-5`}>
      {/* Responsive Image Grid */}


      {/* Submission Form */}
      <form onSubmit={handleSubmit} className={styles.projectForm}>
               <div className="mb-3">
          <label className="form-label">Project Type</label>
          <select
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">-- Select Type --</option>
            {projects.map((project, index) => (
              <option key={index} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Project Name</label>
          <input
            type="text"
            name="submittedProjectName"
            value={formData.submittedProjectName}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter your project name"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">GitHub Code Link</label>
          <input
            type="url"
            name="githubCodeLink"
            value={formData.githubCodeLink}
            onChange={handleChange}
            className="form-control"
            placeholder="https://github.com/your-repo"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Deployed Link</label>
          <input
            type="url"
            name="deployedLink"
            value={formData.deployedLink}
            onChange={handleChange}
            className="form-control"
            placeholder="https://your-project-link.com"
            required
          />
        </div>

 

        {/* <div className="mb-3">
          <label className="form-label">Reviewer's Comment</label>
          <textarea
            name="ReviewersComment"
            value={formData.ReviewersComment}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Optional comments from your reviewer..."
          ></textarea>
        </div> */}

        <button type="submit" className="btn btn-primary w-100">
          Submit Project
        </button>
      </form>
    </div>

    <div className="text-underline container mx-auto row m-4">
        <h4>Submitted projects</h4>
    </div>
     </>
  );
}

export default ProjectSubmissionPage;
