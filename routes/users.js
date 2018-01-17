var express = require('express');
var router = express.Router();
var user_sc = require("../Schema/user");
var auth = require('../tools/authentication');
//var auth=require('../tools/auth');
var bcrypt = require('bcrypt');




/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//Add new user
router.post('/register', auth, function (req, res) {
  var userType = req.session.type;
  // console.log("userType: ", userType);
  if (userType != 0) {
    res.json({
      error: err
    })
  } else {
    console.log('Now U can register a new user...');
    var user = new user_sc(req.body);
    user.save(function (err, result) {
      if (!err) {

        //var token=auth.tokenize(result._id);
        req.session.userId = result._id;
        res.json({
          user: result,
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

//update user
router.post('/update', auth, function (req, res) {
  console.log('U can update user...');
  console.log('query:', req.body);
  user_sc.findById(req.body._id).exec(function (err, result) {
    if (err) {
      res.status(500).json({
        error: err
      });
    }
    //else
    console.log("user: ", result);
    result.firstName = req.body.firstName || result._doc.firstName;
    result.lastName = req.body.lastName || result._doc.lastName;
    result.personelNumber = req.body.personelNumber || result._doc.personelNumber;

    result.password = req.body.password || result._doc.password;
    result.email = req.body.email || result._doc.email;
    result.phoneNumber = req.body.phoneNumber || result._doc.phoneNumber;
    var userType = req.session.type;
    // console.log("userType: ", userType);
    if (userType == 2) { //user privilege
      console.log("U can't change some parameters!");
      // res.json({
      //   error: "U can't change some parameters!"
      // })
    } else {//admin privilege
      result.status = req.body.status || result._doc.status;
      result.permitedChannelsId = req.body.permitedChannelsId || result._doc.permitedChannelsId;
      result.type = req.body.type || result._doc.type;
    }
    //save updated user
    result.save(function (err, result) {
      if (err) {
        res.status(500).send(err)
      }
      //else
      res.status(200).send(result);
    })
  })
})

//Login
router.post('/login', function (req, res) {
  // bcrypt.hash(req.body.password, 10, function (err, hash){
  //   if (err) {
  //     res.json({
  //       error: err
  //     });
  //     //return next(err);
  //   }
  //   req.body.password = hash;
  //   //next();
  // })
  user_sc.findOne({
    'username': req.body.username,
    //'password': req.body.password
  }, function (err, result) {
    if (!err) {
      if (result) {
        bcrypt.compare(req.body.password, result.password, function (err, same) {
          if (!same) {
            return res.status(401).json({
              error: 'unauthorized user, pass is not correct',
              auth: false
            })
          }

          //var token=auth.tokenize(result._id);
          req.session.userId = result._doc._id;
          req.session.type = result._doc.type;
          console.log(req.session.cookie)
          console.plain(req.session.userId)

          res.json({
            user: result,
            cookie: req.session.cookie,
            sName: req.session.name,
            auth: true,
          });
          res.end('done');
        })
      } else {
        res.status(401).json({
          error: 'unauthorized user',
          auth: false
        })
      }
    } else {
      res.status(500).json({
        error: err,
        auth: false
      })
    }
  })
})

//Get all users
router.post('/all', auth, function (req, res) {
  user_sc.find({}, function (err, result) {
    if (!err) {
      if (result) {
        res.json({
          usersArray: result
        });
      } else {
        res.json({
          error: 'There is no user to select...'
        });
      }
    } else {
      res.status(500).json({
        error: err
      })
    }
  })
})


// GET /logout
router.post('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
        console.log("Problem in session distroy")
      } else {
        console.log("session is distroied :D")
        return res.redirect('/');
      }
    });
  }
});

//change status of a user (by id): 0:active - 1:deactive - -1:deleted - 3:banned
//URL: localhost:5010/users/status
//INPUT:{"_id":"5a1e711ed411741d84d10a29"}

router.post('/status',auth, function (req, res) {
  console.log('query', req.body)
    user_sc.findById(req.body._id).exec(function (err, result) {
    if (!err) {
      console.log("user:",result) 
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
      console.log('status of user changed...');
    } else {
      res.status(500).json({
        error: err
      });
    }
  })
})


module.exports = router;