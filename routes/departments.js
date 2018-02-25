var express = require("express");
var router = express.Router();
var departments_sc = require("../Schema/departments");
// var user_sc = require("../Schema/user");
var auth = require("../tools/authentication");
var {checkPermissions}=require("../tools/auth");

////////////////add new department/////////////////
/*example:
{"title":"shmt_bot",
	"bot":"449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk",
	"description":"word cloud department",
	"status":0}
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
 
  if (req.session.type <2 )
  
  departments_sc
    .find({})
    .exec(function(err, result) {
      if (!err) {
        if (result) {
          res.status(200).json({
            departmentsArray: result
          });
        } else {
          res.status(500).json({
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
////////////////select one department by ID/////////////////
router.post("/select/one", auth, function(req, res) {
    

  departments_sc
    .findById(req.session.departmentId)
    .exec(function(err, result) {
      if (!err) {
        if (result) {
          res.status(200).json({
            department: result
          });
        } else {
          res.status(500).json({
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
/**example:
 * {
            "_id": "5a8e9bf5074b3e034c221fcf",
            "title": "newsNovinBot-irinn"
        }
 */

router.post("/update", auth, function(req, res) {
  if(req.session.type!=0){
  var allowedPermissions=[108]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  console.log("query:", req.body);}
  departments_sc.findById(req.body._id).exec(function(err, result) {
    if (!err) {
      var department = result._doc;
      department.title = req.body.title || department.title;
      // department.bot = req.body.type || department.type;
      department.description = req.body.description || department.description;
      department.port=req.body.port||department.port;
      // Save the updated document back to the database
      departments_sc.update({ _id: req.body._id }, department, function(error, response) {
        if (!err) res.status(200).json(response);
        else res.status(500).send(error);
      });
    } else res.status(500).send(err);
  });
});


////////////////change status of a department (by id): 0:active - -1:deleted/////////////////
//URL: localhost:5010/groups/status

router.post("/status", auth, function(req, res) {
  if(req.session.type!=0){
  var allowedPermissions=[108]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  
  console.log("query", req.body);}
  departments_sc.findById(req.body._id).exec(function(err, result) {
    if (!err) {
      console.log("department:", result);
      result.status = req.body.status;
      result.save(function(err, result) {
        if (!err) {
          res.status(200).send(result);
        } else {
          res.status(500).send(err);
        }
      });
      res.status(200);
      console.log("status of department changed...");
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

module.exports = router;
