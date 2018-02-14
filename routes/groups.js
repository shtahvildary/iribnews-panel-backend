
var express = require('express');
var router = express.Router();
var groups_sc = require("../Schema/groups");
// var user_sc = require("../Schema/user");
var auth = require('../tools/authentication');

////////////////add new group/////////////////
/*example:
{"title":"zAdmin",
	"type":0
}
*/
router.post('/new', auth, function (req, res) {
    // var userGroup = req.session.userGroup;
    var userType = req.session.type;
    // console.log("userType: ", userType);
    if (userType != 0) {
      res.json({
        error: err
      })
    } else {
      console.log('Now U can add a new group...');
      var group = new groups_sc(req.body);
      group.save(function (err, result) {
        if (!err) {
  
          //var token=auth.tokenize(result._id);
          req.session.userId = result._id;
          res.json({
            group: result,
            //token: token
          });
        } else {
          res.json({
            error: err
          })
        };
      });
    }
  });

////////////////get all groups/////////////////
  router.post("/all", auth, function (req, res) {
    groups_sc
      .find({})
      .sort("-date")
      .exec(function (err, result) {
        if (!err) {
          if (result) {
            res.json({
              groupsArray: result
            });
          } else {
            res.json({
              error: "There is no group to select..."
            });
          }
        } else {
          res.status(500).json({
            error: err
          });
        }
      });
  });

////////////////update a group (by id)/////////////////
/**example:
 
{"_id": "5a841b19f9943330c4bb98ea",
            "title": "zAdmin",
	"description":"main admin"
}
 */
router.post('/update',auth,function(req,res){
    console.log('query:',req.body)
    groups_sc.findById(req.body._id).exec(function(err,result){
      if(!err){
        console.log("group: ",result)
        result.title=req.body.title||result.title;
        result.type=req.body.type||result.type;
        result.permissions=req.body.permissions||result.permissions;
        result.description=req.body.description||result.description;
        
        // Save the updated document back to the database
        result.save(function(err,result){
          if(!err){
            res.status(200).send(result);
          }
          else{
            res.status(500).send(err)
          }
        })
      }else {
        res.status(500).json({
          error: err
        });
      }
    })
  })
////////////////delete a group for ever (by id)/////////////////
//URL: localhost:5010/groups/delete

router.post('/delete',auth, function (req, res) {
    console.log('query', req.body)
      groups_sc.findByIdAndRemove(req.body._id).exec(function (err, result) {
      if (!err) {
        res.status(200);
        console.log('selected group is deleted!!!!');
      } else {
        res.status(500).json({
          error: err
        });
      }
    })
  })

  module.exports = router;
