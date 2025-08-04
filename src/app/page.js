"use client";

import { useState } from "react";
import { Plus, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import TaskScheduler from "./library/scheduler.js";

export default function Page() {
  const [scheduler] = useState(function () {
    return new TaskScheduler();
  });

  // reactvie states for our custom in hashmap
  const [tasks, setTasks] = useState([]);
  const [scheduledHashMap, setScheduledHashMap] = useState(null);
  const [discardedHashMap, setDiscardedHashMap] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // reactive states for tasks
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("07:00");

  const [debugMode, setDebugMode] = useState(false);

  function addTaskFunction() {
    // this add task is different from the scheduler.js add task!
    if (taskName.trim() === "") {
      return;
    }

    // dates are created in local timezones to avoid any conflicts with displayting the schedule calendar
    const taskDate = new Date(date + "T00:00:00");
    const startDateTime = new Date(date + "T" + startTime + ":00");
    const endDateTime = new Date(date + "T" + endTime + ":00");

    // ensures  priority is a valid number
    const isValidNumber = /^\d+$/.test(priority);
    if (!isValidNumber || priority <= 0 || priority >= 10) {
      alert("Please enter a valid integer");
      return;
    }

    scheduler.addTask(
      taskDate,
      parseInt(priority),
      startDateTime,
      endDateTime,
      taskName
    );

    const newTask = {
      id: Date.now(),
      name: taskName,
      priority: parseInt(priority),
      date: taskDate,
      start: startDateTime,
      end: endDateTime,
    };

    setTasks([...tasks, newTask]);

    setTaskName("");
    setPriority("");
    setStartTime("06:00");
    setEndTime("07:00");
  }

  function generateSchedule() {
    if (debugMode) {
      console.log("Total tasks to process:", tasks.length);
      console.time("Schedule Generation Time"); // times how long it takes to generate the optimized schedule
    }

    const scheduleResult = scheduler.scheduleAllTasks();
    const scheduled = scheduleResult.scheduledHashMap;
    const discarded = scheduleResult.discardedHashMap;

    if (debugMode) {
      console.timeEnd("Schedule Generation Time");

      // amount of  scheduled tasks
      let scheduledCount = 0;
      if (scheduled) {
        const scheduledDates = scheduled.getDates();
        for (let i = 0; i < scheduledDates.length; i++) {
          const tasksForDate = scheduled.getTask(scheduledDates[i]);
          scheduledCount += tasksForDate.length;
        }
      }

      // amount of discarded tasks
      let discardedCount = 0;
      if (discarded) {
        const discardedDates = discarded.getDates();
        for (let i = 0; i < discardedDates.length; i++) {
          const tasksForDate = discarded.getTask(discardedDates[i]);
          discardedCount += tasksForDate.length;
        }
      }

      console.log("Successfully scheduled:", scheduledCount, "tasks");
      console.log("Discarded due to conflicts:", discardedCount, "tasks");
      console.log("Total processed:", scheduledCount + discardedCount);
      console.log(
        "Success rate:",
        ((scheduledCount / (scheduledCount + discardedCount)) * 100).toFixed(
          2
        ) + "%"
      );
    }

    // display discarded tasks in console

    if (discarded) {
      const discardedDates = discarded.getDates();

      if (discardedDates.length === 0) {
        console.log("No tasks were discarded");
      } else {
        let totalDiscarded = 0;

        for (let i = 0; i < discardedDates.length; i++) {
          const date = discardedDates[i];
          const tasksForDate = discarded.getTask(date);
          totalDiscarded += tasksForDate.length;

          if (debugMode || tasksForDate.length <= 20) {
            // show all details in debug mode
            console.log("Date:", date.toLocaleDateString());

            for (let j = 0; j < tasksForDate.length; j++) {
              const task = tasksForDate[j];
              const startTime = task.start ? formatTime(task.start) : "N/A";
              const endTime = task.end ? formatTime(task.end) : "N/A";

              console.log("Task:", task.name);
              console.log("Priority:", task.priority);
              console.log("Time:", startTime + " - " + endTime);
              console.log("Reason: Scheduling conflict");
              console.log("");
            }
          }
        }

        if (!debugMode && totalDiscarded > 20) {
          console.log("Total discarded tasks:", totalDiscarded);
          // set debug mode ON to see all discarded tasks details
        }
      }
    } else {
      console.log("No discarded tasks");
    }

    setScheduledHashMap(scheduled);
    setDiscardedHashMap(discarded);
  }

  function formatTime(date) {
    if (!date) {
      return "Errpr";
    }
    if (!(date instanceof Date)) {
      return "Error";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // for calendar or helper functions
  function getDaysInMonth(date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  }

  function getFirstDayOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  }

  function isSameDay(date1, date2) {
    const sameYear = date1.getFullYear() === date2.getFullYear();
    const sameMonth = date1.getMonth() === date2.getMonth();
    const sameDate = date1.getDate() === date2.getDate();

    return sameYear && sameMonth && sameDate;
  }

  function getTasksForDay(day) {
    if (!scheduledHashMap) {
      return [];
    }

    const dayDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );

    // get all dates from the scheduledHashMap
    const dates = scheduledHashMap.getDates();

    for (let i = 0; i < dates.length; i++) {
      const scheduleDate = dates[i];
      if (isSameDay(scheduleDate, dayDate)) {
        return scheduledHashMap.getTask(scheduleDate);
      }
    }
    return [];
  }

  function hasTasksForDay(day) {
    const tasksForDay = getTasksForDay(day);
    return tasksForDay.length > 0;
  }

  function navigateMonth(direction) {
    setCurrentDate(function (prev) {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  }

  function generateCalendarDays() {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // empty the cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }

  function handleTaskNameChange(e) {
    setTaskName(e.target.value);
  }

  function handlePriorityChange(e) {
    setPriority(e.target.value);
  }

  function handleDateChange(e) {
    setDate(e.target.value);
  }

  function handleStartTimeChange(e) {
    setStartTime(e.target.value);
  }

  function handleEndTimeChange(e) {
    setEndTime(e.target.value);
  }

  function toggleDebugMode() {
    setDebugMode(!debugMode);
    if (!debugMode) {
      console.log("Debug mode: ON");
    } else {
      console.log("Debug mode: OFF");
    }
  }

  function addBulkTestTasks() {
    const testTasks = scheduler.generateBulkTestTasks(100000, 30);
    setTasks(function (prevTasks) {
      return [...prevTasks, ...testTasks];
    });
  }

  function addBulkTestTasksAndSchedule() {
    console.log("Adding 100,000 test tasks and generating schedule");

    // generate tasks using scheduler
    const testTasks = scheduler.generateBulkTestTasks(100000, 30);
    setTasks(function (prevTasks) {
      return [...prevTasks, ...testTasks];
    });

    // short delay before optimizing schedule to prevent crashses before generateBulkTest finishes
    setTimeout(function () {
      generateSchedule();
    }, 200);
  }

  function navigatePreviousMonth() {
    navigateMonth(-1);
  }

  function navigateNextMonth() {
    navigateMonth(1);
  }

  const calendarDays = generateCalendarDays();
  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // show calender or not
  const shouldShowCalendar = scheduledHashMap !== null;

  return (
    <div className="w-full min-h-screen bg-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-900">
        🐊 Swampy Scheduler
      </h1>

      {/* adding a new task/form*/}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-blue-300">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Add New Task
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-orange-400">
          <input
            type="text"
            placeholder="Enter task name"
            value={taskName}
            onChange={handleTaskNameChange}
            className="p-3 border rounded-lg placeholder-gray-700 focus:ring-2 focus:outline-none focus:ring-orange-400"
          />

          <input
            type="number"
            min="1"
            max="10"
            placeholder="Priority ((1-10) lower number = higher priority)"
            value={priority}
            onChange={handlePriorityChange}
            className="p-3 border rounded-lg placeholder-gray-700 focus:ring-2 focus:outline-none focus:ring-orange-400"
          />

          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="p-3 border rounded-lg text-gray-800 focus:ring-2 focus:outline-none focus:ring-orange-400"
          />

          <div className="flex gap-2">
            <input
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              className="p-3 border rounded-lg text-gray-800 focus:ring-2 focus:outline-none focus:ring-orange-400 flex-1"
            />
            <input
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              className="p-3 border rounded-lg text-gray-800 focus:ring-2 focus:outline-none focus:ring-orange-400 flex-1"
            />
          </div>
        </div>

        <button
          onClick={addTaskFunction}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-orange-500 transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Task
        </button>

        {/* debug control */}
        <div className="mt-4 p-3 bg-gray-100 rounded-lg border">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Debug Controls
          </h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={toggleDebugMode}
              className={`px-3 py-1 text-xs rounded ${
                debugMode
                  ? "bg-green-500 text-white"
                  : "bg-gray-300 text-gray-700"
              }`}
            >
              Debug Mode: {debugMode ? "ON" : "OFF"}
            </button>
            <button
              onClick={addBulkTestTasks}
              className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Add 100k Test Tasks
            </button>
            <button
              onClick={addBulkTestTasksAndSchedule}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Add 100k + Schedule
            </button>
          </div>
        </div>
      </div>

      {/* task summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-8 border border-blue-300">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">
          Your Tasks ({tasks.length})
        </h2>

        {tasks.length === 0 && (
          <p className="text-gray-700 text-center py-4">No tasks added yet</p>
        )}

        {tasks.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {tasks.slice(0, 6).map(function (task) {
                // Check if this task was discarded
                let isDiscarded = false;

                if (discardedHashMap) {
                  const discardedDates = discardedHashMap.getDates();

                  for (let i = 0; i < discardedDates.length; i++) {
                    const discardedDate = discardedDates[i];

                    // if this task's date matches a discarded date
                    if (isSameDay(task.date, discardedDate)) {
                      const discardedTasks =
                        discardedHashMap.getTask(discardedDate);

                      // if this specific task is in the discarded list
                      for (let j = 0; j < discardedTasks.length; j++) {
                        const discardedTask = discardedTasks[j];
                        if (
                          discardedTask.name === task.name &&
                          discardedTask.priority === task.priority &&
                          discardedTask.start.getTime() === task.start.getTime()
                        ) {
                          isDiscarded = true;
                          break;
                        }
                      }
                    }

                    if (isDiscarded) break;
                  }
                }

                // different styling based on whether task is discarded
                let taskClassName = "border rounded-lg p-3";
                let textClassName = "font-semibold text-blue-900 text-sm";
                let dateClassName = "text-xs text-gray-800";

                if (isDiscarded) {
                  taskClassName = taskClassName + " bg-red-50 border-red-200";
                  textClassName = textClassName + " line-through text-red-600";
                  dateClassName = dateClassName + " line-through text-red-500";
                } else {
                  taskClassName = taskClassName + " bg-blue-50";
                }

                return (
                  <div key={task.id} className={taskClassName}>
                    <h3 className={textClassName}>
                      {task.name}
                      {isDiscarded && (
                        <span className="text-xs ml-2">(Discarded)</span>
                      )}
                    </h3>
                    <p className={dateClassName}>
                      {task.date.toLocaleDateString()} • P{task.priority}
                    </p>
                  </div>
                );
              })}
            </div>

            {tasks.length > 6 && (
              <p className="text-sm text-gray-600 text-center mb-4">
                ...and {tasks.length - 6} more tasks
              </p>
            )}

            <button
              onClick={generateSchedule}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Generate Optimal Schedule
            </button>
          </>
        )}
      </div>

      {/* calendar */}
      {shouldShowCalendar && (
        <div className="bg-white rounded-lg shadow p-6 border border-blue-300">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-green-800">Swamp Time</h2>

            <div className="flex items-center gap-4">
              <button
                onClick={navigatePreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="text-blue-600" size={20} />
              </button>

              <h3 className="text-lg font-semibold text-green-900 min-w-48 text-center">
                {monthYear}
              </h3>

              <button
                onClick={navigateNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="text-blue-600" size={20} />
              </button>
            </div>
          </div>

          {/* calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(function (
              day
            ) {
              return (
                <div
                  key={day}
                  className="p-3 text-center font-semibold text-blue-800 bg-blue-50 rounded"
                >
                  {day}
                </div>
              );
            })}

            {/* days */}
            {calendarDays.map(function (day, index) {
              let dayClassName =
                "min-h-24 p-2 border rounded-lg transition-colors";

              if (day === null) {
                dayClassName = dayClassName + " bg-gray-50";
              } else if (hasTasksForDay(day)) {
                dayClassName = dayClassName + " bg-orange-50 border-orange-200";
              } else {
                dayClassName = dayClassName + " bg-white hover:bg-gray-50";
              }

              return (
                <div key={index} className={dayClassName}>
                  {day !== null && (
                    <>
                      <div className="font-semibold text-sm text-gray-800 mb-1">
                        {day}
                      </div>

                      {hasTasksForDay(day) && (
                        <div className="space-y-1">
                          {getTasksForDay(day)
                            .slice(0, 2)
                            .map(function (task, taskIndex) {
                              let startTimeFormatted = "N/A";
                              let endTimeFormatted = "N/A";

                              if (task.start) {
                                startTimeFormatted = formatTime(task.start);
                              }
                              if (task.end) {
                                endTimeFormatted = formatTime(task.end);
                              }

                              const tooltipText =
                                task.name +
                                " (" +
                                startTimeFormatted +
                                " - " +
                                endTimeFormatted +
                                ")";

                              return (
                                <div
                                  key={taskIndex}
                                  className="bg-blue-100 text-blue-800 text-xs p-1 rounded truncate"
                                  title={tooltipText}
                                >
                                  <div className="font-medium">{task.name}</div>
                                  <div className="text-xs opacity-75">
                                    {startTimeFormatted}
                                  </div>
                                </div>
                              );
                            })}

                          {getTasksForDay(day).length > 2 && (
                            <div className="text-xs text-orange-600 font-medium">
                              +{getTasksForDay(day).length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
