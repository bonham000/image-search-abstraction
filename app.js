var express = require("express");
var port = process.env.PORT;
var fs = require('fs');
var http = require('http');
var request = require('request');
var mongodb = require('mongodb');

var app = express();

var MongoClient = mongodb.MongoClient;
// Local url:
var url = 'mongodb://localhost:27017/image-search-abstraction';
// mLab hosted url:
// var url = "mongodb://heroku:heroku123@ds023303.mlab.com:23303/image-search-abstraction";

// Serve static files:
app.use(express.static(__dirname + '/public'));


// Route for homepage:
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Route for image search queries:
app.get("/api", function(req, res) {
    
    // Get time at this instance and convert to a date variable;
    var timestamp;
    
    function createTimestamp() {
    
        var d = new Date();
        
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        
        var date = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        
        if (month === 1) { month = "January" }
        else if (month === 2)  { month = "February" }
        else if (month === 3)  { month = "March" }
        else if (month === 4)  { month = "April" }
        else if (month === 5)  { month = "May" }
        else if (month === 6)  { month = "June" }
        else if (month === 7)  { month = "July" }
        else if (month === 8)  { month = "August" }
        else if (month === 9)  { month = "September" }
        else if (month === 10) { month = "October" }
        else if (month === 11) { month = "November" }
        else if (month === 12) { month = "December" }
        
        
        timestamp = month + " " + date + ", " + year + " at " + hours + ":" + minutes + ":" + seconds + " Greenwich Mean Time";    
        
    }
    
    createTimestamp();
    
    // Query string example: Http://baseurl.com/api?find= "Your query here" &offset= "Your offset here"
    
    var query = req.param('find');
    var offset = req.param('offset');

    if (isNaN(offset)) {
        offset = 1;
    }

    if (query === undefined) {
        res.sendFile(__dirname + '/index.html');
    }
    
    else {
    
    var arr = [];
    var resultObj = {};
    
    var apiId = "008924517014194673499%3Atkjerk2whko";
    var apiKey = "AIzaSyAk_Xhchp5zIzikREMeAbnNPnyL6bS6sDE";
    var requestUrl = "https://www.googleapis.com/customsearch/v1?q=" + query + "&searchType=image&num=10&start=" + offset + "&cx=" + apiId + "&key=" + apiKey;
    
    // save query to database collection as a new entry object with a timestamp;
    
    MongoClient.connect(url, function(err, db) {
        
        if (err) {
            console.log("Could not connect.");
        }
        else {
            db.collection('recent').insertOne( {
                "search query" : query,
                "timestamp" : timestamp
            });
        }
        
    })
    
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
            console.log("Search completed successfully and entered into the database.");
            res.send(arr);
    });
    
    };
    
});

// Route for recent search queries:
app.get("/recent", function(req, res) {
    
    // Query database and return 10 most recent entries;
    MongoClient.connect(url, function(err, db) {
        
        if (err) {
            console.log("Could not connect");
        }
        else {
            db.collection('recent').find().sort({timestamp:1}).toArray(function(err, doc) {
                
                if(!err) {
                    
                    for (var j = 0; j < doc.length; j++ ) {
                        delete doc[j]["_id"];
                    }
                    
                    res.send(doc);
                }
                
            });
        }
        
    });
    
});

// Catch all for any other route to redirect to homepage:
app.get('*', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
  
app.listen(port);
console.log("Server is listening on port " + port);