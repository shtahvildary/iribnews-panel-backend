(function ($) {
  const fileserver = "http://localhost:9000";    

    $("#navbar").append(`

  <div id="navbar">
  <ul id="dropdown1" class="dropdown-content" style="direction:ltr">
      <li>
          <a href="userProfile.html">حساب کاربری</a>
      </li>
      <li>
          <a href="#" class="logout">خروج</a>
      </li>

  </ul>
  <nav class="light-blue darken-3" id="mainNav">
      <div class="nav-wrapper">
      
     <!-- <div class="col s12">
        <a href="#!" class="breadcrumb">First</a>
        <a href="#!" class="breadcrumb">Second</a>
        <a href="#!" class="breadcrumb">Third</a>
      </div> --!>
   
          <a href="#" data-activates="mobile-demo" class="right button-collapse">
              <i class="material-icons">menu</i>
          </a>
            <div id="title" class="right">
            </div>
          <ul class="left" >
              <li id="nav-logout" class="local-nav-items-large">
                  <a href="#" class="logout">خروج</a>
              </li>
              <li id="nav-account" class="local-nav-items-large">
                  <a href="userProfile.html">حساب کاربری</a>
              </li>

              <li class="local-nav-items-small">
                  <a class="dropdown-button" href="#!" data-activates="dropdown1">منو
                      <i class="material-icons right">arrow_drop_down</i>
                  </a>
              </li>
          </ul>

          <ul class="right side-nav fixed " id="mobile-demo">
              <li>
                  <a href="../index.html">داشبورد</a>
              </li>
              <li>
                  <a href="charts.html">نمودار ها</a>
              </li>

              <li>
                  <a href="messages.html">پیام ها</a>
              </li>
              <li>
                  <a href="voteItems.html">برنامه ها و کانال ها</a>
              </li>
              <li>
                  <a href="competitions.html">مسابقه</a>
              </li>
              <li>
                  <a href="VSResult.html">نظرسنجی ها</a>
              </li>
              <li>
                  <a href="comments.html">دیدگاه مخاطبان</a>
              </li>
              <li>
                  <a href="externalReports.html">گزارش های تحلیلی</a>
              </li>`);


    post('/departments/select/one', {}, function (response) {
        var department = response.department;
        $('#title').append(
            (department.logo?`
            <div class="col s2">
        <img class="circle  right responsive-img"style="max-width:70% max-width:70%" src="`+fileserver+department.logo+`" > `:'')+
        `          
          <a  class="right local-nav-title" >`+ department.title + `</a>
          <div>
      `)
    })

    post('/users/type', {}, function (response) {
        var userType = response.type;
        $("#mobile-demo").append(`
                

            ` + (userType != 3 ? (`
            <li>
                <a href="usersList.html">مدیریت کاربران</a>
                <a href="groupsList.html">مدیریت گروه ها</a>`+
                (userType<2?`
                <a href="departmentsList.html">مدیریت واحدها</a>`
                :"" ) +`

            </li>`) : '') + `
            ` + (userType != 0 ? (
                `
            <li>
                <a href="connectAdmin.html">ارتباط با ادمین</a>
            </li>`) : '') + `
            ` + (userType == 0 ? (
                `
                <li>
                    <a href="management.html">ابزارهای مدیریتی</a>
                </li>`) : '') + `
            <li>
                  <a href="aboutUs.html">درباره ما</a>
              </li>
          </ul>
      </div>
  </nav>

  
</div>

`);
    })
// $("#mainNav").append(`
// <div>
// <nav>
//   <div class="nav-wrapper">
//     <div class="col s12">
//       <a href="#!" class="breadcrumb">First</a>
//       <a href="#!" class="breadcrumb">Second</a>
//       <a href="#!" class="breadcrumb">Third</a>
//     </div>
//   </div>
// </nav>
// </div>
// `)


})(jQuery);


