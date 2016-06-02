
var express = require("express");
var port = process.env.PORT;


var app = express();


app.get('*', function(req, res) {
    res.send("Server is functioning...");
})





app.listen(port);
console.log("Server is listening on port " + port);