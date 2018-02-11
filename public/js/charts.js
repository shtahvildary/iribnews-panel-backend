const chartColors = [{
    red: 35,
    green: 198,
    blue: 136
}, {
    red: 35,
    green: 18,
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


function
drawChart(element, data, options, type) {

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
        // item.backgroundColor = ['rgba(' + color.red + ',' + color.green + ',' + color.blue + ',0.7)']
        item.borderColor = ['rgba(' + border.red + ',' + border.green + ',' + border.blue + ',0.7)']
        item.borderWidth = 3;
        i++;

    })
    if (!options) {
        var options = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    }

    // console.log('options: ',options)
    var newChart = new Chart(ctx, {
        type: type,
        data: {
            labels: data.labels,
            datasets: datasets
        },
        options: options
    });
}

(function ($) {


    $("#btnShow").click(function () {

        var firstday = jing($("#fYear").val(), $("#fMonth").val(), $("#fDay").val(), false)
        var fDay = $("#fDay").val();
        var fMonth = $("#fMonth").val();
        var fYear = $("#fYear").val();
        var lastday = jing($("#lYear").val(), $("#lMonth").val(), $("#lDay").val(), false)
        var lDay = $("#lDay").val();
        var lMonth = $("#lMonth").val();
        var lYear = $("#lYear").val();

        post('/messages/chart/selectedDate', {
            firstday,
            lastday
        }, function (response) {

            var labels = Array(response.diffDays)
            var datasets = [{
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
            }, {
                label: 'مستندات',
                data: response.document
            }, ]
            var data = {
                labels,
                datasets
            };
            var options;
            drawChart('chart-msg-selectedDate', data, options, 'line')
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








        /////////////////////////////////////daily chart////////////////////////////

        var now = new Date();
        post('/messages/chart/daily', {
            date: now
        }, function (response) {
            console.log(response)
            var labels = [
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
            ]
            var datasets = [{
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
            }, {
                label: 'مستندات',
                data: response.document
            }, ]
            var data = {
                labels,
                datasets
            };
            var options;

            drawChart('chart-msg-today', data, options, 'line')
        });
        /////////////////////////////////////weekly chart////////////////////////////

        post('/messages/chart/weekly', {
            date: now
        }, function (response) {
            
            console.log('weekly response: ',response)
                var labels = [
                'شنبه',
                'یکشنبه',
                'دوشنبه',
                'سه شنبه',
                'چهارشنبه',
                'پنجشنبه',
                'جمعه'
            ]
            var datasets = [{
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
            }, {
                label: 'مستندات',
                data: response.document
            }, ]
            var data = {
                labels,
                datasets
            };
            var options;
            drawChart('chart-msg-thisweek', data, options, 'line')
        });
        /////////////////////////////////////monthly chart////////////////////////////

        post('/messages/chart/monthly', {
            date: now
        }, function (response) {
            // console.log('chart/monthly: ', response)
            var labels = [
                '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
                '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'
            ]
            var jalaliDate=gregorian_to_jalali(now)
            
            if(jalaliDate[1]<7) labels.push(31)
            /*   text: msgCounts,
            voice:audioCount,
            video:videoCount,
            image:photoCount,
            document:documentCount, */
            var datasets = [{
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
            }, {
                label: 'مستندات',
                data: response.document
            }, ]
            var data = {
                labels,
                datasets
            };
            var options;
            drawChart('chart-msg-thismonth', data, options, 'line')
        });
        /////////////////////////////////////vote chart////////////////////////////
        post('/votes/all/scores', {}, function (response) {
            var labels = []
            var percent = [];
            response.votesArray.map(item => {
                // console.log('vote-item', item)
                labels.push(item.title)
                percent.push(Math.round(item.score * 100) / (item.count * 5))

            })
            // console.log('labels: ', labels)
            // console.log('score: ', percent)
            var data = {
                labels: labels,
                datasets: [{
                    label: '%',
                    data: percent,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            }
            var options = {

                scales: {
                    // xAxes:[],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                }
            }
            //chart types: polarArea, bar, line, radar, pie, doughnut, polarArea, bubble, scatter
            drawChart('chart-vote', data, options, 'bar')

        })



        /////////////////////////////////////survey chart////////////////////////////

        post('/surveys/all', {}, function (surveys) {
           
            surveys.surveysArray.map(function (item) {
                // console.log('item: ', item)

                $('#tab-chart-survey').append(`
                <div id="goTop" class="fixed-action-btn">
                    <a class="btn-floating btn-large " color="BDBDBD" href="#top">
                        <i class="large material-icons">vertical_align_top</i>
                    </a>
                </div>
                <div class="col s12 m6">
                    <div class="card modal-trigger" href="#chartModal">
                        <div class="card-content">
                            <canvas id="chart-survey-` + item._id + `" width="400" height="400">
                        </div>
                    </div>
                </div>

                

              `);

                post('/surveys/select/one/result', {
                    surveyId: item._id
                }, function (response) {
                    var labels = []
                    if (response.totalCount > 0) {
                        var percents = [];
                        response.answers.map(answer => {
                            labels.push(answer.title)
                            percents.push(answer.percent)
                        })
                    } else {
                        labels = item.keyboard
                        var percents = Array(labels.length)
                        percents.fill(0)
                    }

                    var data = {
                        labels: labels,
                        datasets: [{
                            label: '%',
                            data: percents,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255,99,132,1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    }
                    var options = {
                        title: {
                            display: true,
                            text: item.title,
                        },
                        scales: {
                            // xAxes:[],
                            yAxes: [{
                                ticks: {
                                    beginAtZero: true
                                }
                            }],

                        }
                    }
                    $("#chart-survey-" + item._id).append(
                        drawChart("chart-survey-" + item._id, data, options, 'bar')
                    )

                    $('#chart-survey-' + item._id).click(function (e) {
                        $("#chartModal").modal();
                    })

                    // $('#tab-chart-survey').after(`
                    // <div id="chartModal" class="modal chartModal modal-fixed-footer">
                    //     <div class="modal-content">
                    //         <canvas id="chart-survey-modal-` + item._id + `" width="400" height="400">            
                    //     </div>
                    // </div>
                    // `);
                    $("#chart-survey-modal-" + item._id).append(
                        drawChart("chart-survey-modal-" + item._id, data, options, 'bar')
                    )
                })
            })
        })
    }); // end of document ready
})(jQuery); // end of jQuery name space