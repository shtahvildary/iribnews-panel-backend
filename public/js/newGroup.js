(function($) {
  function fillPermissions(callback) {
    post("/permissions/read", {}, response => {
      callback(response.permissionsList);
    });
  }
  var permissionsList=[]
  function fillSelectDepartment(departmentId) {
    post("/departments/all", {}, function(response) {
      $("#drpDepartments").append(
        `<option value="" disabled selected>انتخاب کنید...</option>`
      );
      $(response.departmentsArray).each(function(i, department) {
        $("#drpDepartments").append(
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

  function fillGroupType() {
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
                <select id="drpGroupType"  class="validate">
                    <option value="" disabled selected >انتخاب کنید...</option>
                    <option value="3" >کاربران واحدها</option>
                    <option value="2" >مدیران واحدها</option>         
                </select>
                <label for="drpGroupType">نوع گروه:</label>
                        `
        );
      if (userType == 0)
        $("#drpGroupType").append(
          `
            <option value="1" >مدیران رسانه های نوین</option>         
            `
        );
      $("select").material_select();
    });
  }

  //add group
  $("#btnAddGroup").click(function() {
    var title = $("#groupTitle").val();
    var type = $("#drpGroupType").val();
    var permissions = [];
    if(type==3){
    for (var i = 0; i < permissionsList.length; i++) {
      if ($("#cbxPermissions-" + i).is(":checked"))
        permissions.push($("#cbxPermissions-" + i).val());
    }}

    var description = $("#description").val();
    var departmentId = $("#drpDepartments").val();
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

  $(function() {
    fillGroupType();

    // if ($.cookie("token")&&!$.cookie("id")) {
    //     window.location.replace("../login.html");
    // }
    ////////////////////////////////////

    post("/users/type", {}, function(response) {
      var userType = response.type;
      var departments;
      if (userType < 2) {
        $("#drpDepartments").prop("disabled", false);
        deparments = "";
      } else {
        post("/departments/select/one", {}, function(response) {
          departments = response.department;
          $("#drpDepartments").val(departments.departmentId);
        });
      }
      fillSelectDepartment(departments, false);
    });
   
    $(".pNums").persiaNumber();
    $("#groupTypeSelect").change(function() {
      $(".cbxPermissions-list").empty();
      if ($("#drpGroupType").val() == 3)
        fillPermissions(function(result) {
          permissionsList=result
          $(permissionsList).each(function(i, permission) {
            $(".cbxPermissions-list").append(
              `<p>
                      <input type="checkbox" id="cbxPermissions-` +
                i +
                `" value="` +
                permission.code +
                `"/>
                      <label for="cbxPermissions-` +
                i +
                `">` +
                permission.description +
                `</label>
                      </p>
                      `
            );
          });
        });
    });
  });
})(jQuery);
