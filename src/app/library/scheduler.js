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
    const scheduledHashMap = new HashMap();
    const discardedHashMap = new HashMap();
    const dates = this.hashMap.getDates();

    for (const date of dates) {
      const tasks = this.hashMap.getTask(date);
      const { scheduled, discarded } = greedySchedule(tasks);

      // scheduled tasks
      for (const task of scheduled) {
        scheduledHashMap.insert(date, task);
      }

      // discarded tasks
      for (const task of discarded) {
        discardedHashMap.insert(date, task);
      }
    }

    return { scheduledHashMap, discardedHashMap };
  }

  // schedule tasks for a specific date and return both results
  scheduleTasksForDate(date) {
    const tasks = this.hashMap.getTask(date);
    const { scheduled, discarded } = greedySchedule(tasks);

    const scheduledHashMap = new HashMap();
    const discardedHashMap = new HashMap();

    for (const task of scheduled) {
      scheduledHashMap.insert(date, task);
    }

    for (const task of discarded) {
      discardedHashMap.insert(date, task);
    }

    return { scheduledHashMap, discardedHashMap };
  }
}

export default TaskScheduler;
