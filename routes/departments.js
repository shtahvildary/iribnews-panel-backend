var express = require("express");
var router = express.Router();
var departments_sc = require("../Schema/departments");
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
  // var allowedPermissions=[106]
  // if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  
  var userType = req.session.type;
  if (userType!=0)
    res.status(403).json({
      error: "Forbidden: permission error"
    });
  
  else {
    var department = new departments_sc(req.body);
    department.save(function(err, result) {
      if (!err) res.json({
        department: result
        });
       else res.json({
          error: err
        });
    });
  }
});

////////////////get all departments/////////////////
router.post("/all", auth, function(req, res) {
    
  var data;
 
  if (req.userType <2 )
  
  departments_sc
    .find({})
    .sort("-date")
    .exec(function(err, result) {
      if (!err) {
        if (result) {
          res.json({
            departmentsArray: result
          });
        } else {
          res.json({
            error: "There is no department to select..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

////////////////update a department (by id)/////////////////

router.post("/update", auth, function(req, res) {
  var allowedPermissions=[108]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  console.log("query:", req.body);
  departments_sc.findById(req.body._id).exec(function(err, result) {
    if (!err) {
      var department = result._doc;
      department.title = req.body.title || group.title;
      department.type = req.body.type || group.type;
      department.permissions = req.body.permissions || group.permissions;
      department.description = req.body.description || group.description;

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
  var allowedPermissions=[106]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  
  console.log("query", req.body);
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
