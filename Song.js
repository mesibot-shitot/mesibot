const { createAudioResource } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const user = require('./user');

const VOTE = {
  UP: 1,
  DOWN: -1,
};
class Song {
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
    const stream = ytdl(this.url, { quality: 'lowest', format: 'audioonly' });
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

  setVote(interaction) {
    const existingUser = this.getUserVote(interaction.user.id);
    const voteExtract = interaction.options.getString('vote');
    const newVote = VOTE[voteExtract];
    if (existingUser) {
      if (existingUser.vote === newVote) {
        interaction.reply({ content: 'You already voted for this song', ephemeral: true }); // todo pop user out of vote list as if he never voted
        return;
      }
      existingUser.vote = newVote;
      interaction.reply({ content: 'You have changed your vote', ephemeral: true });
      this.priority += newVote;
      return;
    }
    const newUser = { user: interaction.user.id, vote: newVote }; // todo: check if this is the right way to get the user id
    this.vote.push(newUser);

    interaction.reply({ content: 'Vote registered', ephemeral: true });
    this.priority += newVote;
  }
}

module.exports = Song;
