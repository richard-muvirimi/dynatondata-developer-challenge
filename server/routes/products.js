var express = require('express');
var router = express.Router();
const { sprintf } = require('sprintf-js');
var database = require("../util/database");

/* GET product listing. */
router.get('/', async function (req, res, next) {
  let response = { status: true };

  let connection;
  try {

    connection = await database.getConnection();

    connection.connect();

    let sql = sprintf("SELECT * FROM %s", database.getTableName("products"));

    // Handle errors (Restricted by development time)
    let [results] = await connection.query(sql);

    response.data = results;

  } catch (error) {
    console.log(error);
  } finally {
    connection?.end();
  }

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

  if (database.validToken(req.query.token) && req.query.title.length != 0 && req.query.description.length != 0 && isNumeric(req.query.expire) && isNumeric(req.query.bid)) {

    let connection;
    try {

      connection = await database.getConnection();

      connection.connect();

      let sql = sprintf("INSERT INTO %s (title, description, bid, user, expire) VALUES (?,?,?,?,?)", database.getTableName("products"));

      // Handle errors (Restricted by development time)
      await connection.query(sql, [req.query.title, req.query.description, req.query.bid, req.query.user, req.query.expire]);

      response.data = true;

    } catch (error) {
      console.log(error);
    } finally {
      connection?.end();
    }
  } else {
    response.data = false;
    response.message = "Invalid token or Product details";
  }

  res.send(response);
});

/* PATCH product. */
router.patch('/update', async function (req, res, next) {
  let response = { status: true };

  if (database.validToken(req.query.token) && req.query.title.length != 0 && req.query.description.length != 0 && isNumeric(req.query.expire) && isNumeric(req.query.bid) && isNumeric(req.query.product)) {

    let connection;
    try {
      connection = await database.getConnection();

      connection.connect();

      let sql = sprintf("UPDATE %s SET title = ?, description = ?, bid = ?, user = ?, expire = ? WHERE id = ?", database.getTableName("products"));

      // Handle errors (Restricted by development time)
      await connection.query(sql, [req.query.title, req.query.description, req.query.bid, req.query.user, req.query.expire, req.query.product]);

      response.data = true;

    } catch (error) {
      console.log(error);
    } finally {
      connection?.end();
    }
  } else {
    response.data = false;
    response.message = "Invalid token or Product details";
  }

  res.send(response);
});

/* DELETE product. */
router.delete('/delete', async function (req, res, next) {
  let response = { status: true };

  if (database.validToken(req.query.token) && isNumeric(req.query.product)) {

    let connection;
    try {
      connection = await database.getConnection();

      connection.connect();

      let sql = sprintf("DELETE FROM %s WHERE id = ?", database.getTableName("products"));

      // Handle errors (Restricted by development time)
      await connection.execute(sql, [req.query.product]);

      response.data = true;

    } catch (error) {
      console.log(error);
    } finally {
      connection?.end();
    }

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

      let product = await database.fetchProduct(req.query.product);

      let bid = parseFloat(req.query.bid);
      let bidders = product.users
        .map(id => database.fetchUserById(id))
        .filter(bidder => {
          // fetch users with max bid amount greater than current bid
          return bidder.bidMax > bid + 1.5;
        });


      if (bidders.length != 0) {
        user = bidders[0]; // first, could be random
        bid = bid + 1.5;
      }

      let connection;
      try {
        connection = await database.getConnection();

        connection.connect();

        let sql = sprintf("UPDATE %s SET user = ?, bid = ? WHERE id = ? AND bid < ?", database.getTableName("products"));

        await connection.query(sql, [user.id, bid, req.query.product, bid]);

        response.data = await database.fetchProduct(req.query.product);

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

/* PATCH product subscription. */
router.patch('/subscribe', async function (req, res, next) {
  let response = { status: true };
  if (req.query.token.length != 0) {

    let user = await database.fetchUser(req.query.token);

    if (user != undefined) {

      let connection;
      try {
        connection = await database.getConnection();

        connection.connect();

        let product = await database.fetchProduct(req.query.product)

        let users = product.users.split(",")
          .filter(b => b.length !== 0)
          .filter(u => parseInt(u) !== parseInt(user.id));

        if (req.query.subscribe.toLowerCase() === "true") {
          users.push(user.id);
        }

        sql = sprintf("UPDATE %s SET users = ? WHERE id = ?", database.getTableName("products"));

        await connection.query(sql, [users.join(","), req.query.product]);

        response.data = await database.fetchProduct(req.query.product);

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

module.exports = router;
