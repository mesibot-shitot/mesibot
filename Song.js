const ytdl = require('ytdl-core');
const { createAudioResource } = require('@discordjs/voice');
const user = require('./User');

const VOTE = {
  UP: 1,
  DOWN: -1,
};
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
  }

  getResource() {
    const stream = ytdl(this.url, { quality: 'lowestaudio', format: 'audioonly' });
    return createAudioResource(stream);
  }

  getPlayed() {
    return this.Played;
  }

  getUserVote(userID) {
    return this.vote.find((vote) => vote.user === userID); // todo: doubled user class
  }

  // recalculatePriority(vote) { //todo: implement recalculatePriority, Add statistical priority
  //   this.priority += vote;
  // }
  disLikeCount() {
    const count = this.vote.filter((vote) => vote.vote === -1);
    console.log(count.length);
    return count.length;
  }

  setVote(interaction) {
    const existingUser = this.getUserVote(interaction.user.id);
    const voteExtract = interaction.options.getString('vote');
    const newVote = VOTE[voteExtract];
    let message;
    if (existingUser) {
      if (existingUser.vote === newVote) {
        message = 'You already voted for this song'; // todo pop user out of vote list as if he never voted
        return message;
      }
      existingUser.vote = newVote;
      message = 'You have changed your vote';
      this.priority += (newVote * 2);
      return message;
    }
    // todo: check if this is the right way to get the user id
    const newUser = { user: interaction.user.id, vote: newVote };
    this.vote.push(newUser);

    message = 'Vote registered';
    this.priority += newVote;
    return message;
  }
}

module.exports = Song;
