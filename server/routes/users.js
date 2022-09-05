var express = require('express');
var router = express.Router();
var base64 = require('base-64');
const { sprintf } = require('sprintf-js');
var database = require("../util/database");
const { DateTime } = require('luxon');

/* GET user data. */
router.get('/', async function (req, res, next) {
	let response = { status: true };
	if (req.query.token.length != 0) {

		let user = await database.fetchUser(req.query.token);

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
			response.message = "Invalid Token";
		}
	} else {
		res.status("401");
		response.message = "Invalid Token";
	}
	res.send(response);
});

/* Authenticate user */
router.get('/auth', async function (req, res, next) {

	let response = { status: true };
	if (req.query.username.length == 0 || req.query.password.length == 0) {
		res.status("401");
		response.message = "Please provide both Username and Password";
	} else {

		let connection;
		try {

			connection = await database.getConnection();

			connection.connect();

			let sql = sprintf("SELECT * FROM %s WHERE username = ? AND password = ? LIMIT 1", database.getTableName("users"));

			let [users] = await connection.query(sql, [req.query.username, req.query.password]);

			let user = users[0];

			if (user != undefined) {

				// Hacky token generation, JWT would have been ideal but then again user data could have been hardcoded
				let token = sprintf("%s:%s", user.id, user.username);

				response.user = {
					token: base64.encode(token),
				};
			} else {
				res.status("400");
				response.message = "Invalid Username and Password";
			}

		} catch (error) {
			console.log(error);
		} finally {
			connection?.end();
		}
	}
	res.send(response);

});

/* PATCH user bid. */
router.patch('/settings', async function (req, res, next) {
	let response = { status: true };
	if (req.query.token.length != 0) {

		let user = await database.fetchUser(req.query.token);

		if (user != undefined) {

			let connection;
			try {

				connection = await database.getConnection();

				connection.connect();

				let sql = sprintf("UPDATE %s SET bidMax = ?, bidPercentage = ? WHERE id = ?", database.getTableName("users"));

				await connection.query(sql, [req.query.bidMax, req.query.bidPercentage, user.id]);

				response.user = await database.fetchUser(req.query.token);

			} catch (error) {
				console.log(error);
			} finally {
				connection?.end();
			}

		} else {
			res.status("401");
			response.message = "Invalid Token";
		}
	} else {
		res.status("401");
		response.message = "Invalid Token";
	}
	res.send(response);
});

/* GET auto bid status */
router.get('/notice', async function (req, res, next) {
	let response = { status: true };
	if (req.query.token.length != 0) {

		let user = await database.fetchUser(req.query.token);

		if (user != undefined) {

			let connection;
			try {
				// check auto bid
				connection = await database.getConnection();

				connection.connect();

				let sql = sprintf("SELECT * FROM %s WHERE IFNULL(FIND_IN_SET(?, users) , 0) != 0 AND expire > ?", database.getTableName("products"));


				let [products] = await connection.query(sql, [user.id, DateTime.now().toSeconds()]);

				let total = products.map(product => {
					return product.bid;
				});

				if (total > (user.bidMax * user.bidPercentage / 100)) {
					response.notice = "Configured bid amount exceeded";
				}
			} catch (error) {
				console.log(error);
			} finally {
				connection?.end();
			}

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

module.exports = router;
