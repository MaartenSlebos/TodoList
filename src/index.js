import "./styles.css";
import Task from './task.js'; 
import Project from './project.js'; 
import { renderProjects } from "./dom.js";

const projects = []; 

const defaultProject = new Project('Tasks'); 
defaultProject.addTask(new Task('Welcome', 'Get started', '2025-04-20', 'medium')); 



projects.push(defaultProject); 

const projectList = document.getElementById('project-list'); 
renderProjects(projects, projectList);






