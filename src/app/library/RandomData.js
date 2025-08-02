// this file is obsolute for the moment? I think it's more efficient if we just generate data directly rather than writing and reading a csv file

// import fs from "fs";

// //function to create random numbers
// function RandomNum(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// //function to create a random start and end time on a given day
// function RandomStartEnd() {
//   const startHour = RandomNum(0, 20); // ensures there's room for duration
//   const startMinute = RandomNum(0, 59);
//   const duration = RandomNum(10, 180); // duration in minutes
//   const start = new Date();
//   start.setHours(startHour, startMinute, 0, 0);

//   const end = new Date(start.getTime() + duration * 60 * 1000);
//   return { start, end };
// }

// export function Generator(name = "tasks.csv", count = 100000) {
//   let csv = "priority,start,end,name\n";

//   for (let i = 0; i < count; i++) {
//     const priority = RandomNum(0, 10);
//     const { start, end } = RandomStartEnd();
//     const taskName = `Task${i}`;

//     // convert dates to ISO string for CSV
//     csv += `${priority},${start.toISOString()},${end.toISOString()},${taskName}\n`;
//   }

//   fs.writeFileSync(name, csv);
// }
