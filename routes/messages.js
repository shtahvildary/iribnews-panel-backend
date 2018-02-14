var express = require('express');
var router = express.Router();
var message_sc = require("../Schema/messages");
var moment = require('moment');
var auth = require('../tools/authentication');
//var auth = require('../tools/auth');
var request = require('request');
var _ = require('lodash');
const botServer = "http://localhost:9002";



//select all sort by date
router.post('/select/all/date', auth, function (req, res, next) {
    message_sc.find({}).populate({
        path: 'replys.userId',
        select: 'username'
    }).populate({
        path: 'isSeen.userId',
        select: 'username'
    }).sort('-date').exec(function (err, result) {
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
    })
    // }
    // else {
    //     res.status(500).json({
    //         error: err
    //     });}
})

//search
router.post('/search', auth, function (req, res) {
    var {
        filters,
        query
    } = req.body;
    if (!query) query = "";
    var dbQuery = {
        $or: [{
                "message": {
                    // $regex: "",
                    $regex: query,
                    $options: 'i'
                }
            }, {
                "caption": {
                    // $regex: "",
                    $regex: query,
                    $options: 'i'
                }
            }, {
                "audioTitle": {
                    // $regex: "",
                    $regex: query,
                    $options: 'i'
                }
            }, {
                "fileName": {
                    // $regex: "",
                    $regex: query,
                    $options: 'i'
                }
            }, {
                "filePath": {
                    // $regex: "",
                    $regex: query,
                    $options: 'i'
                }
            },
            {
                "replys.text": {
                    // $regex: "",
                    $regex: query,
                    $options: 'i'
                }
            }
        ]
    };
    var filterTypes = [];
    if (filters) {
        if (filters.messages == 1) {
            filterTypes.push("text");
            // dbQuery.$or[0].message.$regex=query;

        }
        if (filters.photos == 1) {
            filterTypes.push("photo");
            // dbQuery.$or[1].caption.$regex=query;
            // dbQuery.$or[1].filePath.$regex=query;
        }
        if (filters.movies == 1) {
            filterTypes.push("video");
            // dbQuery.$or[1].caption.$regex=query;
            // dbQuery.$or[4].filePath.$regex=query;

        }
        if (filters.voices == 1) {
            filterTypes.push("voice", "audio");
            // dbQuery.$or[1].caption.$regex=query;
            // dbQuery.$or[2].audioTitle.$regex=query;
            // dbQuery.$or[4].filePath.$regex=query;
        }
        if (filters.files == 1) {
            filterTypes.push("document");
            // dbQuery.$or[1].caption.$regex=query;
            // dbQuery.$or[3].fileName.$regex=query;
        }
        if (filterTypes.length > 0) dbQuery.type = {
            $in: filterTypes
        }
        // if (filters.replys == 1) {
        //     dbQuery.$or["replys.text"] = {
        //         $regex: query,
        //         $options: "i"
        //     }
        //     filterTypes.push("text", "photo", "video", "voice", "audio", "document");

        //     // if(filters.replys==1) dbQuery["replys.text"]={$regex:query,$options:"i"}
        // }
    }


    console.log('query', dbQuery)
    console.log('req.body', req.body)
    console.log('filterTypes', filterTypes)
    message_sc.find(dbQuery).sort('-date').exec(function (err, result) {
        // console.log(err)
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
    })
});

//Select last 5 messages sort by date
router.post('/select/last/date', auth, function (req, res) {
    message_sc.find({}).sort('-date').limit(5).exec(function (err, result) {
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
    })
})

//date.gethours
router.post('/chart/daily', auth, function (req, res) {
    // console.log(req.body);
    var h0 = new Date(req.body.date);
    var h24 = new Date(req.body.date);
    // console.log(h0);
    h0.setHours(0, 0, 0, 0);
    h24.setHours(23, 59, 59, 999);

    // console.log('h0:'+h0);
    // console.log('h24:'+h24);

    message_sc.find({
        'date': {
            $gt: h0,
            $lt: h24
        }
    }).exec(function (err, result) {
        //pagination should be handled
        console.log(result)
        if (!err) {

            var msgCounts = Array(24);
            msgCounts.fill(0);
            // var msgType={text,image,video,voice}
            // console.log(msgCounts.length)
            var textCount = Array(24); 
            var audioCount=Array(24);
            var videoCount=Array(24);
            var photoCount=Array(24);
            var documentCount=Array(24);
            
            textCount.fill(0);
            audioCount.fill(0);
            videoCount.fill(0);
            photoCount.fill(0);
            documentCount.fill(0);


            result.forEach(function (message) {
                switch(message._doc.type){
                    case 'text': {textCount[message._doc.date.getDate()] += 1; break;}
                    case ('audio'||'voice'):{audioCount[message._doc.date.getDate()] += 1; break;}
                    case 'video':{videoCount[message._doc.date.getDate()] += 1; break;}
                    case 'photo':{photoCount[message._doc.date.getDate()] += 1; break;}
                    case 'document':{documentCount[message._doc.date.getDate()] += 1; break;}
                    
                }
                msgCounts[message.date.getHours()] += 1;
            });
            res.status(200).json({
                
                    text: msgCounts,
                    voice:audioCount,
                    video:videoCount,
                    image:photoCount,
                    document:documentCount,
                // userId: req.body.token
                userId: req.session.userId
            })
        } else {
            res.status(500).json({
                error: err
            });
        }
    })
});
router.post('/chart/weekly', auth, function (req, res) {
    console.log('weekly', req.body);
    var today = new Date(req.body.date);
    // var sat = new Date(req.body.date);
    // var fri = new Date(req.body.date);
    var curr = new Date; // get current date
    var first = today.getDate() - today.getDay()- 1; // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6


    var firstday = new Date(today.setDate(first));
    var lastday = new Date(today.setDate(last));
    // sat=new Date(today.getFullYear(),today.getMonth,)
    // if(sat.getDay)
    firstday.setHours(0, 0, 0, 0);
    lastday.setHours(23, 59, 59, 999);

    message_sc.find({
        'date': {
            $gt: firstday,
            $lt: lastday
        }
    }).exec(function (err, result) {

        //pagination should be handled
        if (!err) {

            var msgCounts = Array(7);
            msgCounts.fill(0)
            // var msgType={text,image,video,voice}
            // console.log(msgCounts.length)
            var textCount = Array(7); 
            var audioCount=Array(7);
            var videoCount=Array(7);
            var photoCount=Array(7);
            var documentCount=Array(7);
            
            textCount.fill(0);
            audioCount.fill(0);
            videoCount.fill(0);
            photoCount.fill(0);
            documentCount.fill(0);

            var persianDay;

            result.forEach(function (message) {
                console.log('message._doc.date.getDay(): ',message._doc.date.getDay())
                persianDay=message._doc.date.getDay()+1;
                if(persianDay==7) persianDay=0;
                switch(message._doc.type){
                    case 'text': {textCount[persianDay] += 1; break;}
                    case ('audio'||'voice'):{audioCount[persianDay] += 1; break;}
                    case 'video':{videoCount[persianDay] += 1; break;}
                    case 'photo':{photoCount[persianDay] += 1; break;}
                    case 'document':{documentCount[persianDay] += 1; break;}
                }
                msgCounts[persianDay] += 1;
            });
            res.status(200).json({
                text: msgCounts,
                voice:audioCount,
                video:videoCount,
                image:photoCount,
                document:documentCount,
            })
        } else {
            res.status(500).json({
                error: err
            });
        }
    })
});
router.post('/chart/monthly', auth, function (req, res) {
    console.log('monthly', req.body);
    var today = new Date(req.body.date);
    // var sat = new Date(req.body.date);
    // var fri = new Date(req.body.date);
    var curr = new Date; // get current date

    // var first = curr.getDate() - curr.getDay() - 1; // First day is the day of the month - the day of the week
    // var last = first + 5; // last day is the first day + 6
    // console.log(first, last)

    var firstday = new Date(curr.setDate(1));
    var lastday = new Date(curr.setDate(30));
    // sat=new Date(today.getFullYear(),today.getMonth,)
    // if(sat.getDay)
    firstday.setHours(0, 0, 0, 0);
    lastday.setHours(23, 59, 59, 999);

    message_sc.find({
        'date': {
            $gt: firstday,
            $lt: lastday
        }
    }).exec(function (err, result) {
        //pagination should be handled
        if (!err) {

            var msgCounts = Array(30);
            msgCounts.fill(0);
            // var msgType={text,image,video,voice}
            // console.log(msgCounts.length)
            var textCount = Array(30); 
            var audioCount=Array(30);
            var videoCount=Array(30);
            var photoCount=Array(30);
            var documentCount=Array(30);
            
            textCount.fill(0);
            audioCount.fill(0);
            videoCount.fill(0);
            photoCount.fill(0);
            documentCount.fill(0);

            result.forEach(function (message) {
                //text,audio,voice,video,photo,document
                switch(message._doc.type){
                    case 'text': {textCount[message._doc.date.getDate()] += 1; break;}
                    case ('audio'||'voice'):{audioCount[message._doc.date.getDate()] += 1; break;}
                    case 'video':{videoCount[message._doc.date.getDate()] += 1; break;}
                    case 'photo':{photoCount[message._doc.date.getDate()] += 1; break;}
                    case 'document':{documentCount[message._doc.date.getDate()] += 1; break;}
                }
                msgCounts[message._doc.date.getDate()] += 1;
                
            });
            console.log('textCount :',textCount)
            console.log('audioCount :',audioCount)
            console.log('videoCount :',videoCount)
            console.log('photoCount :',photoCount)
            console.log('documentCount :',documentCount)
            res.status(200).json({
                text: msgCounts,
                voice:audioCount,
                video:videoCount,
                image:photoCount,
                document:documentCount,
            })
        } else {
            res.status(500).json({
                error: err
            });
        }
    })
})

router.post('/chart/selectedDate', auth, function (req, res) {
    console.log('selectedDate', req.body);
    // var firstday = new Date(req.body.firstday);
    // var lastday = new Date(req.body.lastday);
    var firstday = new Date();
    var lastday = new Date();
     firstday.setYear(req.body.firstday.y);
     firstday.setMonth(req.body.firstday.m);
     firstday.setDate(req.body.firstday.d);
     
     lastday.setYear(req.body.lastday.y);
     lastday.setMonth(req.body.lastday.m);
     lastday.setDate(req.body.lastday.d);



    // sat=new Date(today.getFullYear(),today.getMonth,)
    // if(sat.getDay)
    firstday.setHours(0, 0, 0, 0);
    lastday.setHours(23, 59, 59, 999);

    message_sc.find({
        'date': {
            $gt: firstday,
            $lt: lastday
        }
    }).exec(function (err, result) {
        //pagination should be handled
        if (!err) {


            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds


            var diffDays = Math.round(Math.abs((firstday.getTime() - lastday.getTime()) / (oneDay)));
            // console.log('diffDays: ' + diffDays)


            var msgCounts = Array(diffDays);
             msgCounts .fill(0);
            // console.log(msgCounts)
            
            // var msgType={text,image,video,voice}
            // console.log(msgCounts.length)
            var textCount = Array(diffDays); 
            var audioCount=Array(diffDays);
            var videoCount=Array(diffDays);
            var photoCount=Array(diffDays);
            var documentCount=Array(diffDays);
            
            textCount.fill(0);
            audioCount.fill(0);
            videoCount.fill(0);
            photoCount.fill(0);
            documentCount.fill(0);


            result.forEach(function (message) {
                switch(message._doc.type){
                    case 'text': {textCount[message._doc.date.getDate()] += 1; break;}
                    case ('audio'||'voice'):{audioCount[message._doc.date.getDate()] += 1; break;}
                    case 'video':{videoCount[message._doc.date.getDate()] += 1; break;}
                    case 'photo':{photoCount[message._doc.date.getDate()] += 1; break;}
                    case 'document':{documentCount[message._doc.date.getDate()] += 1; break;}
                }
                msgCounts[message._doc.date.getHours()] += 1;
            });
            res.status(200).json({
                diffDays:diffDays,
                text: msgCounts,
                voice:audioCount,
                video:videoCount,
                image:photoCount,
                document:documentCount,
            })
        } else {
            res.status(500).json({
                error: err
            });
            console.log(res)
        }
    })
})




//save reply for a message
router.post('/reply/new', auth, function (req, res) {
    console.log('query:', req.body)

    // message_sc.findById(req.body._id).exec(function (err, result) {
    //     if (!err) {
            // console.log("message:", result)
            console.log("req.body.reply:", req.body)
            var reply = {
                _id:req.body._id,
                    text:req.body.text,
                    userId:req.session.userId

            }

            request.post({
                url: botServer + "/sendMessage/reply/new",
                json:reply
              },
              function (err, res) {
                if (err) console.log("err: ", err);
               
              }
            );
           
    //     } else {
    //         res.status(500).json({
    //             error: err
    //         });
    //     }
    // })
}); 

//edit reply for a message
router.post('/reply/edit', auth, function (req, res) {
    console.log('query:', req.body)

    // message_sc.findById(req.body._id).exec(function (err, result) {
    //     if (!err) {
            // console.log("message:", result)
            console.log("req.body.reply:", req.body)
            /*exmaple:
{
	"_id":"5a62fea1ba1ee7221416779f",
	"message_id":224,
	"chatId":98445056,
	"text":"just 4 test!!",
	"userId":"5a509716513a501c9cce24c6"
}
example home:
{"_id":"5a61ab39b6def3171ee9992d",
	"text":"dear7",
	"message_id":"227"
	
}
*/
            var reply = {
                _id:req.body._id,
                message_id:req.body.message_id, //message_id of reply
                    text:req.body.text,
                    userId:req.session.userId

            }

            request.post({
                url: botServer + "/sendMessage/reply/edit",
                json:reply
              },
              function (err, res) {
                if (err) console.log("err: ", err);
               
              }
            );
           
    //     } else {
    //         res.status(500).json({
    //             error: err
    //         });
    //     }
    // })
}); 

router.post('/view', auth, function (req, res) {
    message_sc.findById(req.body._id).exec(function (err, result) {
        if (!err) {
            console.log("message:", result)
            // console.log("req.body.reply:", req.body)
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
        }
    })
})

router.post('/isSeen', auth, function (req, res) {
    message_sc.findOne({
        _id: req.body._id
    }).exec(function (err, msg) {
        if (err) return res.status(500).json({
            error: err
        })
        var {
            userId
        } = req.session; // var userId=req.session.userId;
        var userSeen = msg.isSeen.map(seen => {
            if (seen.userId == userId) return seen;
        })
        if (userSeen.length <= 0) message_sc.update({
            _id: req.body._id
        }, {
            $push: {
                isSeen: {
                    userId
                }
            }
        }).exec(function (err, updateInfo) {
            console.log(updateInfo)
            if (err) return res.status(500).json({
                error: err
            });

            return res.status(200).json({
                message: msg
            })
        })
        else
            return res.status(200).json({
                message: msg
            })

    })
})


module.exports = router;