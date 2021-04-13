import React, { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
  Text,
  List,
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import useCoveyAppState from '../../hooks/useCoveyAppState';


const firebaseConfig = {
  apiKey: "AIzaSyBl1Hz-MzSapBEoLmZgr3ycwVVmjD3wrPw",
  authDomain: "cs4530.firebaseapp.com",
  databaseURL: "https://cs4530-default-rtdb.firebaseio.com",
  projectId: "cs4530",
  storageBucket: "cs4530.appspot.com",
  messagingSenderId: "898846758501",
  appId: "1:898846758501:web:0a4d63ebaaa0d51778988c"
};

// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}  
else {
  firebase.app();
}



const CreateAccount: React.FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [username, setUsername] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    async function addNewUser() {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
    
      const user = firebase.auth().currentUser
    
      firebase.database().ref('users').child(user!.uid).set({
        username, 
          displayname: displayName,
          email,
          friendsList: [],
          isOnline: true,
          currentRoomID: "",
          friendsRequestsSent: [],
          friendsRequestsReceived: [],
      });

      let allUsernames = []
      firebase.database().ref('/').get().then((snapshot) => { 
        if (snapshot.exists()) {
          console.log(snapshot.val())
          allUsernames = snapshot.val().allUsernames
        } 
      });
      allUsernames.push(username)
      firebase.database().ref('allUsernames').push(username);
    }

    return <>
    <Button data-testid='openButton' width="100%" onClick={onOpen}>Create New Account</Button>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create A New Account</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={(ev) => {
          ev.preventDefault();
          onClose();
        }}>
          <ModalBody pb={6}>
            <FormControl isRequired>
              <FormLabel htmlFor='username'>Username</FormLabel>
              <Input id='username' name="username" 
              value={username}
              onChange={event => setUsername(event.target.value)}
              />
              <Text fontSize="xs" as="i">Must be unique</Text>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor='displayName'>Display Name</FormLabel>
              <Input id="displayName" name="displayName" 
              value={displayName}
              onChange={event => setDisplayName(event.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" name="email" 
              value={email}
              onChange={event => setEmail(event.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="Password">Password</FormLabel>
              <Input id="password" name="password" 
              value={password}
              onChange={event => setPassword(event.target.value)}
              />
              <Text fontSize="xs" as="i">Password must contain:</Text>
              <UnorderedList>
                <ListItem><Text fontSize="xs" as="i">At least 8 characters</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 uppercase and 1 lowercase character</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 number</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 special character (!#$*?%)</Text></ListItem>
              </UnorderedList>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input id="confirmPassword" name="confirmPassword" />
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button data-testid='createbutton' colorScheme="blue" type="submit" mr={3}
              value="create" onClick={addNewUser}>
              Create Account
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  </>
}


export default CreateAccount;