const ytdl = require('ytdl-core');
const { createAudioResource } = require("@discordjs/voice");
const user = require('./user');

class Song {
  constructor({
    title, url, thumbnail, duration, requestedBy, songId, priority = 0
  }) {
    this.songId = songId;
    this.priority = priority;
    this.title = title;
    this.url = url;
    this.thumbnail = thumbnail;
    this.duration = duration;
    this.requestedBy = requestedBy;
    this.Played = false;
    this.vote = []; //name of the user who voted and what they voted
  }
  getResource() {
    const stream = ytdl(this.url, { quality: 'highestaudio', format: 'audioonly' });
    return createAudioResource(stream);
  }
  getPlayed() {
    return this.Played;
  }

  getUserVote(username) {
    return this.vote.find(vote => vote.user.id === username.id); //todo: doubled user class
  }

  recalculatePriority() { //todo: implement recalculatePriority, Add statistical priority
    const upvotes = this.vote.filter(vote => vote.vote === TRUE).length;
    const downvotes = this.vote.filter(vote => vote.vote === FALSE).length;
    this.priority = upvotes - downvotes;
  }

  setVote(interaction) {
    // if (username.id === ) return;
    const existingUser = this.getUserVote();
  
    if (existingUser) {
      if (existingUser.vote === vote) {
        interaction.reply('You already voted for this song');
        return;
      }
      existingUser.vote = vote;
      this.recalculatePriority();
      return;
    }
    const newUser = { user: interaction.user.id, vote: interaction.customId === 'upvote' ? TRUE : FALSE}; // todo: check if this is the right way to get the user id
    this.vote.push(newUser);
    this.recalculatePriority();

  }
}

module.exports = Song;
