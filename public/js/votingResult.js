(function ($) {
    function fillSelectDepartment() {
        post("/departments/all", {}, function (response) {
            $("#drpDepartments").append(`
                <option value=""  selected>همه</option>
                `);
            $(response.departmentsArray).each(function (i, department) {
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

    function fillSelectvoteItems(deparments) {
        var route;
        var data;
        if (deparments == "all") {
            route = "/voteItems/all";
        } else {
            route = "/voteItems/search";
            data = { departmentId: deparments };
            console.log(data)
        }
        post(route, data, function (response) {
            $("#drpVoteItems").empty();
            $("#drpVoteItems").append(`
                <option value=""  selected>همه</option>
                `);
            $(response.voteItemsArray).each(function (i, voteItem) {
                $("#drpVoteItems").append(
                    `
                <option value="` +
                    voteItem._id +
                    `"  >` +
                    voteItem.title +
                    `</option>
                `
                );
            });
            $("select").material_select();
        });
    }

    function cardsAppend(response) {
        
        console.log(response)
        response.votesArray.map(function (item) {

            $('#votingResult-list').append(`
            <div class="card rtl">
            <div class="card-content activator ">
            <p>"` + item.title + `" از  ` + item.count + ` ر‌ای ثبت شده ` + item.score + ` امتیاز کسب کرده است.</p> 
            </div>   
            </div>`);

        })
    }

    $(function () {
        $('select').material_select();
        // fillSelectDepartment();

        //search in votingResults list   
        var search_votingResult = function (departmentId, destinationId) {

            post('/votes/search/scores', {
                departmentId, destinationId
            }, function (response) {
                $('#votingResult-list').empty();
                if (response.votesArray.length == 0)
                    $("#votingResult-list").append(`<div class="rtl">نتیجه ای یافت نشد.</div>`);
                else
                    cardsAppend(response)
            })
        }
        $('#search').keypress(function (e) {
            var departmentId, voteItemId
            if (e.which == 13) {
                departmentId = $("#drpDepartments").val();
                voteItemId = $("#drpVoteItems").val();
                search_votingResult(departmentId, voteItemId);
                return false;
            }
        });
        post("/users/type", {}, function (response) {
            var userType = response.type;
            var departments;
            if (userType < 2) {
                $("#drpDepartments").prop("disabled", false);
                deparments = "all";
            } else {
                post("/departments/select/one", {}, function (response) {
                    departments = response.department;
                    $("#drpDepartments").val(departments.departmentId);
                });
            }
            fillSelectvoteItems(departments);
            fillSelectDepartment();
        });


        post('/votes/all/scores', {}, function (response) {
            cardsAppend(response)

        })
        $('.pNums').persiaNumber();

        $("#drpDepartments").change(function () {
            fillSelectvoteItems($("#drpDepartments").val());
        });
        $("#drpVoteItems").change(function () {
            var departmentId, voteItemId;
                departmentId = $("#drpDepartments").val();
                voteItemId = $("#drpVoteItems").val();
            search_votingResult( departmentId, voteItemId);
        });
    })

})
    (jQuery);