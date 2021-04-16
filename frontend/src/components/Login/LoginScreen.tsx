import React, { useState } from 'react';
import { Box, Heading, Text, FormControl, FormLabel, Input, Button, VStack, useToast } from '@chakra-ui/react';
import firebase from 'firebase';
import { makeStyles } from '@material-ui/core';
import CreateAccount from './CreateAccount';


const useStyles = makeStyles(() => ({
  container: {
    margin: 'auto',
    width: '50%'
  },
  emailField: {
    width: '100%',
  },
  passwordField: {
    width: '100%',
  },
  continueAsGuestBtn: {
    margin: '0 0 5px 0',
  },
  loginInBtn: {
    margin: '5px 0',
  },
}));

export default function LoginScreen(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const classes = useStyles();
    const toast = useToast();

    const continueAsGuest = () => {
      firebase.auth().signInAnonymously()
    };

    const login = () => {
      firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/wrong-password' || errorCode === 'auth/user-not-found') {
          toast({
            title: 'Unable to Login',
            description: 'Email and/or password does not match our records.',
            status: 'error',
            position: 'top',
            isClosable: true,
          });
        } else if (errorCode === 'auth/invalid-email') {
          toast({
            title: 'Unable to Login',
            description: 'Email is not correctly formatted.',
            status: 'error',
            position: 'top',
            isClosable: true,
          });
        } else {
          toast({
            title: 'Unable to Login',
            description: errorMessage,
            status: 'error',
            position: 'top',
            isClosable: true,
          });
        }
      });
    };

    return (
      <div className={classes.container}>
        <Box p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="xl">Welcome to Covey.Town!</Heading>
            <Text>A new, open source app for hanging out with your friends and meeting new people</Text>
            <Text>Please log in with your email and password, or join as a guest.</Text>
            <br/>
            <div className={classes.container}>
            <VStack spacing="10px">
            <FormControl>
              <FormLabel htmlFor="emailTextbox">Email</FormLabel>
              <div className={classes.emailField}>
                <Input autoFocus id="emailTextbox" name="emailTextbox" placeholder="Your Email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                />
              </div>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="passwordTextBox">Password</FormLabel>
              <div className={classes.passwordField}>
                <Input id="passwordTextBox" type="password" name="passwordTextBox" placeholder="Your password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                />
              </div>
            </FormControl>
            <div className={classes.loginInBtn}>
              <Button colorScheme="blue" isFullWidth onClick={login} type="submit">Log In</Button>
            </div>
            <CreateAccount/>
            <div className={classes.continueAsGuestBtn}>
              <Button size="xs" onClick={continueAsGuest}>Continue As Guest</Button>
            </div>
            </VStack>
            </div>
        </Box>
      </div>
    )
}