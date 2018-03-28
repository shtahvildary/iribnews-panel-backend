(function ($) {
    const fileserver = "http://localhost:9000";
    // const fileserver = "http://172.16.17.149:9000";
  
  
  
    var search_comments = function (query, filters) {
      post(
        "/comments/search",
        {
          filters: filters,
          query: query
        },
        function (response) {
          $("#comments-list").empty();
          response.comments.map(function (item) {
            cardsAppend(item);
          });
        }
      );
    };
  
  
  
    
    function fillSelectDepartment() {
        post('/departments/all', {}, function (response) {

            $("#department").append(`
            <option value="all"  selected>همه</option>
            `)
            $(response.departmentsArray).each(function (i, department) {
                $("#department").append(`
            <option value="`+ department._id + `" >` + department.title + `</option>
            `)

            })
            $('select').material_select();

        })
    }

    function fillSelectvoteItems() {
        post('/voteItems/all', {}, function (response) {

            $("#voteItems").append(`
            <option value="all"  selected>همه</option>
            `)
            $(response.voteItemsArray).each(function (i, voteItem) {
               
                $("#voteItems").append(`
            <option value="`+ voteItem._id + `"  >` + voteItem.title + `</option>
            `)

            })
            $('select').material_select();

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
        documents: 1
      };
  
      
        $( "#department" ).change(function() {
            alert( "Handler for .change() called." );
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

/////////////////////////////////////////////////////////////////////////////////
        post('/users/type', {}, function (response) {
            var userType = response.type;
            if(userType<2){
                $("#filters").append(`<div class="input-field col s6 ">
                <select id="department">
                </select>
                <label for="department">واحد:</label>
            </div>`)
            fillSelectDepartment();
            }
        fillSelectvoteItems();
    })
        


        post('/votes/all/comments', {}, function (response) {
            var commentsCount = 0;
            response.votesArray.map(function (item) {
                if (item.comment) {
                    commentsCount++;

                    $('#comments-list').append(`
                        <div class="card rtl">
                        <div class="card-content activator ">
                            <p>پیام: `+ item.comment.text + `</p>
                            <p>مربوط به: `+ item.comment.destinationId.title + ` از واحد `+item.comment.destinationId.departmentId.title+`</p>
                            <p> در تاریخ: `+ item.date + `</p>
                        </div>   
                    </div>`);
                }
            })
            if (commentsCount == 0)
                $('#comments-list').append(`تا کنون هیچ دیدگاهی ثبت نشده است.`);
        })
        $('.pNums').persiaNumber();
   
    })
})
    (jQuery);