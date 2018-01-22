
//  <a class="waves-effect waves-light btn modal-trigger reply" id="btnReply-` + item._id + `" chatId="` + item.chatId + `" msgId="` + item._id + `" href="#replyModal">پاسخ
//  <i class="material-icons">reply</i></a>

(function ($) {
    const fileserver = "http://localhost:9000";

    var search_message = function (query) {

        post('/messages/search', {
            query: query
        }, function (response) {
            // console.log('search messages', response)
            $('#messages-list').empty();
            response.messages.map(function (item) {
                cardsAppend(item);
            });
        })
    }
    $(function () {
        // if ($.cookie("token")&&!$.cookie("id")) {
        //     window.location.replace("../login.html");
        // }
        $('#search').keypress(function (e) {
            if (e.which == 13) {
                var value = $('#search').val();
                // console.log('query', {
                //     text: value
                // })
                search_message(value);
                return false; //<---- Add this line
            }
        });

        post('/messages/select/all/date', {}, function (response) {
            // console.log('all messages', response)
            var reply;
            response.messages.map(function (item) {

                console.log('path: ', item.filePath)
                console.log('item: ', item.message)
                cardsAppend(item, response.userId);

            });
        })
    });

    function replyToMsg(reply) {
        // console.log('replyToMsg: ', reply);

        post('/messages/reply', {
            _id: reply.msgId,
            // chatId: reply.chatId,

            text: reply.text,
            userId: reply.userId

        }, function (response) {
            // console.log('message which U replied:', response);

        })
    }
    function cardsAppend(item, userId) {
        $('#messages-list').append(`
                    <div class="card " style="` + (item.replys.length > 0 ? 'background-color:#d8d8d8' : '') + `">
                    <div class="card-content activator ">
                    <div class="container">
                        <div class="row">
                            <div class="col m6">
                            <p>
                            ` + (item.type == 'video' ? '<video class="responsive-video" style="max-width:100%" controls><source src="' + fileserver + `/` + item.filePath + '" type="video/mp4"></video>' :
            (item.type == 'photo' ? '<img style="max-width:100%" src="' + fileserver + `/` + item.filePath + '" alt="" class=" responsive-img">' :
                (item.type == 'voice' || item.type == 'audio' ? '<audio controls><source src="' + fileserver + `/` + item.filePath + '" type="audio/mp3"></audio><p><i class="material-icons"></i></p></a>' :
                    (item.type == 'document' ? '<a href="' + fileserver + `/` + item.filePath + '" alt="" download> دانلود</a>' : '')))) + `</p>
    
                            </div>
    
                            <div class="col m6">
                                <p>` + (item.type == 'video' ? item.caption + `<p><i class="material-icons">movie</i></p>` :
            (item.type == 'photo' ? item.caption + `<p><i class="material-icons">photo</i></p>` :
                (item.type == 'voice' || item.type == 'audio' ? item.audioTitle + `<p><i class="material-icons">audiotrack</i></p>` :
                    (item.type == 'text' ? item.message :
                        (item.type == 'document' ? item.fileName : ''))))) + `</p>
                                <p>تاریخ :` + item.date + `</p>
                            </div>
                        </div>
                    </div>
                    
                    
                      <a class="waves-effect waves-light btn modal-trigger reply" id="btnReply-` + item._id + `" item="`+item+`" chatId="` + item.chatId + `" msgId="` + item._id + `" href="#replyModal">مشاهده
                      <i class="material-icons">reply</i></a>
                      
                    </div>
                    ` + (item.replys.length > 0 ? (` <div class="card-reveal"><span class="card-title grey-text text-darken-4 >پاسخها<i class="material-icons right">close</i></span><p id="replys-` + item._id + `">
                    
                   </p></div>`) : '') + `
                    </div>`);
        jQuery(item.replys).each(function (i, reply) {
            jQuery('#replys-' + item._id).append(`<p> کاربر` + reply.userId.username + ' در تاریخ ' + reply.date + '    در پاسخ به این پیام گفته است: ' + reply.text + `</p>`);

        });

        $('#replys-' + item._id).click(function (e) {

            replys = $(this).attr(item.replys);
            // console.log(replys)

        })
        // btnReply-` + item._id + `
        $('#btnReply-' + item._id ).click(function (e) {
            reply = {
                msgId: $(this).attr('msgId'),
                //chatId: $(this).attr('chatId'),
                text: "",
                userId: userId
            }
         
            
            cardsAfter(item);
            // $('#btnReply-' + item._id).modal();
            // $('.reply').modal();
            $('#replyModal').modal();

            $('#btnSendReply').click(function (e) {

                reply.text = $('#replyTxt').val();

                if (replyToMsg(reply)) {
                    // if (status==true) {
                    $('#replyModal').modal('close');
                    alert("ارسال پیام با موفقیت انجام شد.");
                } else {
                    alert("پیام شما ارسال نشدء لطفا دوباره اقدام نمایید. کدخطا: " + status)
                }
            })
        })
    }

    function cardsAfter(item) {
        console.log('item._id in cardsAfter: ',item);
        // console.log('userId in cardsAfter: ',userId);
        $('#messages-list').after(`
        
        <!-- Modal Trigger -->
        <div id="replyModal" class="modal reply">
            <div class="modal-content">
                <h5>پیام</h5>
                <p>
                        <form>
                        <div class="col m6">
                        <p>
                        
                        ` + (item.type == 'video' ? '<video class="responsive-video" style="max-width:100%" controls><source src="' + fileserver + `/` + item.filePath + '" type="video/mp4"></video>' :
        (item.type == 'photo' ? '<img style="max-width:100%" src="' + fileserver + `/` + item.filePath + '" alt="" class=" responsive-img">' :
            (item.type == 'voice' || item.type == 'audio' ? '<audio controls><source src="' + fileserver + `/` + item.filePath + '" type="audio/mp3"></audio><p><i class="material-icons"></i></p></a>' :
                (item.type == 'document' ? '<a href="' + fileserver + `/` + item.filePath + '" alt="" download> دانلود</a>' : '')))) + `</p>

                        </div>

                        <div class="col m6">
                        <p>` + (item.type == 'video' ? item.caption + `<p><i class="material-icons">movie</i></p>` :
    (item.type == 'photo' ? item.caption + `<p><i class="material-icons">photo</i></p>` :
        (item.type == 'voice' || item.type == 'audio' ? item.audioTitle + `<p><i class="material-icons">audiotrack</i></p>` :
            (item.type == 'text' ? item.message :
                (item.type == 'document' ? item.fileName : ''))))) + `</p>
                        <p>تاریخ :` + item.date + `</p>
                    </div>
                </div>
            </div>
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
        </div>`);
    }
})(jQuery);

