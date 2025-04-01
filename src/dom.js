import { saveToLocalStorage } from "./storage.js";

export function renderProjects(projects, projectListElement) {
    projectListElement.innerHTML = ''; // Clear existing content
    
    // Create the task details modal once
    const taskDetailsModal = createTaskDetailsModal();
    
    projects.forEach(project => {
        // Project container with name and delete button
        const li = document.createElement('li');
        
        // Project header with name and delete button
        const projectHeader = document.createElement('div');
        projectHeader.className = 'project-header';
        
        // Project name
        const projectName = document.createElement('span');
        projectName.textContent = project.name;
        projectHeader.appendChild(projectName);
        
        // Delete Project Button - now available for all projects
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Project';
        deleteButton.className = 'delete-project-btn';
        deleteButton.addEventListener('click', () => {
            // Add warning if it's the last project
            let message = `Are you sure you want to delete the project "${project.name}"?`;
            if (projects.length === 1) {
                message += "\n\nWarning: This is your last project. Deleting it will leave you with no projects.";
            }
            
            if (confirm(message)) {
                // Find the index and remove the project
                const projectIndex = projects.indexOf(project);
                if (projectIndex !== -1) {
                    projects.splice(projectIndex, 1);
                    
                    // Save to localStorage
                    saveToLocalStorage(projects);
                    
                    // Re-render the projects
                    renderProjects(projects, projectListElement);
                }
            }
        });
        projectHeader.appendChild(deleteButton);
        
        li.appendChild(projectHeader);
        
        // Tasks list under the project
        const taskUl = document.createElement('ul');
        project.tasks.forEach(task => {
            const taskLi = document.createElement('li');
            
            // Task content container (to make it clickable)
            const taskContent = document.createElement('div');
            taskContent.className = 'task-content';
            
            // Add completed class if task is marked as complete
            if (task.complete) {
                taskContent.classList.add('completed');
            }
            
            taskContent.textContent = `${task.title} (Due: ${task.dueDate})`;
            
            // Make task clickable to show details
            taskContent.addEventListener('click', () => {
                showTaskDetails(taskDetailsModal, task, project.name);
            });
            
            taskLi.appendChild(taskContent);

            // Remove Task Button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the task click
                
                // Find the index of the project in the projects array
                const projectIndex = projects.indexOf(project);
                if (projectIndex !== -1) {
                    // Remove the task from the project
                    project.removeTask(task); 
                    
                    // Save to localStorage
                    saveToLocalStorage(projects);
                    
                    // Re-render the projects 
                    renderProjects(projects, projectListElement);
                }
            });
            taskLi.appendChild(removeButton);
            taskUl.appendChild(taskLi);
        });
        
        li.appendChild(taskUl);
        projectListElement.appendChild(li);
    });
}

// Create a modal for displaying task details
function createTaskDetailsModal() {
    // Check if modal already exists
    let modal = document.getElementById('task-details-modal');
    if (modal) {
        return modal;
    }
    
    // Create modal container
    modal = document.createElement('div');
    modal.id = 'task-details-modal';
    modal.className = 'modal';
    modal.style.display = 'none';
    
    // Modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-modal';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    modalContent.appendChild(closeButton);
    
    // Task details elements
    const taskTitle = document.createElement('h2');
    taskTitle.id = 'detail-title';
    modalContent.appendChild(taskTitle);
    
    const projectName = document.createElement('p');
    projectName.className = 'detail-project';
    modalContent.appendChild(projectName);
    
    const taskDescription = document.createElement('div');
    taskDescription.className = 'detail-description';
    const descriptionTitle = document.createElement('h3');
    descriptionTitle.textContent = 'Description:';
    taskDescription.appendChild(descriptionTitle);
    const descriptionContent = document.createElement('p');
    descriptionContent.id = 'detail-description-content';
    taskDescription.appendChild(descriptionContent);
    modalContent.appendChild(taskDescription);
    
    const taskDetails = document.createElement('div');
    taskDetails.className = 'detail-metadata';
    
    const dueDate = document.createElement('p');
    dueDate.innerHTML = '<strong>Due Date:</strong> <span id="detail-due-date"></span>';
    taskDetails.appendChild(dueDate);
    
    const priority = document.createElement('p');
    priority.innerHTML = '<strong>Priority:</strong> <span id="detail-priority"></span>';
    taskDetails.appendChild(priority);
    
    const status = document.createElement('p');
    status.innerHTML = '<strong>Status:</strong> <span id="detail-status"></span>';
    taskDetails.appendChild(status);
    
    modalContent.appendChild(taskDetails);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    document.body.appendChild(modal);
    return modal;
}

// Function to display task details in the modal
function showTaskDetails(modal, task, projectName) {
    // Populate task details
    document.getElementById('detail-title').textContent = task.title;
    document.querySelector('.detail-project').textContent = `Project: ${projectName}`;
    document.getElementById('detail-description-content').textContent = task.description || 'No description provided';
    document.getElementById('detail-due-date').textContent = task.dueDate;
    
    // Set priority with appropriate class for styling
    const priorityElement = document.getElementById('detail-priority');
    priorityElement.textContent = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    
    // Remove any existing priority classes
    priorityElement.classList.remove('priority-low', 'priority-medium', 'priority-high');
    // Add the appropriate class
    priorityElement.classList.add(`priority-${task.priority.toLowerCase()}`);
    
    // Update status text
    const statusElement = document.getElementById('detail-status');
    statusElement.textContent = task.complete ? 'Completed' : 'Pending';
    
    // Add toggle button if not already present
    let toggleButton = document.getElementById('toggle-status-btn');
    if (!toggleButton) {
        toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-status-btn';
        toggleButton.className = 'toggle-status-btn';
        document.querySelector('.detail-metadata').appendChild(toggleButton);
    }
    
    // Update toggle button text based on current status
    toggleButton.textContent = task.complete ? 'Mark as Pending' : 'Mark as Completed';
    
    // Clear previous event listeners by cloning and replacing
    const newToggleButton = toggleButton.cloneNode(true);
    toggleButton.parentNode.replaceChild(newToggleButton, toggleButton);
    
    // Add event listener to toggle completion status
    newToggleButton.addEventListener('click', () => {
        // Toggle task completion
        task.toggleComplete();
        
        // Save changes to localStorage
        saveToLocalStorage(window.todoProjects); // Access the global projects variable
        
        // Update status display
        statusElement.textContent = task.complete ? 'Completed' : 'Pending';
        newToggleButton.textContent = task.complete ? 'Mark as Pending' : 'Mark as Completed';
    });
    
    // Show the modal
    modal.style.display = 'flex';
}

export function addTaskButton (app, projects) {
    // Get the existing Add Task Button
    const addTaskButton = document.getElementById('add-task-btn'); 

    // Modal 
    const modal = document.createElement('div');
    modal.id = 'task-modal'; 
    document.body.appendChild(modal);

    // Modal Content Container
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modal.appendChild(modalContent);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-modal';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    modalContent.appendChild(closeButton);
    
    // Title Input
    const titleLabel = document.createElement('label'); 
    titleLabel.textContent = 'Title:'; 
    const titleInput = document.createElement('input'); 
    titleInput.type = 'text'; 
    titleInput.name = 'title'; 
    titleInput.required = true; 
    modalContent.appendChild(titleLabel); 
    modalContent.appendChild(titleInput); 

    // Description Input
    const descriptionLabel = document.createElement('label'); 
    descriptionLabel.textContent = 'Description:'; 
    const descriptionInput = document.createElement('textarea'); 
    descriptionInput.name = 'description'; 
    descriptionInput.required = true; 
    modalContent.appendChild(descriptionLabel); 
    modalContent.appendChild(descriptionInput); 

    // Due Date Input
    const dueDateLabel = document.createElement('label'); 
    dueDateLabel.textContent = 'Due Date:'; 
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.name = 'dueDate';
    modalContent.appendChild(dueDateLabel);
    modalContent.appendChild(dueDateInput);

    // Project Selection
    const projectLabel = document.createElement('label');
    projectLabel.textContent = 'Project:';
    const projectSelect = document.createElement('select');
    projectSelect.name = 'project';
    projectSelect.id = 'project-select';
    projectSelect.className = 'form-select';
    
    // We'll populate this dropdown when the modal opens
    
    modalContent.appendChild(projectLabel);
    modalContent.appendChild(projectSelect);

    // Priority Select
    const priorityLabel = document.createElement('label');
    priorityLabel.textContent = 'Priority:';
    const prioritySelect = document.createElement('select');
    prioritySelect.name = 'priority';
    
    // Add priority options
    const priorities = ['low', 'medium', 'high'];
    priorities.forEach(priority => {
        const option = document.createElement('option');
        option.value = priority;
        option.textContent = priority.charAt(0).toUpperCase() + priority.slice(1);
        prioritySelect.appendChild(option);
    });
    
    modalContent.appendChild(priorityLabel);
    modalContent.appendChild(prioritySelect);

    // Submit Button
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Create Task';
    modalContent.appendChild(submitButton);
    
    // Show modal on button click and populate project dropdown
    addTaskButton.addEventListener('click', () => {
        // Clear previous options
        projectSelect.innerHTML = '';
        
        // Check if there are any projects
        if (projects.length === 0) {
            // No projects exist, create a default one
            const option = document.createElement('option');
            option.value = -1; // Will create a new project
            option.textContent = "Create new 'Tasks' project";
            projectSelect.appendChild(option);
        } else {
            // Add all existing projects
            projects.forEach((project, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = project.name;
                projectSelect.appendChild(option);
            });
        }
        
        modal.style.display = 'flex';
        titleInput.focus(); // Auto-focus the title input
    });
    
    // Close modal when clicking outside of modal content
    modal.addEventListener('click', (event) => {
        // Check if the click was directly on the modal background (not its children)
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    return { modal, submitButton, projectSelect };
}

export function addProjectButton(app) {
    // Get the existing Add Project Button
    const addProjectButton = document.getElementById('add-project-btn');
    addProjectButton.className = 'add-project-btn';
    
    // Create Project Modal
    const projectModal = document.createElement('div');
    projectModal.id = 'project-modal';
    projectModal.style.display = 'none';
    document.body.appendChild(projectModal);
    
    // Modal Content Container
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    projectModal.appendChild(modalContent);
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.className = 'close-modal';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        projectModal.style.display = 'none';
    });
    modalContent.appendChild(closeButton);
    
    // Project Name Input
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Project Name:';
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'projectName';
    nameInput.required = true;
    modalContent.appendChild(nameLabel);
    modalContent.appendChild(nameInput);
    
    // Submit Button
    const submitButton = document.createElement('button');
    submitButton.type = 'button';
    submitButton.textContent = 'Create Project';
    modalContent.appendChild(submitButton);
    
    // Show modal on button click
    addProjectButton.addEventListener('click', () => {
        projectModal.style.display = 'flex';
        nameInput.focus(); // Auto-focus the name input
    });
    
    // Close modal when clicking outside
    projectModal.addEventListener('click', (event) => {
        if (event.target === projectModal) {
            projectModal.style.display = 'none';
        }
    });
    
    return { modal: projectModal, submitButton, nameInput };
}