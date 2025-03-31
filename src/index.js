import "./styles.css";
import Task from './task.js';
import Project from './project.js';
import { renderProjects, addTaskButton } from "./dom.js";

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
addTaskButton(app);







