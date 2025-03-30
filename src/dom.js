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
            taskUl.appendChild(taskLi);
        });
        
        li.appendChild(taskUl);
        projectListElement.appendChild(li);
    });
}