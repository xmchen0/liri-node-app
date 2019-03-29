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

// Initialise Spotify npm specific call to get keys to spotify account
var spotify = new Spotify(keys.spotify);

// Capture user input parameters
const command = process.argv[2];
const userInput = process.argv[3];

/* --------- *\
|* Functions *|
\* --------- */

// Switch case statement
function switchCase() {
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
};


/* --- BANDS IN TOWN --- */
// Command line: `node liri.js concert-this <artist/band name here>`
// Render the following information: 
// 1. Name of the venue
// 2. Venue location
// 3. Date of the Event (use moment to format this as "MM/DD/YYYY")
// queryURL: https://rest.bandsintown.com/artists/circa%20survive/events?app_id=codingbootcamp

function myConcert(artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function (response, err) {
            if (!err) {
                for (var i = 0; i < response.data.length; i++) {
                    var concertData = response.data;
                    console.log(" ");
                    console.log("================| MY CONCERT RESULTS |================");
                    console.log("1. Venue: " + concertData[i].venue.name);
                    console.log("2. Location: " + concertData[i].venue.city + ", " + concertData[i].venue.country);
                    console.log("3. Date and Time: " + moment(response.data[i].datetime, 'YYYY-MM-DDTHH:mm:ss').format('MM/DD/YYYY, h:mm A'));
                    console.log("======================================================");
                    console.log(" ");
                }
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
    // If no songs entered, default to "The Sign" by Ace of Base
    if (song === undefined || null) {
        song = "'The Sign' by Ace of Base";
    }
    spotify.search({ type: "track", query: song, limit: 1 }, function (err, data) {
        // If no error loop through tracks of songs
        if (!err) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log(" ");
                console.log("================| MY SONG RESULT |================");
                console.log("1. Artist: " + songData.artists[i].name);
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
    if (movie === undefined) {
        console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    } else {
        console.log(movie)
        var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

        axios.get(queryURL).then(
            function (response, err) {
                if (!err) {
                    var movieData = response.data;
                    console.log(" ");
                    console.log("=====================| MY MOVIE RESULT |=====================");
                    console.log("1. Title: " + movieData.Title);
                    console.log("2. Release Year: " + movieData.Year);
                    console.log("3. IMDB Rating: " + movieData.imdbRating);
                    console.log("4. Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
                    console.log("5. Country: " + movieData.Country);
                    console.log("6. Language: " + movieData.Language);
                    console.log("7. Plot: " + movieData.Plot);
                    console.log("8. Actors: " + movieData.Actors);
                    console.log("=============================================================");
                    console.log(" ");
                } else {
                    console.log("No results found " + err)
                }
            });
    }
};


/* --- DO WHAT IT SAYS --- */
// Command line: `node liri.js do-what-it-says`
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


/* ------------ *\
|* Main Process *|
\* ------------ */

switchCase(command);
