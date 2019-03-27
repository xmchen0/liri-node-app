/*

UofT Bootcamp 2019

Playing with LIRI Bot

*/

// Require .env file to safeguard my private Spotify keys
require("dotenv").config();

/* --------------------------- *\ 
|* Declare Constants/Variables *|
\* --------------------------- */

// Require my keys file
var keys = require("./keys.js");

// Require to install my node Spotify API
var Spotify = require("node-spotify-api");

// Require to install axios package to retrieve data from OMDB API and Bands In Town API
var axios = require("axios"); 

// Require built-in file system node package
var fs = require("fs");

// Require moment js to format Date of the Event for Bands In Town
var moment = require("moment");

// Declare agrument value index for command and user input parameters
const command = process.argv[2];
const userInput = process.argv[3];


/* --------- *\
|* Functions *|
\* --------- */

// Main process function
function switchFunction {
    switch (command) {
        case "concert-this":
            getBands(userInput);
            break;

        case "spotify-this-song":
            if (userInput) {
                spotifyThisSong(userInput);
            } else {
                spotifyThisSong("The Sign");
            }
            break;

        case "movie-this":
            if (userInput) {
                omdb(userInput);
            } else {
                omdb("Mr. Nobody");
            }
            break;

        case "do-what-it-says":
            doThing();
            break;

        default:
            display('Error occurred.');
            break;
    }
};

// BANDS IN TOWN
// Command line: node liri.js concert-this <artist/band name here> 
// Render the following information: 
// 1. Name of the venue
// 2. Venue location
// 3. Date of the Event (use moment to format this as "MM/DD/YYYY")
// queryURL: https://rest.bandsintown.com/artists/circa%20survive/events?app_id=codingbootcamp


// SPOTIFY
// Command line: node liri.js spotify-this-song '<song name here>'
// Render the following information: 
// 1. Artist(s)
// 2. The song's name
// 3. A preview link of the song from Spotify
// 4. The album that the song is from


// OMDB
// Command line: node liri.js movie-this '<movie name here>'
// Render the following information: 
// 1. Title of the movie
// 2. Year the movie came out
// 3. IMDB Rating of the movie
// 4. Rotten Tomatoes Rating of the movie
// 5. Country where the movie was produced
// 6. Language of the movie
// 7. Plot of the movie
// 8. Actors in the movie


// DO THING
// Command line: node liri.js do-what-it-says
// Render the following information: 
// 1. LIRI take text inside random.txt to use it to call one of LIRI's commands
// 2. Run spotify-this-song for "I Want it That Way"

