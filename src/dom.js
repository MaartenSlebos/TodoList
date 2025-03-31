export function renderProjects(projects, projectListElement) {
    projectListElement.innerHTML = ''; // Clear existing content
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
            taskLi.textContent = `${task.title} (Due: ${task.dueDate})`;

            // Remove Task Button
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', () => {
                // Find the index of the project in the projects array
                const projectIndex = projects.indexOf(project);
                if (projectIndex !== -1) {
                    // Remove the task from the project
                    project.removeTask(task); 
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


export function addTaskButton (app, projects) {
    // Add Task Button
    const addTaskButton = document.createElement('button'); 
    addTaskButton.textContent = 'Add Task'; 
    document.body.insertBefore(addTaskButton, app); 

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
    // Create Add Project Button
    const addProjectButton = document.createElement('button');
    addProjectButton.textContent = 'Add Project';
    addProjectButton.className = 'add-project-btn';
    document.body.insertBefore(addProjectButton, app);
    
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