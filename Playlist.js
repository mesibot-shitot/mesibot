// a playlist class that has a queue of songs
class Playlist {
  constructor() {
    this.queue = [];
  }

  // adds a song to the queue
  addTrack(song) {
    this.queue.push(song);
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
