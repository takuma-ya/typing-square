const express = require('express');
const { range } = require('express/lib/request');
const router = express.Router();
const knex = require('../db/knex');

const num_music = 6;

router.get('/', function (req, res, next) {
  const userId = req.session.userid;
  const isAuth = Boolean(userId);
  if (isAuth) {
    knex("scores")
      .max("score", {as: "score"})
      .select("music_id")
      .where({user_id: userId})
      .groupBy("music_id")
      .then(function (results_score) {
        knex("users")
          .select("name")
          .where({id: userId})
          .then(function (results_user) {
            let scores = Array(num_music);
            scores.fill(0);
            console.log(results_score)
            for (let i = 0; i < results_score.length; i++) {
              let music_id = results_score[i].music_id;
              scores[music_id-1] = results_score[i].score;
            }
            res.render('index', {
              userName: results_user[0].name,
              score_1: scores[0],
              score_2: scores[1],
              score_3: scores[2],
              score_4: scores[3],
              score_5: scores[4],
              score_6: scores[5],
              isAuth: isAuth,
            });
          })
      })
      .catch(function (err) {
        console.error(err);
        res.render('index', {
          score_1: -1,
          score_2: -1,
          score_3: -1,
          score_4: -1,
          score_5: -1,
          score_6: -1,
          isAuth: isAuth,
        });
      });
  } else {
    res.render('index', {
      score_1: 0,
      score_2: 0,
      score_3: 0,
      score_4: 0,
      score_5: 0,
      score_6: 0,
      isAuth: isAuth,
    });
  }
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));
router.use('/save_score', require('./save_score'));

module.exports = router;