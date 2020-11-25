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
		.catch((err) => res.status(500).json('Error: ' + err));
	})
	.catch((err) => {res.status(401).json('Error: ' + err)});
});

/* Create new meal plan */
router.post("/", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
		let startdate = req.body.startdate;
		if (!startdate) throw 400;
	    let entry = {username: username, date: startdate,
			 sunday: { breakfast: [], lunch: [], dinner: [] },
			 monday: { breakfast: [], lunch: [], dinner: [] },
			 tuesday: { breakfast: [], lunch: [], dinner: [] },
			 wednesday: { breakfast: [], lunch: [], dinner: [] },
			 thursday: { breakfast: [], lunch: [], dinner: [] },
			 friday: { breakfast: [], lunch: [], dinner: [] },
			 saturday: { breakfast: [], lunch: [], dinner: [] }
		};
	    db.get()
		.collection("mealplans")
		.insertOne(entry)
		.then((insertRes) => {
			res.status(201).json({ id: insertRes.insertedId }).end();
		})
		.catch((err) => {
			res.status(500).json("Error inserting into db: " + err);
		});
	})
	.catch((err) => {
		res.status(err === 400 ? 400 : 401).json('Error: ' + err);
	});
});

/* Update a meal plan - 1 body parameter - stringified JSON representing update fields */
router.put("/:mealplanid", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let mealplanid = req.params.mealplanid;
		let username = tokenInfo.usr;
		
		let body = req.body;
		let updates = {};
		if (body.sunday) updates["sunday"] = body.sunday;
		if (body.monday) updates["monday"] = body.monday;
		if (body.tuesday) updates["tuesday"] = body.tuesday;
		if (body.wednesday) updates["wednesday"] = body.wednesday;
		if (body.thursday) updates["thursday"] = body.thursday;
		if (body.friday) updates["friday"] = body.friday;
		if (body.saturday) updates["saturday"] = body.saturday;
	    db.get()
		.collection("mealplans")
		.findOneAndUpdate({ _id: ObjectId(mealplanid) }, {$set: updates})
		.then((s) => {
			db.get().collection("mealplans")
			.find({username: username})
			.toArray()
			.then((mealplans) => {
				res.status(201).json(mealplans).end();
			});
		})
		.catch(err => {
			console.log(err);
		})
	})
	.catch((err) => {
		console.log(err);
		res.status(400).json('Error: ' + err)
	});
});

router.post("/:mealplanid/check-grocery-items", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let mealplanid = req.params.mealplanid;
		
		let itemsToCheck = req.body.checked;
		let itemsToUncheck = req.body.unchecked;
		if (!itemsToCheck && !itemsToUncheck) throw 400;
		if (!itemsToCheck) itemsToCheck = [];
		if (!itemsToUncheck) itemsToUncheck = [];
		
	    db.get()
		.collection("mealplans")
		.findOne({ _id: ObjectId(mealplanid) })
		.then((mealplan) => {
			const days = [ "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday" ];
			const times = [ "breakfast", "lunch", "dinner" ];
			for (let day of days) {
				for (let time of times) {
					for (let meal in mealplan[day][time]) {
						const ingList = mealplan[day][time][meal].ingredientList;
						for (let ing in ingList) {
							if (itemsToCheck.includes(ingList[ing].name)) {
								mealplan[day][time][meal].ingredientList[ing]["checked"] = true;
							}

							if (itemsToUncheck.includes(ingList[ing].name)) {
								mealplan[day][time][meal].ingredientList[ing]["checked"] = false;
							}
						}
					}
				}
			}
			db.get()
			.collection("mealplans")
			.findOneAndUpdate({ _id: ObjectId(mealplanid) }, { $set: mealplan })
			.then((result) => {
				res.status(200).end();
			})
			.catch(err => {
				console.log("Error updating mealplan when checking ingredients ", err);
				res.status(500).end();
			})
		})
		.catch(err => {
			console.log("Error fetching meal plan to check ingredients in: ", err);
			res.status(500).end();
		})
	})
	.catch((err) => {
		console.log(err);
		res.status(400).json('Error: ' + err)
	});
});

function isAuthenticated(req){
    var token = req.header("Authorization").split(" ")[1];
    return util.promisify(jwt.verify)(
	token,
	process.env.JWT_KEY
    );
}

module.exports = router;
