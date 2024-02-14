class Song{
    // a class to represent a song and its audio resource and also some information about the song like title, url, thumbnail, duration, and requestedBy
    constructor({title, url, thumbnail, duration, requestedBy}){
        this.title = title;
        this.url = url;
        this.thumbnail = thumbnail;
        this.duration = duration;
        this.requestedBy = requestedBy;
    }
}