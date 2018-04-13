// function searchFilter(checkbox) { }
(function ($) {
  const fileserver = "http://localhost:9000";
  // const fileserver = "http://172.16.17.149:9000";



  var search_message = function (query, filters) {
    post(
      "/messages/search",
      {
        filters: filters,
        query: query
      },
      function (response) {
        $("#messages-list").empty();
        if(response.messages.length==0)
        $("#messages-list").append(`<div class="rtl">
        نتیجه ای یافت نشد.
        </div>`);
        else
        
        response.messages.map(function (item) {
          cardsAppend(item);
        });
      }
    );
  };



  $(function () {

    ///////////////////////////////////search filters///////////////////////////////////
    var filters = {
      messages: 1,
      // replys: 1,
      photos: 1,
      movies: 1,
      voices: 1,
      documents: 1
    };

    $("#cbxMessages").change(function () {
      if ($("#cbxMessages").is(":checked")) filters.messages = 1;
      else filters.messages = 0;
      search_message($("#search").val(), filters);
    });

    // $('#cbxReplys').change(function () {
    //     console.log($('#cbxMessages').val())
    //     if ($('#cbxReplys').is(":checked")) filters.replys = 1
    //     else filters.replys = 0
    //     console.log(filters)
    //     search_message($('#search').val(),filters)
    // })

    $("#cbxPhotos").change(function () {

      if ($("#cbxPhotos").is(":checked")) filters.photos = 1;
      else filters.photos = 0;

      search_message($("#search").val(), filters);
    });

    $("#cbxMovies").change(function () {

      if ($("#cbxMovies").is(":checked")) filters.movies = 1;
      else filters.movies = 0;

      search_message($("#search").val(), filters);
    });

    $("#cbxVoices").change(function () {
      if ($("#cbxVoices").is(":checked")) filters.voices = 1;
      else filters.voices = 0;
      search_message($("#search").val(), filters);
    });
    $("#cbxDocs").change(function () {
      if ($("#cbxDocs").is(":checked")) filters.documents = 1;
      else filters.documents = 0;
      search_message($("#search").val(), filters);
    });
    ///////////////////////////////////search///////////////////////////////////

    $("#search").keypress(function (e) {
      if (e.which == 13) {
        var value = $("#search").val();
        search_message(value, filters);
        return false; //<---- Add this line
      }
    });

    post("/messages/select/all/date", {}, function (response) {
      var reply;
      response.messages.map(function (item) {
        cardsAppend(item, response.userId);
      });
    });
  });

  function replyToMsg(reply, callback) {
    var formData=new FormData();
    formData.append("_id",reply.msgId)
    formData.append("text",reply.text)
    formData.append("userId",reply.userId)
    formData.append("file",document.getElementById("inputFile-"+reply.msgId).files[0])
    post(
      "/messages/reply/new",
      {formData},
      function (response) {
        if (response.sentMessage) callback(true);
        else callback(false);
      }
    );
  }
  function editReply(reply, callback) {
    post(
      "/messages/reply/edit",
      {
        _id: reply.msgId,
        message_id: reply.message_id,
        text: reply.text
      },
      function (response) {
        if (response.updatedMessage) callback(true);
        else callback(false);
      }
    );
  }
  function fillUsersList() {
    var usersList;
    post("/users/all", {}, response => {
      usersList = response.usersArray;
      $(usersList).each(function (i, user) {
        $("#cbxUsersList").append(
          `<p>
              <input type="checkbox" id="cbxUser-` + i + `" value="` + user._id + `"/>
              <label for="cbxUser-` + i + `">` + user.firstName + ` ` + user.lastName + `</label>
          </p>`
        );
      });
    });
  }

  function cardsAppend(item, userId) {
    if (!item.pin[0]) item.pin[0]= {};
    var alarmBorder;
    var today = new Date();
    if (item.isSeen == 0 && (today.getTime() - new Date(item.date).getTime() > 60 * 60 * 24 * 1000)) alarmBorder = true;
    $("#messages-list").append(
      `
                    <div class="card overflow" style="` +
      (item.replys.length > 0 ? "background-color:#d8d8d8" : (alarmBorder ? "border:5px solid #FFBD33; margin-top:10px; " : "")) +
      `">
                    <div class="card-content activator ">
                    <div class="container ">
                        <div class="row">
                            <div class="col m6  ">                           
                            <p >` +
      (item.type == "video"
        ? '<video class="responsive-video" style="max-width:50%" ><source src="' +
        fileserver +
        `/` +
        item.filePath +
        '" type="video/mp4"></video>'
        : item.type == "video_note"
          ? '<video class="responsive-video" style="max-width:50%" ><source src="' +
          fileserver +
          `/` +
          item.filePath +
          '" type="video/mp4"></video>'
          : item.type == "photo"
            ? '<img style="max-width:50%" src="' +
            fileserver +
            `/` +
            item.filePath +
            '" alt="" class=" responsive-img">'
            : item.type == "voice" || item.type == "audio"
              ? '<audio><source src="' +
              fileserver +
              `/` +
              item.filePath +
              '" type="audio/mp3"></audio><p><i class="material-icons"></i></p></a>'
              : "") +
      `</p>
                            </div>
    
                            <div class="col m6 ">
                                <p>` +
      (item.type == "video"
        ?  item.caption + `<p><i class="material-icons">movie</i></p>`
        : item.type == "video_note"
          ?  item.caption + `<p><i class="material-icons">movie</i></p>`
          : item.type == "photo"
            ? item.caption + `<p><i class="material-icons">photo</i></p>`
            : item.type == "voice" || item.type == "audio"
              ?  item.audioTitle +
              `<p><i class="material-icons">audiotrack</i></p>`
              : item.type == "text"
                ? item.message
                : item.type == "sticker"
                  ? item.emoji
                  : item.type == "document"
                    ? item.fileName +
                    `<p><i class="material-icons">insert_drive_file</i></p>`
                    : "") +
      `</p>
                                <p>تاریخ :` +
      gregorian_to_jalali(new Date(item.date)) +
      `</p>
                                <p>ساعت :` +
      new Date(item.date).getHours() +
      `:` +
      new Date(item.date).getMinutes() +
      `:` +
      new Date(item.date).getSeconds() +
      `</p>
        <p>واحد: `+ item.departmentId.title + `
                                
                            </div>
                        </div>
                    </div>
                    
                      <a class="waves-effect waves-light btn modal-trigger view " id="btnView-` +
      item._id +
      `" item="` +
      item +
      `" chatId="` +
      item.chatId +
      `" msgId="` +
      item._id +
      `" href="#viewModal">مشاهده
                      <i class="material-icons">reply</i></a>
                      ` +
      (item.isSeen.length > 0
        ? `<a id="icnIsSeen-` +
        item._id +
        `" class="modal-trigger" href="#isSeenModal"><img class="msg-icons isSeen"  src="../icons/icons8-double-tick-50.png" ></a>`
        : ``) +
      `
                      <a id="icnPin-` +
      item._id +
      `" class="modal-trigger " href="#pinModal"><img class="msg-icons pin"   ` +
      (item.pin[0].status ==1 
        ? ` src="../icons/pin-blue.png" >`
        : `src="../icons/pin-gray.png" >`) +
      `</a>
                      
                    </div>
                    
                    </div>`
    );


    $("#replys-" + item._id).click(function (e) {
      replys = $(this).attr(item.replys);
    });
    function isSeenModal(item) {
      $("#messages-list").after(`
            <div id="isSeenModal" class="modal isSeen modal-fixed-footer">
                <div class="modal-content rtl ">
                    <h5>کاربرانی که این پیام را مشاهده کرده اند:</h5>
                    <form id="isSeenForm"  >
                    </form>
                    
                    <div class="modal-footer">
                        <button class="btn waves-effect waves-light modal-close">انصراف
                            <i class="material-icons right">cancel</i>
                        </button>
                    </div>
                </div>
            </div>
        
            `);

      jQuery(item.isSeen).each(function (i, item) {
        jQuery("#isSeenForm").append(
          `<p > کاربر` +
          item.userId.username +
          " در تاریخ " +
          gregorian_to_jalali(new Date(item.date)) +
          ` و در ساعت ` +
          new Date(item.date).getHours() +
          `:` +
          new Date(item.date).getMinutes() +
          `:` +
          new Date(item.date).getSeconds() +
          ` این پیام را خوانده است.   </p>`
        );
        $('.pNums').persiaNumber();
      });

    }

    $("#icnIsSeen-" + item._id).click(function (e) {
      isSeenModal(item);
      $("#isSeenModal").modal();
    });
    // $(".pinmdl").click(function(e) {
    $("#icnPin-" + item._id).click(function (e) {
      // showPinModal(item);
      // // $("#pinModal").modal();
      // $("#pinModal").modal();
      
      if(item.pin[0].status==1) var newStatus=0;
      else var newStatus=1;
      
      post("/messages/pin",{_id:item._id,pin:newStatus},function(response){
        if (response.error) return alert(
          "خطا! لطفا دوباره اقدام نمایید." 
        );
        else location.reload();
      })
    });

    $("#btnView-" + item._id).click(function (e) {
      var msgId = $(this).attr("msgId");
      post(
        "/messages/isSeen",
        {
          _id: msgId
        },
        function (response) { }
      );
      reply = {
        msgId: msgId,
        //chatId: $(this).attr('chatId'),
        text: "",
        userId: userId
      };

      cardsAfter(item);
      // $('#btnView-' + item._id).modal();
      // $('.reply').modal();
      $("#viewModal").modal();
      $('.materialboxed').materialbox();


      $("#btnSendReply").click(function (e) {
        reply.text = $("#replyTxt").val();
        replyToMsg(reply, function (sentMessage) {
          if (sentMessage == true) {
            $("#viewModal").modal("close");
            location.reload();
            return alert("ارسال پیام با موفقیت انجام شد.");
          }
          return alert("پیام شما ارسال نشد. لطفا دوباره اقدام نمایید. ");
        });
      });

    });
    $('.pNums').persiaNumber();
  }

  function cardsAfter(item, userId) {
    $("#messages-list").after(
      `
        
        <!-- Modal Trigger -->
        <div id="viewModal" class="modal view modal-fixed-footer">
            <div class="modal-content">
                <h5>پیام</h5>
                <p>
                        <form>
                        <div class="col m6">
                        <p>` +
      (item.type == "video"
        ? '<video class="responsive-video" style="max-width:100%" controls><source src="' +
        fileserver +
        `/` +
        item.filePath +
        '" type="video/mp4"></video>'
        : item.type == "video_note"
          ? '<video class="responsive-video" style="max-width:100%" controls><source src="' +
          fileserver +
          `/` +
          item.filePath +
          '" type="video/mp4"></video>'
          : item.type == "photo"
            ? '<img class="materialboxed responsive-img" style="max-width:100%" src="' +
            fileserver +
            `/` +
            item.filePath +
            '" alt="" data-caption="' + item.caption + '">'
            : item.type == "voice" || item.type == "audio"
              ? '<audio controls><source src="' +
              fileserver +
              `/` +
              item.filePath +
              '" type="audio/mp3"></audio><p><i class="material-icons"></i></p></a>'
              : item.type == "document"
                ? '<a href="' +
                fileserver +
                `/` +
                item.filePath +
                '" alt="" download> دانلود</a>'
                : "") +
      `</p>
                        </div>

                        <div class="col m6">
                        <p>` +
      (item.type == "video"
        ? item.caption + `<p><i class="material-icons">movie</i></p>`
        : item.type == "video_note"
          ? item.caption + `<p><i class="material-icons">movie</i></p>`
          : item.type == "photo"
            ? item.caption + `<p><i class="material-icons">photo</i></p>`
            : item.type == "voice" || item.type == "audio"
              ? item.audioTitle +
              `<p><i class="material-icons">audiotrack</i></p>`
              : item.type == "text"
                ? item.message
                : item.type == "document" ? item.fileName : "") +
      `</p>
                        <p>تاریخ :` +
      gregorian_to_jalali(new Date(item.date)) +
      `</p>
                        <p>ساعت :` +
      new Date(item.date).getHours() +
      `:` +
      new Date(item.date).getMinutes() +
      `:` +
      new Date(item.date).getSeconds() +
      `</p>
                        
                    </div>
                    <div class="row">
                    <div class="rtl">پاسخها</div>
                    ` +
      (item.replys.length > 0
        ? `<div id="replys-` + item._id + `"></div>`+
        (item.reply.filePath? 
            '<a href="' +
          fileserver +
          `/` +
          item.reply.filePath +
          '" alt="" download> دانلود</a>':"")
        : `تاکنون هیچ پاسخی ارسال نشده است.`) +
      `
                    </div>
           
                        <div class="row">
          
                            <div class="row">
                              <div class="input-field col s12">
                                <textarea id="replyTxt" type="text" class="materialize-textarea"></textarea>
                                <label class="active" for="description">پاسخ</label>
                                <div class="file-field input-field">
                                  <div class="btn">
                                    <span>افزودن فایل</span>
                                    <input type="file"  id="inputFile-`+item._id+`" multiple>
                                  </div>
                                  <div class="file-path-wrapper">
                                    <input class="file-path validate" type="text" placeholder="Upload one file">
                                  </div>
                                </div>
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
        `
    );

    jQuery(item.replys).each(function (i, reply) {
      // jQuery('#replys-' + item._id).append(`<p> کاربر` + reply.userId.username + ' در تاریخ ' + gregorian_to_jalali(new Date(item.date)) + '  : ' + reply.text + `
      jQuery("#replys-" + item._id).append(
        `<p> کاربر` +
        reply.userId.username +
        " در تاریخ " +
        gregorian_to_jalali(new Date(item.date)) +
        ` ساعت ` +
        new Date(item.date).getHours() +
        `:` +
        new Date(item.date).getMinutes() +
        `:` +
        new Date(item.date).getSeconds() +
        "  : " +
        reply.text +
        `
             <a class="btn waves-effect waves-light" id="replyEdit-` +
        reply._id +
        `">
            <i class="material-icons right">edit</i>
         </a></p>`
      );
      $("#replyEdit-" + reply._id).click(function (e) {
        $("#replyTxt").val(reply.text);
        $("#replyTxt").trigger("autoresize");

        $("#messageModalFooter").append(`
                <button class="btn waves-effect waves-light" id="btnUpdateReply">ارسال
                    <i class="material-icons right">send</i>
                </button>
            `);

        $("#btnSendReply").remove();

        $("#btnUpdateReply").click(function (e) {
          reply.text = $("#replyTxt").val();
          reply.msgId = item._id;
          editReply(reply, function (updatedMessage) {
            if (updatedMessage == true) {
              $("#viewModal").modal("close");
              location.reload();
              return alert("ارسال پیام با موفقیت انجام شد.");
            }
            return alert(
              "پیام شما ارسال نشد. لطفا دوباره اقدام نمایید." 
            );
          });
        });
      });
    });

    function selectedUsers(checkbox) { }
  }
  //     $(document).ready(function(){
  //     $('body').on('click', '.pin', function () {
  //         console.log('PIN...')
  //         $('#pinModal').modal('open');

  //     })
  // })


})(jQuery);
