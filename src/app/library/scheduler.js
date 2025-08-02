import HashMap from "./hashMap.js";
import greedySchedule from "./greedy.js";
import Task from "./task.js";

// hekper functions for the random dat generation (pulled from RandomData.js)
function RandomNum(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RandomStartEnd(baseDate) {
  const startHour = RandomNum(0, 20); // ensures there's room for duration
  const startMinute = RandomNum(0, 59);
  const duration = RandomNum(10, 180); // duration in minutes

  const start = new Date(baseDate);
  start.setHours(startHour, startMinute, 0, 0);

  const end = new Date(start.getTime() + duration * 60 * 1000);
  return { start, end };
}

class TaskScheduler {
  constructor() {
    this.hashMap = new HashMap();
  }

  // add a task to a specific date
  addTask(date, priority, startTime, endTime, name) {
    const task = new Task(priority, startTime, endTime, name);
    this.hashMap.insert(date, task);
  }

  // generate bulk test tasks
  generateBulkTestTasks(count = 100000, daySpread = 30) {
    console.log(`Adding ${count} test tasks`);
    console.time("Bulk Task Addition");

    const testTasks = [];
    const baseDate = new Date();

    for (let i = 0; i < count; i++) {
      const dayOffset = Math.floor(i / (count / daySpread));
      const taskDate = new Date(baseDate);
      taskDate.setDate(baseDate.getDate() + dayOffset);

      const { start: startDateTime, end: endDateTime } =
        RandomStartEnd(taskDate);

      const priority = RandomNum(1, 10);
      const taskName = `Task${i + 1}`;

      this.addTask(taskDate, priority, startDateTime, endDateTime, taskName);

      // create task object for return (for UI display in page.js)
      testTasks.push({
        id: Date.now() + i,
        name: taskName,
        priority: priority,
        date: taskDate,
        start: startDateTime,
        end: endDateTime,
      });
    }

    console.timeEnd("Bulk Task Addition");
    console.log(`Successfully added ${count} tasks`);

    return testTasks; // return for UI state update
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
