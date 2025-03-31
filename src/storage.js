import Task from './task.js';
import Project from './project.js';

// Key for localStorage
const STORAGE_KEY = 'todolist_projects';

/**
 * Save projects to localStorage
 * @param {Array} projects - Array of Project objects to save
 */
export function saveToLocalStorage(projects) {
  try {
    // Convert projects array to JSON
    const projectsJSON = JSON.stringify(projects);
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, projectsJSON);
    console.log('Projects saved to localStorage');
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

/**
 * Load projects from localStorage
 * @returns {Array|null} Array of Project objects or null if no data found
 */
export function loadFromLocalStorage() {
  try {
    // Get data from localStorage
    const projectsJSON = localStorage.getItem(STORAGE_KEY);
    
    // If no data exists, return null
    if (!projectsJSON) {
      console.log('No projects found in localStorage');
      return null;
    }
    
    // Parse JSON data
    const projectsData = JSON.parse(projectsJSON);
    
    // Recreate Project and Task objects with their methods
    const reconstructedProjects = projectsData.map(projectData => {
      // Create a new Project instance
      const project = new Project(projectData.name);
      
      // Recreate each task in the project
      if (Array.isArray(projectData.tasks)) {
        projectData.tasks.forEach(taskData => {
          const task = new Task(
            taskData.title,
            taskData.description,
            taskData.dueDate,
            taskData.priority
          );
          
          // Restore task completion status
          if (taskData.complete) {
            task.complete = taskData.complete;
          }
          
          // Add task to project
          project.addTask(task);
        });
      }
      
      return project;
    });
    
    console.log('Projects loaded from localStorage:', reconstructedProjects);
    return reconstructedProjects;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Clear all todo list data from localStorage
 */
export function clearLocalStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('localStorage cleared');
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
} 