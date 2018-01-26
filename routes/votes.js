var express = require('express');
var router = express.Router();
var votes_sc = require("../Schema/votes");
var voteItem_sc = require("../Schema/voteItems");
var _ = require('lodash');
var auth = require('../tools/authentication');



//Get all programs and channels (voteItems) which are enable (not deleted)
router.post('/all', auth, function (req, res) {
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
  //  vote_sc.find({},{vote:1,_id:0}).exec(function(err,result){
  //    if(!err){
  //      if(result){
  //        //_.sumBy(array, [iteratee=_.identity])
  //        var votes=_.sumBy(result,voteItemId)
  //        console.log('votes: ',votes)
  //      }
  //    }


  //  })

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
          var vote=vote.vote;
          if(!votes[vote.destinationId._id]) votes[vote.destinationId._id]={score:0,title:vote.destinationId.title,count:0};
          votes[vote.destinationId._id].score += vote.score;
          votes[vote.destinationId._id].count++;

        })
        console.plain(votes);
        var scores=[];
         _.mapKeys(votes, function (value, key) {
          console.log(key,value)
          var {score,title,count}=value;
          scores.push( {
            destinationId: key,
            score,
            title,
            count

          })
        })
        console.plain('scores: ',scores)
        res.status(200).json({
          votesArray:scores
        })
        



        //   votesArray.forEach(function (message) {
        //     msgCounts[message.date.getHours()] += 1;
        // });
        // voteItem_sc.find({'_id':})

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


router.post('/all/scores2', auth, function (req, res) {
  var voteItemsArray = voteItem_sc.find({}, {
    title: 1,
    _id: 1
  })
  // var  voteItemsArray=voteItem_sc.find({},{title:1,_id:1},function (err, result) {
  console.log(voteItemsArray)
  // votes_sc.find({}).populate({ path: 'vote.destinationId', select: 'title' }).exec(function (err, result) {
  if (!err) {
    // if (result) {
    // // console.log(result[0]._doc.vote)
    // res.json({
    //   voteItemsArray: result
    // });
    // // console.log(res.voteItemsArray)



    //   votesArray.forEach(function (message) {
    //     msgCounts[message.date.getHours()] += 1;
    // });
    // voteItem_sc.find({'_id':})

    // } else {
    //   res.json({
    //     error: 'There is no Vote...'
    //   });
    // }
  } else {
    res.status(500).json({
      error: err
    })
  }

  // }).toArray(function(err, allTheThings) {

  // Do whatever with the array

  // Spit them all out to console
  //   console.log(allTheThings);

  //   // Get the first one
  //   allTheThings[0];

  //   // Iterate over them
  //   allTheThings.forEach(function(thing) {
  //     // This is a single instance of thing
  //     thing;
  //   });

  //   // Return them
  //   callback(null, allTheThings);
  // });
  console.log(voteItemsArray)


})

// //Search voteItems
// router.post('/search', function (req, res) {
//   console.log('query', req.body.query)
//   voteItem_sc.find({
//     "title": {
//       $regex: req.body,
//       $options: 'i'
//     }
//   }).sort('-date').exec(function (err, result) {
//     if (!err) {
//       res.status(200).json({
//         voteItems: result
//       });
//     } else {
//       res.status(500).json({
//         error: err
//       });
//     }
//   })
// })

module.exports = router;