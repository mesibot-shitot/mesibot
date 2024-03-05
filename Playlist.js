const PriorityQueue = require('priorityqueuejs');
const SongRepository = require('./repository/songRepository');

const comperator = (songA, songB) => {
  const sum = songA.priority - songB.priority;
  if (!sum) return songB.place - songA.place;// FIXME
  return sum;
};

const songDB = new SongRepository();
class Playlist {
  constructor(player) {
    this.queue = new PriorityQueue(comperator);
    this.playedList = [];
    this.player = player;
    this.current = null;
    this.player.on('idle', () => {
      this.player.playing = false;
      this.current = undefined;
      this.playSong();
    });
    this.player.on('paused', () => {
      this.player.playing = false;
    });
    this.player.on('playing', () => {
      this.player.playing = true;
    });
    this.player.on('error', (error) => {
      console.error('Error in this.player: there was an error playing the song, skipping.', error);
    });
  }

  // adds a song to the queue
  async addTrack(song) {
    this.queue.enq(song);
    await songDB.createSong(song); //todo: add try catch
  }

  // plays the next song in the queue
  playSong() {
    if (this.current?.getPlayed()) {
      this.player.unpause();
      return;
    }
    this.skip();
  }

  skip() {
    if (this.queue.isEmpty()) {
      return;
    }
    console.log(`b4 ${this.queue._elements[0].title}`);
    this.current = this.queue.deq();
    this.reorderQueue();
    console.log(`after ${this.queue._elements[0].title}`);
    this.player.play(this.current.getResource());
    this.current.Played = true;
    this.playedList.push(this.current);
    this.player.playing = true;
  }

  // returns the first 10 songs in the queue
  getQueue() {
    return this.queue.slice(0, 10);
  }

  saveQueue() {
    songDB.saveQueue(this.queue._elements);
  }

  // returns the current song
  getCurrentSong() {
    return this.queue[0];
  }

  // destroys the queue
  destroy() {
    this.queue = [];
  }

  reorderQueue() {
    const newQueue = new PriorityQueue(comperator);
    while (!this.queue.isEmpty()) {
      newQueue.enq(this.queue.deq());
    }
    this.queue = newQueue;
  }
}

module.exports = Playlist;
