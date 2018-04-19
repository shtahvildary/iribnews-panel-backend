var express = require("express");
var router = express.Router();
var votes_sc = require("../Schema/votes");
var voteItem_sc = require("../Schema/voteItems");
var _ = require("lodash");
var auth = require("../tools/authentication");
var { checkPermissions } = require("../tools/auth");

//Get all votes
router.post("/all", auth, function(req, res) {
  if (req.session.type >2) {
    var allowedPermissions = [123];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var data;
  if (req.session.type < 2) data = {};
  else data = { departmentId: req.session.departmentId };
  votes_sc
    .find(data)
    .populate({
      path: "vote.destinationId",
      select: "title"
    })
    .exec(function(err, result) {
      if (!err) {
        if (result) {
          res.json({
            votesArray: result
          });
        } else {
          res.json({
            error: "There is no Vote..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

router.post("/all/scores", auth, function(req, res) {
  if (req.session.type >2) {
    var allowedPermissions = [123];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var data;
  if (req.session.type < 2) data = {};
  else data = { departmentId: req.session.departmentId };

  votes_sc
    .find(
      {data},
      {
        vote: 1,
        _id: 0
      }
    )
    .populate({
      path: "vote.destinationId",
      select: "title"
    })
    .exec(function(err, result) {
      if (!err) {
        if (result) {
          // console.log(result[0]._doc.vote)
          // res.json({
          //   votesArray: result
          // });
          var votes = {};
          result.map(vote => {
            var vote = vote.vote;
            if (vote.score != 0) {
              if (!votes[vote.destinationId._id]) {
                votes[vote.destinationId._id] = {
                  score: 0,
                  title: vote.destinationId.title,
                  count: 0
                };
              }
              votes[vote.destinationId._id].score += vote.score;
              votes[vote.destinationId._id].count++;
            }
          });

          // console.log(votes.length)
          // for(var i=0;i<votes.length;i++){
          //   votes[i].percent=Math.round((votes[i].score*100)/(votes[i].count*5))
          // }
          console.plain(votes);
          var scores = [];
          _.mapKeys(votes, function(value, key) {
            console.log(key, value);
            var {
              score,
              title,
              count
              // percent
            } = value;
            scores.push({
              destinationId: key,
              score,
              title,
              count
              // percent
            });
          });
          console.plain("scores: ", scores);
          res.status(200).json({
            votesArray: scores
          });
        } else {
          res.json({
            error: "There is no Vote..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

router.post("/search/scores", auth, function(req, res) {
  if (req.session.type >2) {
    var allowedPermissions = [123];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
var {departmentId,destinationId}=req.body;

var dbQuery={}
var vote={}

if(destinationId) vote.destinationId=destinationId;
if (req.session.type < 2)  {if(departmentId) vote.departmentId=departmentId}
else vote.departmentId= req.session.departmentId;

// var data={};
// var $and = [];

// if (req.session.type < 2) {
//   // data = { "comment.destinationId": { $exists: true } }; 
//   if (departmentId || destinationId) {
//     // data = { $and: [dbQuery] };
//     if (departmentId){
//     data.$and=[{ "vote.destinationId": { $exists: true } }];
//       data.$and.push({ "vote.departmentId": departmentId });}
//     if (destinationId) data.$and.push({ "vote.destinationId": destinationId });
//   } //else data = dbQuery;
// } else data = { $and: [
//   { "vote.destinationId": { $exists: true } },
//   { departmentId: req.session.departmentId }] };
dbQuery.vote=vote;
console.log(dbQuery)
  
  votes_sc
    .find(
      dbQuery,
      {
        vote: 1,
        _id: 0
      }
    )
    .populate({
      path: "vote.destinationId",
      select: "title"
    }).populate({
      path: "vote.departmentId",
      select: "title"
    })
    .exec(function(err, result) {
      if (!err) {
        if (result) {
          var votes = {};
          result.map(vote => {
            var vote = vote.vote;
            if (vote.score != 0) {
              if (!votes[vote.destinationId._id]) {
                votes[vote.destinationId._id] = {
                  score: 0,
                  title: vote.destinationId.title,
                  count: 0
                };
              }
              votes[vote.destinationId._id].score += vote.score;
              votes[vote.destinationId._id].count++;
            }
          });
          var scores = [];
          _.mapKeys(votes, function(value, key) {
            var {
              score,
              title,
              count
              // percent
            } = value;
            scores.push({
              destinationId: key,
              score,
              title,
              count
              // percent
            });
          });
          res.status(200).json({
            votesArray: scores
          });
        } else {
          res.json({
            error: "There is no Vote..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

// router.post('/all/comments', auth, function (req, res) {
//   if(req.session.type!=0){
//     var allowedPermissions=[123]
//     if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
//     }

//   votes_sc.find({},{'comment':1}, function (err, result) {
//     if (!err) {
//       if (result) {
//         // var commentsArray=[];
//         // result.map(comment => {
//         //   if (comment.text) {
//         //     console.log(comment)
//         //     commentsArray.push(comment)}
//         // })

//         // res.json({
//         //   commentsArray
//         // });
//         res.json({
//           commentsArray:result
//         })
//       } else {
//         res.json({
//           error: 'There is no comment...'
//         });
//       }
//     } else {
//       res.status(500).json({
//         error: err
//       })
//     }
//   })
// })

router.post("/search/comments", auth, function(req, res) {
  if (req.session.type >2) {
    var allowedPermissions = [123];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var { filters, query, departmentId, voteItemId } = req.body;
  if (!query) query = "";
  var dbQuery = {
    $or: [
      {
        "comment.text": {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      }
    ]
  };

  var data={};
  var $and = [];

  if (req.session.type < 2) {
    // data = { "comment.destinationId": { $exists: true } }; 
    data.$and=[{ "comment.destinationId": { $exists: true } },dbQuery];
    if (departmentId || voteItemId) {
      // data = { $and: [dbQuery] };
      if (departmentId)
        data.$and.push({ "comment.departmentId": departmentId });
      if (voteItemId) data.$and.push({ "comment.destinationId": voteItemId });
    } //else data = dbQuery;
  } else data = { $and: [
    { "comment.destinationId": { $exists: true } },
    { departmentId: req.session.departmentId }, dbQuery] };
  votes_sc
    .find(data)
    .populate({ path: "comment.destinationId", select: "title" })
    .populate({ path: "comment.departmentId", select: "title" })
    .sort("-date")
    .exec(function(err, result) {
      if (!err) {
        console.log("comment result: ", result);
        res.status(200).json({
          votesArray: result,
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

router.post("/all/comments", auth, function(req, res) {
  if (req.session.type >2) {
    var allowedPermissions = [123];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }

  var data;

  if (req.session.type < 2)
    data = { "comment.destinationId": { $exists: true } };
  else
    data = {
      $and: [
        { departmentId: req.session.departmentId },
        { "comment.destinationId": { $exists: true } }
      ]
    };
  votes_sc
    .find(data)
    .populate({path: "comment.destinationId", select: "title"})
    .populate({path: "comment.departmentId",select: "title"})
    .sort("-date")
    .exec(function(err, result) {
      console.log("comments: ", result);
      if (!err) {
        if (result) {
          res.json({
            votesArray: result
          });
        } else {
          res.json({
            error: "There is no Vote..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

module.exports = router;
