var express = require("express");
var jwt = require("jsonwebtoken");
var createError = require("http-errors");
var util = require("util");
var router = express.Router();
var { ObjectId }  = require("mongodb");

var db = require("../db/db");

/* Get all recipes */
router.get("/", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    db.get()
		.collection("recipes")
		.find({username: username})
		.toArray()
		.then((recipes) => {
			res.status(200).json(recipes).end();
		});
	})
	.catch((err) => {res.status(401).json('Error: ' + err)});
});

/* Get recipe by ID */
router.get("/:recipeid", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let recipeid = req.params.recipeid;
	    db.get()
		.collection("recipes")
		.findOne({ _id: ObjectId(recipeid) })
		.then((recipe) => {
		    res.json(recipe);
			res.status(200).end();
		})
	})
	.catch((err) => {res.status(401).json('Error: ' + err)});
});

/* Update recipe by ID */
router.put("/:recipeid", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
		if (!req.body.name || !req.body.ingredients) throw { status: 400, msg: "missing body parameters (recipe name and ingredients)" }

	    let recipeid = req.params.recipeid;
		let updates = { name: req.body.name };
		if (req.body.ingredients) {
			try {
				updates["ingredients"] = JSON.parse(req.body.ingredients);
			} catch (err) {
				updates["ingredients"] = req.body.ingredients;
			}
		}

		db.get()
		.collection("recipes")
		.findOneAndUpdate({ _id: ObjectId(recipeid), username: username }, { $set: updates })
		.then(() => {
			db.get()
			.collection("recipes")
			.find({username : username})
			.toArray()
			.then((recipes) => {
				res.status(200).json(recipes).end();
			});
		})
	})
	.catch((err) => {res.status(res.status(err.status ? err.status : 401)).json('Error: ' + err)});
});

/* Add a recipe to users recipe list */
router.post("/", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
		let username = tokenInfo.usr;
		if (!req.body.name || !req.body.ingredients) throw { status: 400, msg: "missing body parameters (recipe name and ingredients)" }
		let entry = { username: username, name: req.body.name };
		if (req.body.ingredients) {
			try {
				entry["ingredients"] = JSON.parse(req.body.ingredients);
			} catch (err) {
				entry["ingredients"] = req.body.ingredients;
			}
		}
		
	    db.get()
		.collection("recipes")
		.insertOne(entry)
		.then((insertRes) => {
			res.status(201).json({ id: insertRes.insertedId }).end();
		})
		.catch((err) => {
			res.status(500).json("Error: " + err).end();
		})
	})
	.catch((err) => {res.status(err.status ? err.status : 401).json('Error: ' + err)});
});

/* Remove a recipe form users recipe list */
router.delete("/:recipeid", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    let recipeid = req.params.recipeid;
	    db.get()
		.collection("recipes")
		.deleteOne({ _id: ObjectId(recipeid), username: username })
		.then(() => {
			res.status(200).end(); // this doesn't necessarily mean that a document was deleted (maybe there's none matching this ID)
		})
		.catch(() => {
			res.status(400).json('Error: error while deleting document, ' + err);
		})
	})
	.catch((err) => {res.status(401).json('Error: ' + err)});
});

function isAuthenticated(req){
    var token = req.header("Authorization").split(" ")[1];
    return util.promisify(jwt.verify)(
	token,
	process.env.JWT_KEY
    );
}

module.exports = router;
