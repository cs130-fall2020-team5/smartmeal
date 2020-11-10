var express = require("express");
var createError = require("http-errors");
var util = require("util");
var jwt = require("jsonwebtoken");
var router = express.Router();
var { ObjectId }  = require("mongodb");

var db = require("../db/db");

/* Get all meal plans for user */
router.get("/", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    db.get()
		.collection("mealplans")
		.find({ username: username })
		.toArray()
		.then((mealplans) => {
			res.json(mealplans);
			res.status(200).end();
		})
		.catch((err) => res.status(400).json('Error: ' + err));
	})
	.catch((err) => {res.status(400).json('Error: ' + err)});
});

/* Create new meal plan */
router.post("/", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    let startdate = req.body.startdate;
	    let entry = {username: username, date: startdate,
			 sunday: [],
			 monday: [],
			 tuesday: [],
			 wednesday: [],
			 thursday: [],
			 friday: [],
			 saturday: []
			};
	    db.get()
		.collection("mealplans")
		.insertOne(entry)
		.then(() => {
			res.status(201).end();
		})
		.catch((err) => {
			res.status(500).json("Error inserting into db: " + err);
		});
	})
	.catch((err) => {res.status(400).json('Error: ' + err)});
});

/* Update a meal plan */
router.put("/:mealplanid", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let mealplanid = req.params.mealplanid;
	    let username = tokenInfo.usr;
		//let startdate = startdate;
		let updates = {};
		if (req.body.sunday) updates["sunday"] = JSON.parse(req.body.sunday);
		if (req.body.monday) updates["monday"] = JSON.parse(req.body.monday);
		if (req.body.tuesday) updates["tuesday"] = JSON.parse(req.body.tuesday);
		if (req.body.wednesday) updates["wednesday"] = JSON.parse(req.body.wednesday);
		if (req.body.thursday) updates["thursday"] = JSON.parse(req.body.thursday);
		if (req.body.friday) updates["friday"] = JSON.parse(req.body.friday);
		if (req.body.saturday) updates["saturday"] = JSON.parse(req.body.saturday);
	    db.get()
		.collection("mealplans")
		.findOneAndUpdate({ _id: ObjectId(mealplanid) }, {$set: updates})
		.then((s) => {
			db.get().collection("mealplans")
			.find({username: username})
			.toArray()
			.then((mealplans) => {
				res.json(mealplans);
				res.status(201).end();
			});
		})
		.catch(err => {
			console.log(err);
		})
	})
	.catch((err) => {res.status(400).json('Error: ' + err)});
});

function isAuthenticated(req){
    var token = req.header("Authorization").split(" ")[1];
    return util.promisify(jwt.verify)(
	token,
	process.env.JWT_KEY
    );
}

module.exports = router;
