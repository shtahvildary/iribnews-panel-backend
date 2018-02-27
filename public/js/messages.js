function searchFilter(checkbox) {}
(function($) {
  const fileserver = "http://localhost:9000";
  // const fileserver = "http://172.16.17.149:9000";
  
  function fillUsersList() {
    var usersList;
    post("/users/all", {}, response => {
      usersList = response.usersArray;
      $(usersList).each(function(i, user) {
        $("#cbxUsers-list").append(
          `<p>
              <input type="checkbox" id="cbxUser-` +i +`" value="` +user._id +`"/>
              <label for="cbxUser-` +i +`">` +user.firstName +` ` +user.lastName +`</label>
          </p>`
        );
      });
    });
  }
  
  var search_message = function(query, filters) {
    post(
      "/messages/search",
      {
        filters: filters,
        query: query
      },
      function(response) {
        console.log("search messages", response);
        $("#messages-list").empty();
        response.messages.map(function(item) {
          cardsAppend(item);
        });
      }
    );
  };



  $(function() {
   
    ///////////////////////////////////search filters///////////////////////////////////
    var filters = {
      messages: 1,
      // replys: 1,
      photos: 1,
      movies: 1,
      voices: 1,
      documents: 1
    };
    // console.log(filters)

    $("#cbxMessages").change(function() {
      if ($("#cbxMessages").is(":checked")) filters.messages = 1;
      else filters.messages = 0;
      // console.log(filters)
      search_message($("#search").val(), filters);
    });

    // $('#cbxReplys').change(function () {
    //     console.log($('#cbxMessages').val())
    //     if ($('#cbxReplys').is(":checked")) filters.replys = 1
    //     else filters.replys = 0
    //     console.log(filters)
    //     search_message($('#search').val(),filters)
    // })

    $("#cbxPhotos").change(function() {
      console.log($("#cbxMessages").val());

      if ($("#cbxPhotos").is(":checked")) filters.photos = 1;
      else filters.photos = 0;

      console.log(filters);
      search_message($("#search").val(), filters);
    });

    $("#cbxMovies").change(function() {
      console.log($("#cbxMessages").val());

      if ($("#cbxMovies").is(":checked")) filters.movies = 1;
      else filters.movies = 0;

      console.log(filters);
      search_message($("#search").val(), filters);
    });

    $("#cbxVoices").change(function() {
      if ($("#cbxVoices").is(":checked")) filters.voices = 1;
      else filters.voices = 0;
      console.log(filters);
      search_message($("#search").val(), filters);
    });
    $("#cbxDocs").change(function() {
      if ($("#cbxDocs").is(":checked")) filters.documents = 1;
      else filters.documents = 0;
      console.log(filters);
      search_message($("#search").val(), filters);
    });
    ///////////////////////////////////search///////////////////////////////////

    $("#search").keypress(function(e) {
      if (e.which == 13) {
        var value = $("#search").val();
        // console.log('query', {
        //     text: value
        // })
        search_message(value, filters);
        return false; //<---- Add this line
      }
    });

    // $('.modal').modal({
    //     dismissible: true, // Modal can be dismissed by clicking outside of the modal
    //     opacity: .5, // Opacity of modal background
    //     inDuration: 300, // Transition in duration
    //     outDuration: 200, // Transition out duration
    //     startingTop: '4%', // Starting top style attribute
    //     endingTop: '10%', // Ending top style attribute
    //     ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
    //       alert("Ready");
    //       console.log(modal, trigger);
    //     },
    //     complete: function() { alert('Closed'); } // Callback for Modal close
    //   }
    // );

    post("/messages/select/all/date", {}, function(response) {
      // console.log('all messages', response)
      var reply;
      response.messages.map(function(item) {
        cardsAppend(item, response.userId);
      });
    });
  });

  function replyToMsg(reply, callback) {
    post(
      "/messages/reply/new",
      {
        _id: reply.msgId,
        // chatId: reply.chatId,
        text: reply.text,
        userId: reply.userId
      },
      function(response) {
        console.log("our response is ihihihih", response.sentMessage);
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
      function(response) {
        if (response.updatedMessage) callback(true);
        else callback(false);
      }
    );
  }

  function cardsAppend(item, userId) {
    if (!item.pin) item.pin = [];
    $("#messages-list").append(
      `
                    <div class="card " style="` +
        (item.replys.length > 0 ? "background-color:#d8d8d8" : "") +
        `">
                    <div class="card-content activator ">
                    <div class="container">
                        <div class="row">
                            <div class="col m6">                            
                            <p>` +
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
        `" class="modal-trigger" href="#pinModal"><img class="msg-icons pin"   ` +
        (item.pin.length > 0
          ? ` src="../icons/pin-blue.png" >`
          : `src="../icons/pin-gray.png" >`) +
        `</a>
                      
                    </div>
                    
                    </div>`
    );

    $("#replys-" + item._id).click(function(e) {
      replys = $(this).attr(item.replys);
      // console.log(replys)
    });
    function isSeenModal(item) {
      console.log("item.isSeen:", item.isSeen);
      $("#messages-list").after(`
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
        
            `);
      jQuery(item.isSeen).each(function(i, item) {
        jQuery("#isSeenForm").append(
          `<p> کاربر` +
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
      });
    }
    function showPinModal(item) {
      $("#messages-list").after(`
      <div class="container ">
      
                <div id="pinModal" class="modal pin modal-fixed-footer">
                  <div class="modal-content">
                    <h5>انتخاب کاربران:</h5>
                    
                    <div class="row">
                    
                    <div class="input-field col s12" id="cbxUsers-list">
               
                    </div>
                    </div>
                   
                    <div class="modal-footer">
                    <button class="btn waves-effect waves-light" id="btnSavePin">ثبت
                    <i class="material-icons right">send</i>
                </button>    
                      <button class="btn waves-effect waves-light modal-close">انصراف
                        <i class="material-icons right">cancel</i>
                      </button>
                    </div>
                  </div> 
                  </div>
                </div>`);
      fillUsersList();
      // var usersList;
      // post("/users/all", {}, response => {
      //   usersList = response.usersArray;
      //   $(usersList).each(function(i, user) {
      //     $("#cbxUsers-list").append(
      //       `<p>
      //           <input type="checkbox" id="cbxUser-` +i +`" value="` +user._id +`"/>
      //           <label for="cbxUser-` +i +`">` +user.firstName +` ` +user.lastName +`</label>
      //       </p>`
      //     );
      //   });
      // });
    }

    $("#icnIsSeen-" + item._id).click(function(e) {
      isSeenModal(item);
      $("#isSeenModal").modal();
    });
    $("#icnPin-" + item._id).click(function(e) {
      showPinModal(item);
      $("#pinModal").modal();
    });

    // btnView-` + item._id + `
    $("#btnView-" + item._id).click(function(e) {
      var msgId = $(this).attr("msgId");
      // console.log('msgID::::::::::', msgId)
      // var msgIsSeen= {
      //     msgId:msgId,
      //     userId: userId,
      //     date: Date.now(),
      // };
      post(
        "/messages/isSeen",
        {
          _id: msgId
        },
        function(response) {}
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

      $("#btnSendReply").click(function(e) {
        reply.text = $("#replyTxt").val();
        replyToMsg(reply, function(sentMessage) {
          console.log("anjam shod");
          if (sentMessage == true) {
            $("#viewModal").modal("close");
            location.reload();
            return alert("ارسال پیام با موفقیت انجام شد.");
          }
          return alert("پیام شما ارسال نشد. لطفا دوباره اقدام نمایید. ");
        });
      });
    });
  }

  function cardsAfter(item, userId) {
    // console.log('item._id in cardsAfter: ', item);
    // console.log('userId in cardsAfter: ',userId);

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
              ? '<img style="max-width:100%" src="' +
                fileserver +
                `/` +
                item.filePath +
                '" alt="" class=" responsive-img">'
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
          ? `<div id="replys-` + item._id + `"></div>`
          : `تاکنون هیچ پاسخی ارسال نشده است.`) +
        `
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
        `
    );

    jQuery(item.replys).each(function(i, reply) {
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
      $("#replyEdit-" + reply._id).click(function(e) {
        console.log(reply.text);
        $("#replyTxt").val(reply.text);
        $("#replyTxt").trigger("autoresize");

        $("#messageModalFooter").append(`
                <button class="btn waves-effect waves-light" id="btnUpdateReply">ارسال
                    <i class="material-icons right">send</i>
                </button>
            `);

        $("#btnSendReply").remove();

        $("#btnUpdateReply").click(function(e) {
          console.log("btnUpdateReply is clicked...");
          reply.text = $("#replyTxt").val();
          reply.msgId = item._id;
          editReply(reply, function(updatedMessage) {
            console.log("anjam shod");
            if (updatedMessage == true) {
              $("#viewModal").modal("close");
              location.reload();
              return alert("ارسال پیام با موفقیت انجام شد.");
            }
            return alert(
              "پیام شما ارسال نشد. لطفا دوباره اقدام نمایید. کدخطا: " + status
            );
          });
        });
      });
    });

    function selectedUsers(checkbox) {}
  }
  //     $(document).ready(function(){
  //     $('body').on('click', '.pin', function () {
  //         console.log('PIN...')
  //         $('#pinModal').modal('open');

  //     })
  // })

  
})(jQuery);
