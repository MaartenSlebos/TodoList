export function renderProjects(projects, projectListElement) {
    projectListElement.innerHTML = ''; // Clear existing content
    projects.forEach(project => {
        // Project name
        const li = document.createElement('li');
        li.textContent = project.name;
        
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


export function addTaskButton (app) {
    // Add Task Button
    const addTaskButton = document.createElement('button'); 
    addTaskButton.textContent = 'Add Task'; 
    document.body.insertBefore(addTaskButton, app); 

    // Modal 
    const modal = document.createElement('div');
    modal.id = 'task-modal'; 
    modal.style.display = 'none'; 
    modal.style.position = 'fixed'; 
    modal.style.top = '50%'; 
    modal.style.left = '50%'; 
    modal.style.transform = 'translate(-50%, -50%)'; 
    modal.style.backgroundColor = 'white'; 
    modal.style.padding = '20px'; 
    modal.style.border = '1px solid black'; 
    document.body.appendChild(modal);

    // Modal Content 
    // Title Input
    const titleLabel = document.createElement('label'); 
    titleLabel.textContent = 'Title:'; 
    const titleInput = document.createElement('input'); 
    titleInput.type = 'text'; 
    titleInput.name = 'title'; 
    titleInput.required = true; 
    modal.appendChild(titleLabel); 
    modal.appendChild(titleInput); 

    // Description Input
    const descriptionLabel = document.createElement('label'); 
    descriptionLabel.textContent = 'Description:'; 
    const descriptionInput = document.createElement('textarea'); 
    descriptionInput.name = 'description'; 
    descriptionInput.required = true; 
    modal.appendChild(descriptionLabel); 
    modal.appendChild(descriptionInput); 

    // Due Date Input
    const dueDateLabel = document.createElement('label'); 
    dueDateLabel.textContent = 'Due Date:'; 
    const dueDateInput = document.createElement('input');
    dueDateInput.type = 'date';
    dueDateInput.name = 'dueDate';
    modal.appendChild(dueDateLabel);
    modal.appendChild(dueDateInput);

    // Priority Input
    const priorityLabel = document.createElement('label');
    priorityLabel.textContent = 'Priority:';
    const priorityInput = document.createElement('input');
    priorityInput.type = 'text';
    priorityInput.name = 'priority';
    modal.appendChild(priorityLabel);
    modal.appendChild(priorityInput);

    // Submit Button
    const submitButton = document.createElement('button');
    submitButton.type = 'button'; // Changed to button, not submit
    submitButton.textContent = 'Create Task';
    modal.appendChild(submitButton);
    

    // Show modal on button click
    addTaskButton.addEventListener('click', () => {
        modal.style.display = 'block'; 
    });

    
}