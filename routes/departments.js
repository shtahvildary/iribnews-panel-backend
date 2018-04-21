var express = require("express");
var router = express.Router();
var departments_sc = require("../Schema/departments");
// var user_sc = require("../Schema/user");
var auth = require("../tools/authentication");
var {checkPermissions}=require("../tools/auth");
var multer=require("multer");
var mime=require("mime");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/logos')
  },
  filename: function (req, file, cb) {
    var format=mime.getExtension(file.mimetype);
    if(!format ||format==null) format=file.mimetype.substring(file.mimetype.lastIndexOf("/")+1);
    cb(null,  Date.now() + '.' + format);
    
  }
  });
var upload = multer({ storage: storage });
var upFileserver=require("../tools/upload")



////////////////add new department/////////////////
/*example:
{"title":"shmt_bot",
	"bot":"449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk",
	"description":"word cloud department",
	"status":0}
*/

router.post("/new", auth,upload.single('logo'), function(req, res) {
  var userType = req.session.type;
  if (userType!=0)
    res.status(403).json({
      error: "Forbidden: permission error"
    });
  
  else {
    
    var department = new departments_sc(req.body);
    if(req.file){
      upFileserver("/uploads/logos"+req.file.filename,function(err,body,response){
      console.error(err)
      if(err) return err
      department.logo=response.filePath
        saveDepartment(department)

      });
    }
    else{
      saveDepartment(department)
      
    }
  }
  function saveDepartment(department){
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
  if(req.session.type>=2)
    return res.status(403).json({error:"You don't have access to this api."})
    
  // var data={}
  var data={status:0}
  // if(req.session.type!=0) data={status:0}
  departments_sc
    .find(data)
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

router.post("/update", auth, upload.single('logo'),function(req, res) {
  console.log(req.body)
  if(req.session.type!=0){
  var allowedPermissions=[108]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
}
  var logo=false;
      if(req.file){
        upFileserver("/uploads/logos/"+req.file.filename,function(err,body,response){

        console.error(err)
        if(err) return err
        console.log('response: ',response)
        logo=response.filePath
          updateDepartment(logo)
        });
      }
      else{
        updateDepartment(logo)        
      }

      function updateDepartment(logo){
        var {title,description,}=req.body;
        var query={title,description};
        if(logo) query.logo=logo
        departments_sc.update({_id:req.body._id},query).exec((err,result)=>{
          if(err) return res.status(500).json(error);
          return res.status(200).json(result)
        })
        // departments_sc.findById(req.body._id).exec(function(err, result) {
        //   if (!err) {
        //     var department=result._doc
        //     department.title = req.body.title || department.title;
        //     // department.bot = req.body.type || department.type;
        //     department.description = req.body.description || department.description;
        //     department.port=req.body.port||department.port;
        //     department.logo=logo||department.logo;
        //     // Save the updated document back to the database
        //     departments_sc.update({ _id: req.body._id }, department, function(error, response) {
        //       if (!err) res.status(200).json(response);
        //       else res.status(500).send(error);
            
        // });


  //     } else res.status(500).send(err);
  // })
  }
});

router.post("/all/status", auth, function(req, res) {
  if(req.session.type!=0)
    return res.status(403).json({error:"You don't have access to this api."})
    
  // var data={}
  var data={}
  // if(req.session.type!=0) data={status:0}
  departments_sc
    .find(data)
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
////////////////change status of a department (by id): 0:active - -1:deleted/////////////////
//URL: localhost:5010/departments/update/status

router.post("/update/status", auth, function(req, res) {
  if(req.session.type!=0)
  return res.status(403).json({error:"You don't have access to this api."})
  
  // var allowedPermissions=[108]
  // if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  
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
////////////////search a department /////////////////////////////////////////////////////////

router.post('/search', auth, function (req, res) {
  if (req.session.type <2 )
  
  if(req.session.type>=2)
    return res.status(403).json({error:"You don't have access to this api."})
    
  var {
      query,
      status
  } = req.body;
  if (!query) query = "";
  if (!status) status = 0;
  var dbQuery = {
      $or: [{
          "title": {
              // $regex: "",
              $regex: query,
              $options: 'i'
          }
      }, {
          "description": {
              // $regex: "",
              $regex: query,
              $options: 'i'
          }
      }]
  };
  dbQuery.status=status
  var data=dbQuery;
  if(req.session.type!=0)
      data={$and:[{ departmentId: req.session.departmentId },dbQuery]}

  departments_sc
    .find(data)
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

module.exports = router;
