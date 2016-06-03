var express = require("express");
var port = process.env.PORT;
var fs = require('fs');
var http = require('http');
var request = require('request');
var mongodb = require('mongodb');

var app = express();

var MongoClient = mongodb.MongoClient;
// Local url:
// var url = 'mongodb://localhost:27017/image-search-abstraction';
// mLab hosted url:
var url = "mongodb://heroku:heroku123@ds023303.mlab.com:23303/image-search-abstraction";

MongoClient.connect(url, function(err, db) {
    
    if (err) {
        console.log("Unable to connect to the database");
    }
    else {
        console.log("Connection established to " + url);
        
        db.close();
    }
    
})

// Serve static files:
app.use(express.static(__dirname + '/public'));


// Route for homepage:
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Route for image search queries:
app.get("/api", function(req, res) {
    
    // Get time at this instance and convert to a date variable;
    var unix = Math.round(+new Date()/1000);
    var date = new Date(unix * 1000);
    
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
    
    // save query to database collection as a new entry object with a timestamp;
    
    MongoClient.connect(url, function(err, db) {
        
        if (err) {
            console.log("Could not connect.");
        }
        else {
            db.collection('recent').insertOne( {
                "search query" : query,
                "timestamp" : date
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
            console.log(arr);
            res.send(arr);
    });
    
});

// Route for recent search queries:
app.get("/api/recent", function(req, res) {
    
    // Query database and return 10 most recent entries;
    MongoClient.connect(url, function(err, db) {
        
        if (err) {
            console.log("Could not connect");
        }
        else {
            db.collection('recent').find().sort({timestamp:1}).toArray(function(err, doc) {
                
                if(!err) {
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

// API_ID: 008924517014194673499%3Atkjerk2whko
// API_KEY: AIzaSyAk_Xhchp5zIzikREMeAbnNPnyL6bS6sDE