export default function greedySchedule(tasks) {
  // sort tasks by end time (earliest finishing first)
  const sorted = tasks.sort((a, b) => a.end - b.end);

  const scheduledTasks = [];
  const discardedTasks = [];
  let lastEndTime = null;

  for (const task of sorted) {
    if (lastEndTime === null || task.start >= lastEndTime) {
      scheduledTasks.push(task);
      lastEndTime = task.end;
    } else {
      // if conflict
      discardedTasks.push(task);
    }
  }

  return {
    scheduled: scheduledTasks,
    discarded: discardedTasks,
  };
}
