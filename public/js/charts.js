const chartColors = [{
    red: 35,
    green: 198,
    blue: 136
}, {
    red: 35,
    green: 198,
    blue: 170
}, {
    red: 35,
    green: 187,
    blue: 198
}, {
    red: 35,
    green: 124,
    blue: 198
}, {
    red: 35,
    green: 67,
    blue: 198
}, {
    red: 73,
    green: 35,
    blue: 198
}, {
    red: 138,
    green: 35,
    blue: 198
}, {
    red: 198,
    green: 35,
    blue: 154
}, {
    red: 198,
    green: 35,
    blue: 83
}, {
    red: 198,
    green: 35,
    blue: 35
}, {
    red: 198,
    green: 124,
    blue: 35
}, {
    red: 195,
    green: 198,
    blue: 35
}, {
    red: 151,
    green: 198,
    blue: 35
}, {
    red: 113,
    green: 198,
    blue: 35
}, {
    red: 35,
    green: 198,
    blue: 37
}];
var hue = function () {
    return {
        red: Math.floor(Math.random() * 256),
        green: Math.floor(Math.random() * 256),
        blue: Math.floor(Math.random() * 256)
    };
}

function drawLineChart(element, data) {
    var ctx = document.getElementById(element);
    var datasets = data.datasets;
    var i = 0;
    datasets.map(function (item) {
        var color,
            border;
        if (chartColors.length > i) {
            color = chartColors[i];
        } else {
            color = hue();
        }
        border = {
            red: color.red - 23,
            green: color.green - 58,
            blue: color.blue - 60
        };
        item.backgroundColor = ['rgba(' + color.red + ',' + color.green + ',' + color.blue + ',0.7)']
        item.borderColor = ['rgba(' + border.red + ',' + border.green + ',' + border.blue + ',0.7)']
        item.borderWidth = 1;
        i++;

    })
    var totalMessagesChart = new Chart(ctx, {

        type: 'line',
        data: {
            labels: data.labels,
            datasets: datasets
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
(function ($) {
    $(function () {
        // if ($.cookie("token")&&!$.cookie("id")) {
        //     window.location.replace("../login.html");
        // }


        var now = new Date();
        post('/messages/chart/daily', {
            date: now
        }, function (response) {
            // console.log(response)
            // response=JSON.parse(response);
            drawLineChart('chart-msg-today', {
                labels: [
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                    '12',
                    '13',
                    '14',
                    '15',
                    '16',
                    '17',
                    '18',
                    '19',
                    '20',
                    '21',
                    '22',
                    '23'
                ],
                datasets: [{
                    label: 'متن',
                    data: response.text
                }, {
                    label: 'عکس',
                    data: response.image
                }, {
                    label: 'ویدیو',
                    data: response.video
                }, {
                    label: 'صوت',
                    data: response.voice
                }]
            })
        });
        post('/messages/chart/weekly', {
            date: now
        }, function (response) {
            drawLineChart('chart-msg-thisweek', {
                labels: [
                    'شنبه',
                    'یکشنبه',
                    'دوشنبه',
                    'سه شنبه',
                    'چهارشنبه',
                    'پنجشنبه',
                    'جمعه'
                ],
                datasets: [{
                    label: 'متن',
                    data: response.text
                }, {
                    label: 'عکس',
                    data: response.image
                }, {
                    label: 'ویدیو',
                    data: response.video
                }, {
                    label: 'صوت',
                    data: response.voice
                }]
            })
        });
        post('/messages/chart/monthly', {
            date: now
        }, function (response) {
            drawLineChart('chart-msg-thismonth', {
                labels: [
                    '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',
                    '16','17','18','19','20','21','22','23','24','25','26','27','28','29', '30', '31'
                ],
                datasets: [{
                    label: 'متن',
                    data: response.text
                }, {
                    label: 'عکس',
                    data: response.image
                }, {
                    label: 'ویدیو',
                    data: response.video
                }, {
                    label: 'صوت',
                    data: response.voice
                }]
            })
        });

        // post('/messages/chart/selectedDate', {
        //     firstday: document.getElementById('firstday'),
        //     lastday:document.getElementById('lastday')
        // }, function (response) {
        //     console.log("firstday: "+document.getElementById('firstday'))
        //     console.log("lastday: "+document.getElementById('lastday'))
        //     drawLineChart('chart-msg-selectedDate', {
        //         labels: [
        //             '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15',
        //             '16','17','18','19','20','21','22','23','24','25','26','27','28','29', '30', '31'
        //         ],
        //         datasets: [{
        //             label: 'متن',
        //             data: response.text
        //         }, {
        //             label: 'عکس',
        //             data: response.image
        //         }, {
        //             label: 'ویدیو',
        //             data: response.video
        //         }, {
        //             label: 'صوت',
        //             data: response.voice
        //         }]
        //     })
        // });

    }); // end of document ready
})(jQuery); // end of jQuery name space