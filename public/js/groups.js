(function ($) {
    //read permissions
    // const fs = require("fs");
    // let rawdata = fs.readFileSync("/Volumes/MyDrive/MyProjects/iribnews/iribnews-panel-backend/routes/permissions.json");
    // let permissionsList = JSON.parse(rawdata);

    var permissionsList = [{
            "code": 101,
            "title": "Add new user to administrators-group",
            "description": "افزودن کاربر جدید به گروه مدیران"
        },
        {
            "code": 102,
            "title": "udate a user in administrators-group",
            "description": "تغییر مشخصات کاربر در گروه مدیران"
        },
        {
            "code": 104,
            "title": "Add new user to users-group",
            "description": "افزودن کاربر جدید به گروه کاربران"
        },
        {
            "code": 105,
            "title": "udate a user in users-group",
            "description": "تغییر مشخصات کاربر در گروه کاربران"
        },
        {
            "code": 106,
            "title": "Add new users-group",
            "description": "افزودن گروه کاربری جدید"
        },
        {
            "code": 106,
            "title": "update a users-group",
            "description": "تغییر مشخصات گروه کاربری "
        },
        {
            "code": 111,
            "title": "view messages",
            "description": "مشاهده پیامها "
        },
        {
            "code": 112,
            "title": "send reply to messages",
            "description": "ارسال پاسخ به پیامها "
        },
        {
            "code": 113,
            "title": "edit replys",
            "description": "ویرایش پاسخهای ارسال شده "
        },
        {
            "code": 121,
            "title": "add new survey",
            "description": "افزودن نظرسنجی جدید"
        },
        {
            "code": 122,
            "title": "add new voteItem",
            "description": "افزودن کانال یا برنامه جدید"
        },
        {
            "code": 123,
            "title": "view surveys and voteItem results ",
            "description": "مشاهده نتایج نظرسنجی ها"
        },
        {
            "code": 131,
            "title": "view charts",
            "description": "افزودن نظرسنجی جدید"
        }
    ]

    function fillPermissions(cbxListId) {
        jQuery(permissionsList).each(function (i, item) {
            jQuery('.cbxPermissions-list').append(`
        <input type="checkbox" id="cbxPermissions-` + i + `" value="` + item.code + `"/>   
        <label class="active" for="permissions">` + item.description + `</label>
        `)
        })
    }

    fillPermissions();
    //add group 
    $("#btnAddGroup").click(function () {

        console.log('btnAddGroup is clicked...');
        var title = $("#title").val();
        var type = $("#type").val();
        var permissions = []
        for (var i = 0; i < permissionsList.length; i++) {
            if ($('#cbxPermissions-' + i).is(":checked")) permissions.push($('#cbxPermissions-' + i).val())
        }
        var description = $("#description").val();
        var group = {
            title: title,
            type: type,
            permissions: permissions,
            description: description,
        };
        console.log(group);
        //  var newGroup=function (group) {
        post('/groups/new', group, function (response) {
            console.log(response)
            if (response.error)
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            else {
                alert("ثبت اطلاعات با موفقیت انجام شد")
                document.getElementById("newGroupForm").reset()
            }
        });
    });

    // if ($.cookie("token")&&!$.cookie("id")) {
    //     window.location.replace("../login.html");
    // }
    // isLoggedin();
    $("#btnUpdateGroup").click(function () {

        var title = $("#title").val();
        var type = $("#type").val();
        var permissions;
        var description = $("#description").val();

        updategroup({
            title: title,
            type: type,
            permissions: permissions,
            description: description,
        });

    });

    var updateGroup = function (group) {
        post('/groups/update', group, function (response) {
            if (response.group == false) {
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            } else {
                alert("ثبت اطلاعات با موفقیت انجام شد")
                window.location.replace("../index.html")
            }
        })
    };


    $(function () {

        $('select').material_select();

        //search in groups list   
        var search_users = function (query) {

            post('/groups/all', {
                query: query
            }, function (response) {
                // console.log('search vote items', response)
                $('#groups-list').empty();
                response.groupsArray.map(function (item) {
                    $('#groups-list').append(`
                    <div class="card">
                    <div class="card-content">     
                    <p>نام گروه:` + item.title + `</p><p> نوع گروه:` + item.type + `</p>
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
                search_groups(value);
                return false;
            }
        });

        //show a list of groups   
        post('/groups/all', {}, function (response) {

            response.groupsArray.map(function (item) {
                $('#groups-list').append(`

                <div class="card" unqueId=` + item._id + `>
                    <div class="card-content">
                        <p>` + item.title + `</p>
                        <p>` + item.type + `</p>
                        <p>` + item.description + `</p>
                        <p>` + item.permissions + `</p>
                        <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` + item._id + `" href="#editModal" editItem_id="` + item._id + `" editItem_title="` + item.title + `" editItem_type="` + item.type + `" editItem_permissions="` + item.permissions + `" editItem_description="` + item.description + `">ویرایش
                        <i class="material-icons">edit</i></a>
                        <a class="waves-effect waves-light btn delete" id="btnDelete" uniqueId="` + item._id + `" >حذف
                        <i class="material-icons">delete</i></a>
                    </div>   
                </div>`);
            });


            $('.edit').click(function (e) {

                var id = $(this).attr('editItem_id');
                var title = $(this).attr('editItem_title');
                var type = $(this).attr('editItem_type');
                var permissions = $(this).attr('editItem_permissions');
                var description = $(this).attr('editItem_description');


                groupEdit = {
                    id: id,
                    title: title,
                    type: type,
                    permissions: permissions,
                    description: description,
                }

                $('#groups-list').after(`
                    <!-- Modal Trigger -->
                    <div class="container">
                        <div id="editModal" class="modal modal-fixed-footer edit rtl">
                            <div class="modal-content">
                                <h5>ویرایش</h5>
                                    <form class="col s12" id="newGroupForm">
                                        <div class="row">
                                            <div class="input-field col s6">
                                                <i class="material-icons prefix">account_circle</i>
                                                <input id="title" value="` + title + `" type="text" class="validate">
                                                <label class="active" for="title">نام گروه: </label>
                                            </div>
                                            <div class="input-field col s6">
                                                <input id="type" value="` + type + `" type="text" class="validate">
                                                <label class="active" for="type">نوع گروه:</label>
                                            </div>
                                        </div>
                                        <div class="row">
                                        دسترسی ها:
                                            <div class="input-field col s6 cbxPermissions-list">
                                                
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
                `);

                fillPermissions();

                $('.edit').modal();

                $('#btnUpdateGroup').click(function (e) {
                    var permissions = []
                    for (var i = 0; i < permissionsList.length; i++) {
                        if ($('#cbxPermissions-' + i).is(":checked")) permissions.push($('#cbxPermissions-' + i).val())
                    }
                    groupEdit.title = $('#title').val();
                    groupEdit.type = $('#type').val();
                    groupEdit.permissions = permissions;
                    groupEdit.description = $('#description').val();
                    console.log('groupEdit:', groupEdit)

                    edit_groups(groupEdit, function (response) {
                        console.log('response', response)

                        if (response.user) {
                            $('#editModal').modal('close');
                            alert("به روز رسانی با موفقیت انجام شد.");
                        } else {
                            alert("در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. کدخطا: ")
                        }
                    })
                })
            })

            $('.delete').click(function (e) {

                var del = confirm("آیا قصد پاک کردن « " + $(this).attr('title') + " » را دارید؟");
                if (del == true) {
                    var groupId = $(this).attr('uniqueId');

                    // console.log('query', {
                    //     text: groupId
                    // })
                    $('.card[uniqueId=' + groupId + ']').fadeOut();
                    delete_groups(groupId);
                    alert("«" + $(this).attr('title') + "» با موفقیت پاک شد.");
                }

            })
        })

        function edit_groups(groupEdit, callback) {
            // console.log('groupEdit: ', groupEdit);
            post('/users/update', {
                _id: groupEdit.id,
                title: groupEdit.title,
                type: groupEdit.type,
                permissions: groupEdit.permissions,
                description: groupEdit.description,


            }, function (response) {
                callback(response);
            })
        }

        function delete_groups(groupId) {
            post('/groups/status', {
                _id: groupId,
                status: -1
            }, function (response) {
                // console.log('delete group', response);
            })
        }
    });
})(jQuery);