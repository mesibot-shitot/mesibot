const mongoose = require("mongoose");
const Path = require('path');
const { config } = require('dotenv');
const Song = require("../Song");


class SongStorage {
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

getSongs = () => {
    return this.Model.findSongs();
}


getSongId = (songId) => {
    return this.Model.find({ id: songId });
}


createSong = (Song) => {
    return this.Model.create(Song);
}

updateSong = (songId, Song) => {
    return this.Model.updateOne({ songId }, Song);
}


deleteSong = (songId) => {
    return this.Model.deleteOne({ songId: Song });
}

existSong = (songID) => {
    return this.Model.exists({ songID: Song });
}
}
module.exports = { SongStorage };