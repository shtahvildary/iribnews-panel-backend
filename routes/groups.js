
var express = require('express');
var router = express.Router();
var groups_sc = require("../Schema/groups");
// var user_sc = require("../Schema/user");
var auth = require('../tools/authentication');


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