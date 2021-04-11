import React, { useState } from 'react';
import { Box, Heading, Text, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import firebase from 'firebase';
import { makeStyles, Theme } from '@material-ui/core';
import CreateAccount from './CreateAccount';

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    margin: 'auto',
    width: '50%'
  },
  emailField: {
    width: '75%',
  },
  passwordField: {
    width: '75%',
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

    const continueAsGuest = () => {
      firebase.auth().signInAnonymously()
    };

    const login = () => {
      firebase.auth().signInWithEmailAndPassword(email, password);
    };

    return (
      <div className={classes.container}>
        <Box p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="xl">Welcome to Covey.Town!</Heading>
            <Text>A new, open source app for hanging out with your friends and meeting new people</Text>
            <Text>Please log in with your email and password, or join as a guest.</Text>
            <br/>
            <FormControl>
              <FormLabel htmlFor="emailTextbox">Email</FormLabel>
              <div className={classes.emailField}>
                <Input autoFocus name="emailTextbox" placeholder="Your Email"
                        value={email}
                        onChange={event => setEmail(event.target.value)}
                />
              </div>
              <div className={classes.continueAsGuestBtn}>
                <Button size="xs" onClick={continueAsGuest}>Continue As Guest</Button>
              </div>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="passwordTextBox">Password</FormLabel>
              <div className={classes.passwordField}>
                <Input autoFocus name="passwordTextBox" placeholder="Your password"
                        value={password}
                        onChange={event => setPassword(event.target.value)}
                />
              </div>
            </FormControl>
            <div className={classes.loginInBtn}>
              <Button colorScheme="blue" isFullWidth onClick={login}>Log In</Button>
            </div>
            <CreateAccount/>
        </Box>
      </div>
    )
}