var user_sc = require("../Schema/user");

function isPrivileged(req, res, next) {

  var userId = req.session.userId;

  user_sc.findById(userId, function (err, result) {
    console.log(result);
    if (err) {
      err.status = 500;
      return next(err);
    }
    res.userType = result._doc.type;
    return next();

  })

}

module.exports = isPrivileged;