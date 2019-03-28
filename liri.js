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

// Require request for Bands In Town and OMDB queryURL
var request = require("request");

// Initialise Spotify npm specific call to get keys to spotify account
var spotify = new Spotify(keys.spotify);

// Capture user input parameters
const command = process.argv[2];
const userInput = process.argv[3];

/* --------- *\
|* Functions *|
\* --------- */

// Switch case statement
switch (command) {
    case "concert-this":
        myConcert(userInput);
        break;

    case "spotify-this-song":
        mySpotify(userInput);
        break;

    case "movie-this":
        myOmdb(userInput);
        break;

    case "do-what-it-says":
        random();
        break;

    default:
        console.log("Invalid command. Please select a command listed below:");
        console.log("concert-this | movie-this | spotify-this-song | do-what-it-says");
}


/* --- BANDS IN TOWN --- */
// Command line: `node liri.js concert-this <artist/band name here>`
// Render the following information: 
// 1. Name of the venue
// 2. Venue location
// 3. Date of the Event (use moment to format this as "MM/DD/YYYY")
// queryURL: https://rest.bandsintown.com/artists/circa%20survive/events?app_id=codingbootcamp

function myConcert(artist) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    request(queryUrl, function (err, response, body) {
        // If no error and request is successful
        if (!err && response.statusCode === 200) {
            var concertData = JSON.parse(body);
            var momentDateTime = moment().format('L');
            console.log(" ");
            console.log("================| MY CONCERT RESULT |================");
            console.log("1. Venue: " + concertData[0].venue.name);
            console.log("2. Location: " + concertData[0].venue.city + ", " + concertData[0].venue.country);
            console.log("3. Date: " + momentDateTime);
            console.log("=====================================================");
            console.log(" ");
        } else {
            console.log("No results found " + err);
        }
    });
}

/* --- SPOTIFY --- */
// Command line: `node liri.js spotify-this-song <song name here>`
// Render the following information: 
// 1. Artist(s)
// 2. The song's name
// 3. A preview link of the song from Spotify
// 4. The album that the song is from

function mySpotify(song) {
    if (song === undefined || null) {
        song = "'The Sign' by Ace of Base";
    }
    spotify.search({ type: "track", query: song, limit: 1 }, function (err, data) {
        // If no error loop through tracks of songs
        if (!err) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[0];
                console.log(" ");
                console.log("================| MY SONG RESULT |================");
                console.log("1. Artist: " + songData.artists[0].name);
                console.log("2. Song: " + songData.name);
                console.log("3. Preview URL: " + songData.preview_url);
                console.log("4. Album: " + songData.album.name);
                console.log("==================================================");
                console.log(" ");
            }
        } else {
            console.log("No results found " + err);
        }
    });
};


/* --- OMDB --- */
// Command line: `node liri.js movie-this <movie name here>`
// Render the following information: 
// 1. Title of the movie
// 2. Year the movie came out
// 3. IMDB Rating of the movie
// 4. Rotten Tomatoes Rating of the movie
// 5. Country where the movie was produced
// 6. Language of the movie
// 7. Plot of the movie
// 8. Actors in the movie

function myOmdb(movie) {
    // If user does not type a movie, output data for the movie 'Mr. Nobody'
    if (movie === undefined || null) {
        console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }
    var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    request(queryURL, function (err, response, body) {
        // If no error and request is successful, parse the data to become an object
        if (!err && response.statusCode == 200) {
            var content = JSON.parse(body);
            console.log(" ");
            console.log("=====================| MY MOVIE RESULT |=====================");
            console.log("1. Title: " + content.Title);
            console.log("2. Release Year: " + content.Year);
            console.log("3. IMDB Rating: " + content.imdbRating);
            console.log("4. Rotten Tomatoes Rating: " + content.Ratings[1]);
            console.log("5. Country: " + content.Country);
            console.log("6. Language: " + content.Language);
            console.log("7. Plot: " + content.Plot);
            console.log("8. Actors: " + content.Actors);
            console.log("=============================================================");
            console.log(" ");
        } else {
            console.log("No results found " + err)
        }
    });
};

/* --- DO WHAT IT SAYS --- */
// Command line: node liri.js do-what-it-says
// Render the following information: 
// 1. LIRI take text inside random.txt to use it to call one of LIRI's commands
// 2. Run spotify-this-song for "I Want it That Way"

function random() {
    // Run file system to grab random.text and spotify the song in the text file
    fs.readFile("./random.txt", "utf8", function (err, data) {
        var text = data.split(",");
        mySpotify(text[1]);
    });
};


/* --- BONUS (attempted) --- */
// function outputData(dataLog) {
//     // Append each command ran to the log.txt file
//     fs.appendFile("./log.txt", dataLog + function (err) {
//         if (err) return outputData("Error logging data to file: " + err);
//     });
// }
