/*  Bailie Delpire
	Csc 337, Spring 2019
	Final Project, calendar_service.js

	This file is the calendar web service. */

"use strict";

const express = require("express");
const app = express();

const fs = require("fs");

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));


app.post('/', jsonParser, function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let type = req.body.type;
	let date = req.body.date;
	let time = req.body.time;
	let title = req.body.title;
	let details = req.body.details;
	let event = type + "//" + date + "//" + time + "//" + title + "//" + details + "\n";

	fs.appendFile("events.txt", event, function(err) {
    	if(err) {
			console.log(err);
			res.status(400);
    	}
    	res.send("Success!");
	});
});


app.get('/', function (req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	let json = {};
	let events = [];
	let file = fs.readFileSync("events.txt", 'utf8');
	let lines = file.split("\n");
	for (let i=0; i < lines.length; i++) {
		let line = lines[i].split("//");
		let event = {};
		event["type"] = line[0];
		event["date"] = line[1];
		event["time"] = line[2];
		event["title"] = line[3];
		event["details"] = line[4];
		events.push(event);
	}
	json["events"] = events;
	res.send(JSON.stringify(json));
});

app.listen(process.env.PORT);
