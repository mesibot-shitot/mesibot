const PriorityQueue = require('priorityqueuejs');
const statRepository = require('./repository/statRepository');

const comparator = (songA, songB) => {
  const sum = songA.priority - songB.priority;
  if (!sum) return songB.place - songA.place;
  return sum;
};

const statDB = new statRepository();
class Playlist {
  name = '';

  constructor(player, groupID, id) {
    this.groupID = groupID;
    this.id = id;
    this.queue = new PriorityQueue(comparator);
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

  async addTrack(song) {
    song.place = this.queue.size() + this.playedList.length;
    this.queue.enq(song);
    const stat = {
      songId: song.songId,
      groupId: this.groupID,
      action: 'add',
      playlist: this.id,
      userId: song.requestedBy,
    };
    await statDB.createAction(stat);
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
    this.current = this.queue.deq();
    this.reorderQueue();
    this.player.play(this.current.getResource());
    this.current.Played = true;
    this.playedList.push(this.current);
    this.player.playing = true;
  }

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
    const newQueue = new PriorityQueue(comparator);
    while (!this.queue.isEmpty()) {
      newQueue.enq(this.queue.deq());
    }
    this.queue = newQueue;
  }
}

module.exports = Playlist;
