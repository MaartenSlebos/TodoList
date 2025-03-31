import "./styles.css";
import Task from './task.js';
import Project from './project.js';
import { renderProjects, addTaskButton, addProjectButton } from "./dom.js";

// Initialize projects array and create default project
const projects = [];
const defaultProject = new Project('Tasks');

// Add welcome task to default project
defaultProject.addTask(
  new Task('Welcome', 'Get started', '2025-04-20', 'medium')
);
projects.push(defaultProject);

// Get DOM elements
const projectList = document.getElementById('project-list');
const app = document.getElementById('app');

// Initialize UI
renderProjects(projects, projectList);

// Setup task button and modal
const { modal, submitButton } = addTaskButton(app);

// Add project button and modal
const projectControls = addProjectButton(app);

// Handle task creation
submitButton.addEventListener('click', () => {
  // Get form values
  const title = modal.querySelector('input[name="title"]').value;
  const description = modal.querySelector('textarea[name="description"]').value;
  const dueDate = modal.querySelector('input[name="dueDate"]').value;
  const priority = modal.querySelector('select[name="priority"]').value;

  // Validate
  if (!title || !dueDate) {
    alert('Please fill in required fields');
    return;
  }

  // Check if there are any projects
  if (projects.length === 0) {
    // No projects exist, create a default one
    const newDefaultProject = new Project('Tasks');
    projects.push(newDefaultProject);
  }
  
  // Create and add task to the first available project
  const newTask = new Task(title, description, dueDate, priority);
  projects[0].addTask(newTask);
  
  // Re-render project list
  renderProjects(projects, projectList);
  
  // Clear form
  modal.querySelector('input[name="title"]').value = '';
  modal.querySelector('textarea[name="description"]').value = '';
  modal.querySelector('input[name="dueDate"]').value = '';
  modal.querySelector('select[name="priority"]').value = 'medium';
  
  // Close modal
  modal.style.display = 'none';
});

// Handle project creation
projectControls.submitButton.addEventListener('click', () => {
  // Get project name
  const projectName = projectControls.nameInput.value.trim();
  
  // Validate
  if (!projectName) {
    alert('Please enter a project name');
    return;
  }
  
  // Check for duplicate project names
  const isDuplicate = projects.some(project => project.name === projectName);
  if (isDuplicate) {
    alert('A project with this name already exists');
    return;
  }
  
  // Create new project and add to projects array
  const newProject = new Project(projectName);
  projects.push(newProject);
  
  // Re-render project list
  renderProjects(projects, projectList);
  
  // Clear input and close modal
  projectControls.nameInput.value = '';
  projectControls.modal.style.display = 'none';
});







