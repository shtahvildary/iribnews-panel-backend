var express = require("express");
var router = express.Router();
var competition_sc = require("../Schema/competitions");
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

 //Select last 3 surveys sort by date
  // router.post("/select/last/date", auth, function(req, res) {

  //   var data;
  //   if (req.session.type < 2) data = {};
  //   else  data = {'departmentId': req.session.departmentId};
    
  //   survey_sc
  //     .find(data)
  //     .sort("-date")
  //     .limit(3)
  //     .exec(function(err, result) {
  //       //pagination should be handled
  //       if (!err) {
  //         res.status(200).json({
  //           surveys: result,
  //           // userId: req.body.token
  //           userId: req.session.userId
  //         });
  //       } else {
  //         res.status(500).json({
  //           error: err
  //         });
  //       }
  //     });
  // });

// router.post("/select/one/result", auth, function(req, res) {
//   var allowedPermissions=[123]
  
//   surveyResults_sc
//     .find(
//       {
//         surveyId: req.body.surveyId
//       },
//       {
//         _id: 0,
//         text: 1
//       }
//     )
//     .populate({
//       path: "surveyId",
//       select: {
//         title: "title",
//         text: "text"
//       }
//     })
//     .exec(function(error, result) {
//       if (error)
//         return res.status(500).json({
//           error
//         });

//       console.log("survey: ", result);
//       var totalCount = result.length;
//       var count = {};
//       if (result) {
//         //this will loop in result.
//         result.map(surveyResult => {
//           var item = surveyResult._doc;
//           console.log(item.text);
//           //item is one item of result array. its like this:
//           /**
//            * {
//            *  text:"fine"
//            * }
//            */
//           if (!count[item.text]) count[item.text] = 1;
//           else count[item.text]++;
//         });
//         //now count is a json like this:
//         /**
//          * {
//          * "fine":3,
//          * "not bad":2
//          * }
//          */

//         console.log(count);
//         //we have to make it beauty to make our result more readable.
//         var votes = [];
//         //This will loop in keys of a json(count)
//         /*
//        * in first loop >> value is 3, key is "fine"
//        * in second loop >> value is 2,key is "not bad"
//        */
//         _.mapKeys(count, (value, key) => {
//           //I'm just make a more readable result here, votes is an array of jsons with title key and count key.
//           votes.push({
//             title: key,
//             count: value,
//             percent: Math.round(value * 100 / totalCount)
//           });
//         });

//         res.status(200).json({
//           survey: result,
//           answers: votes,
//           totalCount
//         });
//       } else {
//         res.json({
//           error: "There is no user to select..."
//         });
//       }
//     });
// });
module.exports = router;
