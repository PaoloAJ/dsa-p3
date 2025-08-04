// we decided not to use a csv file

// function RandomNum(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function RandomDate(n = 30) {
//   const present = new Date();
//   const future = new Date(present.getTime() + RandomNum(0, n * 24 * 60 * 60 * 1000));
//   future.setHours(RandomNum(0, 23), RandomNum(0, 59), 0, 0);
//   return future.toISOString();
// }

// export default function handler(req, res) {
//   const count = parseInt(req.query.count) || 100;
//   const categories = ["school", "work", "personal"];
//   const events = [];
//   for (let i = 0; i < count; i++) {
//     const id = i;
//     const title = `Task${i}`;
//     const startTime = RandomDate(30);
//     const duration = RandomNum(10, 180) * 60 * 1000; // 10-180 min in ms
//     const endTime = new Date(new Date(startTime).getTime() + duration).toISOString();
//     const category = categories[RandomNum(0, categories.length - 1)];
//     events.push({
//       id,
//       title,
//       startTime,
//       endTime,
//       category,
//       priority: new Date(startTime).getTime(),
//     });
//   }
//   res.status(200).json({ events });
// }
