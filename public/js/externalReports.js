// var wordcloud=require("wordcloud.js")
// require(WordCloud)

// library(wordcloud2)
// help(renderWordcloud2)
(function ($) {
var data={}
   
    $(function () {


        //word cloud
         data.elements=$("#my_canvas")[0];
         var options={size : 1, minSize : 0, gridSize : 0,
                fontFamily : 'Segoe UI', fontWeight : 'bold',
                color : 'random-dark', backgroundColor : "white",
                minRotation : -3.14/4, maxRotation : 3.14/4, shuffle : true,
                rotateRatio : 0.4, shape : 'star', ellipticity : 0.65,
                widgetsize : null, figPath : null, hoverFunction : null}
        // var options={}
                
    post("/messages/select/all/wordcloud", {}, function(response) {
        data.list=response.list
        WordCloud(data,options)
        // data, size = 1, minSize = 0, gridSize = 0,
        //     fontFamily = 'Segoe UI', fontWeight = 'bold',
        //     color = 'random-dark', backgroundColor = "white",
        //     minRotation = -3.14/4, maxRotation = 3.14/4, shuffle = true,
        //     rotateRatio = 0.4, shape = 'circle', ellipticity = 0.65,
        //     widgetsize = null, figPath = null, hoverFunction = null
        // )
    })
    });
    
})(jQuery);