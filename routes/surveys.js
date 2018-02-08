var express = require("express");
var router = express.Router();
var survey_sc = require("../Schema/surveys");
var surveyResults_sc = require("../Schema/surveyResults");
var chat_sc = require("../Schema/chats");
var auth = require("../tools/authentication");
var request = require("request");

const botServer = "http://localhost:9002";
var _ = require("lodash");

// var request=require('request');

//Add new survey
////////////////////////////////////////
// {
// "title":"survey 2",
//   "text":"how r u 2day?",
//   "keyboard":["fine","not bad"]
// }
////////////////////////////////////////
router.post("/new", auth, function (req, res) {
  console.log("Now U can save a new survey ...");
  var survey = new survey_sc(req.body);
  survey.userId = req.session.userId;
  var chatIds = [];
  chat_sc.find({
      trusted: 1
    }, {
      chatId: 1,
      _id: 0
    },
    function (err, result) {
      if (!err) {
        if (result) {
          result.map(function (item) {
            chatIds.push(item._doc.chatId);
          });

          // console.log(result[0]._doc.chatId)
          survey.chatIds = chatIds;
          survey.save(function (err, savedSurvey) {
            console.log(savedSurvey);
            if (!err) {
              // result.json({survey:savedSurvey});
              survey = savedSurvey._doc;
            } else
              result.json({
                error: err
              });
          });
        } else
          res.json({
            error: "There is no chatId to select..."
          });
      } else {
        res.status(500).json({
          error: err
        });
      }
    }
  );
  request.post({
      url: botServer + "/surveys/new",
      json: {
        surveyId: survey._id
      }
    },
    function (err, res) {
      if (err) console.log("err: ", err);
    }
  );
});

//Get all surveys
router.post("/all", auth, function (req, res) {
  survey_sc
    .find({})
    .sort("-date")
    .exec(function (err, result) {
      if (!err) {
        if (result) {
          res.json({
            surveysArray: result
          });
        } else {
          res.json({
            error: "There is no survey to select..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

router.post("/all/result", auth, function (req, res) {
  surveyResults_sc
    .find({})
    .populate({
      path: "surveyId",
      select: {
        text: "text",
        keyboard: "keyboard",
        _id: "_id"
      }
    })
    .sort("-date")
    .exec(function (error, result) {
      if (error) return res.status(500).json({
        error
      });
      var x = {};
      result.map(sresult => {
        var id = sresult.surveyId._id;
        var text = sresult.text;
        if (!x[id]) x[id] = {
          total: 0,
          votes: {}
        };
        if (!x[id]["votes"][text]) x[id]["votes"][text] = 0;
        x[id]["votes"][text]++;
        x[id].total++;
      });
      var final = [];
      _.mapKeys(x, (value, key) => {
        var answers = [];
        _.mapKeys(value.votes, (v, k) => {
          answers.push({
            text: k,
            count: v,
            percent: Math.round(v * 100 / value.total)
          });
        })
        final.push({
          surveyId: key,
          answers,
          totalCount: value.total
        });
      });

      // return console.ok(final)

      return res.status(200).json({
        surveys: final
      })
    });
})

+//Select last 3 surveys sort by date
router.post('/select/last/date', auth, function (req, res) {
  survey_sc.find({}).sort('-date').limit(3).exec(function (err, result) {
      //pagination should be handled
      if (!err) {
          res.status(200).json({
              surveys: result,
              // userId: req.body.token
              userId: req.session.userId
          });
      } else {
          res.status(500).json({
              error: err
          });
      }
  })
})

 router.post('/select/one/result', auth, function (req, res) {
  console.log('req.body: ', req.body);
  
  surveyResults_sc.find({
    'surveyId': req.body.surveyId
  }, {
    _id: 0,
    text: 1
  }).populate({
    path: 'surveyId',
    select: {
      title: 'title',
      text: 'text'
    }
  }).exec(function (error, result) {
    if (error) return res.status(500).json({
      error
    });

    console.log('survey: ', result);
    var totalCount = result.length;
    var count = {}
    if (result) {
      //this will loop in result. 
      result.map(surveyResult => {
        var item=surveyResult._doc
        console.log(item.text)
        //item is one item of result array. its like this:
        /**
         * {
         *  text:"fine"
         * }
         */
        if (!count[item.text]) count[item.text] = 1;
        else count[item.text]++;
      })
      //now count is a json like this:
      /**
       * {
       * "fine":3,
       * "not bad":2
       * }
       */

      console.log(count)
      //we have to make it beauty to make our result more readable.
      var votes = [];
      //This will loop in keys of a json(count)
      /*
       * in first loop >> value is 3, key is "fine"
       * in second loop >> value is 2,key is "not bad"
       */
      _.mapKeys(count, (value, key) => {
        //I'm just make a more readable result here, votes is an array of jsons with title key and count key.
        votes.push({
          title: key,
          count: value,
          percent: Math.round(value * 100 / totalCount)
        });
      });

      res.status(200).json({
        survey: result,
        answers: votes,
        totalCount,
      })
    } else {
      res.json({
        error: 'There is no user to select...'
      })
    }
  })
}) 
module.exports = router;