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

		return await this.fetchUserById(id);
	},
	"fetchUserById": async function (id) {

		let user = undefined;

		let connection;
		try {
			connection = await this.getConnection();

			connection.connect();

			let sql = sprintf("SELECT * FROM %s WHERE id = ? LIMIT 1", this.getTableName("users"));

			// Handle errors (Restricted by development time)
			let [users] = await connection.query(sql, [id]);

			user = users[0];
		} catch (error) {
			console.log(error);
		} finally {
			connection?.end();
		}

		return user;
	},
	"fetchProduct": async function (id) {

		let product = undefined;

		let connection;
		try {

			connection = await this.getConnection();

			connection.connect();

			let sql = sprintf("SELECT * FROM %s WHERE id = ?", this.getTableName("products"));

			let [results] = await connection.query(sql, [id]);

			product = results[0];
		} catch (error) {
			console.log(error);
		} finally {
			connection?.end();
		}

		return product;
	},
	"validToken": async function (token) {

		let user = await this.fetchUser(token);

		return user != undefined && user.admin == true;
	}
}

module.exports = database;