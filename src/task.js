class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title; 
        this.description = description; 
        this.dueDate = dueDate; // Expecting "DD-MM-YYYY" like "2025-04-15"
        this.priority = priority; 
        this.complete = false; 
    }
    toggleComplete() {
        this.complete = !this.complete; 
    }
}

export default Task; 