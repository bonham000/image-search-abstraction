'use strict';

var express = require("express");
var port = process.env.PORT;
var fs = require('fs');
var http = require('http');
var request = require('request');
var prettyjson = require('prettyjson');

var app = express();

// Serve static files:
app.use(express.static(__dirname + '/public'));


// Route for homepage:
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Route for image search queries:
app.get("/api", function(req, res) {
    
    // var input = req.params;
    // var query = input[0].slice(1);
    
    // Query string example: Http://baseurl.com/api?imagesearch= "Your query here" &offset= "Your offset here"
    
    var query = req.param('imagesearch');
    var offset = req.param('offset');
    
    if (isNaN(offset)) {
        offset = 1;
    }
    
    var arr = [];
    var resultObj = {};

    
    var apiId = "008924517014194673499%3Atkjerk2whko";
    var apiKey = "AIzaSyAk_Xhchp5zIzikREMeAbnNPnyL6bS6sDE";
    var requestUrl = "https://www.googleapis.com/customsearch/v1?q=" + query + "&searchType=image&num=10&start=" + offset + "&cx=" + apiId + "&key=" + apiKey;
    
    request(requestUrl, function (err, response, body) {
        
        if (!err && res.statusCode == 200) {
            
            var info = JSON.parse(body);
            var obj = JSON.stringify(info, null, 3);

                for (var i = 0; i < info.items.length; i++) {
            
                        resultObj = {};
                        resultObj.title = info.items[i].title;
                        resultObj.snippet = info.items[i].snippet;
                        resultObj.url = info.items[i].link;
                        resultObj["context link"] = info.items[i].contextLink;
                        arr[i] = resultObj;
            
                    }
                    
            
                }

            res.setHeader('Content-Type', 'application/json');
            console.log(arr);
            res.send(arr);
        
    });
    
    
});

// Route for recent search queries:
app.get("/api/recent", function(req, res) {
    res.send("Recent queries...")
});

// Catch all for any other route to redirect to homepage:
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
  
app.listen(port);
console.log("Server is listening on port " + port);

// API_ID: 008924517014194673499%3Atkjerk2whko
// API_KEY: AIzaSyAk_Xhchp5zIzikREMeAbnNPnyL6bS6sDE