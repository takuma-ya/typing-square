const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const bcrypt = require("bcrypt");

router.post('/', function (req, res, next) {
    const music_id = req.body.music_id;
    const score = req.body.score;
    const userId = req.session.userid;
    const isAuth = Boolean(userId);
    if (isAuth) {
        knex("users")
        .where({id: userId})
        .select("*")
        .then(async function (result) {
            if (result.length == 0) {
                res.status(500).send("no user");
            }
            else {
                knex("scores")
                .insert({user_id: userId, music_id: music_id, score: score})
                .then(function () {
                    res.status(200);
                })
                }
        })
        .catch(function (err) {
            console.error(err);
            res.status(500).send("insert_error")
        });
    } else {
        res.status(200);
    }
 });


  module.exports = router;