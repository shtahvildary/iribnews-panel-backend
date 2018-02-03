(function ($) {
    function showProfile(user) {
        console.log('user: ', user)
        $('#profile').append(`
        <form class="col s12" >

        <form class="col s12" id="UserProfileForm">
        <div class="row">
            <div class="input-field col s6">
                <i class="material-icons prefix">account_circle</i>
                <input id="firstName" disabled value="` + user.firstName + `" type="text" class="validate">
                <label class="active" for="firstName">نام: </label>
            </div>
            <div class="input-field col s6">
                <input id="lastName" disabled value="` + user.lastName + `" type="text" class="validate">
                <label class="active" for="lastName">نام خانوادگی:</label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s6">
                <input id="personelNumber"  disabled value="` + user.personelNumber + `" class="validate">
                <label class="active" for="personelNumber">شماره کارمندی :</label>
            </div>
        </div>

        <div class="row">
            <div class="input-field col s12">
                <i class="material-icons prefix">email</i>
                <input id="email" disabled value="` + user.email + `" type="email" class="validate">
                <label class="active" for="email">ایمیل: </label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s12">
                <i class="material-icons prefix">phone</i>
                <input id="phone" disabled value="` + user.phoneNumber + `" type="tel" class="validate">
                <label class="active" for="phone">شماره تماس: </label>
            </div>
        </div>
        <div class="row">
                </form>
                <a class="waves-effect waves-light btn" id="btnProfileEdit" >اصلاح
                    <i class="material-icons">edit</i>
                </a>
        `)
    }
    $(function () {

        post('/users/findeUser', {}, function (user) {
            showProfile(user)

            $("#btnProfileEdit").click(function (e) {
                $("input").prop('disabled', false);
                $('#profile').after(`
                <div class="row password">
                <p>
                <input type="checkbox" id="cbxChangePassword"/>
                <label for="cbxChangePassword">تغییر کلمه عبور</label>
                </p>
                <div class="input-field pass col s12" >
                        <input class="pass" hidden id="password" type="password" >
                        <label for="password"  hidden class="pass">کلمه عبور فعلی: </label>
                    </div>
                    <div class="input-field pass col s6" >
    
                        <input class="pass" hidden id="newPass1" type="password" >
                        <label for="newPass1"  hidden class="pass">کلمه عبور جدید: </label>
                    </div>
                    <div class="input-field pass col s6" >
                        <input  class="pass" hidden id="newPass2" type="password" >
                        <label for="newPass2"  hidden class="pass">تکرار کلمه عبور جدید: </label>
                    </div>
                </div>
                <a class="waves-effect waves-light btn" id="btnProfileUpdate" >ثبت
                        <i class="material-icons">edit</i>
                    </a>
                    <a class="waves-effect waves-light btn" id="btnProfileCancel" >انصراف
                        <i class="material-icons">cancel</i>
                    </a>`);
                $("#btnProfileEdit").remove();
                $("#btnProfileUpdate").click(function (e) {

                })
                $("#btnProfileCancel").click(function (e, user) {
                    console.log('hiiiii')
                    $("#btnProfileUpdate").replaceWith(`
                        <a class="waves-effect waves-light btn" id="btnProfileEdit" >اصلاح
                            <i class="material-icons">edit</i>
                        </a>
                        `);
                    $("#btnProfileCancel").remove();

                    showProfile(user);

                })
                $('#cbxChangePassword').change(function () {
                    if ($('#cbxChangePassword').is(":checked")) {
                        $('.pass').show();

                    } else {
                        $('.pass').toggle();

                    }

                })
            })
        })

    })




})(jQuery)