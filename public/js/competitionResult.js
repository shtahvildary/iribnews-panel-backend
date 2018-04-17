(function ($) {

    var result = []
    var search_competitions = function(query,departmentId,voteItemId) {
        post(
          "/competitions/search",
          {
            departmentId: departmentId,
            voteItemId,
            query: query
          },
          function(response) {
            $("#competitionsResult-list").empty();
            if(response.competitionsArray.length==0){
            $("#competitionsResult-list").append(`نتیجه ای یافت نشد.`);
            }
            else response.competitionsArray.map(function(item) {
              cardsAppend(item);
            });
          }
        );
      };

    post('/competitions/all/result', {}, function (response) {
        var {
            competitions
        } = response
        competitions.map(item => {
            result.push(item)
        })
    })

    function revealAppend(competitionId) {
        var answers = {}
        for (var i = 0; i < result.length; i++) {
            if (result[i].competitionId == competitionId) {
                var answers = { totalCount: result[i].totalCount, totalCorrectAnswers: result[i].totalCorrectAnswers };
                return answers;
            }
        }
        return 0;
    }

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

      function cardsAppend(item){
          var answers = []
          $('#competitionsResult-list').append(`
              <div class="card rtl">
                  <div class="card-content activator ">
                      <span class="activator grey-text text-darken-4"> ` + item.title + `<i class="material-icons left">more_vert</i></span>
                      <p>سوال: ` + item.question + `</p> 
                      <div id="answers-` + item._id + `">
                          <p>پاسخ ها:</p>
                          <p>
                      </div>
                  </div> 
                  <div class="card-reveal" >
                      <span class=" grey-text text-darken-4">` + item.title + `<i class="material-icons right">close</i></span>
                      <p id="result-` + item._id + `"></p>
                  
              </div>
              `);
    
          var competition = revealAppend(item._id)
          if (competition == 0) $('#result-' + item._id).append(`<p>تا کنون پاسخی ثبت نشده است.</p>`)
          else $('#result-' + item._id).append(
              `<p>تعداد شرکت کنندگان:` + competition.totalCount +
              `<p>تعداد پاسخ های درست:` + competition.totalCorrectAnswers +
              `</div> `)
          jQuery(item.keyboard).each(function (i, keyboard) {
              var style = ""
              if (keyboard.correctAnswer) style = "color:green;"
              jQuery('#answers-' + item._id).append(
                  `<p style="` + style + `">‍` + keyboard.text + `</p>                
                  ` );
    
          })
          
      }

    $(function () {
        $("#search").keypress(function(e) {
            if (e.which == 13) {
                var departmentId,voteItemId;
              var value = $("#search").val();
              if($("#drpDepartments").val()!='all')
                  departmentId = $("#drpDepartments").val();
              if($("#drpVoteItems").val()!='all')            
                  voteItemId = $("#drpVoteItems").val();
              search_competitions(value, departmentId,voteItemId);
              return false; 
            }
          });
          post("/users/type", {}, function(response) {
            var userType = response.type;
            var departments;
            if (userType < 2) {
              $("#drpDepartments").prop("disabled", false);
              deparments = "all";
              fillSelectDepartment();
            } else {
              post("/departments/select/one", {}, function(response) {
                departments = response.department;
                $("#drpDepartments").val(departments.departmentId);
              });
            }
      
            fillSelectvoteItems(departments);
          });
     })
    var departmentId;
        
        post('/competitions/all', {departmentId}, function (response) {
            response.competitionsArray.map(function (item) {
                cardsAppend(item)
            })
        })
        
   
    $("#drpDepartments").change(function() {
        fillSelectvoteItems($("#drpDepartments").val());
      });

      $("#drpVoteItems").change(function() {
        var departmentId,voteItemId;
        var value = $("#search").val();
        if($("#drpDepartments").val()!='all')
            departmentId = $("#drpDepartments").val();
        if($("#drpVoteItems").val()!='all')            
            voteItemId = $("#drpVoteItems").val();
        search_competitions(value, departmentId,voteItemId);
        
      });
})
    (jQuery);