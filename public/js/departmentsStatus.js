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
      search_departments(value);
      return false;
    }
  });
function fillCards(departmentsArray){
    departmentsArray.map(function(item) {
        var statusTitle;
        switch(item.status){
            case -1: statusTitle="حذف شده"
            break;
            case 0: statusTitle="فعال"
            break;
            case 1: statusTitle="غیرفعال";
            break;
            
        }
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
                        <p>وضعیت: ` +statusTitle +
                        `</p>
                        <p>شماره پورت: ` +item.port +
                        `</p>
                        <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` +item._id +`" href="#editModal" editItem_id="` +item._id +
          `" editItem_title="` +item.title +`" editItem_description="` +item.description +`" editItem_status="` +item.status +`">ویرایش
                        <i class="material-icons">edit</i></a>   
                </div>`
            )}
        )}
  post("/departments/all/status", {}, function(response) {
    fillCards(response.departmentsArray)

    $(".edit").click(function(e) {
      departmentEdit = {
        _id: $(this).attr("editItem_id"),
        title: $(this).attr("editItem_title"),
        description: $(this).attr("editItem_description"),
        status: $(this).attr("editItem_status")
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
                                
                                ` <p>عنوان: `+departmentEdit.title +`</P>
                                 <p>توضیحات: `+departmentEdit.description +`</P>
                                 <p>شماره پورت: `+departmentEdit.port +`</P>
                                
                                </div>
                                
                </div>
                <p>
                                            <input name="rdbStatus" type="radio" id="rdbActive" value="0" ` +
            (departmentEdit.status == 0 ? `checked` : "") +
            `/>
                                            <label for="rdbActive">فعال</label>
                                        </p>
                                        <p>
                                            <input name="rdbStatus" type="radio" id="rdbDeactive" value="1" ` +
            (departmentEdit.status == 1 ? `checked` : "") +
            `/>
                                            <label for="rdbDeactive">غیرفعال</label>
                                        </p>
                                        <p>
                                            <input name="rdbStatus" type="radio" id="rdbDeleted" value="-1" ` +
            (departmentEdit.status == -1 ? `checked` : "") +
            `/>
                                            <label for="rdbDeleted">حذف</label>
                                        </p>
                                
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
        departmentEdit.status = $("input[type=radio]:checked").val();
        
        edit_departments(departmentEdit,function(response){
            if (response) {
                $("#editModal").modal("close");
                alert("به روز رسانی با موفقیت انجام شد.");
        window.location.replace("../html/departmentsStatus.html");
              } else {
                alert(
                  "در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. کدخطا: "
                );
              }
        });

      });
    });
  });


  function edit_departments(departmentEdit,callback) {
    console.log(departmentEdit)
      
    post("/departments/update/status", { _id:departmentEdit._id,status:departmentEdit.status }, function(response) {
     callback(response)
    });
  }

  $(function() {
    $(".pNums").persiaNumber();
    $("#btnCancel").click(function (e) {
      window.location.replace("../html/management.html");
  })

  });
})(jQuery);
