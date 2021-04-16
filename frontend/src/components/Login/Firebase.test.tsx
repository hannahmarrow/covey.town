/* eslint-disable @typescript-eslint/ban-ts-comment */
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import firebaseConfig from './FirebaseConfig';


// adds mock data 
describe('Firebase Tests', () => {
    it("Tests Firebase Database Get", async () => {
        

      // initialize firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      else {
        firebase.app();
      }

        
    firebase.database().ref('test').set({ testval: "testval"})
    expect(firebase.database().ref('test').get()).resolves.not.toBeNull()
    expect(firebase.database().ref('test').get()).resolves.toBe({ testval: "testval"})

    });

    it("Tests Firebase Database Update", async () => {

        // initialize firebase
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        else {
          firebase.app();
        }
  
          
      firebase.database().ref('test').update({ testval: "new_test_val" })
      expect(firebase.database().ref('test').get()).resolves.toBe({ testval: "new_test_val" })
  
      });
})
