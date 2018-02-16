
var express = require('express');
var router = express.Router();
var path=require("path")
var auth = require('../tools/authentication');
const fs = require("fs");


//read json

router.post("/read", auth, function(req, res) {
  var jsonPath=path.join(__dirname,'../tools/permissions.json')
  console.log(jsonPath)
  let rawdata = fs.readFileSync(jsonPath);
  let permissionsList = JSON.parse(rawdata);

  return res.status(200).json({permissionsList})
})


module.exports = router;
