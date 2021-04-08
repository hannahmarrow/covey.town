import React, { useState } from 'react';
import { Box, Heading, Text, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

export default function LoginScreen(): JSX.Element {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    return (
        <Box p="4" borderWidth="1px" borderRadius="lg">
            <Heading as="h2" size="xl">Welcome to Covey.Town!</Heading>
            <Text>A new, open source app for hanging out with your friends and meeting new people</Text>
            <Text>Please enter a username. Then either join as a guest, or enter your password and log in.</Text>
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <Input autoFocus name="username" placeholder="Your username"
                     value={userName}
                     onChange={event => setUserName(event.target.value)}
              />
              <Button size="xs">Continue As Guest</Button>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input autoFocus name="password" placeholder="Your password"
                     value={password}
                     onChange={event => setPassword(event.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue">Log In</Button>
            <Button colorScheme="green">Create a New Account</Button>
        </Box>
    )
}