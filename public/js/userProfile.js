(function ($) {
    // var pass;

    function showProfile(user) {
        // pass = user.password;
        $('#profile').append(`
        

        <form class="col s12 rtl" id="UserProfileForm">
        <div class="row rtl">
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
                <input id="email" disabled value="` + user.email + `" type="email" class="validate" data-error="!خطا">
                <label class="active" for="email">ایمیل: </label>
            </div>
        </div>
        <div class="row">
            <div class="input-field col s6">
                <i class="material-icons prefix">phone</i>
                <input id="mobile" disabled value="` + user.mobileNumber + `" type="tel" required class="validate">
                <label class="active" for="mobile">شماره تلفن همراه: </label>
            </div>
                <div class="input-field col s6">
            
                <i class="material-icons prefix">phone</i>
                <input id="phone" disabled value="` + user.phoneNumber + `" type="tel" class="validate">
                <label class="active" for="phone">شماره تلفن ثابت: </label>    </div>
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
                $("#email").prop('disabled', false);
                $("#mobile").prop('disabled', false);
                $("#phone").prop('disabled', false);
                
                $('#profile').after(`
                <div class="rtl">
                <div class="row password ">
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
                    </a>
                    </div>`
                );
                $("#btnProfileEdit").remove();

                $("#btnProfileUpdate").click(function (e) {
                    if ($('#cbxChangePassword').is(":checked")) {
                        
                    // if ($("#password").val() != pass) {
                    //     alert("کلمه عبور صحیح نیست...!")
                    //     // $("#password").append(`data-error="!خطا"`)
                    //     return false;

                    // }

                    if ($("#newPass1").val() !== $("#newPass2").val()) {
                        alert("کلمه عبور و تکرار آن مشابه نیستند!")
                        return false;
                    }}
                    var user = {
                        password: $("#newPass1").val(),
                        email: $("#email").val(),
                        mobileNumber: $("#mobile").val(),
                        phoneNumber: $("#phone").val(),
                        personelNumber: $('#personelNumber').val(),
                    }
                    console.log('user:', user)

                    edit_user(user, function (response) {
                        console.log('response', response)

                        if (response.user) {

                            $('#editModal').modal('close');
                            alert("به روز رسانی با موفقیت انجام شد.");
                            location.reload();
                        } else {
                            alert("در به روز رسانی اطلاعات خطایی رخ داده، لطفا دوباره اقدام نمایید. کدخطا: ")
                        }
                    })
                })
                $("#btnProfileCancel").click(function (e, user) {
                    location.reload();

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

        function edit_user(user, callback) {
            // console.log('voteItemEdit: ', voteItemEdit);
            post('/users/update/profile', {
                password: user.password,
                email: user.email,
                mobileNumber: user.mobileNumber,
                phoneNumber: user.phoneNumber,
                personelNumber: user.personelNumber,
            }, function (response) {
                callback(response);
                // console.log('edit vote item', response);
                // return new Promise(function (resolve, reject) {
                //     resolve(response)
                // })
                // if(response){return true}
                // return false
            })
        }
    })
})(jQuery)