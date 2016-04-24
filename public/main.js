var path = require('path')
var express = require("express")
var http = require("http")
var app = express()

function checkDate(input){
  if (input < 0 || input >= 0)//TODO better way?
    return "unix"
  else {
    var unixtime = Date.parse(input + "Z")/1000
    if(unixtime < 0 || unixtime >= 0)
      return "natural"
    else
      return "bad"
  }
}

function timeDecoder(input){

  var unix, natural

  if (checkDate(input)=="natural")
    unix = Date.parse(input + "Z")/1000 //UTC
  if (checkDate(input)=="unix")
    unix = +input

  var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"]
  var date = new Date(unix*1000)
  var month = monthNames[date.getUTCMonth()], day = date.getUTCDate(), year = date.getUTCFullYear()
  natural = month + " " + day + ", " + year

  if(checkDate(input)=="bad")
    unix = null, natural = null

  return JSON.stringify({"unix":unix, "natural":natural})
}
app.use(express.static('public'));
app.all("*", function(request, response, next) {
  next();
});

app.get("/:input", function(request, response) {
  response.writeHead(200, { "Content-Type": "application/json" });
  var input = request.params.input
  var time = timeDecoder(input)
  response.end(time);
});

app.get("*", function(request, response) {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("404!");
});

http.createServer(app).listen(1337);
console.log("Server Running");
