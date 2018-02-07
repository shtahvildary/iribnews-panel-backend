// var jalaali = require('jalaali-js')
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
    $("#btnShow").click(function () {
        console.log('btnSave click...')
    
    var firstday=jing($("#fYear").val(),$("#fMonth").val(),$("#fDay").val(),false)
    var fDay=$("#fDay").val();
    var fMonth=$("#fMonth").val();
    var fYear=$("#fYear").val();
    var lastday=jing($("#lYear").val(),$("#lMonth").val(),$("#lDay").val(),false)
    var lDay=$("#lDay").val();
    var lMonth=$("#lMonth").val();
    var lYear=$("#lYear").val();
    
    post('/messages/chart/selectedDate', {
        firstday,
        lastday
    }, function (response) {
        console.log('response: ',response)
        drawLineChart('chart-msg-selectedDate', {
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
})
    $(function () {
        // var months = {
        //     '1' : 'فروردین',
        //     '2' : 'اردیبهشت',
        //     '3' : 'خرداد',
        //     '4' : 'تیر',
        //     '5' : 'مرداد',
        //     '6' : 'شهریور',
        //     '7' : 'مهر',
        //     '8' : 'آبان',
        //     '9' : 'آذر',
        //     '10' : 'دی',
        //     '11' : 'بهمن',
        //     '12' : 'اسفند',
        // };
        // jQuery(months).each(function(i,month){
        //     jQuery('.month').append(`<option>`+month[i]+`</option>`)
        // })
        // var selectedOption = '12';

        // var select = $('#fMonth');
        // if(select.prop) {
        //   var options = select.prop('options');
        // }
        // else {
        //   var options = select.attr('options');
        // }
        // $('option', select).remove();

        // $.each(months, function(val, text) {
        //     options[options.length] = new Option(text, val);
        // });
        // select.val(selectedOption);


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
                    '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
                    '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'
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
        
        
   
    }); // end of document ready
})(jQuery); // end of jQuery name space