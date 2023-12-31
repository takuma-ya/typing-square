const express = require('express');
const { range } = require('express/lib/request');
const router = express.Router();
const knex = require('../db/knex');

const num_music = 10;

router.get('/', function (req, res, next) {
  let userId = req.session.userid;
  let isAuth = Boolean(userId);
  let error = req.session.error;
  if (Boolean(error)) {
    delete req.session.error;
  }
  if (isAuth) {
    knex("scores")
      .max({score: "score", rate:"rate"})
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
            let rates = Array(num_music);
            rates.fill(0);
            for (let i = 0; i < results_score.length; i++) {
              let music_id = results_score[i].music_id;
              scores[music_id-1] = results_score[i].score;
              rates[music_id-1] = results_score[i].rate;
            }
            res.render('index', {
              userName: results_user[0].name,
              score_1: scores[0],
              score_2: scores[1],
              score_3: scores[2],
              score_4: scores[3],
              score_5: scores[4],
              score_6: scores[5],
              score_7: scores[6],
              score_8: scores[7],
              score_9: scores[8],
              score_10: scores[9],
              rate_1: rates[0],
              rate_2: rates[1],
              rate_3: rates[2],
              rate_4: rates[3],
              rate_5: rates[4],
              rate_6: rates[5],
              rate_7: rates[6],
              rate_8: rates[7],
              rate_9: rates[8],
              rate_10: rates[9],
              errorMessage: error,
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
          score_7: -1,
          score_8: -1,
          score_9: -1,
          score_10: -1,
          rate_1: -1,
          rate_2: -1,
          rate_3: -1,
          rate_4: -1,
          rate_5: -1,
          rate_6: -1,
          rate_7: -1,
          rate_8: -1,
          rate_9: -1,
          rate_10: -1,
          errorMessage: error,
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
      score_7: 0,
      score_8: 0,
      score_9: 0,
      score_10: 0,
      rate_1: 0,
      rate_2: 0,
      rate_3: 0,
      rate_4: 0,
      rate_5: 0,
      rate_6: 0,
      rate_7: 0,
      rate_8: 0,
      rate_9: 0,
      rate_10: 0,
      errorMessage: error,
      isAuth: isAuth,
    });
  }
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));
router.use('/save_score', require('./save_score'));
router.use('/credit', require('./credit'));

module.exports = router;