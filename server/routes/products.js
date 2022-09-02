var express = require('express');
var router = express.Router();
const { sprintf } = require('sprintf-js');
var base64 = require('base-64');
var database = require("../util/database");

/* GET product listing. */
router.get('/', async function (req, res, next) {
  let response = { status: true };

  var connection = await database.getConnection();

  connection.connect();

  let sql = sprintf("SELECT * FROM %s", database.getTableName("products"));

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

    response.data = await database.fetchProduct(req.query.product);

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

    var connection = await database.getConnection();

    connection.connect();

    let sql = sprintf("INSERT INTO %s (title, description, bid, user, expire) VALUES (?,?,?,?,?)", database.getTableName("products"));

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

    var connection = await database.getConnection();

    connection.connect();

    let sql = sprintf("UPDATE %s SET title = ?, description = ?, bid = ?, user = ?, expire = ? WHERE id = ?", database.getTableName("products"));

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

    var connection = await database.getConnection();

    connection.connect();

    let sql = sprintf("DELETE FROM %s WHERE id = ?", database.getTableName("products"));

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

/* PATCH product bid. */
router.patch('/bid', async function (req, res, next) {
  let response = { status: true };
  if (req.query.token.length != 0) {

    let user = await database.fetchUser(req.query.token);

    if (user != undefined) {

      var connection = await database.getConnection();

      connection.connect();

      // TODO take highest bidder instead
      let sql = sprintf("UPDATE %s SET user = ?, bid = ? WHERE id = ? AND bid < ?", database.getTableName("products"));

      await connection.query(sql, [req.query.user, req.query.bid, req.query.product, req.query.bid]);

      connection.end();

      response.data = await database.fetchProduct(req.query.product);

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

/* PATCH product subscription. */
router.patch('/subscribe', async function (req, res, next) {
  let response = { status: true };
  if (req.query.token.length != 0) {

    let user = await database.fetchUser(req.query.token);

    if (user != undefined) {

      var connection = await database.getConnection();

      connection.connect();

      let product = await database.fetchProduct(req.query.product)

      let users = product.users.split("|").filter();

      if (req.query.subscribe) {
        users.push(user.id);
      } else {
        users = users.filter(u => u == user.id);
      }

      sql = sprintf("UPDATE %s SET users = ? WHERE id = ?", database.getTableName("products"));

      await connection.query(sql, [users.join("|"), req.query.product]);

      connection.end();

      response.data = await database.fetchProduct(req.query.product);

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

module.exports = router;
