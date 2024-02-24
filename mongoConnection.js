const mongoose = require("mongoose");
const Path = require('path');
const { config } = require('dotenv');
const Playlist = require("./Playlist");
const Song = require("./Song");
const User = require("./user");

class MongoStorage {
    constructor(entity) {
        this.entityName = entity.charAt(0).tolowerCase() + entity.slice(1);
        this.Model = require(Path.join(__dirname, `./models/${this.entityName}.model.js`));
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

    getSongs() {
        return this.Model.findSongs();
    }

    getPlaylists() {
        return this.Model.findPlaylist();
    }

    getUsers() {
        return this.Model.findUsers();
    }

    getId(songId) {
        return this.Model.find({ id: songId });
    }

    getId(playlistId) {
        return this.Model.find({ id: playlistId });
    }

    getId(userId) {
        return this.Model.find({ id: userId });
    }

    create(Song) {
        return this.Model.create(Song);
    }

    create( Playlist) {
        return this.Model.create(Playlist);
    }

    create(User) {
        return this.Model.create(User);
    }

    update(songId, Song) {
        return this.Model.updateOne({ songId }, Song);
    }

    update(playlistId, Playlist) {
        return this.Model.updateOne({ playlistId }, Playlist);
    }

    update(userId, User) {
        return this.Model.updateOne({ userId }, User);
    }

    delete(songId) {
        return this.Model.deleteOne({ songId: Song });
    }

    delete(playlistId) {
        return this.Model.deleteOne({ playlistId: Playlist });
    }

    delete(userId) {
        return this.Model.deleteOne({ userId: User });
    }

    exist(songID) {
        return this.Model.exists({ songID: Song });
    }

    exist(playlistID) {
        return this.Model.exists({ playlistID: Playlist });
    }

    exist(userID) {
        return this.Model.exists({ userID: User });
    }
}

module.exports = { MongoStorage };