'use strict';

var express = require("express");
var port = process.env.PORT;
var fs = require('fs');
var http = require('http');
var request = require('request');
var prettyjson = require('prettyjson');

var app = express();



app.get('/', function(req, res) {

    res.send("Homepage...");
    
});

app.get("*", function(req, res) {
    
    var input = req.params;
    var query = input[0].slice(1);
    
    var arr = [];
    var resultObj = {
        url : '',
        text : ''
    };

    
    var apiId = "008924517014194673499%3Atkjerk2whko";
    var apiKey = "AIzaSyAk_Xhchp5zIzikREMeAbnNPnyL6bS6sDE";
    var requestUrl = "https://www.googleapis.com/customsearch/v1?q=" + query + "&cx=" + apiId + "&key=" + apiKey;
    
    request(requestUrl, function (err, response, body) {
        
        if (!err && res.statusCode == 200) {
            
            var info = JSON.parse(body);
            var obj = JSON.stringify(info, null, 3);

    
                for (var i = 0; i < info.items.length; i++) {
        
                    resultObj.url = info.items[i].pagemap.cse_image[0].src;
                    arr.push(resultObj);
                    
                }
            

            res.setHeader('Content-Type', 'application/json');
            res.send(arr);
            
        };
        
    });
    
    
})
  
app.listen(port);
console.log("Server is listening on port " + port);

// API_ID: 008924517014194673499%3Atkjerk2whko
// API_KEY: AIzaSyAk_Xhchp5zIzikREMeAbnNPnyL6bS6sDE