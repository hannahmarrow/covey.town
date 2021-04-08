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

const CreateAccount: React.FunctionComponent = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return <>
    <MenuItem data-testid='openMenuButton' onClick={onOpen}>
      <Typography variant="body1">Create Account</Typography>
    </MenuItem>
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
              <Input id='username' name="username" />
              <Text fontSize="xs" as="i">Must be unique</Text>
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor='displayName'>Display Name</FormLabel>
              <Input id="displayName" name="displayName" />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="email">Email</FormLabel>
              <Input id="email" name="email" />
            </FormControl>

            <FormControl mt={4} isRequired>
              <FormLabel htmlFor="Password">Password</FormLabel>
              <Input id="password" name="password" />
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
              value="create">
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