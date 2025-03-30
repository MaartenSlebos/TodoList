import Task from './task.js'

class Project {
    constructor(name) {
        this.name = name; 
        this.tasks = []; 
    }
    addTask(task) {
        this.tasks.push(task)
    }
    removeTask(taskToRemove) {
        const index = this.tasks.indexOf(taskToRemove); 
        if (index !== -1) {
            this.tasks.splice(index, 1)
        }
    }
}

export default Project; 

