(function ($) {
        function revealAppend(surveyId){
            var result=[]
            
           post('/surveys/all/result',{},function(response){
               var {surveys}=response
               surveys.map(item=>{
                   console.log(item)
                   result.push(item)
               })
           })
           console.log(result);
            

        }


     $(function () {
        })
        post('/surveys/all', {}, function (response) {
            // console.log('response: ',response)
            response.surveysArray.map(function(item){
            console.log('item: ',item)
            
                $('#surveysResult-list').append(`
                <div class="card rtl">
                    <div class="card-content activator ">
                        <span class="card-title activator grey-text text-darken-4"> ` + item.title + `<i class="material-icons left">more_vert</i></span>
                        <p>سوال: ` + item.text + `</p> 
                        <p>پاسخها: ` + item.keyboard + `</p> 
                    </div> 
                    <div class="card-reveal" id="reveal-result-`+item._id+`">
                    </div>
                </div>
                `);
            revealAppend(item._id);
               
            })
        
        // var surveyResultList={}
        // // function revealAppend(item){
        //    post('/surveys/all/result',{},function(response){
        //     console.log('response: ',response)
        //     surveyResultList=response.surveys
        //     console.log('surveyResultList: ',surveyResultList)
        //     response.surveys.map(function(survey){
        //     $('#reveal-result-'+item.id).append(`
        //     <span class="card-title grey-text text-darken-4">` + item.title + `<i class="material-icons right">close</i></span>
        //     <p>مجموع آرای ثبت شده:`+survey+`</p>
        //     <p>نتایج:`+survey+`</p>
        //   </div> `)
                
        //     })
            
        // }) 
    // }
 })
        

    })
(jQuery);