(function ($) {

    var result = []
    post('/surveys/all/result', {}, function (response) {
        var {
            surveys
        } = response
        surveys.map(item => {
            result.push(item)
        })
    })

    function revealAppend(surveyId) {
        var answers = {}
        for (var i = 0; i < result.length; i++) {
            if (result[i].surveyId == surveyId) {
                var answers = { totalCount: result[i].totalCount, answers: result[i].answers };
                return answers;
            }
        }
        return 0;
    }

    function cardsAppend(response) {
        response.surveysArray.map(function (item) {
            $('#surveysResult-list').append(`
                <div class="card rtl">
                    <div class="card-content activator ">
                        <span class="activator grey-text text-darken-4"> ` + item.title + `<i class="material-icons left">more_vert</i></span>
                        <p>سوال: ` + item.text + `</p> 
                        <p>پاسخها: ` + item.keyboard + `</p> 
                    </div> 
                    <div class="card-reveal" >
                        <span class="card-title  grey-text text-darken-4">` + item.title + `<i class="material-icons right">close</i></span>
                        <p id="result-` + item._id + `"></p>
                    </div>
                </div>
                `);

            var survey = revealAppend(item._id)
            if (survey == 0) $('#result-' + item._id).append(`<p>تا کنون نظری ثبت نشده است.</p>`)
            else $('#result-' + item._id).append(
                `<p>مجموع آرای ثبت شده:` + survey.totalCount +
                `<p id="answers-` + item._id + `"></p>
              </div> `)

            jQuery(survey.answers).each(function (i, answer) {
                jQuery('#answers-' + item._id).append(answer.text + ` :   ` + answer.percent + `%</p>
                 `);
            });
        })
    }

    var search_surveys = function (query, departmentId, voteItemId) {

        post('/surveys/search', {
            query, departmentId, voteItemId
        }, function (response) {
            $('#surveysResult-list').empty();
            if (response.surveysArray.length == 0)
                $("#surveysResult-list").append(`<div class="rtl">نتیجه ای یافت نشد.</div>`);

            else
                cardsAppend(response)
        })
    }
    $(function () {
        //search in surveys list   
        $('#search').keypress(function (e) {
            var departmentId, voteItemId
            if (e.which == 13) {
                var value = $('#search').val();
                // if ($("#drpDepartments").val() != "all")
                departmentId = $("#drpDepartments").val();
                voteItemId = $("#drpVoteItems").val();
                search_surveys(value, departmentId, voteItemId);
                return false;
            }
        });
    })
    post('/surveys/all', {}, function (response) {
        cardsAppend(response)
    })
    
    $("#drpVoteItems").change(function () {
        var departmentId, voteItemId;
        var value = $("#search").val();
        if ($("#drpDepartments").val() != "all")
            departmentId = $("#drpDepartments").val();
        if ($("#drpVoteItems").val() != "all")
            voteItemId = $("#drpVoteItems").val();
        search_surveys(value, departmentId, voteItemId);
    });
})
    (jQuery);