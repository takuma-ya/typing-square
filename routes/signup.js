const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require("bcrypt");

router.post('/', function (req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
  
    knex("users")
      .where({name: username})
      .select("*")
      .then(async function (result) {
        if (result.length !== 0) {
          req.session.error = 'このユーザ名は既に使われています';
          res.redirect("/");
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            knex("users")
              .insert({name: username, password: hashedPassword})
              .then(function () {
                res.redirect("/");
              })
            }
      })
      .catch(function (err) {
        console.error(err);
        req.session.error = err.sqlMessage;
        res.redirect("/");
      });
  });

  module.exports = router;