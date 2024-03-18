const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');
const user = require('./User');

class Song {
  place = -1;

  constructor({
    title, url, thumbnail, duration, requestedBy, songId, priority = 0,
  }) {
    this.songId = songId;
    this.priority = priority;
    this.title = title;
    this.url = url;
    this.thumbnail = thumbnail;
    this.duration = duration;
    this.requestedBy = requestedBy;
    this.Played = false;
    this.vote = []; // name of the user who voted and what they voted
    this.skipc = [];//
  }

  getResource() {
    const stream = ytdl(this.url, { quality: 'lowestaudio', format: 'audioonly' });
    return createAudioResource(stream);
  }

  getPlayed() {
    return this.Played;
  }

  getUserVote(userID) {
    return this.vote.find((vote) => vote.user === userID);
  }

  getUserSkip(userID) {
    return this.skipc.find((skip) => skip.user === userID);
  }

  // recalculatePriority(vote) { //todo: implement recalculatePriority, Add statistical priority
  //   this.priority += vote;
  // }
  disLikeCount() {
    const count = this.vote.filter((vote) => vote.vote === -1);
    return count.length;
  }

  setskip(interaction) {
    // eslint-disable-next-line max-len
    const newUser = { user: interaction.user.id };
    this.skipc.push(newUser);
  }
}
module.exports = Song;
