/*

# 05 Third-Party APIs: Work Day Scheduler

Create a simple calendar application that allows the user to save events for each hour of the day. 
This app will run in the browser and feature dynamically updated HTML and CSS powered by jQuery.

You'll need to use the [Moment.js](https://momentjs.com/) library to work with date and time. 
Be sure to read the documentation carefully and concentrate on using Moment.js in the browser.

See index.html for   
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>

*/


//global variables
const momentTime = moment().format('MMMM Do YYYY');
let militaryHours = moment().format('H');
const debug = true;
//Use font-awesome as imported in index.html
const saveImageButton = "./images/save-regular.svg"; 


//loop control variables : Future enhancement: make configureable with input text boxes
const numberHourRows = 18;
let hourDescriptions =  new Array(numberHourRows);  //ES6 like Java && C# makes  Array a 1st class object
const beginHour = 6;
const endHour = 24;

//compute at runtime so set to null;
let displayHour = null;
let amOrPm =  null;
let $saveBtn = null;

//global functions
function updateCurrentTimeWidget(){
  const $currentDay = $('#currentDay');
  $currentDay.text(momentTime);
}

function getHourlyPlans(){
  return JSON.parse(localStorage.getItem("hourlyPlans"));  //convert localStorage string into array of JSON String-objects
}

function setupHoursCell(){
  let $hourColDiv = $('<div>');
  $hourColDiv.addClass('col-md-2');
  const $hourSpanCell = $('<span>');  //Spans are great for styling table cells
  
  return $hourColDiv;
}

function setupHourSpanCell(hour){
  const $hourSpanCell = $('<span>');
  $hourSpanCell.attr('class','hourSpan');
  displayHour = hour > 12 ? hour - 12 : hour;
  amOrPm =  hour > 12 ? "PM": "AM";
  $hourSpanCell.text(`${displayHour} ${amOrPm}`);
  return $hourSpanCell;
}

function setupDescriptionCell(index) {
  let $descriptionText = $("<input>");

  $descriptionText.attr("id", `input-${index}`);
  $descriptionText.attr("hour-index", index);
  $descriptionText.attr("type", "text");
  $descriptionText.attr("class", "dailyPlan");

  $descriptionText.val(hourDescriptions[index]); //get the saved description

  return $descriptionText;
}

function setupSaveButtonCell(index){
  let $saveButtonCell =  $('<div>');
  $saveButtonCell.addClass('col-md-1');
  //function with side effect of populating global variable -- not always best practice
  $saveBtn = $('<i>');
  $saveBtn.attr('id',`saveid-${index}`);
  $saveBtn.attr('save-id',index);
  $saveBtn.attr('class',"far fa-save saveImageButton");

  return $saveButtonCell;
}
      


$(document).ready(function() {
    debugger;
    updateCurrentTimeWidget();

    let hourlyPlans = getHourlyPlans();
    if (hourlyPlans !== null) {
      hourDescriptions = hourlyPlans;
    } 
    
    let $hourSchedulerDiv = $('#hourSchedulerContainer');  //The bootstrap way of creating a table, see index.html
    $hourSchedulerDiv.empty(); //clear table on Reload and render it in the loop below
    
    for (let hour = beginHour; hour <= endHour; hour++) {
      let index = hour - beginHour ;   //0 based table index
     
      //Build rows using JQuery Library methods: addClass(), attr()
      
      //A row div can be added to a 'container table' : use JQuuery convention of $ to begin variables initialized from JQuery library
      let $rowDiv = $('<div>');
      $rowDiv.addClass('row');
      $rowDiv.addClass('hourSchedulerRow');
      $rowDiv.attr('hour-index',hour);
    
      //set up table cell for hours column  as a DIV -- use as many concepts covered in class as possible
      let $hourSpanCell = setupHourSpanCell(hour);
      let $hourColDiv = setupHoursCell();
      $rowDiv.append($hourColDiv);
      $hourColDiv.append($hourSpanCell);

      let $descriptionText = setupDescriptionCell(index);
      
      let $descriptionDiv = $('<div>');
      $descriptionDiv.addClass('col-md-9');

      $rowDiv.append($descriptionDiv);
      $descriptionDiv.append($descriptionText);

      let $saveButtonCell = setupSaveButtonCell(index);
      
      
      $rowDiv.append($saveButtonCell);
      $saveButtonCell.append($saveBtn);
  
      changeRowColorOnCondition($rowDiv, hour);  //highlight all cells in row based on time
      
      $hourSchedulerDiv.append($rowDiv);
    };
  
  /*
  Requirement:  each timeblock is color coded to indicate whether it is in the past, present, or future
  */
    function changeRowColorOnCondition ($hourRow,hour) { 
      debugger;
      let backgroundColor = null;
      if ( hour < militaryHours) {
        backgroundColor = "lightgrey";
      } else if ( hour > militaryHours) {
        backgroundColor = "lightgreen";
      } else {
        backgroundColor = "orange";
      }
 
      $hourRow.children('td').css({ "background-color": backgroundColor });

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