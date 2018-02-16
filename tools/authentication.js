function requiresLogin(req, res, next) {
  userId=req.body.token;
    if (req.session.userId) return next();
     else {
      var err = new Error('You must be logged in to view this page.');
      err.status = 401;
      return next(err);
    }
  }
  
module.exports=requiresLogin;