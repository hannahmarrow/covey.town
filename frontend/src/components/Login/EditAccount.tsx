import React, { useState } from 'react';

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

const EditAccount: React.FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return <>
    <MenuItem data-testid='openMenuButton' onClick={onOpen}>
      <Typography variant="body1">Edit Account</Typography>
    </MenuItem>
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
              <Input id="oldPassword" name="oldPassword" />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="newPassword">New Password</FormLabel>
              <Input id="newPassword" name="newPassword" />
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
              <Input id="confirmNewPassword" name="confirmNewPassword" />
            </FormControl>

          </ModalBody>

          <ModalFooter>
            <Button data-testid='createbutton' colorScheme="blue" type="submit" mr={3}
              value="create">
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