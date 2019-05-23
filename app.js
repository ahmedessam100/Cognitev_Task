// Variables
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;
var db = require('../Cognitiv_Task/models/model');


// Connect to mongodb on the cloud
mongoose.connect("mongodb+srv://Ahmed:ahmed200@cluster0-wuecu.mongodb.net/test?retryWrites=true", {
     useNewUrlParser: true });


var urlencodedParser = bodyParser.urlencoded({ extended: true });
var url = "https://ngkc0vhbrl.execute-api.eu-west-1.amazonaws.com/api/?url=https://arabic.cnn.com/";

app.set('view engine', 'ejs');
app.use('/assets', express.static('stuff'));


// GET Request
app.get('/', function(request, respond){
    db.find().exec().then(docs =>{
        var records = {}; 
        for(var p in docs)
        {
            let country = docs[p]['country'];
            if(country in records)
            {
                category = docs[p]['category'];
                if(category in records[country]){
                records[country][category] += 1;
                }
                else{
                    records[country][category] = 1;
                }
            }
            else{
                category = docs[p]['category'];
                records[country] = {};
                records[country][category] = 1;
            }
            
        }   
        respond.send(records);
    });
});

// Sending HTML Page
app.get('/api', function(request, respond){
    respond.render('api', {qs: request.query});
});

// Post from the user to the database
app.post('/api', urlencodedParser, function (req, res) {
    var object = req.body; 
    // if Category is not provided fetch it from the dummy url
    if(object['Category'] === ''){
        var request = https.request(url, function(respond){
        let data = "";
        respond.on('data', function(chunk){
            data += chunk;
        });
        respond.on('end', function(){
            let json = JSON.parse(data);
            object['Category'] = json['category']['name'];
            const record = new db({
                _id: new mongoose.Types.ObjectId(),
                name: object['Name'],
                country: object['Country'],
                budget: object['Budget'],
                goal:   object['Goal'],
                category: object['Category']   
            });
            record.save().then(result =>{
                console.log(result);
            })
            .catch(err => console.log(err));
        });
        });
        request.on('error', function (e) {
            console.log(e.message);
        });
        request.end();
    }
    else{
        const record = new db({
            _id: new mongoose.Types.ObjectId(),
            name: object['Name'],
            country: object['Country'],
            budget: object['Budget'],
            goal:   object['Goal'],
            category: object['Category']   
        });
        record.save().then(result =>{
            console.log(result);
        })
        .catch(err => console.log(err));
    }
    res.render('api', {qs: req.query});
});

// Listen to a port
app.listen(port);

