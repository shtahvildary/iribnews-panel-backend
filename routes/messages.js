var express = require("express");
var router = express.Router();
var message_sc = require("../Schema/messages");
var moment = require("moment");
var auth = require("../tools/authentication");
var request = require("request");
var _ = require("lodash");
var mime =require("mime");
var multer=require("multer");
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    var format=mime.getExtension(file.mimetype);
    if(!format ||format==null) format=file.mimetype.substring(file.mimetype.lastIndexOf("/")+1);
    cb(null,  Date.now() + '.' + format);
    
  }
  });
  var upload = multer({ storage: storage });
var upFileserver=require("../tools/upload")

// const botServer = "http://172.16.17.149:9002";
const botServer = "http://localhost:9002";
var { checkPermissions } = require("../tools/auth");
var { gregorian_to_jalali } = require("../tools/persian-date-convert.js");
// var { gregorian_to_jalali } = require("../public/js/persian-date-convert.js");
// var { jing } = require("../tools/persian-date-convert.js");

//select all sort by date
router.post("/select/all/date", auth, function(req, res, next) {
  if (req.session.type > 2) {
    // if (req.session.type != 0) {
    var allowedPermissions = [111];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var data;
  if (req.session.type < 2) data = {};
  else data = { departmentId: req.session.departmentId };

  message_sc
    .find(data)
    .populate({
      path: "replys.userId",
      select: "username"
    })
    .populate({
      path: "isSeen.userId",
      select: "username"
    })
    .populate({
      path: "departmentId",
      select: "title"
    })
    .sort("-date")
    .exec(function(err, result) {
      //pagination should be handled
      if (!err) {
        res.status(200).json({
          messages: result,
          // userId: req.body.token
          userId: req.session.userId
        });
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
  // }
  // else {
  //     res.status(500).json({
  //         error: err
  //     });}
});

//search
router.post("/search", auth, function(req, res) {
  if (req.session.type >2) {
    // if (req.session.type != 0) {
    var allowedPermissions = [111];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var { filters, query,departmentId } = req.body;
  if (!query) query = "";
  var dbQuery = {
    $or: [
      {
        message: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      },
      {
        caption: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      },
      {
        audioTitle: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      },
      {
        fileName: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      },
      {
        filePath: {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      },
      {
        "replys.text": {
          // $regex: "",
          $regex: query,
          $options: "i"
        }
      }
    ]
  };
  var filterTypes = [];
  if (filters) {
    if (filters.messages == 1) {
      filterTypes.push("text");
    }
    if (filters.photos == 1) {
      filterTypes.push("photo");
    }
    if (filters.movies == 1) {
      filterTypes.push("video");
    }
    if (filters.voices == 1) {
      filterTypes.push("voice", "audio");
    }
    if (filters.files == 1) {
      filterTypes.push("document");
    }
    if(filters.pin==1){
      dbQuery["pin.status"]=1
    }
    if (filterTypes.length > 0)
      dbQuery.type = {
        $in: filterTypes
      };
  }
  

  // dbQuery.pin = { status: filters.pin };
  
  if (req.session.type < 2) {
    if(departmentId)  dbQuery.departmentId=departmentId;}
  else  dbQuery.departmentId= req.session.departmentId ;

  message_sc
  .find(dbQuery)
  .populate({
    path: "replys.userId",
    select: "username"
  })
  .populate({
    path: "isSeen.userId",
    select: "username"
  })
  .populate({
    path: "departmentId",
    select: "title"
  })
  .sort("-date")
  .exec(function(err, result) {
    //pagination should be handled
    if (!err) {
      res.status(200).json({
        messages: result,
        // userId: req.body.token
        userId: req.session.userId
      });
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

//Select last 5 messages sort by date
router.post("/select/last/date", auth, function(req, res) {
  if (req.session.type >2) {
    // if (req.session.type != 0) {
    var allowedPermissions = [111];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var data;
  if (req.session.type < 2) data = {};
  else data = { departmentId: req.session.departmentId };
  message_sc
    .find(data)
    .sort("-date")
    .limit(5)
    .exec(function(err, result) {
      //pagination should be handled
      if (!err) {
        res.status(200).json({
          messages: result,
          // userId: req.body.token
          userId: req.session.userId
        });
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
});

//date.gethours
router.post("/chart/daily", auth, function(req, res) {
  if (req.session.type >2) {
    // if (req.session.type != 0) {
    var allowedPermissions = [131];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var h0 = new Date(req.body.date);
  var h24 = new Date(req.body.date);
  h0.setHours(0, 0, 0, 0);
  h24.setHours(23, 59, 59, 999);

  // console.log('h0:'+h0);
  // console.log('h24:'+h24);
  var data = {
    date: {
      $gt: h0,
      $lt: h24
    }
  };
  if (req.session.type > 1)
    data = {
      $and: [{ departmentId: req.session.departmentId }, data]
    };
  message_sc.find(data).exec(function(err, result) {
    //pagination should be handled
    if (!err) {
      var msgCounts = Array(24);
      msgCounts.fill(0);
      // var msgType={text,image,video,voice}
      // console.log(msgCounts.length)
      var textCount = Array(24);
      var audioCount = Array(24);
      var videoCount = Array(24);
      var photoCount = Array(24);
      var documentCount = Array(24);
      var othersCount = Array(24);
      var date = Array(24);

      textCount.fill(0);
      audioCount.fill(0);
      videoCount.fill(0);
      photoCount.fill(0);
      documentCount.fill(0);
      othersCount.fill(0);
      date.fill("");
      var index;
      var stringDate;

      result.forEach(function(message) {
        index = message._doc.date.getHours();
        switch (message._doc.type) {
          case "text": {
            textCount[index] += 1;
            // date[index] = _.join(
            //   gregorian_to_jalali(new Date(message._doc.date)),
            //   (seprator = "/")
            // );

            break;
          }
          case "audio" || "voice": {
            audioCount[index] += 1;
            // date[index] = _.join(
            //   gregorian_to_jalali(new Date(message._doc.date)),
            //   (seprator = "/")
            // );

            break;
          }
          case "video": {
            videoCount[index] += 1;
            // date[index] = _.join(
            //   gregorian_to_jalali(new Date(message._doc.date)),
            //   (seprator = "/")
            // );

            break;
          }
          case "photo": {
            photoCount[index] += 1;
            // date[index] = _.join(
            //   gregorian_to_jalali(new Date(message._doc.date)),
            //   (seprator = "/")
            // );

            break;
          }
          case "document": {
            documentCount[index] += 1;
            // date[index] = _.join(
            //   gregorian_to_jalali(new Date(message._doc.date)),
            //   (seprator = "/")
            // );

            break;
          }
          default: {
            othersCount[index] += 1;
            // date[index] = _.join(
            //   gregorian_to_jalali(new Date(message._doc.date)),
            //   (seprator = "/")
            // );
          }
        }
        // console.log('date: ',date)
        // msgCounts[message.date.getHours()] += 1;
      });
      res.status(200).json({
        text: textCount,
        voice: audioCount,
        video: videoCount,
        image: photoCount,
        document: documentCount,
        others: othersCount,
        // date: date,
        // userId: req.body.token
        userId: req.session.userId
      });
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});
router.post("/chart/weekly", auth, function(req, res) {
  // if (req.session.type != 0) {
    if (req.session.type >2) {
    var allowedPermissions = [131];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var today = new Date(req.body.date);
  var dayOfWeek = today.getDay();
  if (dayOfWeek > 5) dayOfWeek -= 5;
  else dayOfWeek += 2;



// var first = today.getDate() - dayOfWeek + 1; // First day is the day of the month - the day of the week
// var last = first + 6; // last day is the first day + 6

// var firstday = new Date(today.setDate(first));
// var lastday = new Date(today.setDate(last));
var firstday = new Date();
var lastday = new Date();
firstday.setDate(today.getDate()-dayOfWeek+1)
lastday.setDate(firstday.getDate()+6)

// sat=new Date(today.getFullYear(),today.getMonth,)
// if(sat.getDay)
firstday.setHours(0, 0, 0, 0);
lastday.setHours(23, 59, 59, 999);

  var data = {
    date: {
      $gt: firstday,
      $lt: lastday
    }
  };
  if (req.session.type > 1)
    data . departmentId= req.session.departmentId ;
    // data = { $and: [{ departmentId: req.session.departmentId }, date] };
  message_sc.find(data).exec(function(err, result) {
    //pagination should be handled
    if (!err) {
      var msgCounts = Array(7);
      msgCounts.fill(0);
      // var msgType={text,image,video,voice}
      // console.log(msgCounts.length)
      var textCount = Array(7);
      var audioCount = Array(7);
      var videoCount = Array(7);
      var photoCount = Array(7);
      var documentCount = Array(7);
      var othersCount = Array(7);
      var date = Array(7);

      textCount.fill(0);
      audioCount.fill(0);
      videoCount.fill(0);
      photoCount.fill(0);
      documentCount.fill(0);
      othersCount.fill(0);
      date.fill("");
      var index;
      var stringDate;

      var persianDay;

      result.forEach(function(message) {
        persianDay = message._doc.date.getDay() + 1;
        if (persianDay == 7) persianDay = 0;
        switch (message._doc.type) {
          case "text": {
            textCount[persianDay] += 1;
            break;
          }
          case "audio" || "voice": {
            audioCount[persianDay] += 1;
            break;
          }
          case "video": {
            videoCount[persianDay] += 1;
            break;
          }
          case "photo": {
            photoCount[persianDay] += 1;
            break;
          }
          case "document": {
            documentCount[persianDay] += 1;
            break;
          }
          default: {
            othersCount[persianDay] += 1;
          }
        }
        msgCounts[persianDay] += 1;
      });
      res.status(200).json({
        text: textCount,
        voice: audioCount,
        video: videoCount,
        image: photoCount,
        document: documentCount,
        others: othersCount
      });
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});
//shows last 30 days messages count
router.post("/chart/monthly", auth, function(req, res) {
  if (req.session.type >2) {
    // if (req.session.type != 0) {
    var allowedPermissions = [131];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }
  var today = new Date(req.body.date);
  var curr = new Date(); // get current date

  
  var firstday=new Date();
  firstday.setDate(today.getDate()-30)
  
  var lastday = today;

  firstday.setHours(0, 0, 0, 0);
  lastday.setHours(23, 59, 59, 999);
  // console.log("jalaliDate: ",gregorian_to_jalali(new Date()))
  

  var data = {
    date: {
      $gte: firstday,
      $lte: lastday
    }
  };
  if (req.session.type > 1)
    data . departmentId=req.session.departmentId;
  message_sc.find(data).sort("date").exec(function(err, result) {
    if (!err) {
      var msgCounts = Array(31);
      msgCounts.fill(0);
      // var msgType={text,image,video,voice}

      var textCount = Array(30);
      var audioCount = Array(30);
      var videoCount = Array(30);
      var photoCount = Array(30);
      var documentCount = Array(30);
      var othersCount = Array(30);
      var date = Array(30);

      textCount.fill(0);
      audioCount.fill(0);
      videoCount.fill(0);
      photoCount.fill(0);
      documentCount.fill(0);
      othersCount.fill(0);
      // date.fill("");
      var index=0;
      var stringDate;

      result=result.map(m=>{
        m.date = _.join(
          gregorian_to_jalali(new Date(m.date)),
          (seprator = "/")
        );
        return m;
      })

      var classed={}
      result.map(m=>{
        if(!classed[m.date]) classed[m.date]={}
      })











      result.forEach(function(message) {
        


        //text,audio,voice,video,photo,document
        index = gregorian_to_jalali(new Date(message.date))[2]-1; //-1 is because it shoud starts from 0
        switch (message.type) {
          case "text": {
            textCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message.date)),
              (seprator = "/")
            );

            break;
          }
          case "audio" || "voice": {
            audioCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message.date)),
              (seprator = "/")
            );

            break;
          }
          case "video"||"video_note": {
            videoCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message.date)),
              (seprator = "/")
            );

            break;
          }
          case "photo": {
            photoCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message.date)),
              (seprator = "/")
            );

            break;
          }
          case "document": {
            documentCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message.date)),
              (seprator = "/")
            );

            break;
          }
          default: {
            othersCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message.date)),
              (seprator = "/")
            );
          }
        }
        // msgCounts[gregorian_to_jalali(new Date(message._doc.date))[2]] += 1;
      });
console.log(date)
      res.status(200).json({
        text: textCount,
        voice: audioCount,
        video: videoCount,
        image: photoCount,
        document: documentCount,
        others: othersCount,
        date: date
      });
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

//chart for selected date
router.post("/chart/selectedDate", auth, function(req, res) {
  if (req.session.type >2) {
    // if (req.session.type != 0) {
    var allowedPermissions = [131];
    if (!checkPermissions(allowedPermissions, req.session.permissions))
      return res
        .status(403)
        .json({ error: "You don't have access to this api." });
  }

  var firstday = new Date();
  var lastday = new Date();
  firstday.setYear(req.body.firstday.y);
  firstday.setMonth(req.body.firstday.m-1);
  firstday.setDate(req.body.firstday.d);

  lastday.setYear(req.body.lastday.y);
  lastday.setMonth(req.body.lastday.m);
  lastday.setDate(req.body.lastday.d);

  // sat=new Date(today.getFullYear(),today.getMonth,)
  // if(sat.getDay)
  firstday.setHours(0, 0, 0, 0);
  lastday.setHours(23, 59, 59, 999);
  console.log(firstday)
  console.log(lastday)

  var data = {
    date: {
      $gte: firstday,
      $lte: lastday
    }
  };
  if (req.session.type > 1)
    data .departmentId= req.session.departmentId ;
  message_sc.find(data).exec(function(err, result) {
    if (!err) {
      var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
      var diffDays = Math.round(
        Math.abs((firstday.getTime() - lastday.getTime()) / oneDay)
      );
      var msgCounts = Array(diffDays);
      msgCounts.fill(0);

      // var msgType={text,image,video,voice}
      var textCount = Array(diffDays);
      var audioCount = Array(diffDays);
      var videoCount = Array(diffDays);
      var photoCount = Array(diffDays);
      var documentCount = Array(diffDays);
      var othersCount = Array(diffDays);
      var date = Array(diffDays);

      textCount.fill(0);
      audioCount.fill(0);
      videoCount.fill(0);
      photoCount.fill(0);
      documentCount.fill(0);
      othersCount.fill(0);
      date.fill("");
      var index;
      var stringDate;

      result.forEach(function(message) {
        index = Math.round(
          Math.abs((message._doc.date.getTime() - firstday.getTime()) / oneDay)
        );
        switch (message._doc.type) {
          case "text": {
            textCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message._doc.date)),
              (seprator = "/")
            );
            // textCount[message._doc.date.getDate()] += 1;
            break;
          }
          case "audio" || "voice": {
            audioCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message._doc.date)),
              (seprator = "/")
            );

            break;
          }
          case "video": {
            videoCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message._doc.date)),
              (seprator = "/")
            );

            break;
          }
          case "photo": {
            photoCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message._doc.date)),
              (seprator = "/")
            );

            break;
          }
          case "document": {
            documentCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message._doc.date)),
              (seprator = "/")
            );

            break;
          }
          default: {
            othersCount[index] += 1;
            date[index] = _.join(
              gregorian_to_jalali(new Date(message._doc.date)),
              (seprator = "/")
            );
            
          }
        }
        // msgCounts[message._doc.date.getHours()] += 1;
      });
      
      res.status(200).json({
        diffDays: diffDays,
        text: textCount,
        voice: audioCount,
        video: videoCount,
        image: photoCount,
        document: documentCount,
        others: othersCount,
        date: date
      });
    } else {
      res.status(500).json({
        error: err
      });
    }
  });
});

//save reply for a message
router.post("/reply/new", auth,upload.single('file') ,function(req, res) {
  if (req.session.type != 2) 
  {
    var allowedPermissions = [112];
  if (!checkPermissions(allowedPermissions, req.session.permissions))
    return res
      .status(403)
      .json({ error: "You don't have access to this api." });
    }
  var reply={
    _id:req.body._id,
            text:req.body.text,
            userId:req.session.userId,
  }
  function sendReply(reply){
    request.post(
      {
        url: botServer + "/sendMessage/reply/new",
       json:reply
      },
      function(err, response) {
        if (err) return res.status(500).json({ error: err });
        return res.status(200).json({ sentMessage: response.body.sentMessage });
      }
    );
  }
  if(req.file){

    upFileserver("/uploads/"+req.file.filename,function(err,body,response){
    console.error(err)
    if(err) return err
    reply.filePath=response.filePath
      sendReply(reply)
    });
  }
  else{
    sendReply(reply)
  }
})

//edit reply for a message
router.post("/reply/edit", auth, function(req, res) {
  if (req.session.type != 2) {
  
  var allowedPermissions = [113];
  if (!checkPermissions(allowedPermissions, req.session.permissions))
    return res
      .status(403)
      .json({ error: "You don't have access to this api." });
  }

  var reply = {
    _id: req.body._id,
    message_id: req.body.message_id, //message_id of reply
    text: req.body.text
  };

  request.post(
    {
      url: botServer + "/sendMessage/reply/edit",
      json: reply
    },
    function(err, response) {
      if (err) return res.status(500).json({ error: err });
      return res.status(200).json({ updatedMessage: response });
    }
  );
});

// router.post("/view", auth, function(req, res) {
//   var allowedPermissions = [111];
//   if (!checkPermissions(allowedPermissions, req.session.permissions))
//     return res
//       .status(403)
//       .json({ error: "You don't have access to this api." });

//   message_sc.findById(req.body._id).exec(function(err, result) {
//     if (!err) {
//       if (!err) {
//         res.status(200).json({
//           messages: result,
//           // userId: req.body.token
//           userId: req.session.userId
//         });
//       } else {
//         res.status(500).json({
//           error: err
//         });
//       }
//     }
//   });
// });

router.post("/isSeen", auth, function(req, res) {
  if (req.session.type <2) {
    return res.status(200).json({
      message: "you don't need this option..."
    });
  }
  
  if (req.session.type >2) {
  
  var allowedPermissions = [111];
  if (!checkPermissions(allowedPermissions, req.session.permissions))
    return res
      .status(403)
      .json({ error: "You don't have access to this api." });
  }

  message_sc
    .findOne({
      _id: req.body._id
    })
    .exec(function(err, msg) {
      if (err)
        return res.status(500).json({
          error: err
        });
      var { userId } = req.session; // var userId=req.session.userId;
      var userSeen = msg.isSeen.map(seen => {
        if (seen.userId == userId) return seen;
      });
      if (userSeen.length <= 0)
        message_sc
          .update(
            {
              _id: req.body._id
            },
            {
              $push: {
                isSeen: {
                  userId
                }
              }
            }
          )
          .exec(function(err, updateInfo) {
            if (err)
              return res.status(500).json({
                error: err
              });

            return res.status(200).json({
              message: msg
            });
          });
      else
        return res.status(200).json({
          message: msg
        });
    });
});

router.post("/pin", auth, function(req, res) {
  if (req.session.type <2) {
    return res
      .status(403)
      .json({ error: "You don't have access to this api." });
  }
  if (req.session.type >2) {
  
  var allowedPermissions = [111];
  if (!checkPermissions(allowedPermissions, req.session.permissions))
    return res
      .status(403)
      .json({ error: "You don't have access to this api." });
  }
      message_sc.findOne({
        _id: req.body._id
    }).exec(function (err, msg) {
        if (err) return res.status(500).json({
            error: err
        })
        var userId=req.session.userId;
        var oldPin=msg.pin;
        // if(userId!=oldPin.userId || req.session.type != 2) return res
        // .status(403)
        // .json({ error: "You don't have access to this api." });

   msg.pin = { status: req.body.pin, userId: req.session.userId ,date:Date.now()};
  message_sc
    .update(
      {
        _id: req.body._id
      },
      
      {"pin":msg.pin},
      {upsert:true,new:true}
      
    )
    .exec(function(err, updateInfo) {
      if (err)
        return res.status(500).json({
          error: err
        });
      return res.status(200).json({
        updateInfo
      });
    });
});
    
});

module.exports = router;
