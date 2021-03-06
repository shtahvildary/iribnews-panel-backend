var express = require('express');
var router = express.Router();
var voteItem_sc = require("../Schema/voteItems");
var auth = require('../tools/authentication');
var {checkPermissions}=require("../tools/auth");



//Add new program or channel
router.post('/new', auth,function (req, res) {
  if(req.session.type>2){
    // if(req.session.type!=0){
    var allowedPermissions=[122]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  
  var {title,text,keyboard}=req.body;

  var voteItem = new voteItem_sc({title,type,description});
  voteItem.departmentId=req.session.departmentId;

  voteItem.save(function (err, result) {

    if (!err) {

      res.json({
        voteItem: result
      });
    } else {

      res.json({
        error: err
      })
    };
  });
});

//Get all programs and channels (voteItems) which has status=1 (not deleted)
router.post('/all', auth,function (req, res) {
  var data;
  if(req.session.type>2){
    // if(req.session.type!=0){
    var allowedPermissions=[122]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  
  var data;
  if (req.session.type < 2) data = {status:0};
  else data = {$and:[{'departmentId': req.session.departmentId},{status:1}]};
  
  voteItem_sc.find(data).populate({path:"departmentId",select:"title"}).exec(function (err, result) {
    if (!err) {
      if (result) {
        res.json({
          voteItemsArray: result
        });
      } else {
        res.json({
          error: 'There is no channel or program to select...'
        });
      }
    } else {
      res.status(500).json({
        error: err
      })
    }
  })
})
router.post('/all/status', auth,function (req, res) {
  if (req.session.type != 0) return res.status(403).json({ error: "Forbidden: permission error" });
  
  voteItem_sc.find({}).populate({path:"departmentId",select:"title"}).exec(function (err, result) {
    if (!err) {
      if (result) {
        res.json({
          voteItemsArray: result
        });
      } else {
        res.json({
          error: 'There is no channel or program to select...'
        });
      }
    } else {
      res.status(500).json({
        error: err
      })
    }
  })
})

//Get all programs and channels (voteItems) ENABLE+DISABLE for recovery
router.post('/all/recover', auth,function (req, res) {
  
  if(req.session.type!=0) return res.status(403).json({error:"You don't have access to this api."})
  voteItem_sc.find({}, function (err, result) {
    if (!err) {
      if (result) {
        res.json({
          voteItemsArray: result
        });
      } else {
        res.json({
          error: 'There is no channel or program to select...'
        });
      }
    } else {
      res.status(500).json({
        error: err
      })
    }
  })
})

//Search voteItems
router.post('/search', auth,function (req, res) {
  if(req.session.type>2){
    // if(req.session.type!=0){
    var allowedPermissions=[122]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  console.log('query', req.body.query)
  var { query,departmentId,type ,status} = req.body;
    if (!query) query = "";
    if(!status) status=0;
    var dbQuery = {
      $or: [
        {"title": {
          $regex: query,
          $options: 'i'
        }},
      {"description": {
          $regex: query,
          $options: 'i'
        }},
      {"personels": {
          $regex: query,
          $options: 'i'
        }
      }
      ]}
      dbQuery.status=status;
      if(type)
        dbQuery.type=type;
      if (req.session.type < 2) {if(departmentId) dbQuery.departmentId=departmentId}
      else dbQuery.departmentId= req.session.departmentId 
      voteItem_sc.find(dbQuery).sort('-date').populate({path:"departmentId",select:"title"}).exec(function (err, result) {
    if (!err) {
      res.status(200).json({
        voteItemsArray: result
      });
    } else {
      res.status(500).json({
        error: err
      });
    }
  })
})
    
//update voteItems (by id)
router.post('/update',auth,function(req,res){
  if(req.session.type>2){
    // if(req.session.type!=0){
    var allowedPermissions=[122]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  
  
  console.log('query:',req.body)
  voteItem_sc.findById(req.body._id).exec(function(err,result){
    if(!err){
      console.log("voteItem:",result)
      result.title=req.body.title||result.title;
      result.type=req.body.type||result.type;
      result.description=req.body.description||result.description;
      result.channelId=req.body.channelId||result.channelId;
      result.personnels=req.body.personnels||result.personnels;
      result.departmentId=req.session.departmentId||result.departmentId;

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




//recover a voteItem (by id)
//URL: localhost:5010/voteItems/recover
//INPUT:{"_id":"5a1e711ed411741d84d10a29"}

router.post('/update/status', auth,function (req, res) {
  if(req.session.type!=0)  
    return res.status(403).json({error:"You don't have access to this api."})
    
    voteItem_sc.findById(req.body._id).exec(function (err, result) {
    if (!err) {
       
      result.status=req.body.status;  
      result.save(function(err,result){
        if(!err){
          res.status(200).send(result);
        }
        else{
          res.status(500).send(err)
        }
      })   
      res.status(200);
      console.log('selected voteItem is enable!!!!');
    } else {
      res.status(500).json({
        error: err
      });
    }
  })
})



//delete voteItems for ever (by id)
//URL: localhost:5010/voteItems/delete
//INPUT:{"_id":"5a1e711ed411741d84d10a29"}

router.post('/delete',auth, function (req, res) {
  if(req.session.type!=0)  return res.status(403).json({error:"You don't have access to this api."})
  
    voteItem_sc.findByIdAndRemove(req.body._id).exec(function (err, result) {
    if (!err) {
      res.status(200);
      console.log('selected voteItem is deleted!!!!');
    } else {
      res.status(500).json({
        error: err
      });
    }
  })
})

module.exports = router;