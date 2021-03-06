var express = require("express");
var router = express.Router();
var user_sc = require("../Schema/user");
var groups_sc = require("../Schema/groups");
var auth = require("../tools/authentication");
//var auth=require('../tools/auth');
var bcrypt = require("bcrypt");
var { checkPermissions } = require("../tools/auth");
// var async = require("async");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//Add new user
router.post("/register", auth, function (req, res) {
  // var allowedPermissions=[103]
  var userType = req.session.type;
  if (userType != 0 && userType >= req.body.type)
    return res.status(403).json({ error: "Forbidden: permission error" });

  console.log("Now U can register a new user...");
  var user = new user_sc(req.body);
  user.save(function (err, result) {
    if (!err) {
      //var token=auth.tokenize(result._id);
      // req.session.userId = result._id;
      res.json({
        user: result
        //token: token
      });
    } else {
      res.json({
        error: err
      });
    }
  });
});

//return user type
router.post("/type", auth, function (req, res) {
  var userType = req.session.type;

  return res.status(200).json({
    type: userType
  });
});

//update user profile
router.post("/update/profile", auth, function (req, res) {
  user_sc.findById(req.session.userId).exec(function (err, result) {
    if (err) {
      return res.status(500).json({
        error: err
      });
    }
    //else

    result.personelNumber =
      req.body.personelNumber || result._doc.personelNumber;
    result.password =
      bcrypt.hash(req.body.password, 10) || result._doc.password;
    result.email = req.body.email || result._doc.email;
    result.mobileNumber = req.body.mobileNumber || result._doc.mobileNumber;
    result.phoneNumber = req.body.phoneNumber || result._doc.phoneNumber;

    //save updated user
    user_sc.update({ _id: result._id }, result, function (err, result) {
      // result.save(function(err, result) {
      if (err) {
        return res.status(500).json({
          error: err
        });
      }
      // else
      return res.status(200).json({
        user: result
      });
    });
  });
});

//update user
router.post("/update", auth, function (req, res) {
  // var allowedPermissions=[102]
  // var allowedPermissions=[104]
  groups_sc
    .findById(req.body.group, { _id: 0, type: 1 })
    .exec(function (err, result) {
      if (err) {
        return res.status(500).json({
          error: err
        });
      }
      var groupType = result.type;

      var userType = req.session.type;
      if (userType != 0 && userType >= groupType)
        return res.status(403).json({ error: "Forbidden: permission error" });
      else {
        var user = ({
          firstName,
          lastName,
          personelNumber,
          group,
          email,
          mobileNumber,
          phoneNumber,
          status,
          permitedChannelsId
        } = req.body);
        if (req.body.password) {
          var hash = bcrypt.hash(req.body.password, 10, function (err, hash) {
            console.log("hash: ", hash);
            if (err) {
              return err;
            }
            user.password = hash;
            userUpdate(req.body._id, user);
          });
        } else userUpdate(req.body._id, user);

        // }
        //save updated user
        function userUpdate(_id, user) {
          user_sc.update({ _id: req.body._id }, user, function (err, result) {
            console.log(err);
            if (err) {
              return res.status(500).json({
                error: err
              });
            }
            // else
            return res.status(200).json({
              user: result
            });
          });
        }
      }
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateUser(userId, userInfo, type) {
  user_sc.findById(userId).exec(function (err, result) {
    if (err) {
      res.status(500).json({
        error: err
      });
    }
    //else
    console.log("user: ", result);
    result.firstName = userInfo.firstName || result._doc.firstName;
    result.lastName = userInfo.lastName || result._doc.lastName;
    result.personelNumber =
      userInfo.personelNumber || result._doc.personelNumber;

    result.password = userInfo.password || result._doc.password;
    result.email = userInfo.email || result._doc.email;
    result.mobileNumber = userInfo.mobileNumber || result._doc.mobileNumber;
    result.phoneNumber = userInfo.phoneNumber || result._doc.phoneNumber;
    var userType = type;
    // console.log("userType: ", userType);
    if (userType == 2) {
      //user privilege
      console.log("U can't change some parameters!");
    } else {
      //admin privilege
      result.status = userInfo.status || result._doc.status;
      result.permitedChannelsId =
        userInfo.permitedChannelsId || result._doc.permitedChannelsId;
      result.type = userInfo.type || result._doc.type;
    }
    //save updated user
    result.save(function (err, result) {
      if (err) {
        return {
          error: err
        };
      }
      // else
      return {
        user: result
      };
    });
  });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Login
router.post("/login", function (req, res) {
  user_sc
    .findOne({
      username: req.body.username
      //'password': req.body.password
    })
    .populate({
      path: "group"
    })
    .exec(function (err, result) {
      if (!err) {
        if (result) {
          bcrypt.compare(req.body.password, result.password, function (
            err,
            same
          ) {
            if (!same) {
              return res.status(401).json({
                error: "unauthorized user, pass is not correct",
                auth: false
              });
            }

            //var token=auth.tokenize(result._id);
            req.session.userId = result._doc._id;
            req.session.fName = result._doc.firstName;
            req.session.lName = result._doc.lastName;
            req.session.type = result._doc.group._doc.type;
            req.session.permissions = result._doc.group._doc.permissions;
            req.session.departmentId = result._doc.group._doc.departmentId;

            console.log(req.session.cookie);
            console.plain(req.session.userId);
            console.plain("type: ", req.session.type);
            console.plain("departmentId: ", req.session.departmentId);

            res.json({
              user: result,
              cookie: req.session.cookie,
              sName: req.session.name,
              auth: true
            });
            res.end("done");
          });
        } else {
          res.status(401).json({
            error: "unauthorized user",
            auth: false
          });
        }
      } else {
        res.status(500).json({
          error: err,
          auth: false
        });
      }
    });
});

//Get all users
router.post("/all", auth, function (req, res) {
  var data;

  if (req.session.type < 2) { data = { status: 0 }; findeUsers(data) }
  else {
    var group;
    groups_sc
      .find(
        { $and: [{ departmentId: req.session.departmentId }, { status: 0 }] },
        { _id: 1 }
      )
      .exec(function (err, group) {
        if (!err) {
          if (group) {
            data = { group: group };
            findeUsers(data)
          } else {
            return res.json({
              error: "There is no group with this _id..."
            });
          }
        } else {
          return res.status(500).json({
            error: err
          });
        }
      });
  }

  function findeUsers(data) {
    user_sc
      .find(data)
      .populate({
        path: "group",
        select: "title",
        populate: { path: "departmentId", select: "title" }
      })
      .exec(function (err, result) {
        if (!err) {
          if (result) {
            res.json({
              usersArray: result
            });
          } else {
            res.json({
              error: "There is no user to select..."
            });
          }
        } else {
          res.status(500).json({
            error: err
          });
        }
      });
  }
});



router.post("/search", auth, function (req, res) {
  var { query, departmentId,status } = req.body;
  if (!query) query = "";
  if (!status) status=0;
  var dbQuery = {
    $or: [
      {
        username: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      },
      {
        firstName: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      },
      {
        lastName: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      },
      {
        email: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      }
    ]
  };
  dbQuery.status=status

  if (req.session.type < 2) {
    //dbQuery.status = 0;

    if (departmentId) {
      findGroup(departmentId, function (error, groups) {
        if (error) return res.status(500).json({ error });
        dbQuery.group = { $in: groups };
        findUsers(dbQuery, function (error, users) {
          if (error) return res.status(500).json({ error });
          return res.status(200).json({ usersArray: users });
        });
      });
    }
    else findUsers(dbQuery, function (error, users) {
      if (error) return res.status(500).json({ error });
      return res.status(200).json({ usersArray: users });
    });
  } else
    findGroup(req.session.departmentId, function (error, groups) {
      if (error) return res.status(500).json({ error });
      dbQuery.group = groups[0]
      findUsers(dbQuery, function (error, users) {
        if (error) return res.status(500).json({ error });
        return res.status(200).json({ usersArray: users });
      });
    });
  // console.log("user search data: ", data);

  function findGroup(departmentId, callback) {
    groups_sc
      .find({ departmentId, status: 0 }, { _id: 1 })
      .exec(function (err, groups) {
        if (!err) {
          if (groups) {
            groups = groups.map(g => g._id);
            return callback(null, groups);
            // return groups;
          } else {
            return callback("There is no group with this _id...");
          }
        } else {
          return callback(err);
        }
      });
  }
  function findUsers(data, callback) {
    user_sc
      .find(data)
      .populate({
        path: "group",
        select: "title",
        populate: { path: "departmentId", select: "title" }
      })
      .exec(function (err, users) {
        if (!err) {
          if (users) return callback(null, users);
          else return callback("There is no user to select...");
        } else return callback(err);
      });
  }
});

// GET /logout
router.post("/logout", function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
        console.log("Problem in session distroy");
      } else {
        console.log("session is distroied :D");
        return res.redirect("/");
      }
    });
  }
});

//change status of a user (by id): 0:active - 1:deactive - -1:deleted - 3:banned
//URL: localhost:5010/users/status
//INPUT:{"_id":"5a1e711ed411741d84d10a29"}

router.post("/update/status", auth, function (req, res) {
  var userType = req.session.type;
  if (userType != 0)
    return res.status(403).json({ error: "Forbidden: permission error" });

  console.log("query", req.body);
  user_sc.findById(req.body._id).exec(function (err, result) {
    if (!err) {
      console.log("user:", result);
      result.status = req.body.status;
      result.save(function (err, result) {
        if (!err) {
          res.status(200).send(result);
        } else {
          res.status(500).send(err);
        }
      });
      res.status(200);
      console.log("status of user changed...");
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

router.post("/all/status", auth, function (req, res) {
  if (req.session.type != 0) return res.status(403).json({ error: "Forbidden: permission error" });

  user_sc
    .find()
    .populate({
      path: "group",
      select: "title",
      populate: { path: "departmentId", select: "title" }
    })
    .exec(function (err, result) {
      if (!err) {
        if (result) {
          res.json({
            usersArray: result
          });
        } else {
          res.json({
            error: "There is no user to select..."
          });
        }
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

router.post("/findeUser", auth, function (req, res) {
  user_sc.findById(req.session.userId).exec(function (err, result) {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).send(result);
  });
});

module.exports = router;
