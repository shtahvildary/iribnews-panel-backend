(function ($) {
    $(function () {
        post('/users/findeUser', {}, function (response) {
            console.log('user: ',response)
            $('#profile').append(`
            <form class="col s12" >

            <form class="col s12" id="UserProfileForm">
            <div class="row">
                <div class="input-field col s6">
                    <i class="material-icons prefix">account_circle</i>
                    <input id="firstName" disabled value="` + response.firstName + `" type="text" class="validate">
                    <label class="active" for="firstName">نام: </label>
                </div>
                <div class="input-field col s6">
                    <input id="lastName" disabled value="` + response.lastName + `" type="text" class="validate">
                    <label class="active" for="lastName">نام خانوادگی:</label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s6">
                    <input id="personelNumber"  disabled value="` + response.personelNumber + `" class="validate">
                    <label class="active" for="personelNumber">شماره کارمندی :</label>
                </div>
            </div>

            <div class="row">
                <div class="input-field col s12">
                    <i class="material-icons prefix">email</i>
                    <input id="email" disabled value="` + response.email + `" type="email" class="validate">
                    <label class="active" for="email">ایمیل: </label>
                </div>
            </div>
            <div class="row">
                <div class="input-field col s12">
                    <i class="material-icons prefix">phone</i>
                    <input id="phone" disabled value="` + response.phoneNumber + `" type="tel" class="validate">
                    <label class="active" for="phone">شماره تماس: </label>
                </div>
            </div>
            <div class="row">
                    </form>
            
                    <a class="waves-effect waves-light btn" id="btnProfileEdit" href="#">اصلاح
                        <i class="material-icons">edit</i>
                    </a>
            `)
        })
        $("#btnProfileEdit").click(function(e){
            $("input").prop('disabled', false);
        })
    })
})(jQuery)