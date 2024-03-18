const PriorityQueue = require('priorityqueuejs');
const StatRepository = require('./repository/statRepository');

const comparator = (songA, songB) => {
  const sum = songA.priority - songB.priority;
  if (!sum) return songB.place - songA.place;
  return sum;
};

const statDB = new StatRepository();
class Playlist {
  name = '';

  constructor(player, group, id) {
    this.groupID = group.id;
    this.owner = group.owner;
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

  pushToQueue(song) {
    song.place = this.queue.size() + this.playedList.length;
    this.queue.enq(song);
  }

  async addTrack(song) {
    this.pushToQueue(song);
    await statDB.createAction({
      song: {
        songId: song.songId,
        songTitle: song.title,
      },
      groupId: this.groupID,
      action: 'songAdded',
      playlist: this.id,
      user: {
        userId: song.requestedBy.userId,
        userName: song.requestedBy.userName,
      },
    });
  }

  // plays the next song in the queue
  playSong() {
    if (this.current?.getPlayed()) {
      this.player.unpause();
      return;
    }
    this.nextSong();
  }

  nextSong() {
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

  async skip() {
    this.nextSong();
    await statDB.createAction({
      song: {
        songId: this.current.songId,
        songTitle: this.current.title,
      },
      groupId: this.groupID,
      action: 'songSkip',
      playlist: this.id,
    });
  }

  async checkUserSkip(userId, userName) {
    if (this.current.getUserSkip(userId)) {
      return true;
    }
    await statDB.createAction({
      song: {
        songId: this.current.songId,
        songTitle: this.current.title,
      },
      groupId: this.groupID,
      action: 'userSkip',
      playlist: this.id,
      user: {
        userId,
        userName,
      },
    });
    return false;
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
