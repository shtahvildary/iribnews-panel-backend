function div(a, b) {
    return parseInt((a / b));
}
function gregorian_to_jalali(date) {
    var g_y=date.getFullYear();
    var g_m=date.getMonth();
    var g_d=date.getDate();
    var g_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var j_days_in_month = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
    var jalali = [];
    var gy = g_y - 1600;
    var gm = g_m - 1;
    var gd = g_d - 1;

    var g_day_no = 365 * gy + div(gy + 3, 4) - div(gy + 99, 100) + div(gy + 399, 400);

    for (var i = 0; i < gm; ++i)
        g_day_no += g_days_in_month[i];
    if (gm > 1 && ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)))
        /* leap and after Feb */
        g_day_no++;
    g_day_no += gd;

    var j_day_no = g_day_no - 79;

    var j_np = div(j_day_no, 12053);
    /* 12053 = 365*33 + 32/4 */
    j_day_no = j_day_no % 12053;

    var jy = 979 + 33 * j_np + 4 * div(j_day_no, 1461);
    /* 1461 = 365*4 + 4/4 */

    j_day_no %= 1461;

    if (j_day_no >= 366) {
        jy += div(j_day_no - 1, 365);
        j_day_no = (j_day_no - 1) % 365;
    }
    for (var i = 0; i < 11 && j_day_no >= j_days_in_month[i]; ++i)
        j_day_no -= j_days_in_month[i];
    var jm = i + 1;
    var jd = j_day_no + 1;
    jalali[0] = jy;
    jalali[1] = jm;
    jalali[2] = jd;
    return jalali;
    //return jalali[0] + "_" + jalali[1] + "_" + jalali[2];
    //return jy + "/" + jm + "/" + jd;
}
function get_year_month_day(date) {
    var convertDate;
    var y = date.substr(0, 4);
    var m = date.substr(5, 2);
    var d = date.substr(8, 2);
    convertDate = gregorian_to_jalali(y, m, d);
    return convertDate;
}
function get_hour_minute_second(time) {
    var convertTime = [];
    convertTime[0] = time.substr(0, 2);
    convertTime[1] = time.substr(3, 2);
    convertTime[2] = time.substr(6, 2);
    return convertTime;
}
function convertDate(date) {
    var convertDateTime = get_year_month_day(date.substr(0, 10));
    convertDateTime = convertDateTime[0] + "/" + convertDateTime[1] + "/" + convertDateTime[2] + " " + date.substr(10);
    return convertDateTime;
}
function get_persian_month(month) {
    switch (month) {
        case 1:
            return "فروردین";
            break;
        case 2:
            return "اردیبهشت";
            break;
        case 3:
            return "خرداد";
            break;
        case 4:
            return "تیر";
            break;
        case 5:
            return "مرداد";
            break;
        case 6:
            return "شهریور";
            break;
        case 7:
            return "مهر";
            break;
        case 8:
            return "آبان";
            break;
        case 9:
            return "آذر";
            break;
        case 10:
            return "دی";
            break;
        case 11:
            return "بهمن";
            break;
        case 12:
            return "اسفند";
            break;
    }
}
// var now=new Date()
// //  now=Date.now();

// console.log(now)
// console.log(now.getDate())
// console.log(now.getMonth())
// console.log(now.getFullYear())
//    $("#gregorian_to_jalali").text(gregorian_to_jalali(now));

//    var datetime = new Date();

//    var date = datetime.getFullYear() + "/" + datetime.getMonth() + "/" + datetime.getDay();
// //    $("#get_year_month_day").text(get_year_month_day(date));

//    //var time = datetime.getTime();
//    var time = datetime.getHours() + ":" + datetime.getMinutes() + ":" + datetime.getSeconds();
// //    $("#get_hour_minute_second").text(get_hour_minute_second(time));

// //    $("#convertDate").text(convertDate(date));

// //    $("#get_persian_month").text(get_persian_month(1));






/////////////////////////////////////////////////////


/** Gregorian & Jalali (Hijri_Shamsi,Solar) Date Converter Functions
Author: JDF.SCR.IR =>> Download Full Version : http://jdf.scr.ir/jdf
License: GNU/LGPL _ Open Source & Free _ Version: 2.72 : [2017=1396]
--------------------------------------------------------------------
1461 = 365*4 + 4/4   &  146097 = 365*400 + 400/4 - 400/100 + 400/400
12053 = 365*33 + 32/4    &    36524 = 365*100 + 100/4 - 100/100   */

// (function ($) {
//     $(function () {

        // function gregorian_to_jalali(gy,gm,gd){
        //     g_d_m=[0,31,59,90,120,151,181,212,243,273,304,334];
        //     if(gy > 1600){
        //      jy=979;
        //      gy-=1600;
        //     }else{
        //      jy=0;
        //      gy-=621;
        //     }
        //     gy2=(gm > 2)?(gy+1):gy;
        //     days=(365*gy) +(parseInt((gy2+3)/4)) -(parseInt((gy2+99)/100)) +(parseInt((gy2+399)/400)) -80 +gd +g_d_m[gm-1];
        //     jy+=33*(parseInt(days/12053)); 
        //     days%=12053;
        //     jy+=4*(parseInt(days/1461));
        //     days%=1461;
        //     if(days > 365){
        //      jy+=parseInt((days-1)/365);
        //      days=(days-1)%365;
        //     }
        //     jm=(days < 186)?1+parseInt(days/31):7+parseInt((days-186)/30);
        //     jd=1+((days < 186)?(days%31):((days-186)%30));
        //     return [jy,jm,jd];
        //    }


        //    function jalali_to_gregorian(jy,jm,jd){
        //     if(jy > 979){
        //      gy=1600;
        //      jy-=979;
        //     }else{
        //      gy=621;
        //     }
        //     days=(365*jy) +((parseInt(jy/33))*8) +(parseInt(((jy%33)+3)/4)) +78 +jd +((jm<7)?(jm-1)*31:((jm-7)*30)+186);
        //     gy+=400*(parseInt(days/146097));
        //     days%=146097;
        //     if(days > 36524){
        //      gy+=100*(parseInt(--days/36524));
        //      days%=36524;
        //      if(days >= 365)days++;
        //     }
        //     gy+=4*(parseInt(days/1461));
        //     days%=1461;
        //     if(days > 365){
        //      gy+=parseInt((days-1)/365);
        //      days=(days-1)%365;
        //     }
        //     gd=days+1;
        //     sal_a=[0,31,((gy%4==0 && gy%100!=0) || (gy%400==0))?29:28,31,30,31,30,31,31,30,31,30,31];
        //     for(gm=0;gm<13;gm++){
        //      v=sal_a[gm];
        //      if(gd <= v)break;
        //      gd-=v;
        //     }
        //     return [gy,gm,gd]; 
        //    }



//https://github.com/zhupin/time-and-gregorian-to-jalali-javascript
        
        /* time to jalali */
        function t2j(date, f) {
            var g = t2g(date, false);
            return ginj(g.y, g.m, g.d, f);
        }

        /* gregorian to jalali */
        function ginj(year, month, day, f) {

            var $g_days_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            var $j_days_in_month = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);

            $gy = year - 1600;
            $gm = month - 1;
            $gd = day - 1;

            $g_day_no = 365 * $gy + div($gy + 3, 4) - div($gy + 99, 100) + div($gy + 399, 400);

            for ($i = 0; $i < $gm; ++$i)
                $g_day_no += $g_days_in_month[$i];
            if ($gm > 1 && (($gy % 4 == 0 && $gy % 100 != 0) || ($gy % 400 == 0)))
                /* leap and after Feb */
                $g_day_no++;
            $g_day_no += $gd;

            $j_day_no = $g_day_no - 79;
            $j_np = div($j_day_no, 12053); /* 12053 = 365*33 + 32/4 */
            $j_day_no = $j_day_no % 12053;

            $jy = 979 + 33 * $j_np + 4 * div($j_day_no, 1461); /* 1461 = 365*4 + 4/4 */

            $j_day_no %= 1461;

            if ($j_day_no >= 366) {
                $jy += div($j_day_no - 1, 365);
                $j_day_no = ($j_day_no - 1) % 365;
            }

            for ($i = 0; $i < 11 && $j_day_no >= $j_days_in_month[$i]; ++$i)
                $j_day_no -= $j_days_in_month[$i];
            $jm = $i + 1;
            $jd = $j_day_no + 1;

            function div(x, y) {
                return Math.floor(x / y);


            }
            if (!f || f == undefined)
                return {
                    y: $jy,
                    m: $jm,
                    d: $jd
                }
            else
                return $jy + '/' + $jm + '/' + $jd

        }


        /* jalali to gregorian  */
        function jing(year, month, day, f) {
            function div(x, y) {
                return Math.floor(x / y);
            }
            $g_days_in_month = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
            $j_days_in_month = new Array(31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29);

            $jy = year - 979;
            $jm = month - 1;
            $jd = day - 1;

            $j_day_no = 365 * $jy + div($jy, 33) * 8 + div($jy % 33 + 3, 4);
            for ($i = 0; $i < $jm; ++$i)
                $j_day_no += $j_days_in_month[$i];

            $j_day_no += $jd;

            $g_day_no = $j_day_no + 79;

            $gy = 1600 + 400 * div($g_day_no, 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
            $g_day_no = $g_day_no % 146097;

            $leap = true;
            if ($g_day_no >= 36525) /* 36525 = 365*100 + 100/4 */ {
                $g_day_no--;
                $gy += 100 * div($g_day_no, 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
                $g_day_no = $g_day_no % 36524;

                if ($g_day_no >= 365)
                    $g_day_no++;
                else
                    $leap = false;
            }

            $gy += 4 * div($g_day_no, 1461); /* 1461 = 365*4 + 4/4 */
            $g_day_no %= 1461;

            if ($g_day_no >= 366) {
                $leap = false;

                $g_day_no--;
                $gy += div($g_day_no, 365);
                $g_day_no = $g_day_no % 365;
            }

            for ($i = 0; $g_day_no >= $g_days_in_month[$i] + ($i == 1 && $leap); $i++)
                $g_day_no -= $g_days_in_month[$i] + ($i == 1 && $leap);
            $gm = $i + 1;
            $gd = $g_day_no + 1;

            if (!f || f == undefined)
                return {
                    y: $gy,
                    m: $gm,
                    d: $gd
                }
            else
                return $gy + '/' + $gm + '/' + $gd;
        }

        /* time to gregorian  */
        function t2g(date, f) {

            date = date * 1000;
            var d = new Date(date);
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var year = d.getFullYear();

            if (!f || f == undefined)
                return {
                    y: year,
                    m: month,
                    d: day
                }
            else
                return year + '/' + month + '/' + day;
        }
//     })
// })(jQuery)