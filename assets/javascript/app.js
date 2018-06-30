//   ____    ____  _       ____  _____ __ __    ___  ____  
//  |    \  /    || |     /    |/ ___/|  |  |  /  _]|    \ 
//  |  o  )|  o  || |    |  o  (   \_ |  |  | /  [_ |  D  )
//  |    < |     || |___ |     |\__  ||  _  ||    _]|    / 
//  |  o  \|  _  ||     ||  _  |/  \ ||  |  ||   [_ |    \ 
//  |      |  |  ||     ||  |  |\    ||  |  ||     ||  .  \
//  |_____/|__|__||_____||__|__| \___||__|__||_____||__|\_|

// Make sure that your app suits this basic spec:

// When adding trains, administrators should be able to submit the following:
// Train Name
// Destination 
// First Train Time -- in military time
// Frequency -- in minutes
// Code this app to calculate when the next train will arrive; this should be relative to the current time.
// Users from many different machines must be able to view same train times.
// Styling and theme are completely up to you. Get Creative!


$(document).ready(function () {

  // Initialize Firebase
  let config = {
    apiKey: "AIzaSyAHJ49M8LR5TjuH7BSpifKFZOHM12fO6yA",
    authDomain: "train-scheduler-9c259.firebaseapp.com",
    databaseURL: "https://train-scheduler-9c259.firebaseio.com",
    projectId: "train-scheduler-9c259",
    storageBucket: "train-scheduler-9c259.appspot.com",
    messagingSenderId: "394841133871"
  };
  firebase.initializeApp(config);
  let database = firebase.database();

  // Create variables
  let train = '';
  let destination = '';
  let trainTime = '';
  let trainFrequency = '';

  // Click Button changes what is stored in firebase
  $("#click-button").on("click", function (event) {

    event.preventDefault(); // Prevent the page from refreshing

    // get input values
    train = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    trainTime = $("#start-time-input").val().trim();
    trainFrequency = $("#frequency-input").val().trim();

    database.ref().push({
      trainName: train,
      destinationName: destination,
      time: trainTime,
      frequency: trainFrequency
    });

  });
  // Get added info from dB
  database.ref().on('child_added', function (snapshot) {
    let value = snapshot.val();
    console.log(value);
    console.log(value.trainName);
    console.log(value.destinationName);
    console.log(value.time);
    console.log(value.frequency);

    //setting variables
    let initialStartTime = value.time;
    let timeFrequency = value.frequency;
    let nextTrain = gettingTimeTrain(initialStartTime, timeFrequency);

    // Change the HTML
    $('#train-data').append(`
      <tr>
        <td>${value.trainName}</td>
        <td>${value.destinationName}</td>
        <td>${value.frequency}</td>
        <td>${nextTrain[0]}</td>
        <td>${nextTrain[1]}</td>
      </tr>
      ` );
  });

  //Calculation Function
  function gettingTimeTrain(initialStartTime, timeFrequency) {
    //setting variables
    let now = moment().format('HH:mm');
    let startTime = initialStartTime;
    timeFrequency = timeFrequency; //reconfirm the timeFrequency variable is recognized for future functions
    //Converting now and startTime to minutes
    let sTime = convert(startTime);
    // console.log('Start Time in minutes: ' + startTime);
    let nTime = convert(now);
    // console.log('Now in minutes: ' + now);
    //Calling function to get the next Train Array/Information
    let newTrain = nextTrain(sTime, nTime, timeFrequency);
    // console.log(newTrain);
    //Calls function to set up values for the last 2 columns in table
    nextTrainTime = revert(newTrain);
    trainWillArrive = newTrain[1];
    // console.log(revert);
    let finalResults = [];
    finalResults.push(nextTrainTime, trainWillArrive);
    // console.log(finalResults);
    return finalResults
  }
  
  //revert minutes back to military time
  function revert(a) {
    // console.log(a);
    let time = parseFloat(a[0] / 60);
    console.log(time)
    timeH = parseInt(time);
    timeM = time - timeH;
    timeM = timeM * 60;
    if (timeM < 10) {
      timeM = '0' + timeM;
    }
    // console.log(`${timeH}:${timeM}`);
    let timerz = `${timeH}:${timeM}`
    return timerz;
  }

  //convert string to minutes
  function convert(e) {
    // console.log(e);
    let time = e.split(':');
    return parseInt((time[0] * 60)) + parseInt((time[1]));
  }

  // use convert function to get the next train info
  function nextTrain(sTime, nTime, timeFrequency) {
    // console.log("stime", sTime);

    let nextTrainArray = [];
    // console.log(timeFrequency + 'freq2' + typeof timeFrequency);
    let x = parseInt(timeFrequency);
    //for loop to find next train
    for (let index = sTime; index < 1440; index += x) {
      // console.log(index);
      if (index > nTime) {
        let newTrainz = index;
        // console.log('newTrains= ' + newTrainz);
        let minutesTill = index - nTime;
        // console.log('TILL: ' + minutesTill);
        nextTrainArray.push(newTrainz, minutesTill)
        return nextTrainArray;
      }
    }
  }

}); // End doc ready