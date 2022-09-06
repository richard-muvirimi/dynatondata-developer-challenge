var express = require('express');
var router = express.Router();
const fs = require('fs/promises');
const database = require('../util/database');

/* Install data. */
router.get('/', async function (req, res, next) {

	let connection;
	try {

		connection = await database.getConnection();

		connection.connect();

		let sql = await fs.readFile('./data/install.sql', { encoding: 'utf8' });

		sql = sql.replaceAll("{{PREFIX}}", process.env.DATABASE_PREFIX);

		sql.split(";")
			.map(t => t.trim())
			.filter(t => t.length > 0)
			.forEach(async statement => {
				await connection.execute(statement);
			});

	} catch (error) {
		console.log(error);
	} finally {
		connection?.end();
	}

	res.send("Installed");
});

module.exports = router;
