var express = require("express");
var router = express.Router();
var groups_sc = require("../Schema/groups");
// var user_sc = require("../Schema/user");
var auth = require("../tools/authentication");
var {checkPermissions}=require("../tools/auth");

////////////////add new group/////////////////
/*example:
{"title":"zAdmin",
	"type":0
}
*/

router.post("/new", auth, function(req, res) {
  if(req.session.type!=0){
  var allowedPermissions=[105]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  }
  var userType = req.session.type;
  if (userType > 1)
    res.status(403).json({
      error: "Forbidden: permission error"
    });
  else if (userType == 1 && req.body.type < 2)
    res.status(403).json({
      error: "Forbidden: permission error"
    });
  else {
    var group = new groups_sc(req.body);
    group.save(function(err, result) {
      if (!err) res.json({
          group: result
        });
       else res.json({
          error: err
        });
    });
  }
});

////////////////get all groups except builtins/////////////////
router.post("/all", auth, function(req, res) {
    
  var data;
  if (req.userType == 0) data = {};
  else if (req.session.type == 1) data = { readOnly: 0 };
  else if (req.session.type > 1) data = {$and:[{ readOnly: 0 },{departmentId:req.session.departmentId}]};
  
  groups_sc
    .find(data)
    .sort("-date")
    .exec(function(err, result) {
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
router.post("/update", auth, function(req, res) {
  if(req.session.type!=0){
  var allowedPermissions=[106]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  console.log("query:", req.body);}
  groups_sc.findById(req.body._id).exec(function(err, result) {
    if (!err) {
      var group = result._doc;
      group.title = req.body.title || group.title;
      group.type = req.body.type || group.type;
      group.permissions = req.body.permissions || group.permissions;
      group.description = req.body.description || group.description;
      group.departmentId = req.body.departmentId || group.departmentId;

      // Save the updated document back to the database
      groups_sc.update({ _id: req.body._id }, group, function(error, response) {
        if (!err) res.status(200).json(response);
        else res.status(500).send(error);
      });
    } else res.status(500).send(err);
  });
});
////////////////delete a group for ever (by id)/////////////////
//URL: localhost:5010/groups/delete

router.post("/delete", auth, function(req, res) {
  // var allowedPermissions=[]
  // if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  
  console.log("query", req.body);
  groups_sc.findByIdAndRemove(req.body._id).exec(function(err, result) {
    if (!err) {
      res.status(200);
      console.log("selected group is deleted!!!!");
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

////////////////change status of a group (by id): 0:active - -1:deleted/////////////////
//URL: localhost:5010/groups/status

router.post("/status", auth, function(req, res) {
  if(req.session.type!=0){
  var allowedPermissions=[106]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  }
 
  group_sc.findById(req.body._id).exec(function(err, result) {
    if (!err) {
      console.log("group:", result);
      result.status = req.body.status;
      result.save(function(err, result) {
        if (!err) {
          res.status(200).send(result);
        } else {
          res.status(500).send(err);
        }
      });
      res.status(200);
      console.log("status of group changed...");
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

module.exports = router;
