const express = require('express');
const router = express.Router();
const knex = require("../db/knex");
const bcrypt = require("bcrypt");

router.post('/', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
  
    knex("users")
      .where({
        name: username,
      })
      .select("*")
      .then(async function (results) {
        if (results.length === 0) {
          res.render("index", {
            title: "Sign in",
            errorMessage: ["ユーザが見つかりません"],
          });
        } else if (await bcrypt.compare(password, results[0].password)) {
          req.session.userid = results[0].id;
          res.redirect('/');
        } else {
          res.render("index", {
            title: "Sign in",
            errorMessage: ["ユーザが見つかりません"],
          });
        }
      })
      .catch(function (err) {
        console.error(err);
        res.render("index", {
          title: "Sign in",
          errorMessage: [err.sqlMessage],
          isAuth: false,
        });
      });
  });

  module.exports = router;