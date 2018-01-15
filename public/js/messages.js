(function ($) {

    var search_message = function (query) {

        post('/messages/search', {
            query: query
        }, function (response) {
            console.log('search messages', response)
            $('#messages-list').empty();
            response.messages.map(function (item) {
                $('#messages-list').append(`
                <div class="card ` + (item.replys.length > 0 ? '' : 'grey') + `">

                

                <span class="card-title">Card Title</span>
              </div>
                <div class="card-content">
                
                  <p>` + item.message + `</p>
                  <p>تاریخ :` + item.date + `</p>
                  <a class="waves-effect waves-light btn modal-trigger reply" id="btnReply-` + item._id + `" href="#replyModal">پاسخ
                  <i class="material-icons">reply</i></a>

                </div>
                
              </div>`);
            });
        })
    }
    $(function () {
        if (!$.cookie("token")) {
            window.location.replace("../login.html");
        }
        $('#search').keypress(function (e) {
            if (e.which == 13) {
                var value = $('#search').val();
                console.log('query', {
                    text: value
                })
                search_message(value);
                return false; //<---- Add this line
            }
        });

        post('/messages/select/all/date', {}, function (response) {
            console.log('all messages', response)
            var reply;
            
            response.messages.map(function (item) {

                $('#messages-list').append(`
                <div class="card ` + (item.replys.length > 0 ? '' : 'grey') + `">
                

                <div class="card-content activator ">
                
                  ` + (item.type == 'video' ? '<video class="responsive-video" controls><source src="../public/files/videos/big_buck_bunny.mp4" type="video/mp4"></video>' : '') + `<p>
                  ` + (item.type == 'photo' ? '<img src="../public/files/photos/sample-1.jpg" alt="" class=" responsive-img"> <!-- notice the "circle" class --></div>' : '') + `<p>
                  ` + (item.type == ('voice' || 'music') ? '<audio controls><source src="../public/files/music/file_3.mp3" type="audio/mp3">Your browser does not support the audio element.</audio>' : '') + `<p>
                  
                  <p>` + item.message + `</p>
                  <p>تاریخ :` + item.date + `</p>
                 
                
                  <a class="waves-effect waves-light btn modal-trigger reply" id="btnReply-` + item._id + `" chatId="` + item.chatId + `" msgId="` + item._id + `" href="#replyModal">پاسخ
                  <i class="material-icons">reply</i></a>
                  
                </div>
                ` + (item.replys.length > 0 ? (` <div class="card-reveal"><span class="card-title grey-text text-darken-4 >پاسخها<i class="material-icons right">close</i></span><p id="replys-` + item._id + `">
                
               </p></div>`) : '') + `
                </div>`);
                
                jQuery(item.replys).each(function(i, reply) {
                    jQuery('#replys-'+item._id).append(`<p> کاربر:`+reply.userId.username + ' پاسخ:' + reply.text+' تاریخ:'+reply.date+`</p>`);
                   
                });
                // $('#replys-'+item._id).append(`<p>‍‍ سلام`+item.replys.map(function (reply) {+`<p>` + reply.text + `</p>کاربر:`+ reply.userId + `</p>تاریخ: `+ reply.date + `</p>`})+`</div>`);

                $('#replys-' + item._id).click(function (e) {
                    console.log('I like to show replys');
                    replys = $(this).attr(item.replys);
                    console.log(replys)

                })
            });

            $('.reply').click(function (e) {
                console.log('btn reply is clicked');
                reply = {

                    msgId: $(this).attr('msgId'),
                    //chatId: $(this).attr('chatId'),
                    text: "",
                    ////////////////////////////////////////////////////////////////////
                    // userId= .... CORRECT IT AS SOON AS POSSIBLE
                    ////////////////////////////////////////////////////////////////////
                    userId: response.userId
                    // userId: "5a16a4406fd1520f97e7ae86"


                }
                //console.log($(this).attr('replyItem'));

                $('#messages-list').after(`
        
        <!-- Modal Trigger -->
        <div id="replyModal" class="modal reply">
            <div class="modal-content">
                <h5>پاسخ</h5>
                <p>
                        <form>
                        <div class="row">
          
                            <div class="row">
                            <div class="input-field col s12">
                                <textarea id="replyTxt" type="text" class="materialize-textarea"></textarea>
                                <label class="active" for="description">پاسخ</label>
                            </div>
                            </div>
                            
                        </form>
        
                        <div class="modal-footer">
                            <button class="btn waves-effect waves-light" id="btnSendReply">ارسال
                               <i class="material-icons right">send</i>
                            </button>
                            <button class="btn waves-effect waves-light modal-close">انصراف
                               <i class="material-icons right">cancel</i>
                            </button>
                        </div>
                    </div>
                </p>
            </div>
        </div>
        `);
                $('.reply').modal();


                $('#btnSendReply').click(function (e) {

                    // reply.msgId= $(this).attr("msgId");
                    // reply.chatId= $(this).attr('chatId');
                    //reply.text = "jkjljljasga";

                    reply.text = $('#replyTxt').val();
                    ////////////////////////////////////////////////////////////////////
                    // userId= .... CORRECT IT AS SOON AS POSSIBLE
                    ////////////////////////////////////////////////////////////////////

                    console.log('reply:', reply)

                    if (replyToMsg(reply)) {
                        // if (status==true) {
                        $('#replyModal').modal('close');
                        alert("ارسال پیام با موفقیت انجام شد.");
                    } else {
                        alert("پیام شما ارسال نشدء لطفا دوباره اقدام نمایید. کدخطا: " + status)
                    }
                })
            })
        })

        function replyToMsg(reply) {
            console.log('replyToMsg: ', reply);

            post('/messages/reply', {
                _id: reply.msgId,
                // chatId: reply.chatId,

                text: reply.text,
                userId: reply.userId

            }, function (response) {
                console.log('message which U replied:', response);

            })
        }


    });
})(jQuery);