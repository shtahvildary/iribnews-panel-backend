require('shery-logger');
// console.plain('.....');

require('dotenv').config();
var db = require('./config/DBConfig');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var messages = require('./routes/messages');
var voteItems = require('./routes/voteItems');
var votes = require('./routes/votes');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();


// /////////////////////////////////////////////
// //use auth0 for tracking logins

// var jwt = require('express-jwt');
// var jwks = require('jwks-rsa');
// // Authentication middleware. When used, the
// // access token must exist and be verified against
// // the Auth0 JSON Web Key Set
// var port = process.env.PORT || 8080;
// // var port = process.env.PORT || 5010;

// var jwtCheck = jwt({
//   // Dynamically provide a signing key
//   // based on the kid in the header and 
//   // the signing keys provided by the JWKS endpoint.
//     secret: jwks.expressJwtSecret({
//         cache: true,
//         rateLimit: true,
//         jwksRequestsPerMinute: 5,
//         jwksUri: "https://tstat.eu.auth0.com/.well-known/jwks.json"
//     }),
//   // Validate the audience and the issuer.    
//     audience: 'https://telegram-stats',
//     issuer: "https://tstat.eu.auth0.com/",
//     algorithms: ['RS256']
// });

// app.use(jwtCheck);

// app.get('/authorized', function (req, res) {
//   res.send('Secured Resource');
// });

// app.listen(port);

// ////////////////////////////////////////////////////






//use sessions for tracking logins

//export default function sessionManagementConfig(app) {
app.use(session({
  // secret: serverSettings.session.password,
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    // secure: true,
    maxAge: 1800000 //30 mins
  },
  ttl: (1 * 60 * 60),
  store: new MongoStore({
    mongooseConnection: db
  }),
  name: "id",
}));
// session.Session.prototype.login = function(user, cb){
//   this.userInfo = user;
//   cb();
// };
// }

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, HEAD, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Api-Token, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, x-access-token');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/messages', messages);
app.use('/voteItems', voteItems);
app.use('/votes', votes);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;