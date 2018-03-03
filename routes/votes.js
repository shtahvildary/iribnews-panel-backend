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
    var data;
    if (req.session.type < 2) data = {};
    else  data = {'departmentId': req.session.departmentId};
  votes_sc.find(data).populate({
    path: 'vote.destinationId',
    select: 'title'
  }).exec( function (err, result) {
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
        // if (vote.score==0) next()
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

router.post('/search', auth, function (req, res) {
  if(req.session.type!=0){
    var allowedPermissions=[123]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  var {
      filters,
      query
  } = req.body;
  if (!query) query = "";
  var dbQuery = {
      $or: [{
          "message": {
              // $regex: "",
              $regex: query,
              $options: 'i'
          }
      }, {
          "caption": {
              // $regex: "",
              $regex: query,
              $options: 'i'
          }
      }, {
          "audioTitle": {
              // $regex: "",
              $regex: query,
              $options: 'i'
          }
      }, {
          "fileName": {
              // $regex: "",
              $regex: query,
              $options: 'i'
          }
      }, {
          "filePath": {
              // $regex: "",
              $regex: query,
              $options: 'i'
          }
      },
      {
          "replys.text": {
              // $regex: "",
              $regex: query,
              $options: 'i'
          }
      }
      ]
  };
  var filterTypes = [];
  if (filters) {
      if (filters.messages == 1) {
          filterTypes.push("text");
      }
      if (filters.photos == 1) {
          filterTypes.push("photo");
      }
      if (filters.movies == 1) {
          filterTypes.push("video");
      }
      if (filters.voices == 1) {
          filterTypes.push("voice", "audio");
      }
      if (filters.files == 1) {
          filterTypes.push("document");
      }
      if (filterTypes.length > 0) dbQuery.type = {
          $in: filterTypes
      }
  }
  var departmentSelect;
  var voteItemSelect;
  var data;
  if (req.session.type < 2) data = {};
  else  data = {$and:[{'departmentId':req.session.departmentId},dbQuery]};
  votes_sc.find(data).populate({
    path: 'vote.destinationId',
    select: 'title'
  }).sort('-date').exec(function (err, result) {
      if (!err) {
          res.status(200).json({
              votes: result,
              // userId: req.body.token
              userId: req.session.userId
          });
      } else {
          res.status(500).json({
              error: err
          });
      }
  })
});

module.exports = router;