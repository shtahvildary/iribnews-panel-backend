(function($) {
  function cardsAppend(voteItemsArray) {
    voteItemsArray.map(function(item) {
      var statusTitle;
      switch(item.status){
          case -1: statusTitle="حذف شده"
          break;
          case 0: statusTitle="فعال"
          break;
          case 1: statusTitle="غیرفعال";
          break;
          case 3: statusTitle="محدود شده"
          break;
      }
      $("#voteItems-list").append(
        `
            <div class="card" unqueId=` +
          item._id +
          `>
                <div class="card-content">
                    <p>` +
          item.title +
          `</p>
                    <p>` +
          item.description +
          `</p>
                    <p>` +
          item.personnels +
          `</p>
          <p> وضعیت: ` +
          statusTitle +
          `</p> 
                    <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` +
          item._id +
          `" href="#editModal" editItem_id="` +
          item._id +
          `" editItem_title="` +
          item.title +
          `" editItem_description="` +
          item.description +
          `" editItem_personnels="` +
          item.personnels +
          `" editItem_status="`+item.status+`">ویرایش
                    <i class="material-icons">edit</i></a>
                    
                </div>   
            </div>`
      );
    }); 
  }

  $(function() {
    var search_voteItems = function(query, departmentId, type,status) {
        post(
          "/voteItems/search",
          {
            query,
            departmentId,
            type,
            status
          },
          function(response) {
            $("#voteItems-list").empty();
            if (response.voteItemsArray.length == 0)
              $("#voteItems-list").append(`<div class="rtl">
              نتیجه ای یافت نشد.
              </div>`);
            else cardsAppend(response.voteItemsArray);
          }
        );
      };


    function fillSelectDepartment() {
      post("/departments/all", {}, function(response) {
        $("#drpDepartments").append(`
                <option value=""  selected>همه</option>
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

    // if ($.cookie("token")&&!$.cookie("id")) {
    //     window.location.replace("../login.html");
    // }
    ////////////////////////////////////

    $("#search").keypress(function(e) {
      if (e.which == 13) {
        var departmentId;
        var value = $("#search").val();
        departmentId = $("#drpDepartments").val();
        search_voteItems(value, departmentId, $("#drpVoteItemType",$("#drpStatus")).val());
        return false;
      }
    });

    post("/users/type", {}, function(response) {
        var userType = response.type;
        var departments;
        if (userType < 2) {
          $("#drpDepartments").prop("disabled", false);
          deparments = "";
          // deparments = "all";
          fillSelectDepartment();
        } else {
          post("/departments/select/one", {}, function(response) {
            departments = response.department;
            $("#drpDepartments").val(departments.departmentId);
          });
        }
      });

    post("/voteItems/all/status", {}, function(response) {
      cardsAppend(response.voteItemsArray);
      $(".edit").click(function(e) {
        voteItemEdit = {
          id: $(this).attr("editItem_id"),
          title:$(this).attr("editItem_title"),
          description:$(this).attr("editItem_description"),
          status: $(this).attr("editItem_status"),
        };
        $("#voteItems-list").after(
          ` 
            <!-- Modal Trigger -->
            <div id="editModal" class="modal edit rtl">
                <div class="modal-content">
                    <h5>ویرایش</h5>
                    <p>
                            <form>
                            <div class="row">
                                <div class="input-field col s12">
                                <p>                                
                                    عنوان: ` +voteItemEdit.title +`</p>
                                   
                                <p>                                
                                    توضیحات: ` +
            voteItemEdit.description +
            `</p>
            <p> وضعیت: </p>
            </div>
            <p>
                <input name="rdbStatus" type="radio" id="rdbActive" value="0" ` +
(voteItemEdit.status == 0 ? `checked` : "") +
`/>
                <label for="rdbActive">فعال</label>
            </p>
            <p>
                <input name="rdbStatus" type="radio" id="rdbDeactive" value="1" ` +
(voteItemEdit.status == 1 ? `checked` : "") +
`/>
                <label for="rdbDeactive">غیرفعال</label>
            </p>
            <p>
                <input name="rdbStatus" type="radio" id="rdbDeleted" value="-1" ` +
(voteItemEdit.status == -1 ? `checked` : "") +
`/>
                <label for="rdbDeleted">حذف</label>
            </p>
            <p>
                <input name="rdbStatus" type="radio" id="rdbBanned" value="3" ` +
(voteItemEdit.status == 3 ? `checked` : "") +
`/>
                <label for="rdbBanned">محدود</label>
            </p>   
                            </form>
            
                            <div class="modal-footer">
                                <button class="btn waves-effect waves-light" id="btnVoteItemsUpdate">ثبت
                                   <i class="material-icons right">send</i>
                                </button>
                                <button class="btn waves-effect waves-light modal-close">انصراف
                                   <i class="material-icons right">cancel</i>
                                </button>
                            </div>
                        </div>
                    </p>
                </div>
            </div>
            `
        );
        $(".edit").modal();

        $("#btnVoteItemsUpdate").click(function(e) {
          //id: $(this).attr('editItem_id'),
          voteItemEdit.status = $("input[type=radio]:checked").val();
          edit_voteItems(voteItemEdit, function(response) {

          // var status=edit_voteItems(voteItemEdit);
          // if (edit_voteItems(voteItemEdit)) {
            // $("#editModal").modal("close");
            if (response) {
              $("#editModal").modal("close");
              alert("به روز رسانی با موفقیت انجام شد.");
            } else {
              alert(
                "در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. "
              );
            }
          })
        });
      });

    });

    function edit_voteItems(voteItemEdit,callback) {
      console.log(voteItemEdit)
      post(
        "/voteItems/update/status",
        {
          _id: voteItemEdit.id,
          status:voteItemEdit.status
        },
        function(response) {
          // return new Promise(function(resolve, reject) {
          //   resolve(response);
          // });
          callback(response)
          // if(response){return true}
          // return false
        }
      );
    }

    $(".pNums").persiaNumber();
    $("#drpDepartments").change(function() {
      search_voteItems(
        $("#search").val(),
        $("#drpDepartments").val(),
        $("#drpVoteItemType").val(),
        $("#drpStatus").val()
      );
    });
    $("#drpVoteItemType").change(function() {
      search_voteItems(
        $("#search").val(),
        $("#drpDepartments").val(),
        $("#drpVoteItemType").val(),
        $("#drpStatus").val()        
      );
    });
    $("#drpStatus").change(function() {
      search_voteItems(
        $("#search").val(),
        $("#drpDepartments").val(),
        $("#drpVoteItemType").val(),
        $("#drpStatus").val()        
      );
    });
  });
})(jQuery);
