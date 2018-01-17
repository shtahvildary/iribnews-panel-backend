(function ($) {
    //update user profile
    $(function () {
        // if ($.cookie("token")&&!$.cookie("id")) {
        //     window.location.replace("../login.html");
        // }
        // isLoggedin();
        $("#btnUpdateUser").click(function () {
            var firstName = $("#first_name").val();
            var lastName = $("#last_name").val();
            var email = $("#email").val();
            var phoneNumber = $("#phone").val();

            // var password;
            // var status;
            // var permitedChannelsId;
            updateUser({
                // username:username,
                // password:password,
                firstName: firstName,
                lastName: lastName,
                email: email,
                phoneNumber: phoneNumber,
                // status:status,
                // permitedChannelsId:permitedChannelsId,
                // type:type
            });
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


        var userEdit;

        //Add new user
        $("#btnAddUser").click(function () {
            var firstName = $("#firstName").val();
            var lastName = $("#lastName").val();
            var personelNumber = $("#personelNumber").val();
            if ($("#password1").val() !== $("#password2").val()) {
                return false;
            }
            var password = $("#password1").val();
            var email = $("#email").val();
            var phoneNumber = $("#phone").val();
            var permitedChannels = $("#permitedChannels").val();
            var type = $('input[name=type]:selected').val();

            // var type = $('input[name=voteItemType]:checked').val();

            addUser({
                firstName: firstName,
                lastName: lastName,
                personelNumber: personelNumber,
                password: password,
                email: email,
                phoneNumber: phoneNumber,
                permitedChannels: permitedChannels,
                type: type
            });
        });

    };

    var addUser = function (user) {
        post('/users/register', user, function (response) {
            if (response.user == false) {
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            } else {
                alert("ثبت اطلاعات با موفقیت انجام شد")
                // $("#newVoteItemForm").reset();
                document.getElementById("newUserForm").reset()
                // document.getElementById("voteItemTitle").reset()
                // document.getElementById("description").reset()
            }
        });
    }

    //search in users list   
    var search_users = function (query) {

        post('/users/all', {
            query: query
        }, function (response) {
            // console.log('search vote items', response)
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
            // console.log('query', {
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
                        <p>` + item.phoneNumber + `</p>
                        <p>` + item.email + `</p>
                        <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` + item._id + `" href="#editModal" editItem_id="` + item._id + `" editItem_firstName="` + item.firstName + `" editItem_lastName="` + item.lastName + `" editItem_phoneNumber="` + item.phoneNumber + `">ویرایش
                        <i class="material-icons">edit</i></a>
                        <a class="waves-effect waves-light btn delete" id="btnDelete" username="` + item.username + `" uniqueId="` + item._id + `" >حذف
                        <i class="material-icons">delete</i></a>
                    </div>   
                </div>`);
        });

        // <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` + item._id + `" href="#editModal" editItem="` + JSON.stringify(item)+ `">ویرایش



        $('.edit').click(function (e) {

            //console.log($(this).attr('editItem'));

            // var voteItemEdit=JSON.parse($(this).attr('editItem'));

            userEdit = {
                id: $(this).attr('editItem_id'),
                firstName: $(this).attr('editItem_firstName'),
                lastName: $(this).attr('editItem_lastNames'),
                phoneNumber: $(this).attr('editItem_phoneNumber'),
            }
            $('#users-list').after(`
            
            <!-- Modal Trigger -->
            <div id="editModal" class="modal edit">
                <div class="modal-content">
                    <h5>ویرایش</h5>
                    <p>
                            <form>
                            <div class="row">
                    <div class="input-field col s6">
                        <i class="material-icons prefix">account_circle</i>
                        <input id="firstName" type="text" class="validate">
                        <label for="firstName">نام: </label>
                    </div>
                    <div class="input-field col s6">
                        <input id="lastName" type="text" class="validate">
                        <label for="lastName">نام خانوادگی:</label>
                    </div>
                </div>
                <div class="input-field col s6">
                    <input id="personelNumber" type="text" class="validate">
                    <label for="personelNumber">شماره کارمندی :</label>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input disabled value="I am not editable" id="username" type="text" class="validate">
                        <label for="username">شناسه کاربر: </label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">

                        <input disabled id="password1" type="password" class="validate">
                        <label for="password1">کلمه عبور: </label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">

                        <input disabled hidden id="password2" type="password" class="validate">
                        <label hidden for="password2">تکرار کلمه عبور: </label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="material-icons prefix">email</i>
                        <input id="email" type="email" class="validate">
                        <label for="email">ایمیل: </label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <i class="material-icons prefix">phone</i>
                        <input id="phone" type="tel" class="validate">
                        <label for="phone">شماره تماس: </label>
                    </div>
                </div>
                <div class="row">
                    <p>
                        <input type="checkbox" id="permitedChannels" />
                        <label for="permitedChannels">permitedChannels</label>
                    </p>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <p>
                        <select id="type">
                            <option value="" disabled selected>انتخاب کنید...</option>
                            <option value="1">مدیر</option>
                            <option value="2">کاربر</option>
                            <option value="0">ادمین</option>
                        </select>
                        <label>گروه کاربری</label>
                        </p>
                    </div>
                </div>    
                            </form>
            
                            <div class="modal-footer">
                                <button class="btn waves-effect waves-light" id="btnUpdateUser">ثبت
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
            `);
            $('.edit').modal();


            $('#btnUpdateUser').click(function (e) {

                // console.log(voteItemEdit);
                userEdit.firstName = $('#firstName').val();
                //id: $(this).attr('editItem_id'),

                //personnels: $(this).attr('editItem_personnels'),
                userEdit.lastName = $('#lastName').val();
                userEdit.personelNumber = $('#personelNumber').val();
                userEdit.lastName = $('#lastName').val();

                if ($("#password1").val() !== $("#password2").val()) {
                    return false;
                }
                userEdit.password = $("#password1").val();
                userEdit.email = $("#email").val();
                userEdit.phoneNumber = $("#phone").val();
                userEdit.permitedChannels = $("#permitedChannels").val();
                userEdit.type = $('input[name=type]:selected').val();

                // console.log('voteItemEdit:', voteItemEdit)
                // var status=edit_voteItems(voteItemEdit);
                // console.log('status:',status)
                if (edit_users(userEdit)) {
                    // if (status==true) {
                    $('#editModal').modal('close');
                    alert("به روز رسانی با موفقیت انجام شد.");
                } else {
                    alert("در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. کدخطا: " + status)
                }
            })
        })

        $('.delete').click(function (e) {

            var del = confirm("آیا قصد پاک کردن « " + $(this).attr('username') + " » را دارید؟");
            if (del == true) {
                var userId = $(this).attr('uniqueId');

                // console.log('query', {
                //     text: voteItemId
                // })
                $('.card[uniqueId=' + userId + ']').fadeOut();
                delete_users(userId);
                alert("«" + $(this).attr('username') + "» با موفقیت پاک شد.");
            }
        })
    })

    function edit_users(userEdit) {
        // console.log('voteItemEdit: ', voteItemEdit);
        post('/users/update', {
            _id: userEdit.id,
            firstName: userEdit.firstName,
            lastName: userEdit.lastName,
            password: userEdit.password,
            email: userEdit.email,
            phoneNumber: userEdit.phoneNumber,
            permitedChannels: userEdit.permitedChannels,
            type: userEdit.type,

        }, function (response) {
            // console.log('edit vote item', response);
            return new Promise(function (resolve, reject) {
                resolve(response)
            })
            // if(response){return true}
            // return false

        })
    }

    function delete_users(userId) {
        // console.log('voteItemId: ', voteItemId);

        post('/users/status', {
            _id: userId,
            status: -1
        }, function (response) {
            // console.log('delete vote item', response);

        })
    }
});
})(jQuery);