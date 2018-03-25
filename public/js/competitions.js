(function ($) {

    //new competition
    $("#btnSave").click(function () {
        var keyboard = [];
        for (i = 1; i <= tbxKeyboardCount; i++) {
            var correctAnswer = false;
            if ($("#tbxKeyboard" + i).val()) {
                if ($('#rdbKeyboard' + i).is(':checked'))
                    correctAnswer = true;
                var key = {
                    text: $("#tbxKeyboard" + i).val(),
                    correctAnswer
                }
                console.log('key: ', key)
                keyboard.push(key)
            }
        }
        if ($("#tbxTitle").val() && $("#tbxText").val() && keyboard) {
            var newCompetition = {
                title: $("#tbxTitle").val(),
                question: $("#tbxText").val(),
                keyboard,

            }
            if ($("#selectVoteItems").val()) newCompetition.voteItemId = $("#selectVoteItems").val();
            post('/competitions/new', newCompetition, (response) => {
                if (response.error) {
                    alert("ثبت اطلاعات با موفقیت همراه نبود. لطفا دوباره سعی کنید")
                } else {
                    alert("ثبت اطلاعات با موفقیت انجام شد و درحال ارسال به مخاطبان است.")
                    document.getElementById("newCompetitionForm").reset()
                }
            })
        }
        else
            alert("لطفا تمامی موارد را وارد کنید!")

    })
    var tbxKeyboardCount = 2
    $("#btnAddTbxKeyboard").click(function () {
        tbxKeyboardCount++;
        $('#replys').append(`
        <input class="with-gap" name="answers" type="radio"  id="rdbKeyboard`+ tbxKeyboardCount + `" value="` + tbxKeyboardCount + `" />
            <label for="rdbKeyboard`+ tbxKeyboardCount + `">
        <input id="tbxKeyboard`+ tbxKeyboardCount + `" type="text" class="validate">
        </label>

        `)
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