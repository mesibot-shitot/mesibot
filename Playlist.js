const PriorityQueue = require('priorityqueuejs');

class Playlist {
  constructor() {
    this.queue = new PriorityQueue((songA, songB) => songA.priority - songB.priority);
    this.playedList = [];
  }

  // adds a song to the queue
  addTrack(song) {
    this.queue.enq(song);
  }

  // removes a song from the queue
  removeTrack(song) {
    this.queue = this.queue.filter((track) => track !== song);
  }

  // returns the first 10 songs in the queue
  getQueue() {
    return this.queue.slice(0, 10);
  }

  // returns the current song
  getCurrentSong() {
    return this.queue[0];
  }

  // destroys the queue
  destroy() {
    this.queue = [];
  }
}
