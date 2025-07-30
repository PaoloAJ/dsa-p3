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
}

export default hashMap;
