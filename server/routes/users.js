var express = require('express');
// var users = require("../data/users");
var router = express.Router();
var base64 = require('base-64');
const { sprintf } = require('sprintf-js');
const fs = require('fs');

/* GET user data. */
router.get('/', function (req, res, next) {
	let response = { status: true };
	if (req.query.token.length != 0) {
		let token = base64.decode(req.query.token);

		let [id, username] = token.split(":");

		let rawdata = fs.readFileSync('data/users.json');
		let users = JSON.parse(rawdata);

		let user = users.find((user) => {
			return user.username == username && user.id == id;
		});

		if (user != undefined) {
			response.user = {
				id: user.id,
				username: user.username,
				admin: user.admin,
				bidMax: user.bidMax,
				bidPercentage: user.bidPercentage
			};
		} else {
			res.status("401");
			response.message = "Invalid Tokens";
		}
	} else {
		res.status("401");
		response.message = "Invalid Token";
	}
	res.send(response);
});

/* Authenticate user */
router.get('/auth', function (req, res, next) {

	let response = { status: true };
	if (req.query.username.length == 0 || req.query.password.length == 0) {
		res.status("401");
		response.message = "Please provide both Username and Password";
	} else {

		let rawdata = fs.readFileSync('data/users.json');
		let users = JSON.parse(rawdata);

		let user = users.find((user) => {
			return user.username == req.query.username && user.password == req.query.password;
		});

		if (user != undefined) {

			// Hacky token generation, JWT would have been ideal but then again user data is hardcoded
			let token = sprintf("%s:%s", user.id, user.username);

			response.user = {
				token: base64.encode(token),
			};
		} else {
			res.status("400");
			response.message = "Invalid Username and Password";
		}
	}
	res.send(response);

});

module.exports = router;
