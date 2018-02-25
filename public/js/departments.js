(function ($) {


    
    $("#btnAddDepartment").click(function () {
        console.log('btnAddDepartment clicked...')
        var title = $("#title").val();
        var bot = $("#bot").val();
        var port = $("#port").val();
        var description = $("#description").val();

        addDepartment({
            title,
            bot,
            port,
            description
        });
    });
    var addDepartment = function (department) {
        console.log('addDepartment.... hi...')
        post('/departments/new', department, function (response) {
            if (response.department == false) {
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            } else {
                alert("ثبت اطلاعات با موفقیت انجام شد")
                document.getElementById("newDepartmentForm").reset()     
            }
        });
    }

    //show a list of departments    
    var search_departments = function (query) {

        post('/departments/all', {
            query: query
        }, function (response) {
            // console.log('search vote items', response)
            $('#departments-list').empty();
            response.departmentsArray.map(function (item) {
                $('#departments-list').append(`
                    <div class="card">
                    <div class="card-content">     
                    <p>` + item.title + `</p>
                    <p>` + item.description + `</p>
                    <p>` + item.port + `</p>
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
                search_departments(value);
                return false;
            }
        });

        post('/departments/all', {}, function (response) {
    
            response.departmentsArray.map(function (item) {
                $('#departments-list').append(`

                <div class="card" unqueId=` + item._id + `>
                    <div class="card-content">
                        <p>عنوان: ` + item.title + `</p>
                        <p>توضیحات: ` + item.description + `</p>
                        <p>شماره پورت: ` + item.port + `</p>
                        <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` + item._id + `" href="#editModal" editItem_id="` + item._id + `" editItem_title="` + item.title + `" editItem_description="` + item.description + `">ویرایش
                        <i class="material-icons">edit</i></a>
                        <a class="waves-effect waves-light btn delete" id="btnDelete" title="` + item.title + `" uniqueId="` + item._id + `" >حذف
                        <i class="material-icons">delete</i></a>
                    </div>   
                </div>`);
            });

            $('.edit').click(function (e) {
        

                departmentEdit = {
                    _id: $(this).attr('editItem_id'),
                    title: $(this).attr('editItem_title'),
                    description: $(this).attr('editItem_description'),
                }
                $('#departments-list').after(`
            
            <!-- Modal Trigger -->
            <div id="editModal" class="modal edit rtl">
                <div class="modal-content">
                    <h5>ویرایش</h5>
                    <p>
                            <form>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input id="title" type="text" class="validate" value="` + departmentEdit.title + `">
                                    <label class="active" for="title">عنوان</label>
                                </div>
                                </div>
                                
                                <div class="row">
                                <div class="input-field col s12">
                                    <textarea id="description" type="text" class="materialize-textarea">` + departmentEdit.description + `</textarea>
                                    <label class="active" for="description">توضیحات</label>
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
            `);
                $('.edit').modal();


                $('#btnUpdate').click(function (e) {

                    departmentEdit.title = $('#title').val();
                    departmentEdit.description = $('#description').val();
                   edit_departments(departmentEdit)
                     
                })
            })

            $('.delete').click(function (e) {
                
                var del = confirm("آیا قصد پاک کردن « " + $(this).attr('title') + " » را دارید؟");
                if (del == true) {
                    var departmentId = $(this).attr('uniqueId');

                    $('.card[uniqueId=' + departmentId + ']').fadeOut();
                    delete_departments(departmentId);
                    alert("«" + $(this).attr('title') + "» با موفقیت پاک شد.");
                }
            })
        })

        function edit_departments(departmentEdit) {
            // console.log('departmentEdit: ', departmentEdit);
            post('/departments/update', departmentEdit,function (response) {
                if (response.user == false) {
                    alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
                } else {
                    alert("ثبت اطلاعات با موفقیت انجام شد")
                    window.location.replace("../index.html")
                }
            })
        }

        function delete_departments(departmentId) {
            // console.log('departmentId: ', departmentId);

            post('/departments/disable', {
                _id: departmentId
            }, function (response) {
                // console.log('delete vote item', response);

            })
        }
    })(jQuery);