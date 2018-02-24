var express = require('express');
var router = express.Router();
var votes_sc = require("../Schema/votes");
var voteItem_sc = require("../Schema/voteItems");
var _ = require('lodash');
var auth = require('../tools/authentication');
var {checkPermissions}=require("../tools/auth");




//Get all votes
router.post('/all', auth, function (req, res) {
  if(req.session.type!=0){
    var allowedPermissions=[123]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  
  votes_sc.find({}, function (err, result) {
    if (!err) {
      if (result) {
        res.json({
          votesArray: result
        });
      } else {
        res.json({
          error: 'There is no Vote...'
        });
      }
    } else {
      res.status(500).json({
        error: err
      })
    }
  })
})


router.post('/all/scores', auth, function (req, res) {
  if(req.session.type!=0){
    var allowedPermissions=[123]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  

  votes_sc.find({}, {
    vote: 1,
    _id: 0
  }).populate({
    path: 'vote.destinationId',
    select: 'title'
  }).exec(function (err, result) {
    if (!err) {
      if (result) {
        // console.log(result[0]._doc.vote)
        // res.json({
        //   votesArray: result
        // });
        var votes = {};
        result.map(vote => {
          var vote = vote.vote;
          if (!votes[vote.destinationId._id]) votes[vote.destinationId._id] = {
            score: 0,
            title: vote.destinationId.title,
            count: 0
          };
          votes[vote.destinationId._id].score += vote.score;
          votes[vote.destinationId._id].count++;

        })
        // console.log(votes.length)
        // for(var i=0;i<votes.length;i++){
        //   votes[i].percent=Math.round((votes[i].score*100)/(votes[i].count*5))
        // }
        console.plain(votes);
        var scores = [];
        _.mapKeys(votes, function (value, key) {
          console.log(key, value)
          var {
            score,
            title,
            count,
            // percent
          } = value;
          scores.push({
            destinationId: key,
            score,
            title,
            count,
            // percent

          })
        })
        console.plain('scores: ', scores)
        res.status(200).json({
          votesArray: scores
        })

      } else {
        res.json({
          error: 'There is no Vote...'
        });
      }
    } else {
      res.status(500).json({
        error: err
      })
    }
  })
})

module.exports = router;