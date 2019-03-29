require("dotenv").config();
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

//commands
//concert-this
    //node liri.js concert-this <artist/band name here>
///spotify-this-song
    //node liri.js spotify-this-song '<song name here>'
//movie-this
    //node liri.js movie-this '<movie name here>'
//do-what-it-says
    //node liri.js do-what-it-says