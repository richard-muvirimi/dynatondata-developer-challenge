var express = require('express');
var router = express.Router();
var mysql = require('mysql2/promise');
const { sprintf } = require('sprintf-js');
const fs = require('fs');
var base64 = require('base-64');

const getTableName = function () {
  return sprintf("%sproducts", process.env.DATABASE_PREFIX);
}

const getConnection = async function () {
  return await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  });
}

const validToken = function (token) {

  token = base64.decode(token);

  let [id, username] = token.split(":");

  let rawdata = fs.readFileSync('data/users.json');
  let users = JSON.parse(rawdata);

  let user = users.find((user) => {
    return user.username == username && user.id == id;
  });

  return user != undefined && user.admin == true;
}

/* GET product listing. */
router.get('/', async function (req, res, next) {
  let response = { status: true };

  var connection = await getConnection();

  connection.connect();

  let sql = sprintf("SELECT * FROM %s", getTableName());

  // Handle errors (Restricted by development time)
  let [results] = await connection.query(sql);

  response.data = results;

  connection.end();

  res.send(response);
});

/* GET product. */
router.get('/product', async function (req, res, next) {
  let response = { status: true };

  if (req.query.product) {

    var connection = await getConnection();

    connection.connect();

    let sql = sprintf("SELECT * FROM %s WHERE id = ?", getTableName());

    // Handle errors (Restricted by development time)
    let [results] = await connection.query(sql, [req.query.product]);

    response.data = results;

    connection.end();
  } else {
    response.data = [];
  }

  res.send(response);
});

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}

/* PUT product. */
router.put('/add', async function (req, res, next) {
  let response = { status: true };

  if (validToken(req.query.token) && req.query.title.length != 0 && req.query.description.length != 0 && isNumeric(req.query.expire) && isNumeric(req.query.bid)) {

    var connection = await getConnection();

    connection.connect();

    let sql = sprintf("INSERT INTO %s (title, description, bid, user, expire) VALUES (?,?,?,?,?)", getTableName());

    // Handle errors (Restricted by development time)
    await connection.query(sql, [req.query.title, req.query.description, req.query.bid, req.query.user, req.query.expire]);

    response.data = true;

    connection.end();
  } else {
    response.data = false;
    response.message = "Invalid token or Product details";
  }

  res.send(response);
});

/* PATCH product. */
router.patch('/update', async function (req, res, next) {
  let response = { status: true };

  if (validToken(req.query.token) && req.query.title.length != 0 && req.query.description.length != 0 && isNumeric(req.query.expire) && isNumeric(req.query.bid) && isNumeric(req.query.product)) {

    var connection = await getConnection();

    connection.connect();

    let sql = sprintf("UPDATE %s SET title = ?, description = ?, bid = ?, user = ?, expire = ? WHERE id = ?", getTableName());

    // Handle errors (Restricted by development time)
    await connection.query(sql, [req.query.title, req.query.description, req.query.bid, req.query.user, req.query.expire, req.query.product]);

    response.data = true;

    connection.end();
  } else {
    response.data = false;
    response.message = "Invalid token or Product details";
  }

  res.send(response);
});

/* DELETE product. */
router.delete('/delete', async function (req, res, next) {
  let response = { status: true };

  if (validToken(req.query.token) && isNumeric(req.query.product)) {

    var connection = await getConnection();

    connection.connect();

    let sql = sprintf("DELETE FROM %s WHERE id = ?", getTableName());

    // Handle errors (Restricted by development time)
    await connection.execute(sql, [req.query.product]);

    response.data = true;

    connection.end();

  } else {
    response.data = false;
    response.message = "Invalid token or Product ID";
  }

  res.send(response);
});

module.exports = router;
