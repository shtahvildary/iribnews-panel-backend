(function($) {
  function cardsAppend(voteItemsArray) {
    voteItemsArray.map(function(item) {
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
          `">ویرایش
                    <i class="material-icons">edit</i></a>
                    <a class="waves-effect waves-light btn delete" id="btnDelete" title="` +
          item.title +
          `" uniqueId="` +
          item._id +
          `" >حذف
                    <i class="material-icons">delete</i></a>
                </div>   
            </div>`
      );
    });
  }

  $(function() {
    var search_voteItems = function(query, departmentId, type) {
      post(
        "/voteItems/search",
        {
          query,
          departmentId,
          type
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

    $("#btnVoteItemsAdd").click(function() {
      var voteItemTitle = $("#voteItemTitle").val();
      var type = $("input[name=voteItemType]:checked").val();
      var description = $("#description").val();

      addVoteItem({
        title: voteItemTitle,
        type: type,
        description
      });
    });
    var addVoteItem = function(voteItem) {
      post("/voteItems/new", voteItem, function(response) {
        if (response.voteItem == false) {
          alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید");
        } else {
          alert("ثبت اطلاعات با موفقیت انجام شد");
          document.getElementById("newVoteItemForm").reset();
        }
      });
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
        search_voteItems(value, departmentId, $("#drpVoteItemType").val());
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

    post("/voteItems/all", {}, function(response) {
      cardsAppend(response.voteItemsArray);
      $(".edit").click(function(e) {
        voteItemEdit = {
          id: $(this).attr("editItem_id"),
          title: $(this).attr("editItem_title"),
          personnels: $(this).attr("editItem_personnels"),
          description: $(this).attr("editItem_description")
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
                                <i class="material-icons prefix">title</i>                                
                                    <input id="voteItemTitle" type="text" class="validate" value="` +
            voteItemEdit.title +
            `">
                                    <label class="active" for="voteItemTitle">عنوان</label>
                                </div>
                                </div>
                                
                                <div class="row">
                                <div class="input-field col s12">
                                <i class="material-icons prefix">description</i>                                
                                    <textarea id="description" type="text" class="materialize-textarea">` +
            voteItemEdit.description +
            `</textarea>
                                    <label class="active" for="description">توضیحات</label>
                                </div>
                                </div>
                                
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
          voteItemEdit.title = $("#voteItemTitle").val();
          //id: $(this).attr('editItem_id'),

          //personnels: $(this).attr('editItem_personnels'),
          voteItemEdit.description = $("#description").val();

          // var status=edit_voteItems(voteItemEdit);
          if (edit_voteItems(voteItemEdit)) {
            $("#editModal").modal("close");
            alert("به روز رسانی با موفقیت انجام شد.");
          } else {
            alert(
              "در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. کدخطا: " +
                status
            );
          }
        });
      });

      $(".delete").click(function(e) {
        var del = confirm(
          "آیا قصد پاک کردن « " + $(this).attr("title") + " » را دارید؟"
        );
        if (del == true) {
          var voteItemId = $(this).attr("uniqueId");
          $(".card[uniqueId=" + voteItemId + "]").fadeOut();
          delete_voteItems(voteItemId, function(response) {
            if (response) {
              alert("«" + $(this).attr("title") + "» با موفقیت پاک شد.");
              location.reload();
            } else alert("خطایی رخ داده! لطفا دوباره اقدام نمایید.");
          });
        }
      });
    });

    function edit_voteItems(voteItemEdit) {
      post(
        "/voteItems/update",
        {
          _id: voteItemEdit.id,
          title: voteItemEdit.title,
          type: voteItemEdit.type,
          description: voteItemEdit.description,
          channelId: voteItemEdit.channelId,
          personnels: voteItemEdit.personnels
        },
        function(response) {
          return new Promise(function(resolve, reject) {
            resolve(response);
          });
          // if(response){return true}
          // return false
        }
      );
    }

    function delete_voteItems(voteItemId, callback) {
      post(
        "/voteItems/update/status",
        {
          _id: voteItemId,
          status: -1
        },
        function(response) {
          callback(response);
        }
      );
    }
    $(".pNums").persiaNumber();
    $("#drpDepartments").change(function() {
      search_voteItems(
        $("#search").val(),
        $("#drpDepartments").val(),
        $("#drpVoteItemType").val()
      );
    });
    $("#drpVoteItemType").change(function() {
      search_voteItems(
        $("#search").val(),
        $("#drpDepartments").val(),
        $("#drpVoteItemType").val()
      );
    });
  });
})(jQuery);
