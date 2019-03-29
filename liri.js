//this loads the spotify api key from the .env and uses Spotify api
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//other dependencies
var axios = require("axios"); //for OMDB and Bands in Town api calls
var moment = require("moment"); //for time and date parsing


console.log(spotify);

//commands
//concert-this
    //node liri.js concert-this <artist/band name here>
///spotify-this-song
    //node liri.js spotify-this-song '<song name here>'
//movie-this
    //node liri.js movie-this '<movie name here>'
//do-what-it-says
    //node liri.js do-what-it-says