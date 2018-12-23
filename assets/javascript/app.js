//initialize firebase db
  var config = {
    apiKey: "AIzaSyDv0tfaWRmKubl8SqwQ7OXAvmDer2APWIs",
    authDomain: "train-scheduler-c4452.firebaseapp.com",
    databaseURL: "https://train-scheduler-c4452.firebaseio.com",
    projectId: "train-scheduler-c4452",
    storageBucket: "",
    messagingSenderId: "1068742681431"
  };
  firebase.initializeApp(config);
  
  var database = firebase.database();

//on click event for submit button for adding trains
$("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    // Grabs user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrainTime = $("#time-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
  
    // create an object that we will persist to firebase db
    var newTrain = {
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency
    };
  
    //push data to the database
    database.ref().push(newTrain);
    
    // Clear the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#time-input").val("");
    $("#frequency-input").val("");
  });

    // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
  
    // get the values from the database and store it in a local variable
    var trainName = childSnapshot.val().trainName;
    var destination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrainTime;
    var frequency = childSnapshot.val().frequency;
  
    // calculate when the next train will arrive; this should be relative to the current time.
    var firstTimeConverted = moment(firstTrainTime, "HH:mm").subtract(1, "years");
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = diffTime % frequency;
    var tMinutesTillTrain = frequency - tRemainder;

    // Calculate how many minutes away the next train is
    var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("HH:mm");
  
    //TO DO
    // Calculate how many minutes away the next train is
    // console.log(moment().diff(moment(firstTrainTime, "X"), "minutes"));
    
  
    // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(nextTrain),
      $("<td>").text(tMinutesTillTrain),
    );
  
    // Append the new row to the table
    $("#employee-table-body").append(newRow);
  });