//this loads the spotify api key from the .env and uses Spotify api
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

//other dependencies
var axios = require("axios"); //for OMDB and Bands in Town api calls
var moment = require("moment"); //for time and date parsing
var fs = require("fs"); //read and write txt files

//collect input
var command = process.argv[2];
var searchQuery = process.argv.slice(3);

function concertThis(term){
    //search Band in Town api to find venue name, location, and event date
    axios.get("https://rest.bandsintown.com/artists/" + term + "/events?app_id=codingbootcamp").then(
        function(response) {
            console.log("Venue: " + response.data[0].venue.name);
            console.log("Location: " + response.data[0].venue.city + ", " + response.data[0].venue.region +", "+ response.data[0].venue.country);
            console.log("Date: "+ moment(response.data[0].datetime).format("MM-DD-YYYY"));
            fs.appendFile("log.txt","concert-this "+ searchQuery + "\n"+ response.data[0].venue.name + ",\n" + response.data[0].venue.city + ", " + response.data[0].venue.region +", "+ response.data[0].venue.country +",\n" + moment(response.data[0].datetime).format("MM-DD-YYYY")+"\n",function(err){
                if(err){
                    return err;
                }
            })
        })
        .catch(function(error){
            console.log("Error: band not found.");
        }
    )
}

function spotifyThisSong(term) {
    spotify.search({type: 'track', query: term}).then(
        function(response){
            var artists = [];
            for(var i=0;i<response.tracks.items[0].album.artists.length;i++){
                artists.push(response.tracks.items[0].album.artists[i].name);
            }
            console.log("Artist(s): " + artists);
            console.log("Track: " + response.tracks.items[0].name);
            console.log("Link: " + response.tracks.items[0].external_urls.spotify);
            console.log("Album: " + response.tracks.items[0].album.name)
            fs.appendFile("log.txt","spotify-this-song "+ searchQuery + "\n" + response.tracks.items[0].name + "\n" + response.tracks.items[0].external_urls.spotify + "\n" + response.tracks.items[0].album.name + "\n" ,function(err){
                if(err){
                    return err;
                }
            })
        }
    )
    .catch(function(error){
        console.log("Error: track not found.");
    })
}

function movieThis(term) {
    axios.get("http://www.omdbapi.com/?t="+term+"&apikey=trilogy").then(
        function(response) {
        if(response.data.Title == undefined){
            axios.get("http://www.omdbapi.com/?t="+"mr.nobody"+"&apikey=trilogy").then(
                function(response) {
                    console.log("Title: " + response.data.Title);
                    console.log("Year: " + response.data.Year);
                    console.log("IMDB rating: " + response.data.imdbRating);
                    console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
                    console.log("Country: " + response.data.Country);
                    console.log("Launguage: " + response.data.Language);
                    console.log("Plot: " + response.data.Plot);
                    console.log("Actors: " + response.data.Actors);
                    fs.appendFile("log.txt","movie-this " + "Mr. Nobody" + "\n" + response.data.Title + "\n" + response.data.Year + "\n" + response.data.imdbRating + "\n" + response.data.Ratings[1].Value + "\n" + response.data.County + "\n" + response.data.Language + "\n" + response.data.Plot + "\n" + response.data.Actors + "\n",function(err){
                        if(err){
                            return err;
                        }
                    })
                })}
        else{
          console.log("Title: " + response.data.Title);
          console.log("Year: " + response.data.Year);
          console.log("IMDB rating: " + response.data.imdbRating);
          console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
          console.log("Country: " + response.data.Country);
          console.log("Launguage: " + response.data.Language);
          console.log("Plot: " + response.data.Plot);
          console.log("Actors: " + response.data.Actors);
          fs.appendFile("log.txt","movie-this " + searchQuery + "\n" + response.data.Title + "\n" + response.data.Year + "\n" + response.data.imdbRating + "\n" + response.data.Ratings[1].Value + "\n" + response.data.County + "\n" + response.data.Language + "\n" + response.data.Plot + "\n" + response.data.Actors + "\n",function(err){
            if(err){
                return err;
            }
        })
        }
  })
}

//interpret the command then run the logic
if(command === "concert-this"){
    concertThis(searchQuery.join("+"));
}
else if(command == "spotify-this-song"){
    spotifyThisSong(searchQuery.join("+"));
}
else if(command == "movie-this"){
    movieThis(searchQuery.join("+"));
}
else if(command == "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(error, data){
        if(error){
            return console.log(error);
        }
        var strArr = data.split(",");
        console.log(strArr);
        for(var i=0;i<strArr.length;i++){
            if(strArr[i] == "concert-this"){
                var replaceStr = strArr[i+1].replace("\"", "");
                concertThis(replaceStr.replace("\"", ""));
            }
            else if(strArr[i] == "spotify-this-song") {
                var replaceStr = strArr[i+1].replace("\"", "");
                spotifyThisSong(replaceStr.replace("\"", ""));
            }
            else if(strArr[i] == "movie-this") {
                var replaceStr = strArr[i+1].replace("\"", "");
                movieThis(replaceStr.replace("\"", ""));
            }
            i++;
        }
        
    })
}
else{
    console.log("Please enter a valid command.")
    console.log("1. concert-this\n2. spotify-this-song\n3. movie-this\n4. do-what-it-says");
}

//commands
//concert-this
    //node liri.js concert-this <artist/band name here>
///spotify-this-song
    //node liri.js spotify-this-song '<song name here>'
//movie-this
    //node liri.js movie-this '<movie name here>'
//do-what-it-says
    //node liri.js do-what-it-says