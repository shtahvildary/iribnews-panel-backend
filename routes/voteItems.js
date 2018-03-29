var express = require('express');
var router = express.Router();
var voteItem_sc = require("../Schema/voteItems");
var auth = require('../tools/authentication');
var {checkPermissions}=require("../tools/auth");



//Add new program or channel
router.post('/new', auth,function (req, res) {
  if(req.session.type!=0){
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

//Get all programs and channels (voteItems) which are enable (not deleted)
router.post('/all', auth,function (req, res) {
  if(req.session.type!=0){
    var allowedPermissions=[122]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  
  var data;
  if (req.session.type < 2) data = {};
  else data = {$and:[{'departmentId': req.session.departmentId},{enable:1}]};
  
  voteItem_sc.find(data, function (err, result) {
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
  if(req.session.type!=0){
    var allowedPermissions=[122]
    if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
    }
  console.log('query', req.body.query)
  var { query } = req.body;
    if (!query) query = "";
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
      var data;
        if (req.session.type < 2)
        {data = dbQuery;
        if(req.body.departmentId) data={ $and: [{ departmentId: req.body.departmentId }, dbQuery] };}
        else data = { $and: [{ departmentId: req.session.departmentId }, dbQuery] };
  voteItem_sc.find(data).sort('-date').exec(function (err, result) {
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
  if(req.session.type!=0){
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

//disable a voteItem (by id)
//URL: localhost:5010/voteItems/disable
//INPUT:{"_id":"5a1e711ed411741d84d10a29"}

router.post('/disable',auth, function (req, res) {
  if(req.session.type!=0){  
  var allowedPermissions=[122]
  if(!checkPermissions(allowedPermissions,req.session.permissions))return res.status(403).json({error:"You don't have access to this api."})
  }
  
  console.log('query', req.body)
    voteItem_sc.findById(req.body._id).exec(function (err, result) {
    if (!err) {
      console.log("voteItem:",result) 
      result.enable=0;  
      result.save(function(err,result){
        if(!err){
          res.status(200).send(result);
        }
        else{
          res.status(500).send(err)
        }
      })   
      res.status(200);
      console.log('selected voteItem is disabled!!!!');
    } else {
      res.status(500).json({
        error: err
      });
    }
  })
})


//recover a voteItem (by id)
//URL: localhost:5010/voteItems/recover
//INPUT:{"_id":"5a1e711ed411741d84d10a29"}

router.post('/recover', auth,function (req, res) {
  if(req.session.type!=0)  
    return res.status(403).json({error:"You don't have access to this api."})
    
    voteItem_sc.findById(req.body._id).exec(function (err, result) {
    if (!err) {
       
      result.enable=1;  
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