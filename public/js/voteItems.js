(function ($) {
    function voteItemList(voteItemsArray){
        voteItemsArray.map(function (item) {
            $('#voteItems-list').append(`

            <div class="card" unqueId=` + item._id + `>
                <div class="card-content">
                    <p>` + item.title + `</p>
                    <p>` + item.description + `</p>
                    <p>` + item.personnels + `</p>
                    <a class="waves-effect waves-light btn modal-trigger edit" id="btnEdit-` + item._id + `" href="#editModal" editItem_id="` + item._id + `" editItem_title="` + item.title + `" editItem_description="` + item.description + `" editItem_personnels="` + item.personnels + `">ویرایش
                    <i class="material-icons">edit</i></a>
                    <a class="waves-effect waves-light btn delete" id="btnDelete" title="` + item.title + `" uniqueId="` + item._id + `" >حذف
                    <i class="material-icons">delete</i></a>
                </div>   
            </div>`);
    })
}

    $(function () {

    
    $("#btnVoteItemsAdd").click(function () {
        var voteItemTitle = $("#voteItemTitle").val();
        var type = $('input[name=voteItemType]:checked').val();
        var description = $("#description").val();

        addVoteItem({
            title: voteItemTitle,
            type: type,
            description,
        });
    });
    var addVoteItem = function (voteItem) {
        post('/voteItems/new', voteItem, function (response) {
            if (response.voteItem == false) {
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            } else {
                alert("ثبت اطلاعات با موفقیت انجام شد")
                document.getElementById("newVoteItemForm").reset()
            }
        });
    }

    //show a list of vote items    
    var search_voteItems = function (query) {

        post('/voteItems/search', {
            query: query
        }, function (response) {
            $('#voteItems-list').empty();
            voteItemList(response.voteItemsArray)
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
                search_voteItems(value);
                return false;
            }
        });

        post('/voteItems/all', {}, function (response) {
    
            voteItemList(response.voteItemsArray);
         

            $('.edit').click(function (e) {

                voteItemEdit = {
                    id: $(this).attr('editItem_id'),
                    title: $(this).attr('editItem_title'),
                    personnels: $(this).attr('editItem_personnels'),
                    description: $(this).attr('editItem_description'),
                }
                $('#voteItems-list').after(`
            
            <!-- Modal Trigger -->
            <div id="editModal" class="modal edit rtl">
                <div class="modal-content">
                    <h5>ویرایش</h5>
                    <p>
                            <form>
                            <div class="row">
                                <div class="input-field col s12">
                                    <input id="voteItemTitle" type="text" class="validate" value="` + voteItemEdit.title + `">
                                    <label class="active" for="voteItemTitle">عنوان</label>
                                </div>
                                </div>
                                
                                <div class="row">
                                <div class="input-field col s12">
                                    <textarea id="description" type="text" class="materialize-textarea">` + voteItemEdit.description + `</textarea>
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
            `);
                $('.edit').modal();


                $('#btnVoteItemsUpdate').click(function (e) {

                    voteItemEdit.title = $('#voteItemTitle').val();
                    //id: $(this).attr('editItem_id'),

                    //personnels: $(this).attr('editItem_personnels'),
                    voteItemEdit.description = $('#description').val();

                    // var status=edit_voteItems(voteItemEdit);
                    if (edit_voteItems(voteItemEdit)) {
                        // if (status==true) {
                        $('#editModal').modal('close');
                        alert("به روز رسانی با موفقیت انجام شد.");
                    } else {
                        alert("در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. کدخطا: " + status)
                    }
                })
            })

            $('.delete').click(function (e) {
                
                var del = confirm("آیا قصد پاک کردن « " + $(this).attr('title') + " » را دارید؟");
                if (del == true) {
                    var voteItemId = $(this).attr('uniqueId');
                    $('.card[uniqueId=' + voteItemId + ']').fadeOut();
                    delete_voteItems(voteItemId);
                    alert("«" + $(this).attr('title') + "» با موفقیت پاک شد.");
                }
            })
        })

        function edit_voteItems(voteItemEdit) {
            post('/voteItems/update', {
                _id: voteItemEdit.id,
                title: voteItemEdit.title,
                type: voteItemEdit.type,
                description: voteItemEdit.description,
                channelId: voteItemEdit.channelId,
                personnels: voteItemEdit.personnels,
            }, function (response) {
                return new Promise(function (resolve, reject) {
                    resolve(response)
                })
                // if(response){return true}
                // return false

            })

        }

        function delete_voteItems(voteItemId) {

            post('/voteItems/disable', {
                _id: voteItemId
            }, function (response) {
            })
        }
        $('.pNums').persiaNumber();

    })
    })(jQuery);