

(function ($) {


    function fillSelectGroup(groupId) {
        post('/groups/all', {}, function (response) {
    
            $("#userGroup").append(`
            <option value="" disabled selected>انتخاب کنید...</option>
            `)
            $(response.groupsArray).each(function(i,group){
                $("#userGroup").append(`
            <option value="`+group._id+`"`+(group._id==groupId?'selected':'')+`>`+group.title+`</option>
            `)
                
            })
        $('select').material_select();
            
        })
    }

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
    // isLoggedin();
    $("#btnUpdateUser").click(function () {
      

        
            if($("#password1").val())var password = $("#password1").val();
            
            if($("#firstName").val())var firstName = $("#firstName").val();
            if($("#lastName").val())var lastName = $("#lastName").val();
            if($("#personelNumber").val()) var personelNumber = $("#personelNumber").val();
            if($("#personelNumber").val())var personelNumber = $("#personelNumber").val();
            if($("#email").val())var email = $("#email").val().toLowerCase();
            if( $("#mobile").val())var mobileNumber = $("#mobile").val();
            if($("#phone").val())var phoneNumber = $("#phone").val();
            // var permitedChannels = $("#permitedChannels").val();
            // var type = $("#type").val();
            var group=$("#userGroup").val();
        
            var user = {
                firstName: firstName,
                lastName: lastName,
                personelNumber: personelNumber,
                password: password,
                email: email,
                mobileNumber: mobileNumber,
                phoneNumber: phoneNumber,
                // permitedChannels: permitedChannels,
                // type: type
            group:group                
            };
            updateUser(user)
        
    });

    var updateUser = function (user) {
        post('/users/update', user, function (response) {
            if (response.user == false) {
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            } else {
                alert("ثبت اطلاعات با موفقیت انجام شد")
                window.location.replace("../index.html")
            }
        })
    };
    function cardsAppend(response){
        response.usersArray.map(function (item) {
            $('#users-list').append(`

            <div class="card" unqueId=` + item._id + `>
                <div class="card-content">
                    <p>` + item.firstName + ` ` + item.lastName + `</p>
                    <p موبایل:` + item.mobileNumber + `</p>
                    <p> شماره داخلی:` + item.phoneNumber + `</p>
                    <p>` + item.email + `</p>
                    <p> واحد:` + item.group.departmentId.title +
                     `</p>
                    <p>گروه کاربری:` + item.group.title + 
                    `</p>
                    <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` + item._id + `" href="#editModal" editItem_id="` + item._id + `" editItem_un="` + item.username + `" editItem_firstName="` + item.firstName + `" editItem_lastName="` + item.lastName + `" editItem_mobileNumber="` + item.mobileNumber + `" editItem_phoneNumber="` + item.phoneNumber + `" editItem_personelNumber="` + item.personelNumber + `" editItem_email="` + item.email + `" editItem_group="` + item.group.title + `">ویرایش
                    <i class="material-icons">edit</i></a>
                </div>   
            </div>`);
        });

    }


    $(function () {

        $('select').material_select();
        fillSelectDepartment();
        fillSelectGroup();
        //search in users list   
        var search_users = function (query,departmentId) {

            post('/users/search', {
                query,departmentId:departmentId
            }, function (response) {
                $('#users-list').empty();
        if (response.usersArray.length == 0) 
          $("#users-list").append(`<div class="rtl">نتیجه ای یافت نشد.</div>`);
            
        else
        cardsAppend(response)
            })
        }

        // if ($.cookie("token")&&!$.cookie("id")) {
        //     window.location.replace("../login.html");
        // }
        ////////////////////////////////////

        $('#search').keypress(function (e) {
            var departmentId
            if (e.which == 13) {
                var value = $('#search').val();
                // if ($("#drpDepartments").val() != "all")
          departmentId = $("#drpDepartments").val();
                search_users(value,departmentId);
                return false;
            }
        });

        //show a list of users   
        post('/users/all/recover', {}, function (response) {
            cardsAppend(response)

            $('.edit').click(function (e) {

                var id = $(this).attr('editItem_id');
                var username = $(this).attr('editItem_un');
                var firstName = $(this).attr('editItem_firstName');
                var lastName = $(this).attr('editItem_lastName');
                var mobileNumber = $(this).attr('editItem_mobileNumber');
                var phoneNumber = $(this).attr('editItem_phoneNumber');
                var personelNumber = $(this).attr('editItem_personelNumber');
                var email = $(this).attr('editItem_email');
                var group = $(this).attr('editItem_group');
                userEdit = {
                    id: id,
                   status
                }

                $('#users-list').after(`
                    <!-- Modal Trigger -->
                    <div class="container ">
                        <div id="editModal" class="modal modal-fixed-footer edit rtl">
                            <div class="modal-content ">
                                <h5>ویرایش</h5>
                                    <form class="col s12 " id="newUserForm">
                                        <div class="row">
                                        <p>نام کاربری: ` + username  + `</p>
                                        <i class="material-icons prefix">account_circle</i>
                                        <p>` + firstName + ` ` + lastName + `</p>
                                        <p> شماره کارمندی:` + personelNumber + `</p>                                        
                                        <p موبایل:` + mobileNumber + `</p>
                                        <p> شماره داخلی:` + phoneNumber + `</p>
                                        <p>` + email + `</p>
                                        <p>گروه کاربری:` + group + `</p>
                                        </div>
                                        <p>
                                            <input name="rdbStatus" type="radio" id="rdbActive" value="0" />
                                            <label for="rdbActive">فعال</label>
                                        </p>
                                        <p>
                                            <input name="rdbStatus" type="radio" id="rdbDeactive" value="1" />
                                            <label for="rdbDeactive">غیرفعال</label>
                                        </p>
                                        <p>
                                            <input name="rdbStatus" type="radio" id="rdbDeleted" value="-1" />
                                            <label for="rdbDeleted">حذف</label>
                                        </p>
                                        <p>
                                            <input name="rdbStatus" type="radio" id="rdbBanned" value="3" />
                                            <label for="rdbBanned">محدود</label>
                                        </p>
                                    </form>
                                </div>
                                <div class="modal-footer">
                                    <button class="btn waves-effect waves-light" id="btnUpdateUser">ثبت
                                        <i class="material-icons right">send</i>
                                    </button>
                                    <button class="btn waves-effect waves-light modal-close">انصراف
                                        <i class="material-icons right">cancel</i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>       
                `);
                

                $('.edit').modal();

                $('#btnUpdateUser').click(function (e) {
                   
                    userEdit.status = $("#userGroup").val();

                    edit_users(userEdit, function (response) {
                        if (response.user) {
                            $('#editModal').modal('close');
                            alert("به روز رسانی با موفقیت انجام شد.");
                        } else {
                            alert("در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. کدخطا: ")
                        }
                    })
                })
                $('.pNums').persiaNumber();
            })
        })

        function edit_users(userEdit, callback) {
            post('/users/update/status', {
                _id: userEdit.id,
                status: userEdit.status,
            }, function (response) {
                callback(response);
            })
        }

       
        $('.pNums').persiaNumber();

    });

})(jQuery);