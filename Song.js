class Song {
  constructor({
    title, url, thumbnail, duration, requestedBy, priority, songId,
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
}
