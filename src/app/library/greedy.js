export default function greedySchedule(tasks) {
  // sort by end time
  const sorted = tasks.sort((a, b) => a.end - b.end);

  const scheduledTasks = [];
  let lastEndTime = null;

  for (const task of sorted) {
    if (lastEndTime === null || task.start >= lastEndTime) {
      scheduledTasks.push(task);
      lastEndTime = task.end;
    }
    // If there's a conflict, skip this task
  }

  return scheduledTasks;
}

// Usage example:
// const tasks = [
//   { priority: 1, start: new Date('2025-07-31T09:00:00Z'), end: new Date('2025-07-31T10:00:00Z'), name: 'Meeting A' },
//   { priority: 2, start: new Date('2025-07-31T09:30:00Z'), end: new Date('2025-07-31T11:00:00Z'), name: 'Meeting B' },
//   { priority: 3, start: new Date('2025-07-31T10:30:00Z'), end: new Date('2025-07-31T12:00:00Z'), name: 'Meeting C' },
// ];
// const optimal = greedySchedule(tasks);
// console.log(optimal);
