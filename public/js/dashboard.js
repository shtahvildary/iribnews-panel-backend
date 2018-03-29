(function ($) {

    $(function () {
        post('/messages/select/last/date', { token: $.cookie("token") }, function (response) {
            response.messages.map(function (item) {
                $('#last-messages').append(`<li class="collection-item">
            <p class="truncate ">`+ (item.isSeen.length == 0 ? `<b>` : "") + (item.type == 'video' ? item.caption + `<p><i class="material-icons">movie</i></p>` :
                        (item.type == 'photo' ? item.caption + `<p><i class="material-icons">photo</i></p>` :
                            (item.type == 'voice' || item.type == 'audio' ? item.audioTitle + `<p><i class="material-icons">audiotrack</i></p>` :
                                (item.type == 'text' ? item.message :
                                    (item.type == 'document' ? item.fileName : ''))))) + (item.isSeen.length == 0 ? `</b>` : "") + `</p>
            
          </li>`);
            });
        })
        // last-surveys
        post('/surveys/select/last/date', { token: $.cookie("token") }, function (response) {
            response.surveys.map(function (item) {
                $('#last-surveys').append(`
                <div class="card rtl">
                    <div class="card-content activator ">
                        <p>سوال: ` + item.text + `</p> 
                        <p>پاسخها: ` + item.keyboard + `</p> 
                    </div> 
                    <div  id="reveal-result-`+ item._id + `">
                    </div>
                </div>
                `);

            });
        })

        // last-competitions
        post('/competitions/select/last/date', { token: $.cookie("token") }, function (response) {
            response.competitions.map(function (item) {
                $('#last-competitions').append(`
                <div class="card rtl">
                    <div class="card-content activator ">
                        <p>سوال: ` + item.question + `</p> 
                        <div id="answers-` + item._id + `">
                            <p>پاسخ ها:</p>
                            <p>
                        </div>
                </div>
                `);
                jQuery(item.keyboard).each(function (i, keyboard) {
                    var style = ""
                    if (keyboard.correctAnswer) style = "color:green;"
                    jQuery('#answers-' + item._id).append(
                        `<p style="` + style + `">‍` + keyboard.text + `</p>                
                        ` );
        
                })
            });
        })
    });
})(jQuery);