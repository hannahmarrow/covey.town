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


/* eslint-disable */

const EditAccount: React.FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [currentPass, setCurrentPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [newPassConfirm, setNewPassConfirm] = useState<string>('');


    // changes the users password when the edit profile button is pressed and the current password is validated
    // and the two new passwords match
    async function setNewPasswordToDatabase() {
      const user = firebase.auth().currentUser

      if (user !== null && user !== undefined && newPassConfirm == newPass) {

        const credential = firebase.auth.EmailAuthProvider.credential(
          user.email!,
          currentPass
        );
        
        await user.reauthenticateWithCredential(credential).then(function() {
          user.updatePassword(newPass).then(function() {
            console.log("password updated!")
          }).catch(function(error) {
            console.log(error)
          });
        }).catch(function(error) {
          console.log(error)
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
          onClose();
        }}>
          <ModalBody pb={6}>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="oldPassword">Current Password</FormLabel>
              <Input id="oldPassword" name="oldPassword" 
                value={currentPass}
                onChange={event => setCurrentPass(event.target.value)}
              />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <Input id="newPassword" name="newPassword" 
                value={newPass}
                onChange={event => setNewPass(event.target.value)}
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
              <FormLabel htmlFor="confirmNewPassword">Confirm New Password</FormLabel>
              <Input id="confirmNewPassword" name="confirmNewPassword" 
                value={newPassConfirm}
                onChange={event => setNewPassConfirm(event.target.value)}
              />
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button data-testid='createbutton' colorScheme="blue" type="submit" mr={3}
              value="create"
              onClick={setNewPasswordToDatabase}
            >
              Edit Account
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  </>
}

export default EditAccount;