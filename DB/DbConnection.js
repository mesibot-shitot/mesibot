const mongoose = require('mongoose');
const Path = require('path');
const { config } = require('dotenv');

class DbConnection {
    constructor() {
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
    }

module.exports =  DbConnection ;