
var express = require('express');
var router = express.Router();
var permissions_sc = require("../Schema/permissions");
// var user_sc = require("../Schema/user");
var auth = require('../tools/authentication');

////////////////add new permission/////////////////
/*example:
{"title":"view channels"}
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
      console.log('Now U can add a new permission...');
      var permission = new permissions_sc(req.body);
      permission.save(function (err, result) {
        if (!err) {
  
          //var token=auth.tokenize(result._id);
          req.session.userId = result._id;
          res.json({
            permission: result,
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

////////////////get all permissions/////////////////
router.post("/all", auth, function (req, res) {
  permissions_sc
    .find({})
    .sort("-date")
    .exec(function (err, result) {
      if (!err) {
        if (result) {
          res.json({
            permissionsArray: result
          });
        } else {
          res.json({
            error: "There is no permission to select..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

////////////////update a permission (by id)/////////////////
/*example:
{
  "_id": "5a841ee7a788e8063448a950",
  "title": "view charts"
}   
*/
router.post('/update',auth,function(req,res){
  console.log('query:',req.body)
  permissions_sc.findById(req.body._id).exec(function(err,result){
    if(!err){
      console.log("permission: ",result)
      result.title=req.body.title||result.title;
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

////////////////delete a permission for ever (by id)/////////////////
//URL: localhost:5010/groups/delete

router.post('/delete',auth, function (req, res) {
  console.log('query', req.body)
    permissions_sc.findByIdAndRemove(req.body._id).exec(function (err, result) {
    if (!err) {
      res.status(200);
      console.log('selected permission is deleted!!!!');
    } else {
      res.status(500).json({
        error: err
      });
    }
  })
})

module.exports = router;
