class MinHeap {
  constructor() {
    //makes the parent/child index be 1 based
    this.heap = [null];
  }

  //insert a task into the minheap
  insert(task) {
    this.heap.push(task);
    let index = this.heap.length - 1;

    //keeps swapping with parent if the priority is smaller
    while (
      index > 1 &&
      this.heap[index].priority < this.heap[Math.floor(index / 2)].priority
    ) {
      //swap task with parent
      [this.heap[index], this.heap[Math.floor(index / 2)]] = [
        this.heap[Math.floor(index / 2)],
        this.heap[index],
      ];
      index = Math.floor(index / 2);
    }
  }
  //extracts the task with the highest priority
  extractMin() {
    if (this.heap.length <= 1) {
      return null;
    }
    if (this.heap.length === 2) {
      return this.heap.pop();
    }
    //the root
    const smallest = this.heap[1];
    //moves last task to root
    this.heap[1] = this.heap.pop();
    let i = 1;

    //keeps swapping with smaller child until the heap is properly arrange
    while (true) {
      let smallindex = i;
      let left = 2 * i;
      let right = 2 * i + 1;

      //compare with left child
      if (
        left < this.heap.length &&
        this.heap[left].priority < this.heap[smallindex].priority
      ) {
        smallindex = left;
      }
      //compare with right child
      if (
        right < this.heap.length &&
        this.heap[right].priority < this.heap[smallindex].priority
      ) {
        smallindex = right;
      }
      //if either child is smaller then swap
      if (smallindex !== i) {
        [this.heap[i], this.heap[smallindex]] = [
          this.heap[smallindex],
          this.heap[i],
        ];
        i = smallindex;
      } else {
        break;
      }
    }
    return smallest;
  }
  //view the top task without removing it
  NextTask() {
    return this.heap[1] || null;
  }
  //returns the size of the heap
  size() {
    return this.heap.length - 1;
  }
}

export default MinHeap;
