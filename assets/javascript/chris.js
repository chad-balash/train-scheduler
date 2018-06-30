$(document).ready(function () {
    // Initialize Firebase
    let config = {
        apiKey: "AIzaSyBxGpTgiNjkzLN7CLw1MezVf6_z-Fq3NKY",
        authDomain: "xrys-train-project.firebaseapp.com",
        databaseURL: "https://xrys-train-project.firebaseio.com",
        projectId: "xrys-train-project",
        storageBucket: "xrys-train-project.appspot.com",
        messagingSenderId: "459032360349"
    };
    firebase.initializeApp(config);
    let database = firebase.database();


    //When Submit Button is Pressed, Push information to Firebase database
    $(".submit").on("click", function () {
        database.ref().push({
            name: $('.trainName').val().trim(),
            destination: $('.trainDestination').val().trim(),
            time: $('.trainTime').val().trim(),
            frequency: $('.trainFrequency').val().trim()
        });
    });

    // Creating the table information
    database.ref().on('child_added', function (snapshot) {
        console.log(snapshot.val());
        let value = snapshot.val();
        //setting initial variables for calculations      
        let initialStartTime = value.time;
        let timeFrequency = value.frequency;
        console.log(initialStartTime);
        //calling function to calculate other fields
        let nextTrain = gettingTimeTrain(initialStartTime, timeFrequency);
        //Creates new row from child-added
        $('.table').append(
            `
            <div class="row">
                <div class="name col-md">${value.name}</div>
                <div class="destination col-md">${value.destination}</div>
                <div class="nextTrain col-md">${nextTrain[0]}</div>
                <div class="frequency col-md">${nextTrain[1]} Minutes</div>
            </div>
            `
        )
    })
    //Calculation Function
    function gettingTimeTrain(initialStartTime, timeFrequency) {
        //setting variables
        let now = moment().format('HH:mm');
        let startTime = initialStartTime;
        timeFrequency = timeFrequency; //reconfirm the timeFrequency variable is recognized for future functions
        //Converting now and startTime to minutes
        let sTime = convert(startTime);
        console.log('Start Time in minutes: ' + startTime);
        let nTime = convert(now);
        console.log('Now in minutes: ' + now);
        //Calling function to get the next Train Array/Information
        let newTrain = nextTrain(sTime, nTime, timeFrequency);
        console.log(newTrain);
        //Calls function to set up values for the last 2 columns in table
        nextTrainTime = revert(newTrain);
        trainWillArrive = newTrain[1];
        console.log(revert);
        let finalResults = [];
        finalResults.push(nextTrainTime, trainWillArrive);
        console.log(finalResults);
        return finalResults

    }
    //revert minutes back to military time
    function revert(a) {
        console.log(a);
        let time = parseFloat(a[0] / 60);
        console.log(time)
        timeH = parseInt(time);
        timeM = time - timeH;
        timeM = timeM * 60;
        if (timeM < 10) {
            timeM = '0' + timeM;
        }
        console.log(`${timeH}:${timeM}`);
        let timerz = `${timeH}:${timeM}`
        return timerz;
    }

    //convert string to minutes
    function convert(e) {
        console.log(e);
        let time = e.split(':');
        return parseInt((time[0] * 60)) + parseInt((time[1]));
        // console.log(timer)
    }

    // use convert fxn to get the next train info
    function nextTrain(sTime, nTime, timeFrequency) {
        console.log("stime", sTime);

        let nextTrainArray = [];
        console.log(timeFrequency + 'freq2' + typeof timeFrequency);
        let x = parseInt(timeFrequency);
        //for loop to find next train
        for (let index = sTime; index < 1440; index += x) {
            console.log(index);
            if (index > nTime) {
                console.log('boo');
                let newTrainz = index;
                console.log('newTrainz= ' + newTrainz);
                let minutesTill = index - nTime;
                console.log('TILL: ' + minutesTill);
                nextTrainArray.push(newTrainz, minutesTill)
                return nextTrainArray;
            }
        }
    }

})