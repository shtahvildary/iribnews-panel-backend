(function ($) {

    var result = []
    post('/surveys/all/result', {}, function (response) {
        var {
            surveys
        } = response
        surveys.map(item => {
            result.push(item)
        })
        console.log(result)
    })

    function revealAppend(surveyId) {
        console.log(surveyId)
        var answers = {}
        for (var i = 0; i < result.length; i++) {
            if (result[i].surveyId == surveyId) {
                var answers = { totalCount: result[i].totalCount, answers: result[i].answers };
                return answers;
            }
        }
        return 0;
    }


    $(function () { })
    post('/surveys/all', {}, function (response) {
        response.surveysArray.map(function (item) {
            console.log('item: ', item)

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
    })

})
    (jQuery);