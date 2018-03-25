(function ($) {
    function fillSelectDepartment() {
        post('/departments/all', {}, function (response) {

            $("#department").append(`
            <option value="all"  selected>همه</option>
            `)
            $(response.departmentsArray).each(function (i, department) {
                $("#department").append(`
            <option value="`+ department._id + `" >` + department.title + `</option>
            `)

            })
            $('select').material_select();

        })
    }

    function fillSelectvoteItems() {
        post('/voteItems/all', {}, function (response) {

            $("#voteItems").append(`
            <option value="all"  selected>همه</option>
            `)
            $(response.voteItemsArray).each(function (i, voteItem) {
               
                $("#voteItems").append(`
            <option value="`+ voteItem._id + `"  >` + voteItem.title + `</option>
            `)

            })
            $('select').material_select();

        })
    }
    $(function () {
        post('/users/type', {}, function (response) {
            var userType = response.type;
            
            $("#filters").append(`
                    
    
                ` + (userType < 2 ? (`
                <div class="input-field col s6 ">
              <select id="department">
              </select>
              <label for="department">واحد:</label>
          </div>`+
        fillSelectDepartment()):''))
        fillSelectvoteItems();
    })
        


        post('/votes/all/comments', {}, function (response) {
            var commentsCount = 0;
            console.log(response)
            response.votesArray.map(function (item) {
                if (item.comment) {
                    commentsCount++;

                    $('#comments-list').append(`
                        <div class="card rtl">
                        <div class="card-content activator ">
                            <p>پیام: `+ item.comment.text + `</p>
                            <p>مربوط به: `+ item.comment.destinationId.title + `</p>
                            <p> در تاریخ: `+ item.date + `</p>
                        </div>   
                    </div>`);
                }
            })
            if (commentsCount == 0)
                $('#comments-list').append(`تا کنون هیچ دیدگاهی ثبت نشده است.`);
        })
        $('.pNums').persiaNumber();
   
    })
})
    (jQuery);