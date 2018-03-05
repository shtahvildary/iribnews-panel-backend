(function ($) {

     $(function () {
    

        post('/votes/all/scores', {}, function (response) {
            // console.log('all votes', response)
//             var reply;
            
            response.votesArray.map(function (item) {
                // console.log(item)

                $('#votingResult-list').append(`
                <div class="card rtl">
                <div class="card-content activator ">
                <p>"` + item.title + `" از  `+item.count+` ر‌ای ثبت شده ` + item.score + ` امتیاز کسب کرده است.</p> 
                </div>   
                </div>`);
                
                })
            })
            $('.pNums').persiaNumber();
        })
  
    })
(jQuery);