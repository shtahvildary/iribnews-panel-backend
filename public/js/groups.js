(function($) {
  function fillPermissions(callback) {
    post("/permissions/read", {}, response => {
      callback(response.permissionsList);
    });
  }
  function fillSelectDepartment(departmentId, edit) {
      var drpDepartmentsList;
    post("/departments/all", {}, function(response) {
      if (edit) {
          drpDepartmentsList="#department";
          $(drpDepartmentsList).append(`<option value="" disabled selected>انتخاب کنید...</option>` );
        }
      else {
        drpDepartmentsList="#drpDepartments";
        $(drpDepartmentsList).append(`<option value=""  selected>همه</option>`);
    }

      $(response.departmentsArray).each(function(i, department) {
        $(drpDepartmentsList).append(
          `
            <option value="` +
            department._id +
            `"  ` +
            (departmentId == department._id ? "selected" : "") +
            `>` +
            department.title +
            `</option>
            `
        );
      });
      $("select").material_select();
    });
  }

  function fillGroupType(groupType) {
    // function fillGroupType(groupType,edit) {
    // var drpGroupTypeList;
    post("/users/type", {}, function(response) {
      var userType = response.type;
      // if(!edit){
      //   drpGroupTypeList="#drpGroupType"
      // }
      if (userType < 2)
        $("#groupTypeSelect").append(
          `
                <select id="groupType"  class="validate">
                    <option value="" disabled ` +
            (!groupType ? "selected" : "") +
            `>انتخاب کنید...</option>
                    <option value="3" ` +
            (groupType == 3 ? "selected" : "") +
            `>کاربران واحدها</option>
                    <option value="2" ` +
            (groupType == 2 ? "selected" : "") +
            ` >مدیران واحدها</option>         
                </select>
                <label for="groupType">نوع گروه:</label>
                        `
        );
      if (userType == 0)
        $("#groupType").append(
          `
            <option value="1" ` +
            (groupType == 1 ? "selected" : "") +
            ` >مدیران رسانه های نوین</option>         
            `
        );
      $("select").material_select();
    });
  }

  function cardsAppend(response, permissionsList) {
    response.groupsArray.map(function(item, callback) {
      var groupType;
        switch(item.type){
          case 0: groupType="ادمین";
            break;
            case 1: groupType="مدیران رسانه های نوین";
            break;
            case 2: groupType="مدیران واحدها";
            break;
            case 3: groupType="کاربران واحدها"
            break;
        }
      $("#groups-list").append(
        `
        <div class="card" unqueId=` +
          item._id +
          `>
            <div class="card-content">
                <p>                                                     
                عنوان: ` +
          item.title +
          `</p>
          <p>                                                        
          واحد:` +
    item.departmentId.title +
    `</p>
    <p>
                نوع گروه: ` +
                groupType +
          `</p>  
                <p>
                توضیحات:` +
          item.description +
          `</p>  
                <div class="showPermissions rtl" id="permissions_` +
          item._id +
          `">دسترسی ها: </div>
                ` +
          (item.type > 1
            ? `
                <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` +
              item._id +
              `" href="#editModal" editItem_id="` +
              item._id +
              `" editItem_title="` +
              item.title +
              `" editItem_type="` +
              item.type +
              `" editItem_permissions="` +
              item.permissions +
              `" editItem_description="` +
              item.description +
              `" editItem_department="` +
              item.departmentId._id +
              `">ویرایش
                <i class="material-icons">edit</i></a>
                <a class="waves-effect waves-light btn delete" id="btnDelete" uniqueId="` +
              item._id +
              `" >حذف
                <i class="material-icons">delete</i></a>`
            : "") +
          `
            </div>   
        </div>`
      );
      $(permissionsList).each(function(i, permission) {
        $("#permissions_" + item._id).append(
          item.permissions.indexOf(String(permission.code)) != -1
            ? `<p>- ` + permission.description + `</p>`
            : ""
        );
      });
    });
  }
  //add group
  $("#btnAddGroup").click(function() {
    var title = $("#groupTitle").val();
    var type = $("#groupType").val();
    var permissions = [];
    for (var i = 0; i < permissionsList.length; i++) {
      if ($("#cbxPermissions-" + i).is(":checked"))
        permissions.push($("#cbxPermissions-" + i).val());
    }

    var description = $("#description").val();
    var departmentId = $("#department").val();
    var group = {
      title,
      type,
      permissions,
      description,
      departmentId
    };

    //  var newGroup=function (group) {
    post("/groups/new", group, function(response) {
      if (response.error)
        alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید");
      else {
        alert("ثبت اطلاعات با موفقیت انجام شد");
        // document.getElementById("newGroupForm").reset()
        window.location.replace("./groupsList.html");
      }
    });
  });
  $("#btnAddGroupCancel").click(function(e, user) {
    window.location.replace("./groupsList.html");
  });

  // if ($.cookie("token")&&!$.cookie("id")) {
  //     window.location.replace("../login.html");
  // }
  // isLoggedin();
  $("#btnUpdateGroup").click(function() {
    var title = $("#groupTitle").val();
    var type = $("#type").val();
    var permissions;
    var description = $("#description").val();

    updategroup({
      title,
      type,
      permissions,
      description
    });
  });

  var updateGroup = function(group) {
    post("/groups/update", group, function(response) {
      if (response.group == false) {
        alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید");
      } else {
        alert("ثبت اطلاعات با موفقیت انجام شد");
        window.location.replace("./groupsList.html");
      }
    });
  };

  $(function() {
    fillGroupType();

    //search in groups list
    var search_groups = function(query, departmentId) {
      post(
        "/groups/search",
        {
          query,
          departmentId
        },
        function(response) {
          $("#groups-list").empty();
          if (response.groupsArray.length == 0)
            $("#groups-list").append(
              `<div class="rtl">نتیجه ای یافت نشد.</div>`
            );
          else
            fillPermissions(function(permissionsList) {
              cardsAppend(response, permissionsList);
            });
        }
      );
    };

    // if ($.cookie("token")&&!$.cookie("id")) {
    //     window.location.replace("../login.html");
    // }
    ////////////////////////////////////
    $("#search").keypress(function(e) {
      if (e.which == 13) {
        var departmentId;
        var value = $("#search").val();
        departmentId = $("#drpDepartments").val();
        search_groups(value, departmentId);
        return false;
      }
    });

    post("/users/type", {}, function(response) {
      var userType = response.type;
      var departments;
      if (userType < 2) {
        $("#drpDepartments").prop("disabled", false);
        // deparments = "all";
      } else {
        post("/departments/select/one", {}, function(response) {
          departments = response.department;
          $("#drpDepartments").val(departments.departmentId);
        });
      }
      fillSelectDepartment(departments, false);
    });

    //show a list of groups
    fillPermissions(function(permissionsList) {
      post("/groups/all", {}, function(response) {
        // var permissions=[]
        cardsAppend(response, permissionsList);

        $(".edit").click(function(e) {
          var _id = $(this).attr("editItem_id");
          var title = $(this).attr("editItem_title");
          var type = $(this).attr("editItem_type");
          var permissions = $(this).attr("editItem_permissions");
          var description = $(this).attr("editItem_description");
          var department = $(this).attr("editItem_department");

          groupEdit = {
            _id,
            title,
            type,
            permissions,
            description,
            department
          };

          $("#groups-list").after(
            `
                    <!-- Modal Trigger -->
                    <div class="container ">
                        <div id="editModal" class="modal modal-fixed-footer edit rtl">
                            <div class="modal-content">
                                <h5>ویرایش</h5>
                                    <form class="col s12" id="editGroupForm ">
                                        <div class="row">
                                            <div class="input-field col s6">
                                                <i class="material-icons prefix">account_circle</i>
                                                <input id="groupTitle" value="` +
              title +
              `" type="text" class="validate">
                                                <label class="active" for="groupTitle">نام گروه: </label>
                                            </div>
                                            <div class="input-field col s6" id="groupTypeSelect">
                                            </div>
                                            <div class="row">
                                                <div class="input-field col s12">
                                                    <select id="department">
                                                    
                                                    </select>
                                                    <label>واحد:</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                        دسترسی ها:
                                            <div class="col s12 cbxPermissions-list ">
                                                
                                            </div>
                                        </div>
                                    </form>
                    
                                </div>
                                <div class="modal-footer">
                                    <button class="btn waves-effect waves-light" id="btnUpdateGroup">ثبت
                                        <i class="material-icons right">send</i>
                                    </button>
                                    <button class="btn waves-effect waves-light modal-close">انصراف
                                        <i class="material-icons right">cancel</i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>       
                `
          );
          fillSelectDepartment(department, true);
          fillGroupType(type);

          $(permissionsList).each(function(i, permission) {
            $(".cbxPermissions-list").append(
              `<p>
                    <input type="checkbox" id="cbxPermissions-` +
                i +
                `" value="` +
                permission.code +
                `"` +
                (permissions.indexOf(permission.code) != -1
                  ? 'checked="checked"'
                  : "") +
                `/>
                    <label for="cbxPermissions-` +
                i +
                `">` +
                permission.description +
                `</label>
                    </p>
                    `
            );
          });

          $(".edit").modal();

          $("#btnUpdateGroup").click(function(e) {
            var permissions = [];
            for (var i = 0; i < permissionsList.length; i++) {
              if ($("#cbxPermissions-" + i).is(":checked"))
                permissions.push($("#cbxPermissions-" + i).val());
            }
            groupEdit.title = $("#groupTitle").val();
            groupEdit.type = $("#groupType").val();
            groupEdit.permissions = permissions;
            groupEdit.description = $("#description").val();
            groupEdit.departmentId = $("#department").val();

            edit_groups(groupEdit, function(response) {
              if (response.ok) {
                $("#editModal").modal("close");
                alert("به روز رسانی با موفقیت انجام شد.");
              } else {
                alert(
                  "در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. کدخطا: "
                );
              }
            });
            location.reload();
          });
        });

        $(".delete").click(function(e) {
          var del = confirm(
            "آیا قصد پاک کردن « " + $(this).attr("title") + " » را دارید؟"
          );
          if (del == true) {
            var groupId = $(this).attr("uniqueId");
            $(".card[uniqueId=" + groupId + "]").fadeOut();
            delete_groups(groupId);
            alert("«" + $(this).attr("title") + "» با موفقیت پاک شد.");
          }
        });
      });
    });

    function edit_groups(groupEdit, callback) {
      post("/groups/update", groupEdit, function(response) {
        callback(response);
      });
    }

    function delete_groups(groupId) {
      post(
        "/groups/status",
        {
          _id: groupId,
          status: -1
        },
        function(response) {}
      );
    }
    $(".pNums").persiaNumber();
    $("#drpDepartments").change(function() {
      var departmentId;
      var value = $("#search").val();
      departmentId = $("#drpDepartments").val();
      search_groups(value, departmentId);
    });
  });
})(jQuery);
