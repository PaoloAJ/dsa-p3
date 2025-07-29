class Task {
  constructor(priority, endTime, name, startTime, id) {
    this.priority = priority; // lower = higher priority
    this.startTime = new Date(startTime); // when the task starts
    this.name = name;
    this.endTime = new Date(endTime); // when the task ends
    this.id = id;

    // validates the times
    if(this.endTime< this.startTime){
      throw new Error("Invalid")
    }
  }
}
