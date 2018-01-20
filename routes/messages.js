var express = require('express');
var router = express.Router();
var message_sc = require("../Schema/messages");
var moment = require('moment');
var auth = require('../tools/authentication');
//var auth = require('../tools/auth');
var request = require('request');


//select all sort by date
router.post('/select/all/date', auth, function (req, res, next) {
    message_sc.find({}).populate({path: 'replys.userId', select: 'username'}).sort('-date').exec(function (err, result) {
        //pagination should be handled
        if (!err) {
            res.status(200).json({
                messages: result,
                // userId: req.body.token
                userId:req.session.userId
                
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

    // console.log('query', req.body)
    message_sc.find({
        $or:[
        {"message": {
            $regex: req.body.query,
            $options: 'i'
        }},{"replys.text": {
            $regex: req.body.query,
            $options: 'i'
        }},{"caption": {
            $regex: req.body.query,
            $options: 'i'
        }},{"audioTitle": {
            $regex: req.body.query,
            $options: 'i'
        }},{"fileName": {
            $regex: req.body.query,
            $options: 'i'
        }}
    ]
    }).sort('-date').exec(function (err, result) {
        // console.log(err)
        //pagination should be handled
        if (!err) {
            res.status(200).json({
                messages: result,
                // userId: req.body.token
                userId:req.session.userId   
            });
        } else {
            res.status(500).json({
                error: err
            });
        }
    })
})

//Select last 5 messages sort by date
router.post('/select/last/date', auth, function (req, res) {
    message_sc.find({}).sort('-date').limit(5).exec(function (err, result) {
        //pagination should be handled
        if (!err) {
            res.status(200).json({
                messages: result,
                // userId: req.body.token
                userId:req.session.userId
                
                
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

            var msgCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            // console.log(msgCounts.length)


            result.forEach(function (message) {
                msgCounts[message.date.getHours()] += 1;
            });
            res.status(200).json({
                text: msgCounts,
                // userId: req.body.token
                userId:req.session.userId
                
                
            })
        } else {
            res.status(500).json({
                error: err
            });
        }
    })
})
router.post('/chart/weekly', auth, function (req, res) {
    console.log('weekly', req.body);
    var today = new Date(req.body.date);
    var sat = new Date(req.body.date);
    var fri = new Date(req.body.date);
    var curr = new Date; // get current date
    var first = today.getDate() - today.getDay() - 1; // First day is the day of the month - the day of the week
    var last = first + 5; // last day is the first day + 6
    

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

            var msgCounts = [0, 0, 0, 0, 0, 0, 0];
            // console.log(msgCounts.length)


            result.forEach(function (message) {
                msgCounts[message._doc.date.getDay()] += 1;
            });
            res.status(200).json({
                text: msgCounts
            })
        } else {
            res.status(500).json({
                error: err
            });
        }
    })
})
router.post('/chart/monthly', auth, function (req, res) {
    console.log('monthly', req.body);
    var today = new Date(req.body.date);
    var sat = new Date(req.body.date);
    var fri = new Date(req.body.date);
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

            var msgCounts = [0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0,0, 0, 0, 0, 0, 0, 0,0,0];
            // console.log(msgCounts.length)


            result.forEach(function (message) {
                msgCounts[message._doc.date.getDate()] += 1;
            });
            res.status(200).json({
                text: msgCounts
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
    var firstday = new Date(req.body.firstday);
    var lastday = new Date(req.body.lastday);



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
            console.log('diffDays: '+diffDays)


            var msgCounts = Array(diffDays);
            // var msgCounts = [0, 0, 0, 0, 0, 0, 0];
            // console.log(msgCounts.length)


            result.forEach(function (message) {
                msgCounts[message.date.getHours()] += 1;
            });
            res.status(200).json({
                text: msgCounts
            })
        } else {
            res.status(500).json({
                error: err
            });
        }
    })
})

//shmt_bot
// var botToken = "449968526:AAGY4Tz48MiN8uxUD_0nWHFZSQscD9OQ_Vk";
//iribnews
var botToken = "545443179:AAGEKFAT_mg5H2aTZbCKEPXr2Pkee11b8l4";


//save reply for a message
router.post('/reply', auth, function (req, res) {
    console.log('query:', req.body)



    message_sc.findById(req.body._id).exec(function (err, result) {
        if (!err) {
            console.log("message:", result)
            console.log("req.body.reply:", req.body)
            var reply = {
                text: req.body.text,
                //date:req.body.date,
                // userId: req.body.userId
                // userId: req.body.token
                userId:req.session.userId
                
            }

            request({
                uri: "https://api.telegram.org/bot" + botToken + "/sendMessage",
                method: 'POST',
                json: {
                    chat_id: result.chatId,
                    text: req.body.text
                }

            }, function (err, d) {
                console.log(err, d)
                if (err) {
                    res.status(500).json({
                        error: err
                    })
                } else {

                    if (result._doc.replys) {
                        result._doc.replys.push(reply || result._doc.replys);
                    } else {
                        result._doc.replys = reply || result._doc.replys;

                    }
                    // Save the updated document back to the database
                    result.save(function (err, result) {
                        if (!err) {
                            res.status(200).send(result);
                        } else {
                            res.status(500).send(err)
                        }
                    })
                }
            })
        } else {
            res.status(500).json({
                error: err
            });
        }
    })
})

module.exports = router;