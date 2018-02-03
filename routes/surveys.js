var express=require('express');
var router=express.Router();
var survey_sc=require("../Schema/surveys");
var chat_sc=require("../Schema/chats");
var auth = require('../tools/authentication');
var request = require('request');

const botServer = "http://localhost:9002";

// var request=require('request');

//Add new survey
////////////////////////////////////////
// {
  // "title":"survey 2",
  //   "text":"how r u 2day?",
  //   "keyboard":["fine","not bad"]
  // }
////////////////////////////////////////
router.post('/new',auth,function(req,res){
    console.log('Now U can save a new survey ...');
    var survey=new survey_sc(req.body);
    survey.userId=req.session.userId;
    var chatIds=[];
    chat_sc.find({trusted:1},{chatId:1,_id:0},function (err, result) {
        if (!err) {
          if (result) {
            result.map(function(item){
              chatIds.push(item._doc.chatId);
            })

            // console.log(result[0]._doc.chatId)
            survey.chatIds=chatIds;
            survey.save(function(err,savedSurvey){
              console.log(savedSurvey)
              if(!err) {
              // result.json({survey:savedSurvey});
              survey=savedSurvey._doc;
            }
              else result.json({error:err})
          })}
           else 
            res.json({
              error: 'There is no chatId to select...'
            });
          
        } else {
          res.status(500).json({
            error: err
          })
        }
    })
    request.post({
      url:botServer+'/surveys/new',
      json:{surveyId:survey._id}

      },function(err,res){
      if(err) console.log('err: ',err)
      
    })
    
})

//Get all surveys
router.post('/all',auth,function(req,res){
    
})
module.exports = router;
