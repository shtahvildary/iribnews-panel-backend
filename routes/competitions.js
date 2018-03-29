var express = require("express");
var router = express.Router();
var competition_sc = require("../Schema/competitions");
var competitionResults_sc=require("../Schema/competitionResults")
// var competitionResults_sc = require("../Schema/competitionResults");
var chat_sc = require("../Schema/chats");
var auth = require("../tools/authentication");
var request = require("request");
var {checkPermissions}=require("../tools/auth");


// const botServer = "http://172.16.17.149:9002";
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
router.post("/new", auth, function(req, res) {
  var allowedPermissions=[121]
  
  console.log("Now U can save a new competition ...",req.body);
  var {title,voteItemId,question,keyboard}=req.body;

  var competition = new competition_sc({title,voteItemId,question,keyboard});
  competition.userId = req.session.userId;
  competition.departmentId=req.session.departmentId;

  competition.save(function(err, savedCompetition) {
    if(err)return res.status(500).json({error:err})
    res.status(200).json({message:"competition has been saved successfully and will be send to all users soon."})
    request.post(
      {
        url: botServer + "/competitions/new",
        json: {
          competitionId: savedCompetition._id
        }
      },
      function(err, response) {
        if (err)return console.log("err: ", err);

      }
    );
  });
  
});

//Get all surveys
router.post("/all", auth, function(req, res) {
  var allowedPermissions=[121]
  
  var data;
  if (req.session.type < 2) data = {};
  else  data = {'departmentId': req.session.departmentId};
  
  competition_sc
    .find(data)
    .sort("-date")
    .exec(function(err, result) {
      if (!err) {
        if (result) {
          res.json({
            competitionsArray: result
          });
        } else {
          res.json({
            error: "There is no competition to select..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

router.post("/all/result", auth, function(req, res) {
  var allowedPermissions=[123]

  var data;
  if (req.session.type < 2) data = {};
  else  data = {'departmentId': req.session.departmentId};
  
  
  competitionResults_sc
    .find(data)
    .populate({
      path: "competitionId",
      select: {
        question: "question",
        keyboard: "keyboard",
        _id: "_id"
      }
    })
    .sort("-date")
    .exec(function(error, result) {
      if (error)
        return res.status(500).json({
          error
        });
      var x = {};
      result.map(compResult => {
        var id = compResult.competitionId._id;
        var question = compResult.question;
        if (!x[id])
          x[id] = {
            total: 0,
            totalCorrectAnswers:0,
          };
          var correctAnswer;
          compResult.competitionId.keyboard.map(key=>{
            if(key.correctAnswer) correctAnswer=key.text;
          })
         if(compResult.answer.text==correctAnswer)  x[id].totalCorrectAnswers++;
        // if (!x[id]["votes"][text]) x[id]["votes"][text] = 0;
        // x[id]["votes"][text]++;
        x[id].total++;
      });
      var final = [];
      _.mapKeys(x, (value, key) => {
        final.push({
          competitionId: key,
          
          totalCount: value.total,
          totalCorrectAnswers:value.totalCorrectAnswers
        });
      });

      // return console.ok(final)

      return res.status(200).json({
        competitions: final
      });
    });
})



//  Select last 3 competitions sort by date
  router.post("/select/last/date", auth, function(req, res) {

    var data;
    if (req.session.type < 2) data = {};
    else  data = {'departmentId': req.session.departmentId};
    
    competition_sc
      .find(data)
      .sort("-date")
      .limit(3)
      .exec(function(err, result) {
        //pagination should be handled
        if (!err) {
          res.status(200).json({
            competitions: result,
            // userId: req.body.token
            userId: req.session.userId
          });
        } else {
          res.status(500).json({
            error: err
          });
        }
      });
  });


module.exports = router;
