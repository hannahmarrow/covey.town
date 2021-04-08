//import * as functions from "firebase-functions";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import "firebase/auth";




// links used

// https://www.youtube.com/watch?v=DglTSNEdl0U
// https://www.youtube.com/watch?v=DYfP-UIKxH0
// https://stackoverflow.com/questions/33094943/how-to-run-typescript-program-on-windows
// https://firebase.google.com/docs/auth/web/password-auth#create_a_password-based_account
// https://firebase.google.com/docs/web/setup
// https://github.com/firebase/snippets-web/blob/174088f73e9ebfa6d8fabe04cbdd1d54d257d9c6/auth/email.js#L28-L38


// config for database
const firebaseConfig = {
  apiKey: "AIzaSyBl1Hz-MzSapBEoLmZgr3ycwVVmjD3wrPw",
  authDomain: "cs4530.firebaseapp.com",
  databaseURL: "https://cs4530-default-rtdb.firebaseio.com",
  projectId: "cs4530",
  storageBucket: "cs4530.appspot.com",
  messagingSenderId: "898846758501",
  appId: "1:898846758501:web:0a4d63ebaaa0d51778988c"



  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const database = firebase.database();
  const username = "username0"

  // write user data to database
  function writeUserData() {
    firebase.database().ref('users').child(username).set({
      username: username,
        displayname: "display name",
        email: "test@test.test",
        friendsList: ["username1", "username2"],
        isOnline: false,
        currentRoomID: "",
        friendsRequestsSent: ["username3", "username4"],
        friendsRequestsReceived: ["username5", "username6"],
    });
  }
  writeUserData()

  // writes user data to firebase auth, stores hashed pass
 function signUpWithEmailPassword() {
    var email = "test@test.test";
    var password = "password1";
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {

      })
      .catch((error) => {

      });
  }
signUpWithEmailPassword()

// reads user data from database and prints it
database.ref('users').child(username).get().then(function(snapshot) {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  }
  else {
    console.log("No data available");
  }
}).catch(function(error) {
  console.error(error);
});



  
console.log("end")