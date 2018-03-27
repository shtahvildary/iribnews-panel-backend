(function ($) {

    var result = []

    post('/competitions/all/result', {}, function (response) {
        var {
            competitions
        } = response
        competitions.map(item => {
            result.push(item)
        })
        console.log(result)
    })

    function revealAppend(competitionId) {
        console.log(competitionId)
        // console.log("result:::: ",result[0])
        var answers = {}
        for (var i = 0; i < result.length; i++) {
            if (result[i].competitionId == competitionId) {
                var answers= {totalCount:result[i].totalCount,totalCorrectAnswers:result[i].totalCorrectAnswers};
                return answers;
            }
        }
         return 0;
    }


    $(function () {})
    post('/competitions/all', {}, function (response) {
        // console.log('response: ',response)
        response.competitionsArray.map(function (item) {
            console.log('item: ', item)
            var answers=[]
            

            $('#competitionsResult-list').append(`
                <div class="card rtl">
                    <div class="card-content activator ">
                        <span class="activator grey-text text-darken-4"> ` + item.title + `<i class="material-icons left">more_vert</i></span>
                        <p>سوال: ` + item.question + `</p> 
                        <div id="answers">
                        <p>پاسخ ها:</p>
                        </div>
                        
                        </div> 
                    <div class="card-reveal" >
                        <span class=" grey-text text-darken-4">` + item.title + `<i class="material-icons right">close</i></span>
                        <p id="result-` + item._id + `"></p>
                    </div>
                </div>

                `);
                item.keyboard.map(function(keyboard){
                    console.log(keyboard)
                
            $('#answers').append(`
                
                <p `+(keyboard.correctAnswer?`style="color:green;"`:"")+`>‍` + keyboard.text + `</p> 
           
            `);
        })
            
           

            var competition = revealAppend(item._id)
            console.log('competition: ', competition)
            if (competition==0) $('#result-' + item._id).append(`<p>تا کنون پاسخی ثبت نشده است.</p>`)
            else $('#result-' + item._id).append(
                `<p>تعداد شرکت کنندگان:` + competition.totalCount + 
                `<p>تعداد پاسخ های درست:` + competition.totalCorrectAnswers + 
                `<p id="answers-`+ item._id+`"></p>
              </div> `)

            //   jQuery(competition.answers).each(function (i, answer) {

            //     jQuery('#answers-'+ item._id).append(answer.text + ` :   `+answer.percent+`%</p>
            //      `);
            // });
        })
        
    })

})
(jQuery);