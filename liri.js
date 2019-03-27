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
switch (command) {
    case "concert-this":
        getBands(userInput);
        break;

    case "spotify-this-song":
        if (userInput) {
            spotifySong(userInput);
        } else {
            spotifySong("The Sign Ace of Base");
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
        display("Error occurred.");
        break;
};


/* --- BANDS IN TOWN --- */
// Command line: node liri.js concert-this <artist/band name here> 
// Render the following information: 
// 1. Name of the venue
// 2. Venue location
// 3. Date of the Event (use moment to format this as "MM/DD/YYYY")
// queryURL: https://rest.bandsintown.com/artists/circa%20survive/events?app_id=codingbootcamp

var queryUrl = "https://rest.bandsintown.com/artists/" + bandQuery + "/events?app_id=codingbootcamp#";

request(queryUrl, function (error, response, body) {
    // If no error and request is successful
    if (!error && response.statusCode === 200) {
        var concertData = JSON.parse(body);
        var momentDT = moment().format('L');
        console.log("1. Venue: " + concertData[0].venue.name);
        console.log("2. Location: " + concertData[0].venue.city + "," + concertData[0].venue.country);
        console.log("3. Date: " + momentDT);
    }
});

/* --- SPOTIFY --- */
// Command line: node liri.js spotify-this-song '<song name here>'
// Render the following information: 
// 1. Artist(s)
// 2. The song's name
// 3. A preview link of the song from Spotify
// 4. The album that the song is from

function spotifySong(song) {
    spotify.search({ type: "track", query: song }, function (error, data) {
        // If no error loop through song database
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("1. Artist: " + songData.artists[0].name);
                console.log("2. Song: " + songData.name);
                console.log("3. Preview URL: " + songData.preview_url);
                console.log("4. Album: " + songData.album.name);
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

/* --- OMDB --- */
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

function omdb(movie) {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&y=&plot=short&apikey=trilogy';

    request(omdbURL, function (error, response, body) {
        // If no error and request is successful, parse the data to become an object
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);
            console.log("1. Title: " + body.Title);
            console.log("2. Release Year: " + body.Year);
            console.log("3. IMdB Rating: " + body.imdbRating);
            console.log("4. Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("5. Country: " + body.Country);
            console.log("6. Language: " + body.Language);
            console.log("7. Plot: " + body.Plot);
            console.log("8. Actors: " + body.Actors);
        } else {
            console.log("Error occurred.")
        }
        // If user does not type a movie, output data for the movie 'Mr. Nobody'
        if (movie === "Mr. Nobody") {
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
    });
};

/* --- DO WHAT IT SAYS --- */
// Command line: node liri.js do-what-it-says
// Render the following information: 
// 1. LIRI take text inside random.txt to use it to call one of LIRI's commands
// 2. Run spotify-this-song for "I Want it That Way"

function doThing() {
    // Run file system to grab random.text and spotify the song in the text file
    fs.readFile("random.txt", "utf8", function (error, data) {
        var text = data.split(",");
        spotifySong(text[1]);
    });
};
