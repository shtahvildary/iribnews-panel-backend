(function($) {
  const fileserver = "http://localhost:9000";

  //show a list of departments
  var search_departments = function(query) {
      post(
          "/departments/search",
          {
              query: query
            },
            function(response) {
        $("#departments-list").empty();
        if(response.departmentsArray.length==0)
            $("#departments-list").append(`<div class="rtl">
            نتیجه ای یافت نشد.
            </div>`);
            
            else
        
        fillCards(response.departmentsArray)
      }
    );
  };

  // if ($.cookie("token")&&!$.cookie("id")) {
  //     window.location.replace("../login.html");
  // }
  ////////////////////////////////////
  //TODO: search should be completed
  ////////////////////////////////////

  $("#search").keypress(function(e) {
    if (e.which == 13) {
      var value = $("#search").val();
      // console.log('query', {
      //     text: value
      // })
      search_departments(value);
      return false;
    }
  });
function fillCards(departmentsArray){
    departmentsArray.map(function(item) {
    
    $("#departments-list").append(
    
    `<div class="card" unqueId=` +item._id +`>
                    <div class="card-content">
                        <p>
                        `+(item.logo?`        
                        <img class="circle  right responsive-img"style="max-width:70% max-width:70%" src="`+fileserver+item.logo+`" > `:'')+ 
                        item.title +
                        `</p>
                        <p>توضیحات: ` +item.description +
                        `</p>
                        <p>شماره پورت: ` +item.port +
                        `</p>
                        <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` +item._id +`" href="#editModal" editItem_id="` +item._id +
          `" editItem_title="` +item.title +`" editItem_description="` +item.description +`">ویرایش
                        <i class="material-icons">edit</i></a>
                        <a class="waves-effect waves-light btn delete" id="btnDelete" title="` +
          item.title +
          `" uniqueId="` +
          item._id +
          `" >حذف
                        <i class="material-icons">delete</i></a>
                    </div>   
                </div>`
            )}
        )}
  post("/departments/all", {}, function(response) {
    fillCards(response.departmentsArray)

    $(".edit").click(function(e) {
      departmentEdit = {
        _id: $(this).attr("editItem_id"),
        title: $(this).attr("editItem_title"),
        description: $(this).attr("editItem_description")
      };
      $("#departments-list").after(
        `
            
            <!-- Modal Trigger -->
            <div id="editModal" class="modal edit rtl">
                <div class="modal-content">
                    <h5>ویرایش</h5>
                    <p>
                            <form>
                            <div class="row">
                                <div class="input-field col s12">
            `+(departmentEdit.logo?`
                                
        <img class="circle  right responsive-img"style="max-width:70% max-width:70%" src="..`+departmentEdit.logo+`" > `:'')+
                                
                                `                                                               
                                    <input id="tbxTitle" type="text" class="validate" value="` +
          departmentEdit.title +
          `">
                                    <label class="active" for="tbxTitle">عنوان</label>
                                </div>
                                </div>
                                
                                <div class="row">
                                <div class="input-field col s12">
                                <i class="material-icons prefix">description</i>                                    
                                <textarea id="tbxDescription" type="text" class="materialize-textarea">` +
          departmentEdit.description +
          `</textarea>
                                    <label class="active" for="tbxDescription">توضیحات</label>
                                </div>
                                </div>
                                <div class="file-field input-field col s6">
                    <div class="btn">
                        <span>افزودن لوگو</span>
                        <input type="file" multiple id="updateLogo" accept="image/*">
                    </div>
                    <div class="file-path-wrapper">
                        <input class="file-path validate" type="text" placeholder="Upload one file">
                    </div>
                </div>
                                
                            </form>
            
                            <div class="modal-footer">
                                <button class="btn waves-effect waves-light" id="btnUpdate">ثبت
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

      $("#btnUpdate").click(function(e) {
        departmentEdit.title = $("#tbxTitle").val();
        departmentEdit.description = $("#tbxDescription").val();
        

        edit_departments(departmentEdit);
      });
    });

    $(".delete").click(function(e) {
      var del = confirm(
        "آیا قصد پاک کردن « " + $(this).attr("title") + " » را دارید؟"
      );
      if (del == true) {
        var departmentId = $(this).attr("uniqueId");

        $(".card[uniqueId=" + departmentId + "]").fadeOut();
        delete_departments(departmentId);
        alert("«" + $(this).attr("title") + "» با موفقیت پاک شد.");
      }
    });
  });

  var addDepartment = function(department) {
    var formData = new FormData();
    formData.append("title", department.title);
    formData.append("bot", department.bot);
    formData.append("port", department.port);
    formData.append("logo", document.getElementById("inputLogo").files[0]);
    post("/departments/new", { formData }, function(response) {
      // post('/departments/new', department, function (response) {
      if (response.department == false) {
        alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید");
      } else {
        alert("ثبت اطلاعات با موفقیت انجام شد");
        document.getElementById("newDepartmentForm").reset();
      }
    });
  };

  function edit_departments(departmentEdit) {
    var formData = new FormData();
    formData.append("_id", departmentEdit._id);
    formData.append("title", departmentEdit.title);
    formData.append("description", departmentEdit.description);
    formData.append("logo", document.getElementById("updateLogo").files[0]);
    post("/departments/update", { formData }, function(response) {
      if (response.department == false) {
        alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید");
      } else {
        alert("ثبت اطلاعات با موفقیت انجام شد");
        window.location.replace("../html/departmentsList.html");
      }
    });
  }

  function delete_departments(departmentId) {
    // console.log('departmentId: ', departmentId);

    post(
      "/departments/disable",
      {
        _id: departmentId
      },
      function(response) {
      }
    );
  }
  $(function() {
    $(".pNums").persiaNumber();

    $("#btnAddDepartment").click(function() {
      var title = $("#tbxTitle").val();
      var bot = $("#tbxBot").val();
      var port = $("#tbxPort").val();
      var description = $("#tbxDescription").val();

      addDepartment({
        title,
        bot,
        port,
        description
      });
    });

    // var addDepartment = function(department) {
    //   var formData = new FormData();
    //   formData.append("title", department.title);
    //   formData.append("bot", department.bot);
    //   formData.append("port", department.port);
    //   formData.append("logo", document.getElementById("inputLogo").files[0]);
    //   post("/departments/new", { formData }, function(response) {
    //     // post('/departments/new', department, function (response) {
    //     if (response.department == false) {
    //       alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید");
    //     } else {
    //       alert("ثبت اطلاعات با موفقیت انجام شد");
    //       document.getElementById("newDepartmentForm").reset();
    //     }
    //   });
    // };
  });
})(jQuery);
