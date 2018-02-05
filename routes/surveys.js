var express = require('express');
var router = express.Router();
var survey_sc = require("../Schema/surveys");
var surveyResults_sc = require("../Schema/surveyResults");
var chat_sc = require("../Schema/chats");
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
router.post('/new', auth, function (req, res) {
  console.log('Now U can save a new survey ...');
  var survey = new survey_sc(req.body);
  survey.userId = req.session.userId;
  var chatIds = [];
  chat_sc.find({
    trusted: 1
  }, {
    chatId: 1,
    _id: 0
  }, function (err, result) {
    if (!err) {
      if (result) {
        result.map(function (item) {
          chatIds.push(item._doc.chatId);
        })

        // console.log(result[0]._doc.chatId)
        survey.chatIds = chatIds;
        survey.save(function (err, savedSurvey) {
          console.log(savedSurvey)
          if (!err) {
            // result.json({survey:savedSurvey});
            survey = savedSurvey._doc;
          } else result.json({
            error: err
          })
        })
      } else
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
    url: botServer + '/surveys/new',
    json: {
      surveyId: survey._id
    }

  }, function (err, res) {
    if (err) console.log('err: ', err)

  })

})

//Get all surveys 
router.post('/all',auth,function(req,res){
  survey_sc.find({}).sort('-date').exec(function (err, result) {
    if (!err) {
      if (result) {
        res.json({
          surveysArray: result
        });
      } else {
        res.json({
          error: 'There is no survey to select...'
        });
      }
    } else {
      res.status(500).json({
        error: err
      })
    }
  })
})

//////////////////////////////////PROBLEM???????????????????????
//Get all surveys results
// output:[{text:'fine',percent:10} ,{text:'not bad',percent:90}]
router.post('/all/result', auth, function (req, res) {
  
  surveyResults_sc.find({}).populate({path:'surveyId',select:{text:'text',keyboard:'keyboard'}}).sort('-date').exec(function (error, result) {
    if (!error) {
      var surveys=[]
      // console.log(result);
      result.map(item=>{
        var {surveyId}=item;
        
        if(!surveys[surveyId]) surveys[surveyId]={count:0,surveyText:item.surveyId._doc.text,keyboard:item.surveyId._doc.keyboard,surveyResult:[item.text],resultCount:[{text:item.text,count:1}]}
        else{surveys[surveyId].count++;
        //var keys=surveys[surveyId].surveyResultkeys()
        // console.log(keys)
        if(surveys[surveyId].surveyResult.includes(item.text)) surveys[surveyId].resultCount[item.text].count++;
         
        else {surveys[surveyId].surveyResult.push(item.text);
          
        surveys[surveyId].resultCount.push({text:item.text,count:1});}
          
        }
      })
      console.plain(surveys);
      var survey={}
      surveys.map(item=>{
        var{_id}=item;
        if(!survey[_id]) survey[_id]=item;
        console.plain('survey.....:',survey)

      })

      
      // surveyResults_sc.find({}).exec(function(err,result){
      //   var surveyRes=[]
      //   if(!err){
      //     for(var i=0;i<surveys.length;i++){
      //       for(var j=0;j<result.length;j++){
      //         console.log(surveys[i]._doc._id)
      //         console.log(result[j]._doc.surveyId)
      //         if(surveys[i]._doc._id==result[j]._doc.surveyId){
      //           surveyRes.push(result[j]._doc.text)
      //         }
      //       }
      //     }
      //     console.log(surveyRes)
      //   }
      // })
    }
    else{}
  })
})
//////////////////////////////////PROBLEM???????????????????????
module.exports = router;