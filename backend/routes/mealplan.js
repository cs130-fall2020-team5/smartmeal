var express = require("express");
var createError = require("http-errors");
var util = require("util");
var router = express.Router();

var db = require("../db/db");

/* Get all meal plans for user */
router.get("/", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    db.get()
		.collection("mealplans")
		.find({ username: username })
		.then((mealplans) => {
		    if (mealplans.length < 1) {
			throw "unknown user";
		    }
		    res.json(mealplans);
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
		.insert(entry);
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
	    let sunday = req.body.sunday;
	    let monday = req.body.monday;
	    let tuesday = req.body.tuesday;
	    let wednesday = req.body.wednesday;
	    let thursday = req.body.thursday;
	    let friday = req.body.friday;
	    let saturday = req.body.saturday;
	    let updates = {
		sunday: sunday,
		monday: monday,
		tuesday: tuesday,
		wednesday: wednesday,
		thursday: thursday,
		friday: friday,
		saturday: saturday
	    };
	    db.get()
		.collection("mealplans")
		.findOneAndUpdate({"_id": mealplanid}, {$set: updates});
	    db.get().collection("mealplans")
		.find({username: username})
		.then((mealplans) => {
		    res.json(mealplans);
		});
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
