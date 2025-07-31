import Heap from "./minHeap.js";

class hashMap {
  // privates
  #bucketSize = 16;
  #items = 0; // change to minheap size later
  #arr;

  constructor() {
    this.#arr = new Array(this.#bucketSize).fill(null);
  }

  checkLoadFactor() {
    const loadFactor = this.#items / this.#bucketSize;
    if (loadFactor >= 0.75) {
      // resize and rehash
      const oldArr = this.#arr;
      this.#bucketSize = this.#bucketSize * 2;
      this.#arr = new Array(this.#bucketSize).fill(null);
      this.#items = 0;

      // reinsert old entries
      for (const bucket of oldArr) {
        if (bucket !== null) {
          for (const entry of bucket) {
            this.insert(entry.key, ...entry.value.getAllTasks());
          }
        }
      }
    }
  }

  insert(date, task) {
    // we're assuming date is an object already
    const datems = this.dateMS(date);
    const index = datems % this.#bucketSize;

    if (this.#arr[index] === null) {
      // === for strict comparison
      const minHeap = new Heap();
      minHeap.insert(task);
      this.#arr[index] = [{ key: date, value: minHeap }];
      this.#items++;
    } else {
      let dayExists = false;
      for (const day of this.#arr[index]) {
        if (day.key.getTime() === date.getTime()) {
          // match by timestamp for accuracy
          day.value.insert(task);
          dayExists = true;
          break; // stop searching once found
        }
      }

      if (!dayExists) {
        const minHeap = new Heap();
        minHeap.insert(task);
        this.#arr[index].push({ key: date, value: minHeap });
        this.#items++;
      }
    }
    this.checkLoadFactor();
  }

  dateMS(date) {
    const ms = date.getTime();
    return ms;
  }

  //gets all the keys in the hash map
  GetDates(){
    const dates=[];
    //loops through the buckets
    for(let i=0;i<this.#arr.length;i++){
      //if the bucket is not empty
      if(this.#arr[i]!==null){
        //loops through each entry in the bucket
        for(let j=0;j<this.#arr[i].length;j++){
          dates.push(this.#arr[i][j].key);
        }
      }
    }
    return dates;

  }
  //get all the value from the date in the hash map
  getTask(date){
    //changes the date into a timestamp
    const datems=this.dateMS(date);
    //hash function
    const index=datems%this.#arr.size();
    //if the bucket is not empty
    if(this.#arr[index]!==null){
      //loops through entries in the bucket
      for(let i=0;i<this.#arr[index].length;i++){
        //compares the data stored in the hashmap with the input date
        if(this.#arr[index][i].key.getTime()===date.getTime()){
          //returns a list of tasks from the min heap
          return this.#arr[index][i].value.GetAllTask();
        }
      }
    }
    return [];
  }
}

export default hashMap;
