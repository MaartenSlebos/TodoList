class Task {
    constructor(title, description, dueDate, priority) {
        this.title = title; 
        this.description = description; 
        this.dueDate = dueDate; // Expecting "YYYY-MM-DD" like "2025-04-15"
        this.priority = priority; 
        this.complete = false; 
    }
    
    toggleComplete() {
        this.complete = !this.complete;
        return this.complete;
    }
}

export default Task; 