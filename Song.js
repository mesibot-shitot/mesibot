const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');

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

  changeVote(vote) {
    this.priority += (vote * 2);
  }

  setVote(user, newVote) {
    this.vote.push(user);
    this.priority += newVote;
  }

  // todo: implement recalculatePriority, Add statistical priority
  calculatePriority(stats) {
    const statsActions = stats.reduce((groups, stat) => {
      const { action, user } = stat;
      if (!groups[action]) {
        groups[action] = !user.userId ? { count: 0 } : { users: [] };
      }

      const { userId } = user;
      if (userId) {
        const userExist = groups[action].users.find((userObj) => userObj.userId === userId);
        if (userExist) userExist.count += 1;
        else groups[action].users.push({ userId, count: 1 });
      } else groups[action].count += 1;
      return groups;
    }, {});
    this.calculateSongPriority(statsActions);
  }

  calculateSongPriority(statsActions) {
    let weightedAverage = 0;
    let totalWeight = 0;

    const weights = {
      songAdded: 0.5,
      upVote: 1,
      downVote: -1,
      songSkip: -1,
      userSkip: -0.5,
      songRemoved: -1,
    };

    for (const action in statsActions) {
      if (action in weights) {
        const actionWeight = weights[action];
        let userWeightedSum = 0;
        if (statsActions[action].users) {
          userWeightedSum = statsActions[action].users.reduce((sum, userObj) => sum + userObj.count * actionWeight, 0);
        }
        const totalUserCount = statsActions[action].users ? statsActions[action].users.length : 0;
        const actionWeightedCount = userWeightedSum + (statsActions[action].count || 0) * actionWeight;
        weightedAverage += actionWeightedCount / (totalUserCount || 1);
        totalWeight += Math.abs(actionWeight);
      }
    }
    this.priority = weightedAverage / totalWeight || 0;
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
