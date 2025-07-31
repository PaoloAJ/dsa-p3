import HashMap from "./hashMap.js";
import greedySchedule from "./greedy.js";
import Task from "./task.js";

class TaskScheduler {
  constructor() {
    this.hashMap = new HashMap();
  }

  // add a task to a specific date
  addTask(date, priority, startTime, endTime, name) {
    const task = new Task(priority, startTime, endTime, name);
    this.hashMap.insert(date, task);
  }

  getAllDates() {
    return this.hashMap.getDates();
  }

  getTasksForDate(date) {
    return this.hashMap.getTask(date);
  }

  // schedule all tasks on all dates using greedy algorithm
  scheduleAllTasks() {
    const finalResult = new Map();
    const dates = this.hashMap.getDates();

    for (const date of dates) {
      const tasks = this.hashMap.getTask(date);
      s;
      const scheduledTasks = greedySchedule(tasks);
      finalResult.set(date, scheduledTasks);
    }

    return finalResult;
  }

  // schedule tasks for a specific date
  scheduleTasksForDate(date) {
    const tasks = this.hashMap.getTask(date);
    return greedySchedule(tasks);
  }
}

export default TaskScheduler;
