(function ($) {

    //new competition
    $("#btnSave").click(function () {
        var keyboard = [];
        answer=$("#tbxCorrectAnswer").val()
        for (i = 1; i <= tbxKeyboardCount; i++) {
            var correctAnswer = false;
            if ($("#tbxKeyboard" + i).val()) {
                if(answer==i)
                    correctAnswer = true;
                var key = {
                    text: $("#tbxKeyboard" + i).val(),
                    correctAnswer
                }
                keyboard.push(key)
            }
        }
        if ($("#tbxTitle").val() && $("#tbxText").val() && keyboard&&$("#tbxCorrectAnswer").val()) {
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
        <input id="tbxKeyboard`+ tbxKeyboardCount + `" type="text" class="validate pNums" placeholder="گزینه `+tbxKeyboardCount+`">
        </label>

        `)
        
        $("#tbxCorrectAnswer").attr("max",tbxKeyboardCount)
    })

    $("#btnCancel").click(function (e) {
        window.location.replace("../html/competitions.html");
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
        $('.pNums').persiaNumber();
        
    });
    
})(jQuery);