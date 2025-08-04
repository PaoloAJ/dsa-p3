// we decided not to use a csv file

// import fs from "fs";
// import path from "path";

// // Helper to parse CSV string to event objects
// function parseCSV(csv) {
//   const lines = csv.trim().split("\n");
//   return lines.map((line, i) => {
//     // CSV: priority,deadline,title,duration,id
//     const [priority, deadline, title, duration, id] = line.split(",");
//     // For demo, generate startTime and endTime from deadline and duration
//     const startTime = new Date(deadline + "T08:00:00Z").toISOString();
//     const endTime = new Date(new Date(startTime).getTime() + parseInt(duration) * 60 * 1000).toISOString();
//     return {
//       id: parseInt(id),
//       title,
//       startTime,
//       endTime,
//       category: "imported",
//       priority: parseInt(priority),
//     };
//   });
// }

// export default function handler(req, res) {
//   // Path to the CSV file (adjust if needed)
//   const filePath = path.join(process.cwd(), "src/app/library/tasks.csv");
//   if (!fs.existsSync(filePath)) {
//     return res.status(404).json({ error: "CSV file not found" });
//   }
//   const csv = fs.readFileSync(filePath, "utf-8");
//   const events = parseCSV(csv);
//   res.status(200).json({ events });
// }
