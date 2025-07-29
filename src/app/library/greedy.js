
export function greedySchedule(events) {
  // convert times to date if needed and sort by endTime
  const sorted = events
    .map(e => ({
      ...e,
      startTime: new Date(e.startTime),
      endTime: new Date(e.endTime),
    }))
    .sort((a, b) => a.endTime - b.endTime);

  const result = [];
  let lastEnd = null;

  for (const event of sorted) {
    if (!lastEnd || event.startTime >= lastEnd) {
      result.push(event);
      lastEnd = event.endTime;
    }
  }
  return result;
}
// use like this:
// import { greedySchedule } from "./library/greddy.js";

// const events = [
//   { id: 1, name: "A", startTime: "2025-07-29T09:00:00Z", endTime: "2025-07-29T10:00:00Z" },
//   { id: 2, name: "B", startTime: "2025-07-29T09:30:00Z", endTime: "2025-07-29T11:00:00Z" },
//   { id: 3, name: "C", startTime: "2025-07-29T10:30:00Z", endTime: "2025-07-29T12:00:00Z" },
// ];
// const optimal = greedySchedule(events);
// console.log(optimal);
