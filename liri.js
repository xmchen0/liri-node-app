/* --- Declare Constants and Variables --- */

const dotenv = require("dotenv").config();
const keys = require("./keys.js");

var Spotify = require("node-spotify-api");
var BandsInTown = require("node-bandsintown-api");

var spotify = new Spotify(keys.spotify);
var bands = new BandsInTown(keys.bands);
var ombdKey = keys.ombdapi_key;

var fs = require("fs");

const firstCommand = process.argv[2];
const secondCommand = process.argv[3];

/* --- Functions --- */

switch (firstCommand) {
    case ("concert-this"):
        getBands();
        break;
    case ("spotify-this-song"):
        if (secondCommand) {
            spotifyThisSong(secondCommand);
        } else {
            spotifyThisSong("Bennie And The Jets");
        }
        break;
    case ('movie-this'):
        if (secondCommand) {
            omdb(secondCommand);
        } else {
            omdb("Interstellar");
        }
        break;
    case ('do-what-it-says'):
        doThing();
        break;
    default:
        console.log('Error');
};
