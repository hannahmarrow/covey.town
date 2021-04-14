import React, { useState } from 'react';
import firebase from "firebase/app";
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

// this component is a button that opens a modal to allow authed user to edit account
const EditAccount: React.FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [currentPass, setCurrentPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [newPassConfirm, setNewPassConfirm] = useState<string>('');
    const toast = useToast();
    const regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

    // validates fields are not empty, passwords match, and password is valid
    // returns boolean
    const validation = () => {
      // check for empty fields
      if (currentPass === "" || newPass === "" || newPassConfirm === "") {
        toast({
          title: 'Edit Account',
          description: 'Please fill out all fields.',
          status: 'error',
          position: 'top',
          isClosable: true,
        });
        return false;
      }

      // confirm passwords match
      if (newPass !== newPassConfirm) {
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
      if (!regex.test(newPass)) {
        toast({
          title: 'Password',
          description: 'Password must be at least 8 characters long and must include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (!@#$%^&*)',
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
      setCurrentPass('');
      setNewPass('');
      setNewPassConfirm('');
      onClose();
    };

    // if valid new password, changes the users password when the edit profile button is pressed
    async function setNewPasswordToDatabase() {
      const user = firebase.auth().currentUser;

      if (user !== null && user !== undefined && validation()) {

        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email!,
          currentPass
        );
        
        await user.reauthenticateWithCredential(credential).then(() => {
          user.updatePassword(newPass).then(() => {
            toast({
              title: 'Edit Account Success!',
              status: 'success',
              position: 'top',
              isClosable: true,
            });
            closeModal();
          }).catch((error) => {
            // password failed to update or something else went wrong
            const errorMessage = error.message;
            toast({
              title: 'Unable to Edit Account',
              description: errorMessage,
              status: 'error',
              position: 'top',
              isClosable: true,
            });
          });
        }).catch((error) => {
          // current password is incorrect or something else went wrong
          const errorCode = error.code;
          const errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            toast({
              title: 'Unable to Edit Account',
              description: 'Current password given is incorrect.',
              status: 'error',
              position: 'top',
              isClosable: true,
            });
          } else {
            toast({
              title: 'Unable to Edit Account',
              description: errorMessage,
              status: 'error',
              position: 'top',
              isClosable: true,
            });
          }
        });
      }
    }

    return <>
    <Button data-testid='openButton' width="100%" onClick={onOpen}>Edit Profile</Button>
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Account</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={(ev) => {
          ev.preventDefault();
        }}>
          <ModalBody pb={6}>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="oldPassword">Current Password</FormLabel>
              <Input id="oldPassword" name="oldPassword" type="password"
                value={currentPass}
                onChange={event => setCurrentPass(event.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <Input id="newPassword" name="newPassword" type="password"
                value={newPass}
                onChange={event => setNewPass(event.target.value)}
              />
              <Text fontSize="xs" as="i">Password must contain:</Text>
              <UnorderedList>
                <ListItem><Text fontSize="xs" as="i">At least 8 characters</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 uppercase and 1 lowercase character</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 number</Text></ListItem>
                <ListItem><Text fontSize="xs" as="i">At least 1 special character (!@#$%^&*)</Text></ListItem>
              </UnorderedList>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="confirmNewPassword">Confirm New Password</FormLabel>
              <Input id="confirmNewPassword" name="confirmNewPassword" type="password"
                value={newPassConfirm}
                onChange={event => setNewPassConfirm(event.target.value)}
              />
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button data-testid='createbutton' colorScheme="blue" type="submit" mr={3}
              value="create"
              onClick={setNewPasswordToDatabase}>
              Edit Account
            </Button>
            <Button onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  </>
}

export default EditAccount;