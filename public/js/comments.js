(function($) {
  const fileserver = "http://localhost:9000";
  // const fileserver = "http://172.16.17.149:9000";

  var search_comments = function(query, departmentId, voteItemId) {
    post(
      "/votes/search/comments",
      {
        departmentId: departmentId,
        voteItemId,
        query: query
      },
      function(response) {
        $("#comments-list").empty();
        if (response.votesArray.length == 0) {
          $("#comments-list").append(`نتیجه ای یافت نشد.`);
        } else
          // else response.comments.map(function(item) {
          //   cardsAppend(item);
          // });
          console.log(response)
          cardsAppend(response);
      }
    );
  };

  function fillSelectDepartment() {
    post("/departments/all", {}, function(response) {
      $("#drpDepartments").append(`
            <option value="all"  selected>همه</option>
            `);
      $(response.departmentsArray).each(function(i, department) {
        $("#drpDepartments").append(
          `
            <option value="` +
            department._id +
            `" >` +
            department.title +
            `</option>
            `
        );
      });
      $("select").material_select();
    });
  }

  function fillSelectvoteItems(deparments) {
    var route;
    var data;
    if (deparments == "all") {
      route = "/voteItems/all";
    } else {
      route = "/voteItems/search";
      data = { departmentId: deparments };
    }
    post(route, data, function(response) {
      $("#drpVoteItems").empty();
      $("#drpVoteItems").append(`
            <option value="all"  selected>همه</option>
            `);
      $(response.voteItemsArray).each(function(i, voteItem) {
        $("#drpVoteItems").append(
          `
            <option value="` +
            voteItem._id +
            `"  >` +
            voteItem.title +
            `</option>
            `
        );
      });
      $("select").material_select();
    });
  }
  function cardsAppend(response) {
    var commentsCount = 0;
    response.votesArray.map(function(item) {
      if (item.comment) {
        commentsCount++;
        $("#comments-list").append(
          `
            <div class="card rtl">
            <div class="card-content ">
            <p>پیام: ` +
            item.comment.text +
            `</p>
            <p>مربوط به: ` +
            item.comment.destinationId.title +
            ` از واحد ` +
            item.comment.departmentId.title +
            `</p>
            <p> در تاریخ: ` +
            gregorian_to_jalali(new Date(item.date)) +
            // item.date +
            `<p>ساعت :` +
            new Date(item.date).getHours() +
            `:` +
            new Date(item.date).getMinutes() +
            `:` +
            new Date(item.date).getSeconds() +
            `</p>
              
                        </div>   
                    </div>`
        );
      }
    });
    if (commentsCount == 0)
      $("#comments-list").append(`تا کنون هیچ دیدگاهی ثبت نشده است.`);
  }
  $(function() {
    ///////////////////////////////////search filters///////////////////////////////////

    ///////////////////////////////////search///////////////////////////////////

    $("#search").keypress(function(e) {
      if (e.which == 13) {
        var departmentId, voteItemId;
        var value = $("#search").val();
        if ($("#drpDepartments").val() != "all")
          departmentId = $("#drpDepartments").val();
        if ($("#drpVoteItems").val() != "all")
          voteItemId = $("#drpVoteItems").val();
          console.log(value, departmentId, voteItemId)
        search_comments(value, departmentId, voteItemId);
        return false;
      }
    });

    /////////////////////////////////////////////////////////////////////////////////
    post("/users/type", {}, function(response) {
      var userType = response.type;
      var departments;
      if (userType < 2) {
        $("#drpDepartments").prop("disabled", false);
        deparments = "all";
      } else {
        post("/departments/select/one", {}, function(response) {
          departments = response.department;
          $("#drpDepartments").val(departments.departmentId);
        });
      }

      fillSelectvoteItems(departments);

      fillSelectDepartment();
    });

    post("/votes/all/comments", {}, function(response) {
      cardsAppend(response);

      // var commentsCount = 0;
      // response.votesArray.map(function(item) {
      //   cardsAppend(item)
      //   if (item.comment) {
      //     commentsCount++;

      //     $("#comments-list").append(
      //       `
      //                   <div class="card rtl">
      //                   <div class="card-content activator ">
      //                       <p>پیام: ` +
      //         item.comment.text +
      //         `</p>
      //                       <p>مربوط به: ` +
      //         item.comment.destinationId.title +
      //         ` از واحد ` +
      //         // item.comment.destinationId.departmentId.title +
      //         `.........................</p>
      //                       <p> در تاریخ: ` +
      // gregorian_to_jalali(new Date(item.date)) +

      //         // item.date +
      //         `<p>ساعت :` +
      //         new Date(item.date).getHours() +
      //         `:` +
      //         new Date(item.date).getMinutes() +
      //         `:` +
      //         new Date(item.date).getSeconds() +
      //         `</p>

      //                   </div>
      //               </div>`
      //     );
      //   }
      // });
      // if (commentsCount == 0)
      //   $("#comments-list").append(`تا کنون هیچ دیدگاهی ثبت نشده است.`);
    });
    $(".pNums").persiaNumber();
    // $( '#drpVoteItems' ).change(function() {
    $("#drpDepartments").change(function() {
      fillSelectvoteItems($("#drpDepartments").val());
    });
    $("#drpVoteItems").change(function() {
      var departmentId, voteItemId;
      var value = $("#search").val();
      if ($("#drpDepartments").val() != "all")
        departmentId = $("#drpDepartments").val();
      if ($("#drpVoteItems").val() != "all")
        voteItemId = $("#drpVoteItems").val();
      search_comments(value, departmentId, voteItemId);
    });
  });
})(jQuery);
