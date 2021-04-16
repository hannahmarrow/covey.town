import React, { useState } from 'react';
import firebase from "firebase/app";
import firebaseConfig from './FirebaseConfig';
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";


import {
  Button,
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
  ListItem,
  UnorderedList,
} from '@chakra-ui/react';



// initialize firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
else {
  firebase.app();
}

// this component is a button that opens a modal to allow user to create account
const CreateAccount: React.FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [username, setUsername] = useState<string>('');
    const [displayName, setDisplayName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passConfirm, setpassConfirm] = useState<string>('');
    const toast = useToast();
    const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

    // validates fields are not empty, passwords match, and password is valid
    // returns boolean
    const validation = async () => {
      // check for empty fields
      if (username === "" || displayName === "" || email === "" || password === "" || passConfirm === "") {
        toast({
          title: 'Create Account',
          description: 'Please fill out all fields.',
          status: 'error',
          position: 'top',
          isClosable: true,
        });
        return false;
      }

      // confirm passwords match
      if (password !== passConfirm) {
        toast({
          title: 'Password',
          description: 'Password and Confirm Password do not match',
          status: 'error',
          position: 'top',
          isClosable: true,
        });
        return false;
      }

      // confirm password is valid
      if (!regex.test(password)) {
        toast({
          title: 'Password',
          description: 'Password must be at least 8 characters long and must include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)',
          status: 'error',
          position: 'top',
          isClosable: true,
        });
        return false;
      }

      // confirm username is unique
      let allUsernames: Record<string, string> = {};
      await firebase.database().ref('/').get().then((snapshot) => {
        if (snapshot.exists()) {
          allUsernames = snapshot.val().allUsernames;
        }
      });

      const allUsernamesList: string[] = [];
      Object.keys(allUsernames).forEach((key) => {
        const val = allUsernames[key];
        allUsernamesList.push(val);
      });

      if (allUsernamesList.indexOf(username) !== -1) {
        toast({
          title: 'Create Account',
          description: 'Username already taken, please choose a different username.',
          status: 'error',
          position: 'top',
          isClosable: true,
        });

        return false;
      }

      // everything valid
      return true;
    };

    // clear variables and close
    const closeModal = () => {
      setUsername('');
      setDisplayName('');
      setEmail('');
      setPassword('');
      setpassConfirm('');
      onClose();
    };

    async function addNewUser() {
      if (await validation()) {
        // create new user
        await firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/email-already-in-use') {
            toast({
              title: 'Unable to Create Account',
              description: 'The email address is already in use by another account.',
              status: 'error',
              position: 'top',
              isClosable: true,
            });
          } else if (errorCode === 'auth/invalid-email') {
            toast({
              title: 'Unable to Create Account',
              description: 'Email is not correctly formatted.',
              status: 'error',
              position: 'top',
              isClosable: true,
            });
          } else {
            toast({
              title: 'Unable to Create Account',
              description: errorMessage,
              status: 'error',
              position: 'top',
              isClosable: true,
            });
          }

          setpassConfirm('');
          setPassword('');
        }).then(() => {
          const user = firebase.auth().currentUser;

          if (user) {

            firebase.database().ref('users').child(user.uid).set({
                username,
                displayname: displayName,
                email,
                friendsList: [],
                isOnline: true,
                currentRoomID: "",
                friendsRequestsSent: [],
                friendsRequestsReceived: [],
            });

            let allUsernames = [];
            firebase.database().ref('/').get().then((snapshot) => {
              if (snapshot.exists()) {
                allUsernames = snapshot.val().allUsernames;
              }
            });
            allUsernames.push(username);
            firebase.database().ref('allUsernames').push(username);

            onClose();
          }
        });
      }
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
              <Input id="email" name="email" type="email"
              value={email}
              onChange={event => setEmail(event.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" name="password" type="password"
              value={password}
              onChange={event => setPassword(event.target.value)}
              />
              <Text fontSize="xs" as="i">Password must contain:</Text>
              <UnorderedList>
                <ListItem><Text fontSize="xs" as="i">At least 8 characters</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 uppercase and 1 lowercase character</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 number</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 special character (!@#$%*^&)</Text></ListItem>
              </UnorderedList>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input id="confirmPassword" name="confirmPassword" type="password"
              value={passConfirm} onChange={event => setpassConfirm(event.target.value)}/>
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button data-testid='createbutton' colorScheme="blue" type="submit" mr={3}
              value="create" onClick={addNewUser}>
              Create Account
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  </>
}


export default CreateAccount;
