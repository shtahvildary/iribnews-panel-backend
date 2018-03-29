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




    //add user 
    $("#btnAddUser").click(function () {
        if ($("#password1").val() !== $("#password2").val()) {

            alert("کلمه عبور و تکرار آن مشابه نیستند!")

        } else {
            var password = $("#password1").val();
            console.log('btnAddUser is clicked...');
            var firstName = $("#firstName").val();
            var lastName = $("#lastName").val();
            if($("#personelNumber").val()) var personelNumber = $("#personelNumber").val();
            var username = $("#username").val().toLowerCase();
            var email = $("#email").val().toLowerCase();
            var mobileNumber = $("#mobile").val();
            var phoneNumber = $("#phone").val();
            // var permitedChannels = $("#permitedChannels").val();
            // var type = $("#type").val();
            var group=$("#userGroup").val()

            var user = {
                firstName,
                lastName,
                personelNumber,
                username,
                password,
                email,
                mobileNumber,
                phoneNumber,
                // permitedChannels: permitedChannels,
                // type: type
                group,
            };
            //  var newUser=function (user) {
            post('/users/register', user, function (response) {
                if (response.error) {

                    alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
                } else {
                    alert("ثبت اطلاعات با موفقیت انجام شد")
                    document.getElementById("newUserForm").reset()
                }
            });
        }
    });

    // if ($.cookie("token")&&!$.cookie("id")) {
    //     window.location.replace("../login.html");
    // }
    // isLoggedin();
    $("#btnUpdateUser").click(function () {
        // if($("#first_name").val()) var firstName = $("#first_name").val();
        // if( $("#last_name").val())var lastName = $("#last_name").val();
        // if($("#email").val())var email = $("#email").val();
        // if($("#mobile").val())var mobileNumber = $("#mobile").val();
        // if($("#phone").val())var phoneNumber = $("#phone").val();

        // updateUser({
            
        //     firstName: firstName,
        //     lastName: lastName,
        //     email: email,
        //     mobileNumber: mobileNumber,
        //     phoneNumber: phoneNumber,
        //     group:group
        // });

        if ($("#password1").val() !== $("#password2").val()) {

            alert("کلمه عبور و تکرار آن مشابه نیستند!")

        } else {
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
        }
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


    $(function () {

        $('select').material_select();

        fillSelectGroup()
        //search in users list   
        var search_users = function (query) {

            post('/users/all', {
                query: query
            }, function (response) {
                $('#users-list').empty();
                response.usersArray.map(function (item) {
                    $('#users-list').append(`
                    <div class="card">
                    <div class="card-content">     
                    <p>` + item.firstName + ` ` + item.lastName + `</p>
                    </div>
                  </div>`);
                });
            })
        }

        // if ($.cookie("token")&&!$.cookie("id")) {
        //     window.location.replace("../login.html");
        // }
        ////////////////////////////////////
        //TODO: search should be completed 
        ////////////////////////////////////

        $('#search').keypress(function (e) {
            if (e.which == 13) {
                var value = $('#search').val();
                //     text: value
                // })
                search_users(value);
                return false;
            }
        });

        //show a list of users   
        post('/users/all', {}, function (response) {

            response.usersArray.map(function (item) {
                $('#users-list').append(`

                <div class="card" unqueId=` + item._id + `>
                    <div class="card-content">
                        <p>` + item.firstName + ` ` + item.lastName + `</p>
                        <p موبایل:` + item.mobileNumber + `</p>
                        <p> شماره داخلی:` + item.phoneNumber + `</p>
                        <p>` + item.email + `</p>
                        <p> واحد:` + item.group.departmentId.title + `</p>
                        <p>گروه کاربری:` + item.group.title + `</p>
                        <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` + item._id + `" href="#editModal" editItem_id="` + item._id + `" editItem_un="` + item.username + `" editItem_firstName="` + item.firstName + `" editItem_lastName="` + item.lastName + `" editItem_mobileNumber="` + item.mobileNumber + `" editItem_phoneNumber="` + item.phoneNumber + `" editItem_personelNumber="` + item.personelNumber + `" editItem_email="` + item.email + `" editItem_group="` + item.group + `">ویرایش
                        <i class="material-icons">edit</i></a>
                        <a class="waves-effect waves-light btn delete" id="btnDelete" username="` + item.username + `" uniqueId="` + item._id + `" >حذف
                        <i class="material-icons">delete</i></a>
                    </div>   
                </div>`);
            });

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
                    firstName,
                    lastName,
                    mobileNumber,
                    phoneNumber,
                    personelNumber,
                    email,
                    group
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
                                            <div class="input-field col s6">
                                            
                                                <i class="material-icons prefix">account_circle</i>
                                                <input id="firstName" value="` + firstName + `" type="text" class="validate">
                                                <label class="active" for="firstName">نام: </label>
                                            </div>
                                            <div class="input-field col s6">
                                                <input id="lastName" value="` + lastName + `" type="text" class="validate">
                                                <label class="active" for="lastName">نام خانوادگی:</label>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="input-field col s6 pNums">
                                                <input id="personelNumber"  value="` + personelNumber + `" class="validate">
                                                <label class="active" for="personelNumber">شماره کارمندی :</label>
                                            </div>
                                        </div>
                                        <div class="row password">
                                            <p>
                                                <input type="checkbox" id="cbxChangePassword"/>
                                                <label for="cbxChangePassword">تغییر کلمه عبور</label>
                                            </p>
                                            <div class="input-field col s6">
                                                <input hidden id="password1" type="password" class="pass">
                                                <!-- <input disabled id="password1" type="password" class="validate"> -->
                                                <label for="password1"  hidden class="pass">کلمه عبور: </label>
                                            </div>
                                            <div class="input-field col s6">
                                                <input  hidden id="password2" type="password" class="pass">
                                                <label for="password2"  hidden class="pass">تکرار کلمه عبور: </label>
                                            </div>
                                        </div>  
                                        <div class="row">
                                            <div class="input-field col s12">
                                                <i class="material-icons prefix">email</i>
                                                <input id="email" value="` + email + `" type="email" class="validate">
                                                <label class="active" for="email">ایمیل: </label>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="input-field col s6">
                                                <i class="material-icons prefix">phone_android</i>
                                                <input id="mobile" value="` + mobileNumber + `" type="tel" required class="validate">
                                                <label class="active" for="mobile">شماره همراه: </label>
                                            </div>
                                            <div class="input-field col s6">
                                                <i class="material-icons prefix">phone</i>
                                                <input id="phone" value="` + phoneNumber + `" type="tel" class="validate">
                                                <label class="active" for="phone">شماره داخلی: </label>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="input-field col s12">
                                                <select id="userGroup">
                                                    
                                                </select>
                                                <label>گروه کاربری</label>
                                            </div>
                                        </div>
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
                
                fillSelectGroup(group);

                $('#cbxChangePassword').change(function () {
                    if ($('#cbxChangePassword').is(":checked")) $('.pass').show();
                    else $('.pass').toggle();
                })

                $('.edit').modal();

                $('#btnUpdateUser').click(function (e) {

                    userEdit.firstName = $('#firstName').val();

                    //personnels: $(this).attr('editItem_personnels'),
                    userEdit.lastName = $('#lastName').val();
                    userEdit.personelNumber = $('#personelNumber').val();
                    userEdit.lastName = $('#lastName').val();

                    if ($("#password1").val() !== $("#password2").val()) {
                        return false;
                        alert("کلمه عبور و تکرار آن مشابه نیستند!")
                    }
                    userEdit.password = $("#password1").val();
                    userEdit.email = $("#email").val();
                    userEdit.mobileNumber = $("#mobile").val();
                    userEdit.phoneNumber = $("#phone").val();
                    // userEdit.permitedChannels = $("#permitedChannels").val();
                    userEdit.group = $("#userGroup").val();

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

            $('.delete').click(function (e) {
                var del = confirm("آیا قصد پاک کردن « " + $(this).attr('username') + " » را دارید؟");
                if (del == true) {
                    var userId = $(this).attr('uniqueId');
                    $('.card[uniqueId=' + userId + ']').fadeOut();
                    delete_users(userId);
                    alert("«" + $(this).attr('username') + "» با موفقیت پاک شد.");
                }

            })
        })

        function edit_users(userEdit, callback) {
            post('/users/update', {
                _id: userEdit.id,
                firstName: userEdit.firstName,
                lastName: userEdit.lastName,
                password: userEdit.password,
                email: userEdit.email,
                mobileNumber: userEdit.mobileNumber,
                phoneNumber: userEdit.phoneNumber,
                personelNumber: userEdit.personelNumber,
                // permitedChannels: userEdit.permitedChannels,
                group: userEdit.group,
                // type: userEdit.type,

            }, function (response) {
                callback(response);
            })
        }

        function delete_users(userId) {
            post('/users/status', {
                _id: userId,
                status: -1
            }, function (response) {
            })
        }
        $('.pNums').persiaNumber();
    });

})(jQuery);