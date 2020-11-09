var express = require("express");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var createError = require("http-errors");
var util = require("util");
var router = express.Router();

var db = require("../db/db");

/* Get all recipes */
router.get("/", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    db.get()
		.collection("recipes")
		.find({username: username})
		.then((recipes) => {
		    if (recipes.length < 1) {
			throw "unknown user";
		    }
		    res.json(recipes);
		});
	})
	.catch((err) => {res.status(400).json('Error: ' + err)});
});

/* Get recipe by ID */
router.get("/:recipeid", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    let recipeid = req.params.recipeid;
	    db.get()
		.collection("recipes")
		.find({"_id": recipeid, username: username})
		.then((recipe) => {
		    res.json(recipe);
		})
	})
	.catch((err) => {res.status(400).json('Error: ' + err)});
});

/* Update recipe by ID */
router.put("/:recipeid", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    let recipeid = req.params.recipeid;
	    let recipename = req.body.name;
	    let ingredients = req.body.ingredients;
	    let updates = {name: recipename, ingredients: ingredients}
	    db.get()
		.findOneAndUpdate({"_id": recipeid, username: username}, {$set: updates});
	    db.get()
		.collection("recipes")
		.find({username : username})
		.then((recipes) => {
		    res.json(recipes);
		});
	})
	.catch((err) => {res.status(400).json('Error: ' + err)});
});

/* Add a recipe to users recipe list */
router.post("/", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    let recipename = req.body.name;
	    let ingredients = req.body.ingredients;
	    let entry = {username: username, name: recipename, ingredients: ingredients};
	    db.get()
		.collection("recipes")
		.insert(entry);
	})
	.catch((err) => {res.status(400).json('Error: ' + err)});
});

/* Remove a recipe form users recipe list */
router.delete("/:recipeid", function (req, res, next) {
    isAuthenticated(req)
	.then((tokenInfo) => {
	    let username = tokenInfo.usr;
	    let recipeid = req.params.recipeid;
	    db.get()
		.collection("recipes")
		.deleteOne({"_id": recipeid, username: username});
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
