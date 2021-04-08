import React, { useState } from 'react';
import { Box, Heading, Text, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import firebase from 'firebase';
import CreateAccount from './CreateAccount';


export default function LoginScreen(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const continueAsGuest = () => {
      firebase.auth().signInAnonymously()
    };

    const login = () => {
      firebase.auth().signInWithEmailAndPassword(email, password);
    };

    return (
        <Box p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="xl">Welcome to Covey.Town!</Heading>
            <Text>A new, open source app for hanging out with your friends and meeting new people</Text>
            <Text>Please log in with your email and password, or join as a guest.</Text>
            <FormControl>
              <FormLabel htmlFor="emailTextbox">Email</FormLabel>
              <Input autoFocus name="emailTextbox" placeholder="Your Email"
                     value={email}
                     onChange={event => setEmail(event.target.value)}
              />
              <Button size="xs" onClick={continueAsGuest}>Continue As Guest</Button>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="passwordTextBox">Password</FormLabel>
              <Input autoFocus name="passwordTextBox" placeholder="Your password"
                     value={password}
                     onChange={event => setPassword(event.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" onClick={login}>Log In</Button>
            <CreateAccount/>
        </Box>
    )
}