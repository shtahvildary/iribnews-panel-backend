(function ($) {
    
    // $(function () {
        console.log('HHHHIIIIII')
        post('/users/findeUser', {}, function (response) {
            console.log('user: ',response)
            $('#profileForm').append(`
            <form class="col s12" >

            <div class="row">
                    <div class="input-field col s6">
                            <i class="material-icons prefix">account_circle</i>
                        <input id="first_name" disabled value="`+response.username+`" type="text" class="validate">
                        <label class="active" for="first_name">نام: </label>
                    </div>
                    <div class="input-field col s6">
                        <input id="last_name" type="text" class="validate">
                        <label for="last_name">نام خانوادگی:</label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                        <input  id="username" type="text" class="validate">
                        <label for="username">شناسه کاربر: </label>
                    </div>
                </div>
                <div class="row">
                    <div class="input-field col s12">
                                                   
                        <input disabled id="password1" type="password" class="validate">
                        <label for="password1">کلمه عبور: </label>
                    </div>
                </div>
                <div class="row">
                        <div class="input-field col s12">
                                                       
                            <input disabled hidden id="password2" type="password" class="validate">
                            <label hidden for="password2">تکرار کلمه عبور: </label>
                        </div>
                    </div>
                <div class="row">
                    <div class="input-field col s12">
                            <i class="material-icons prefix">email</i>                        
                        <input id="email" type="email" class="validate">
                        <label for="email">ایمیل: </label>
                    </div>
                </div>
                <div class="row">
                        <div class="input-field col s12">
                                <i class="material-icons prefix">phone</i>
                            <input id="phone" type="tel" class="validate">
                            <label for="phone">شماره تماس: </label>
                        </div>
                    </div>
                    </form>
            
                    <a class="waves-effect waves-light btn" href="profileUpdate.html">اصلاح
                        <i class="material-icons">edit</i>
                    </a>
            `)
        })
    // })
})