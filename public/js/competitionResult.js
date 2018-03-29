(function ($) {

    var result = []

    post('/competitions/all/result', {}, function (response) {
        var {
            competitions
        } = response
        competitions.map(item => {
            result.push(item)
        })
    })

    function revealAppend(competitionId) {
        var answers = {}
        for (var i = 0; i < result.length; i++) {
            if (result[i].competitionId == competitionId) {
                var answers = { totalCount: result[i].totalCount, totalCorrectAnswers: result[i].totalCorrectAnswers };
                return answers;
            }
        }
        return 0;
    }

    $(function () { })
    post('/competitions/all', {}, function (response) {
        response.competitionsArray.map(function (item) {
            var answers = []
            $('#competitionsResult-list').append(`
                <div class="card rtl">
                    <div class="card-content activator ">
                        <span class="activator grey-text text-darken-4"> ` + item.title + `<i class="material-icons left">more_vert</i></span>
                        <p>سوال: ` + item.question + `</p> 
                        <div id="answers-` + item._id + `">
                            <p>پاسخ ها:</p>
                            <p>
                        </div>
                    </div> 
                    <div class="card-reveal" >
                        <span class=" grey-text text-darken-4">` + item.title + `<i class="material-icons right">close</i></span>
                        <p id="result-` + item._id + `"></p>
                    
                </div>
                `);

            var competition = revealAppend(item._id)
            if (competition == 0) $('#result-' + item._id).append(`<p>تا کنون پاسخی ثبت نشده است.</p>`)
            else $('#result-' + item._id).append(
                `<p>تعداد شرکت کنندگان:` + competition.totalCount +
                `<p>تعداد پاسخ های درست:` + competition.totalCorrectAnswers +
                `</div> `)
            jQuery(item.keyboard).each(function (i, keyboard) {
                var style = ""
                if (keyboard.correctAnswer) style = "color:green;"
                jQuery('#answers-' + item._id).append(
                    `<p style="` + style + `">‍` + keyboard.text + `</p>                
                    ` );

            })
        })
    })
})
    (jQuery);