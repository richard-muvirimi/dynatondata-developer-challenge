var mysql = require('mysql2/promise');
var base64 = require('base-64');
const { sprintf } = require('sprintf-js');

const database = {
	"getConnection": async function () {
		return await mysql.createConnection({
			host: process.env.DATABASE_HOST,
			user: process.env.DATABASE_USER,
			password: process.env.DATABASE_PASSWORD,
			database: process.env.DATABASE_NAME
		});
	}
	,
	"getTableName": function (name) {
		return process.env.DATABASE_PREFIX + name;
	},
	"fetchUser": async function (token) {

		token = base64.decode(token);

		let [id, username] = token.split(":");

		let connection = await this.getConnection();

		connection.connect();

		let sql = sprintf("SELECT * FROM %s WHERE id = ? AND username = ? LIMIT 1", this.getTableName("users"));

		// Handle errors (Restricted by development time)
		let [users] = await connection.query(sql, [id, username]);

		connection.end();

		return users[0];
	},
	"fetchProduct": async function (product) {
		let connection = await this.getConnection();

		connection.connect();

		let sql = sprintf("SELECT * FROM %s WHERE id = ?", this.getTableName("products"));

		let [results] = await connection.query(sql, [product]);

		connection.end();

		return results[0];
	},
	"validToken": async function (token) {

		let user = await this.fetchUser(token);

		return user != undefined && user.admin == true;
	}
}

module.exports = database;