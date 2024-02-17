const ytdl = require('ytdl-core');
const {createAudioResource} = require("@discordjs/voice");

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
  }
  getResource() {
    const stream = ytdl(this.url, { quality: 'highestaudio', format: 'audioonly' });
    return createAudioResource(stream);
  }
    getPlayed() {
        return this.Played;
    }
}

module.exports = Song;
