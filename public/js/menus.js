
(function($){
  
$("#navbar").append(`

  <div id="navbar">
  <ul id="dropdown1" class="dropdown-content">
      <li>
          <a href="userProfile.html">حساب کاربری</a>
      </li>
      <li>
          <a href="#" class="logout">خروج</a>
      </li>

  </ul>
  <nav class="light-blue darken-3">
      <div class="nav-wrapper">
          <a href="#" data-activates="mobile-demo" class="right button-collapse">
              <i class="material-icons">menu</i>
          </a>
          <a href="#!" class="right local-nav-title">واحد مرکزی خبر</a>

          <ul class="left">
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
                  <a href="votingResult.html">نظرسنجی ها</a>
              </li>
              <li>
                  <a href="usersList.html">مدیریت کاربران</a>
              </li>
              <li>
              <a href="ConnectAdmin.html">ارتباط با ادمین</a>
          </li>
          </ul>
      </div>
  </nav>
</div>

`
); 
  })(jQuery);