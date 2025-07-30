class Task {
  constructor(priority, deadline, name, duration, id) {
    this.priority = priority; // lower = higher priority
    this.deadline = new Date(deadline); // converts to a native "date" object in js
    this.name = name;
    this.duration = duration; // in seconds or minutes? You guys choose
    this.id = id;
  }
}


