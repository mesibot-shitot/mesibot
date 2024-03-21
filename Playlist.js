const PriorityQueue = require('priorityqueuejs');
const StatRepository = require('./repository/statRepository');

const comparator = (songA, songB) => {
  if (songA.priority === songB.priority) {
    return songA.place < songB.place ? 1 : -1;
  }
  return (songA.priority > songB.priority ? 1 : -1);
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

  async newSong(song) {
    try {
      const stats = await statDB.fetchSongStatsByGroup(this.groupID, song.songId);
      if (!stats) {
        await this.addTrack(song);
        return;
      }
      song.calculatePriority(stats);
      await this.addTrack(song);
    } catch (error) {
      console.log(error);
    }
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

  async songRemoved(songTitle, songId) {
    return statDB.createAction({
      song: {
        songId,
        songTitle,
      },
      groupId: this.groupID,
      action: 'songRemoved',
      playlist: this.id,
    });
  }

  async voteForSong(songNum, userId, newVote) {
    const { _elements } = this.queue;
    const song = _elements[songNum];
    const existingUser = song.getUserVote(userId);
    if (existingUser) {
      if (existingUser.vote === newVote) {
        return 0;
      }
      const { actionId } = existingUser;
      existingUser.vote = newVote;
      song.changeVote(newVote);
      const updated = await this.voteStat(song, userId, newVote, actionId, false);
      const { _id } = updated;
      if (!_id) throw new Error('Failed to update vote stat'); // todo throw error
      existingUser.actionId = _id;
      return -1;
    }

    const id = await this.voteStat(song, userId, newVote, null);
    const newUser = { user: userId, vote: newVote, actionId: id };
    song.setVote(newUser, newVote);
    return 1;
  }

  async voteStat(song, userId, vote, id, newVote = true) {
    const stat = {
      song: {
        songId: song.songId,
        songTitle: song.title,
      },
      groupId: this.groupID,
      action: vote === 1 ? 'upVote' : 'downVote',
      playlist: this.id,
      user: {
        userId,
      },
    };

    if (newVote) return statDB.createAction(stat);
    const res = await statDB.updateAction(id, stat);
    if (!res.acknowledged) throw new Error('Failed to update vote stat');
    return { _id: id };
  }
}

module.exports = Playlist;
