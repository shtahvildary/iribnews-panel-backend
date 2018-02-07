(function ($) {

    $(function () {
        post('/messages/select/last/date',{token:$.cookie("token")},function(response){
            // console.log({token:$.cookie("token")})
            // console.log('last messages',response)
            response.messages.map(function(item){
            $('#last-messages').append(`<li class="collection-item">
            
            <p>` + (item.type == 'video' ? item.caption+ `<p><i class="material-icons">movie</i></p>`:
            (item.type == 'photo' ? item.caption+`<p><i class="material-icons">photo</i></p>` :
            (item.type == 'voice'||item.type =='audio'? item.audioTitle+`<p><i class="material-icons">audiotrack</i></p>` :
            (item.type == 'text' ? item.message :
            (item.type == 'document' ? item.fileName :'')))))+ `</p>
            
          </li>`);
          });
        })


        // last-surveys

        post('/surveys/select/last/date',{token:$.cookie("token")},function(response){
            // console.log({token:$.cookie("token")})
            // console.log('last messages',response)
            response.surveys.map(function(item){
                console.log('last survey',item)
                $('#last-surveys').append(`
                <div class="card rtl">
                    <div class="card-content activator ">
                        <p>سوال: ` + item.text + `</p> 
                        <p>پاسخها: ` + item.keyboard + `</p> 
                    </div> 
                    <div  id="reveal-result-`+item._id+`">
                    </div>
                </div>
                `);
            
          });
        })
   });
})(jQuery);