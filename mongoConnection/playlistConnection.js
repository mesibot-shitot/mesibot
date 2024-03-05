const mongoose = require("mongoose");
const Path = require('path');
const { config } = require('dotenv');
const Playlist = require("../Playlist");

class playlistStorage {
    constructor(entity) {
        this.entityName = entity.charAt(0).toLowerCase() + entity.slice(1);
        this.Model = require(Path.join(__dirname, `../models/${this.entityName}.model.js`));
        this.connect();
    }   

    connect() {
        const connectionUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`;
        mongoose
            .connect(connectionUri)
            .then(() => {
                console.log('Connected to the database');
            })
            .catch((error) => {
                console.error('Error connecting to the database', error);
            });
    }
getPlaylists = () => {
    return this.Model.findPlaylist();
}

getPlaylistId = (playlistId) => {
    return this.Model.find({ id: playlistId });
}

createPlaylist = (Playlist) => {
    return this.Model.create(Playlist);
}

savePlaylist = (Playlist) => {
    return this.Model.save(Playlist);
}

updatePlaylist = (playlistId, Playlist) => {
    return this.Model.updateOne({ playlistId }, Playlist);
}

deletePlaylist = (playlistId) => {
    return this.Model.deleteOne({ playlistId: Playlist });
}

existPlaylist = (playlistID) => {
    return this.Model.exists({ playlistID: Playlist });
}
}

module.exports = { playlistStorage };