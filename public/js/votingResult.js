(function ($) {

//     var search_message = function (query) {

//         post('/messages/search', {
//             query: query
//         }, function (response) {
//             console.log('search messages', response)
//             $('#messages-list').empty();
//             response.messages.map(function (item) {
//                 $('#messages-list').append(`
//                 <div class="card ` + (item.replys.length > 0 ? '' : 'grey') + `">

                

//                 <span class="card-title">Card Title</span>
//               </div>
//                 <div class="card-content">
                
//                   <p>` + item.message + `</p>
//                   <p>تاریخ :` + item.date + `</p>
//                   <a class="waves-effect waves-light btn modal-trigger reply" id="btnReply-` + item._id + `" href="#replyModal">پاسخ
//                   <i class="material-icons">reply</i></a>

//                 </div>
                
//               </div>`);
//             });
//         })
//     }
     $(function () {
        if (!$.cookie("token")) {
            window.location.replace("login2.html");
        }

//         $('#search').keypress(function (e) {
//             if (e.which == 13) {
//                 var value = $('#search').val();
//                 console.log('query', {
//                     text: value
//                 })
//                 search_message(value);
//                 return false; //<---- Add this line
//             }
//         });

         post('/votes/all/scores', {}, function (response) {
            console.log('all votes', response)
//             var reply;

            
            response.votesArray.map(function (item) {
                console.log(item)

                $('#votingResult-list').append(`
                <div class="card">
                

                <div class="card-content activator ">
                <p>"` + item.vote.destinationId.title + `" از آرای ثبت شده ` + item.vote.score + ` امتیاز کسب کرده است.</p>
                 
                </div>   
                </div>`);
                
                })
            })
        })
    
    })
(jQuery);