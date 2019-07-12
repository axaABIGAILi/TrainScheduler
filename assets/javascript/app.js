// assure document is loaded and ready first
$(document).ready(function() {

// set up firebase config
var firebaseConfig = {
    apiKey: "AIzaSyChakDxOtDwcVxrmBFr4pCI_9Lhnpi-pAQ",
    authDomain: "train-scheduler-c2b0e.firebaseapp.com",
    databaseURL: "https://train-scheduler-c2b0e.firebaseio.com",
    projectId: "train-scheduler-c2b0e",
    storageBucket: "",
    messagingSenderId: "134811415158",
    appId: "1:134811415158:web:ffb84f45866fc12d"
  };

// initialize firebase
firebase.initializeApp(firebaseConfig);

// assign database to a variable for ease of access
var database = firebase.database();

// declare necessary variables
var train;
var destination;
var firsTime;
var freqMins;
var trainMins;
var nextArr;
var remaining;

// add input trains to table
$('#submitbtn').on('click', function(event){

  event.preventDefault();

  train = $('#new-train-name').val();
  destination = $('#new-train-dest').val();
  firsTime = $('#new-train-first').val();
  freqMins = $('#new-train-freq').val();

  // push these into the database
  database.ref().push({
    name: train,
    destination: destination,
    first: firsTime,
    frequency: freqMins
  });

  $('#new-train-name').val('');
  $('#new-train-dest').val('');
  $('#new-train-first').val('');
  $('#new-train-freq').val('');

});

database.ref().on("child_added", function(childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var train = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firsTime = childSnapshot.val().first;
  var freqMins = childSnapshot.val().frequency;

  var maxMoment = moment().min(moment(), firsTime);

  if (maxMoment === firsTime) {
    nexArr = firsTime;
    firsTime = parseInt(firsTime.split(":")[1][0] + firsTime.split(':')[1][1]);
    freqMins = parseInt(freqMins);
    var trainMins = moment().diff(firsTime, 'minutes');
    remaining = trainMins % freqMins;
  } else {
    firsTime = parseInt(firsTime.split(":")[1][0] + firsTime.split(':')[1][1]);
    freqMins = parseInt(freqMins);

    var trainMins = moment().diff(firsTime, 'minutes');
    remaining = trainMins % freqMins;
    nexArr = freqMins - remaining;
    nexArr = moment().add(nexArr, 'm').format('hh:mm A');
  }

  $('#train-tbl').append('<tr><td>'+train+'</td><td>'+destination+'</td><td>'+freqMins+'</td><td>'+nexArr+'</td><td>'+remaining+'</td></tr>')

});

//closing doc.ready
});