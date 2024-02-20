const PriorityQueue = require('priorityqueuejs');

class Playlist {
  constructor(player) {
    this.queue = new PriorityQueue((songA, songB) => songA.priority - songB.priority);
    this.playedList = [];
    this.player = player;
    this.current = null;
    this.player.on('idle', () => {
      this.current = undefined;
      this.playSong();
    });
    this.player.on('paused', () => {
      this.player.playing = false;
    });
    this.player.on('playing', () => {
      this.player.playing = true;
    });
  }

  // adds a song to the queue
  addTrack(song) {
    this.queue.enq(song);
  }

  // plays the next song in the queue
  playSong() {
    if (this.current?.getPlayed()) {
      this.player.unpause();
      return;
    }
    if (this.queue.isEmpty()) return;
    this.current = this.queue.deq();
    this.player.play(this.current.getResource());
    this.current.Played = true;
    this.playedList.push(this.current);
    this.player.playing = true;
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

module.exports = Playlist;
