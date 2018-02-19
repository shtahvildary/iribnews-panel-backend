(function ($) {

    //new survey
    $("#btnSave").click(function () {
        var newSurvey = {
            title: $("#tbxTitle").val(),
            text: $("#tbxText").val(),
            keyboard: [$("#tbxKeyboard1").val(), $("#tbxKeyboard2").val()],
        }
        if ($("#selectVoteItems").val()) newSurvey.voteItemId = $("#selectVoteItems").val();
        post('/surveys/new', newSurvey, (response) => {
            if (response.error) {
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            } else {
                alert("ثبت اطلاعات با موفقیت انجام شد و درحال ارسال به مخاطبان است.")
                document.getElementById("newSurveyForm").reset()
            }
        })
    })
    $(function () {

        post('/voteItems/all', {}, function (response) {

            $("#selectVoteItems").append(`
            <option value="" disabled selected>انتخاب کنید...</option>
            `)
            jQuery(response.voteItemsArray).each(function (i, voteItem) {
                jQuery("#selectVoteItems").append(`
            <option value="`+ voteItem._id + `">` + voteItem.title + `</option>
            `)

            })
            $('select').material_select();

        })

    });
})(jQuery);