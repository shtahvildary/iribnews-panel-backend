//  <a class="waves-effect waves-light btn modal-trigger reply" id="btnView-` + item._id + `" chatId="` + item.chatId + `" msgId="` + item._id + `" href="#replyModal">پاسخ
//  <i class="material-icons">reply</i></a>
//class="tooltipped" data-position="bottom" data-delay="50" data-tooltip="I am a tooltip"

// ` + (item.replys.length > 0 ? (` <div class="card-reveal"><span class="card-title grey-text text-darken-4 >پاسخها<i class="material-icons right">close</i></span><p id="replys-` + item._id + `"></p></div>`) : '') + `
function searchFilter(checkbox) {
    // if (checkbox.checked == true) {


    // } else {

    // }

}
(function ($) {
    // var jalaali = require('jalaali-js')
    const fileserver = "http://localhost:9000";

    var search_message = function (query,filters) {

        post('/messages/search', {
            filters:filters,
            query: query
        }, function (response) {
            console.log('search messages', response)
            $('#messages-list').empty();
            response.messages.map(function (item) {
                cardsAppend(item);
            });
        })
    }

    $(function () {
        ///////////////////////////////////search filters///////////////////////////////////
        var filters = {
            messages: 1,
            // replys: 1,
            photos: 1,
            movies: 1,
            voices: 1,
            documents:1,
        }
        // console.log(filters)

        $('#cbxMessages').change(function () { 
            if ($('#cbxMessages').is(":checked")) filters.messages = 1
            else filters.messages = 0
            // console.log(filters)
            search_message($('#search').val(),filters)
        })

        // $('#cbxReplys').change(function () {
        //     console.log($('#cbxMessages').val())
        //     if ($('#cbxReplys').is(":checked")) filters.replys = 1
        //     else filters.replys = 0
        //     console.log(filters)
        //     search_message($('#search').val(),filters)
        // })

        $('#cbxPhotos').change(function () {
            console.log($('#cbxMessages').val())
            
            if ($('#cbxPhotos').is(":checked")) filters.photos = 1
            else filters.photos = 0

            console.log(filters)
            search_message($('#search').val(),filters)
            

        })

        $('#cbxMovies').change(function () {
            console.log($('#cbxMessages').val())
            

            if ($('#cbxMovies').is(":checked")) filters.movies = 1
            else filters.movies = 0

           

            console.log(filters)
            search_message($('#search').val(),filters)
            

        })

        $('#cbxVoices').change(function () { 
            if ($('#cbxVoices').is(":checked")) filters.voices = 1
            else filters.voices = 0
            console.log(filters)
            search_message($('#search').val(),filters)
        })
        $('#cbxDocs').change(function () { 
            if ($('#cbxDocs').is(":checked")) filters.documents = 1
            else filters.documents = 0
            console.log(filters)
            search_message($('#search').val(),filters)
        })
        ///////////////////////////////////search///////////////////////////////////


        $('#search').keypress(function (e) {
            if (e.which == 13) {
                var value = $('#search').val();
                // console.log('query', {
                //     text: value
                // })
                search_message(value,filters);
                return false; //<---- Add this line
            }
        });

        post('/messages/select/all/date', {}, function (response) {
            // console.log('all messages', response)
            var reply;
            response.messages.map(function (item) {
                cardsAppend(item, response.userId);

            });
        })
    });

    function replyToMsg(reply) {
        // console.log('replyToMsg: ', reply);

        post('/messages/reply/new', {
            _id: reply.msgId,
            // chatId: reply.chatId,

            text: reply.text,
            userId: reply.userId

        }, function (response) {
            // console.log('message which U replied:', response);

        })
    }
    function editReply(reply){
        console.log('replyToMsg: ', reply);

        post('/messages/reply/edit', {
            /*exmaple:
{
	"_id":"5a62fea1ba1ee7221416779f",
	"message_id":224,
	"chatId":98445056,
	"text":"just 4 test!!",
	"userId":"5a509716513a501c9cce24c6"
}
example home:
{"_id":"5a61ab39b6def3171ee9992d",
	"text":"dear7",
	"message_id":"227"
	
}
*/
            _id: reply.msgId,
            // chatId: reply.chatId,
            message_id:reply.message_id,
            text: reply.text,
            userId: reply.userId

        }, function (response) {
            // console.log('message which U replied:', response);

        })
    }

    function cardsAppend(item, userId) {
        if (!item.pin) item.pin = [];
        $('#messages-list').append(`
                    <div class="card " style="` + (item.replys.length > 0 ? 'background-color:#d8d8d8' : '') + `">
                    <div class="card-content activator ">
                    <div class="container">
                        <div class="row">
                            <div class="col m6">                            
                            <p>` + (item.type == 'video' ? '<video class="responsive-video" style="max-width:50%" ><source src="' + fileserver + `/` + item.filePath + '" type="video/mp4"></video>' :
            (item.type == 'photo' ? '<img style="max-width:50%" src="' + fileserver + `/` + item.filePath + '" alt="" class=" responsive-img">' :
                (item.type == 'voice' || item.type == 'audio' ? '<audio><source src="' + fileserver + `/` + item.filePath + '" type="audio/mp3"></audio><p><i class="material-icons"></i></p></a>' :
                    ''))) + `</p>
                            </div>
    
                            <div class="col m6">
                                <p>` + (item.type == 'video' ? item.caption + `<p><i class="material-icons">movie</i></p>` :
            (item.type == 'photo' ? item.caption + `<p><i class="material-icons">photo</i></p>` :
                (item.type == 'voice' || item.type == 'audio' ? item.audioTitle + `<p><i class="material-icons">audiotrack</i></p>` :
                    (item.type == 'text' ? item.message :
                        (item.type == 'document' ? item.fileName + `<p><i class="material-icons">insert_drive_file</i></p>` : ''))))) + `</p>
                                <p>تاریخ :` + gregorian_to_jalali(new Date(item.date)) + `</p>
                                
                            </div>
                        </div>
                    </div>
                    
                      <a class="waves-effect waves-light btn modal-trigger view " id="btnView-` + item._id + `" item="` + item + `" chatId="` + item.chatId + `" msgId="` + item._id + `" href="#viewModal">مشاهده
                      <i class="material-icons">reply</i></a>
                      ` + (item.isSeen.length > 0 ? (`<a id="icnIsSeen-` + item._id + `" class="modal-trigger" href="#isSeenModal"><img class="msg-icons isSeen"  src="../icons/icons8-double-tick-50.png" ></a>`) : ``) + `
                      <a id="icnPin-` + item._id + `" class="modal-trigger" href="#pinModal"><img class="msg-icons pin"   ` + (item.pin.length > 0 ? (` src="../icons/pin-blue.png" >`) : `src="../icons/pin-gray.png" >`) + `</a>
                      
                    </div>
                    
                    </div>`);



        $('#replys-' + item._id).click(function (e) {

            replys = $(this).attr(item.replys);
            // console.log(replys)

        })
        function isSeenModal(item){
            console.log('item.isSeen:',item.isSeen)
            $('#messages-list').after(`
            <div id="isSeenModal" class="modal isSeen modal-fixed-footer ">
                <div class="modal-content rtl">
                    <h5>کاربرانی که این پیام را مشاهده کرده اند:</h5>
                    <form id="isSeenForm">
                    </form>
                    
                    <div class="modal-footer">
                        <button class="btn waves-effect waves-light modal-close">انصراف
                            <i class="material-icons right">cancel</i>
                        </button>
                    </div>
                </div>
            </div>
        
            `)
            jQuery(item.isSeen).each(function (i, item) {
                jQuery('#isSeenForm').append(`<p> کاربر` + item.userId.username + ' در تاریخ ' + gregorian_to_jalali(new Date(item.date)) + `این پیام را خوانده است.   </p>`);
    
            });
            
        }
        function pinModal(item){
            $('#messages-list').after(`
                <div id="pinModal" class="modal pin modal-fixed-footer">
                    <div class="modal-content">
                    <h5>انتخاب کاربران:</h5>
                    <p>
                            <form>
                            <p>
                        <input type="checkbox" id="cbx0-` + item._id + `" value="0" onchange='selectedUsers(this);'/>
                        <label for="cbx0-` + item._id + `">همه گروهها</label>
                        </p>
                        <p>
                        <input type="checkbox" id="cbx1-` + item._id + `" value="1" onchange='selectedUsers(this);'/>
                        <label for="cbx1-` + item._id + `">گروه مدیران</label>
                        </p>    <p>
                        <input type="checkbox" id="cbx2-` + item._id + `" value="2" onchange='selectedUsers(this);'/>
                        <label for="cbx2-` + item._id + `">گروه کاربران</label>
    
                        </p>
                            </form>
            
                            <div class="modal-footer">
                            
                                <button class="btn waves-effect waves-light modal-close">انصراف
                                   <i class="material-icons right">cancel</i>
                                </button>
                            </div>
                        </div>
                    </p>
                </div>
            </div>`)
            }
            $('#icnIsSeen-' + item._id).click(function (e) {
                isSeenModal(item);
                $('#isSeenModal').modal();

            })
        $('#icnPin-' + item._id).click(function (e) {
            pinModal(item);
            $('#pinModal').modal();

        });

        // btnView-` + item._id + `
        $('#btnView-' + item._id).click(function (e) {
            var msgId = $(this).attr('msgId');
            // console.log('msgID::::::::::', msgId)
            // var msgIsSeen= {
            //     msgId:msgId,
            //     userId: userId,
            //     date: Date.now(),
            // };
            post('/messages/isSeen', {
                _id: msgId
            }, function (response) {})
            reply = {
                msgId: msgId,
                //chatId: $(this).attr('chatId'),
                text: "",
                userId: userId,
            }



            cardsAfter(item);
            // $('#btnView-' + item._id).modal();
            // $('.reply').modal();
            $('#viewModal').modal();


            $('#btnSendReply').click(function (e) {

                reply.text = $('#replyTxt').val();
                if (replyToMsg(reply)) {
                    // if (status==true) {
                    $('#viewModal').modal('close');
                    alert("ارسال پیام با موفقیت انجام شد.");
                } else {
                    alert("پیام شما ارسال نشد. لطفا دوباره اقدام نمایید. کدخطا: " + status)
                }
            })
        })
    }

    function cardsAfter(item, userId) {
        // console.log('item._id in cardsAfter: ', item);
        // console.log('userId in cardsAfter: ',userId);

        $('#messages-list').after(`
        
        <!-- Modal Trigger -->
        <div id="viewModal" class="modal view modal-fixed-footer">
            <div class="modal-content">
                <h5>پیام</h5>
                <p>
                        <form>
                        <div class="col m6">
                        <p>` + (item.type == 'video' ? '<video class="responsive-video" style="max-width:100%" controls><source src="' + fileserver + `/` + item.filePath + '" type="video/mp4"></video>' :
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
                        <p>تاریخ :` + gregorian_to_jalali(new Date(item.date)) + `</p>
                    </div>
                    <div class="row">
                    <div class="rtl">پاسخها</div>
                    ` + (item.replys.length > 0 ? (`<div id="replys-` + item._id + `"></div>`) : `تاکنون هیچ پاسخی ارسال نشده است.`) + `
                    </div>
           
                        <div class="row">
          
                            <div class="row">
                            <div class="input-field col s12">
                                <textarea id="replyTxt" type="text" class="materialize-textarea"></textarea>
                                <label class="active" for="description">پاسخ</label>
                            </div>
                            </div>
                        </form>  
                    </div>
                    </p>
                    </div>
                    <div id="messageModalFooter" class="modal-footer">
                        <button class="btn waves-effect waves-light" id="btnSendReply">ارسال
                            <i class="material-icons right">send</i>
                        </button>
                        <button class="btn waves-effect waves-light modal-close">انصراف
                            <i class="material-icons right">cancel</i>
                        </button>
                    </div>
                </div>
            </div>
        `);
        
        jQuery(item.replys).each(function (i, reply) {
            console.log('reply: ',reply)
            // jQuery('#replys-' + item._id).append(`<p> کاربر` + reply.userId.username + ' در تاریخ ' + gregorian_to_jalali(new Date(item.date)) + '  : ' + reply.text + `
            jQuery('#replys-' + item._id).append(`<p> کاربر` + reply.userId.username + ' در تاریخ ' + gregorian_to_jalali(new Date(item.date)) + '  : ' + reply.text + `
             <button class="btn waves-effect waves-light" id="replyEdit-`+reply._id+`">
            <i class="material-icons right">edit</i>
         </button></p>`);
         $('#replyEdit-' + reply._id).click(function (e) {
             console.log(reply.text)
             $('#replyTxt').val(reply.text);
             $('#replyTxt').trigger('autoresize');

             $("#messageModalFooter").append(`
                <button class="btn waves-effect waves-light" id="btnUpdateReply">ارسال
                    <i class="material-icons right">send</i>
                </button>
            `)
                         
             $('#btnSendReply').remove()
 
             $("#btnUpdateReply").click(function(e){
                 console.log('btnUpdateReply is clicked...')
                reply.text = $('#replyTxt').val();
                reply.msgId=item._id
                if (editReply(reply)) {
                    // if (status==true) {
                    $('#viewModal').modal('close');
                    alert("ارسال پیام با موفقیت انجام شد.");
                } else {
                    alert("پیام شما ارسال نشد. لطفا دوباره اقدام نمایید. کدخطا: " + status)
                }
             })
         })
        });
 
        function selectedUsers(checkbox) {

        }


    }
    //     $(document).ready(function(){
    //     $('body').on('click', '.pin', function () {
    //         console.log('PIN...')
    //         $('#pinModal').modal('open');

    //     })
    // })


})(jQuery);