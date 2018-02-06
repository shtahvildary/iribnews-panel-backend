(function ($) {
    //new survey
    $("#btnSave").click(function () {
        console.log('btnSave is clicked...')
        var newSurvey = {
            title: $("#tbxTitle").val(),
            // voteItemId,
            text: $("#tbxText").val(),
            keyboard: [$("#tbxKeyboard1").val(), $("#tbxKeyboard2").val()],
        }
        post('/surveys/new', newSurvey, function (response) {
            if (response.error) {
                alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
            } else {
                alert("ثبت اطلاعات با موفقیت انجام شد")
                // document.getElementById("newSurveyForm").reset() 
            }
        })
    })
    $(function () {

    });
})(jQuery);