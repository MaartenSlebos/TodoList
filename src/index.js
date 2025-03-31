import "./styles.css";
import Task from './task.js';
import Project from './project.js';
import { renderProjects, addTaskButton, addProjectButton } from "./dom.js";
import { saveToLocalStorage, loadFromLocalStorage } from "./storage.js";

// Initialize projects array
let projects = [];

// Expose projects array globally for access from other modules
window.todoProjects = projects;

// Try to load existing projects from localStorage
const savedProjects = loadFromLocalStorage();

// If no saved projects found, create a default project
if (!savedProjects || savedProjects.length === 0) {
  const defaultProject = new Project('Tasks');
  
  // Add welcome task to default project
  defaultProject.addTask(
    new Task('Welcome', 'Get started', '2025-04-20', 'medium')
  );
  projects.push(defaultProject);
} else {
  // Use the saved projects
  projects = savedProjects;
  // Update the global reference
  window.todoProjects = projects;
}

// Get DOM elements
const projectList = document.getElementById('project-list');
const app = document.getElementById('app');

// Initialize UI
renderProjects(projects, projectList);

// Setup task button and modal - pass the projects array
const { modal, submitButton, projectSelect } = addTaskButton(app, projects);

// Add project button and modal
const projectControls = addProjectButton(app);

// Handle task creation
submitButton.addEventListener('click', () => {
  // Get form values
  const title = modal.querySelector('input[name="title"]').value;
  const description = modal.querySelector('textarea[name="description"]').value;
  const dueDate = modal.querySelector('input[name="dueDate"]').value;
  const priority = modal.querySelector('select[name="priority"]').value;
  const selectedProjectIndex = parseInt(projectSelect.value);

  // Validate
  if (!title || !dueDate) {
    alert('Please fill in required fields');
    return;
  }

  // Create the task
  const newTask = new Task(title, description, dueDate, priority);
  
  // Add task to the selected project
  if (selectedProjectIndex === -1 || projects.length === 0) {
    // Create a new default project if needed
    const newDefaultProject = new Project('Tasks');
    newDefaultProject.addTask(newTask);
    projects.push(newDefaultProject);
  } else {
    // Add to the selected project
    projects[selectedProjectIndex].addTask(newTask);
  }
  
  // Save to localStorage
  saveToLocalStorage(projects);
  
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
  
  // Save to localStorage
  saveToLocalStorage(projects);
  
  // Re-render project list
  renderProjects(projects, projectList);
  
  // Clear input and close modal
  projectControls.nameInput.value = '';
  projectControls.modal.style.display = 'none';
});







