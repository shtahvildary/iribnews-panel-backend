(function ($) {

    $(function () {
        post('/messages/select/last/date', { token: $.cookie("token") }, function (response) {
            response.messages.map(function (item) {
                $('#last-messages').append(`<li class="collection-item">
            <p class="truncate ">`+ (item.isSeen.length == 0 ? `<b>` : "") + (item.type == 'video' ? '<i class="material-icons">movie</i>'+ (item.caption?item.caption:"فیلم") :
                        (item.type == 'photo' ? '<i class="material-icons">photo</i>'+(item.caption? item.caption:"عکس ")  :
                            (item.type == 'voice' || item.type == 'audio' ? '<i class="material-icons">audiotrack</i>'+(item.audioTitle?item.audioTitle:"صدا") :
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