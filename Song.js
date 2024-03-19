const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');
const user = require('./User');

class Song {
  place = -1;

  priority = 0;

  constructor({
    title, url, thumbnail, duration, requestedBy, songId,
  }) {
    this.songId = songId;
    this.title = title;
    this.url = url;
    this.thumbnail = thumbnail;
    this.duration = duration;
    this.requestedBy = requestedBy;
    this.Played = false;
    this.vote = []; // name of the user who voted and what they voted
    this.skipc = [];
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

  calculatePriority(stats, memberCount) { // todo: implement recalculatePriority, Add statistical priority
    const statsActions = stats.reduce((groups, stat) => {
      const { action, user } = stat;
      if (!groups[action]) {
        groups[action] = {
          users: [],
          count: 0,
        };
      }
      if (!user) {
        groups[action].count += 1;
      } else if (!groups[action].users.includes(user.userId)) {
        groups[action].users.push(user.userId);
        groups[action].count += 1;
      }
      return groups;
    }, {});
    console.log(statsActions);
  }

  disLikeCount() {
    const count = this.vote.filter((vote) => vote.vote === -1);
    return count.length;
  }

  setskip(interaction) {
    const newUser = { user: interaction.user.id };
    this.skipc.push(newUser);
  }
}
module.exports = Song;
