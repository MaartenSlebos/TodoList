import "./styles.css";

import Task from './task.js'; 

const task1 = new Task('buy milk', 'go to the grocery store to buy raw milk', '15', true); 
console.log(task1)
task1.toggleComplete(); 
console.log(task1)
task1.toggleComplete(); 
console.group(task1)
