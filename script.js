/*

# 05 Third-Party APIs: Work Day Scheduler

Create a simple calendar application that allows the user to save events for each hour of the day. 
This app will run in the browser and feature dynamically updated HTML and CSS powered by jQuery.

You'll need to use the [Moment.js](https://momentjs.com/) library to work with date and time. 
Be sure to read the documentation carefully and concentrate on using Moment.js in the browser.

See index.html for   
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>

*/
$(document).ready(function() {
    debugger;
    const debug = true;
    const momentTime = moment().format('MMMM Do YYYY');
    let militaryHours = moment().format('H');
    const $currentDay = $('#currentDay');
    $currentDay.text(momentTime);

    //Use font-awesome as covered in week 1
    const saveImageButton = "./images/save-regular.svg"; 
  
    let hourlyPlans = JSON.parse(localStorage.getItem("hourlyPlans"));  //convert localStorage string into JSON Object
    debugger;
    const numberHourRows = 18;
    if (hourlyPlans !== null) {
      hourDescriptions = hourlyPlans;
    } else {
      hourDescriptions = new Array(numberHourRows);  
    }
    
    let $hourSchedulerDiv = $('#hourSchedulerContainer');
    $hourSchedulerDiv.empty();
  
    const beginHour = 6;
    const endHour = 24;
  
    //my day starts at 6 AM
    for (let hour = beginHour; hour <= endHour; hour++) {
      let index = hour - beginHour ;   //0 based table index
     
     
     
     //Build rows using JQuery Library methods: addClass(), attr()
      let $rowDiv = $('<div>');

    
      $rowDiv.addClass('row');
      $rowDiv.addClass('hourSchedulerRow');
      $rowDiv.attr('hour-index',hour);
    
      let $hourColDiv = $('<div>');
      $hourColDiv.addClass('col-md-2');
    

      const $hourSpanCell = $('<span>');
      $hourSpanCell.attr('class','hourSpan');
      
      let displayHour = hour > 12 ? hour - 12 : hour;
      let amOrPm =  hour > 12 ? "PM": "AM";
      
      $hourSpanCell.text(`${displayHour} ${amOrPm}`);
  
      $rowDiv.append($hourColDiv);
      $hourColDiv.append($hourSpanCell);

      let $dailyPlanSpn = $('<input>');
  
      $dailyPlanSpn.attr('id',`input-${index}`);
      $dailyPlanSpn.attr('hour-index',index);
      $dailyPlanSpn.attr('type','text');
      $dailyPlanSpn.attr('class','dailyPlan');
 
      $dailyPlanSpn.val( hourDescriptions[index] ); //get the saved description
      
 
      let $descriptionDiv = $('<div>');
      $descriptionDiv.addClass('col-md-9');

      $rowDiv.append($descriptionDiv);
      $descriptionDiv.append($dailyPlanSpn);

      let $col1SaveDiv = $('<div>');
      $col1SaveDiv.addClass('col-md-1');
  
      let $saveBtn = $('<i>');
      $saveBtn.attr('id',`saveid-${index}`);
      $saveBtn.attr('save-id',index);
      $saveBtn.attr('class',"far fa-save saveImageButton");
      
      $rowDiv.append($col1SaveDiv);
      $col1SaveDiv.append($saveBtn);
  
      changeRowColorOnCondition($rowDiv, hour);
      
      $hourSchedulerDiv.append($rowDiv);
    };
  
  /*
  Requirement:  each timeblock is color coded to indicate whether it is in the past, present, or future
  */
    function changeRowColorOnCondition ($hourRow,hour) { 
      debugger;
      if ( hour < militaryHours) {
        $hourRow.css("background-color","lightgrey")
      } else if ( hour > militaryHours) {
        $hourRow.css("background-color","lightgreen")
      } else {
        $hourRow.css("background-color","tomato")
      }

    };
  
  /*
  Requirment: store descriptions for times to localStorage
  */

    $(document).on('click','i', function(event) {
      event.preventDefault();  
      debugger;
      let $index = $(this).attr('save-id');
  
      let inputId = '#input-'+$index;
      let $value = $(inputId).val();
  
      hourDescriptions[$index] = $value;
  
      if (debug) { console.log('value ', $value, 'index ', $index, '\nhourDescriptions in clickHandler '+ hourDescriptions); }
      $(`#saveid-${$index}`).removeClass('shadowPulse');
      localStorage.setItem("hourlyPlans", JSON.stringify(hourDescriptions));
    });  

    
    
    $(document).on('change','input', function(event) {
      event.preventDefault();  
      debugger;
      let i = $(this).attr('hour-index');
      $(`#saveid-${i}`).addClass('shadowPulse');
    });
  });