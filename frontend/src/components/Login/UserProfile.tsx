import React, { useCallback, useContext, useEffect, useState } from 'react';
import assert from "assert";
import { makeStyles } from '@material-ui/core';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Theme,
  Tr,
  useToast
} from '@chakra-ui/react';
import firebase from "firebase/app";
import "firebase/auth";
import useVideoContext from '../VideoCall/VideoFrontend/hooks/useVideoContext/useVideoContext';
import Video from '../../classes/Video/Video';
import useCoveyAppState from '../../hooks/useCoveyAppState';
import CreateAccount from './CreateAccount';
import EditAccount from './EditAccount';
import DisplayNameContext from '../../contexts/DisplayNameContext';



const useStyles = makeStyles((theme: Theme) => ({
  rightJustify: {
    float: "right",
  }
}));

export type Friend = { username: string, id?: string, isOnline: boolean, coveyTownID?: string };
export type FriendList = Friend[];

// different from Friend because it does not have isOnline
export type FriendRequest = { username: string, id: string };

export default function UserProfile(): JSX.Element {
  const classes = useStyles();

  // check if current user is guest
  const guest = firebase.auth().currentUser?.isAnonymous;
  const username = (guest ? 'guest' : 'not guest');
  const {displayName, setDisplayName} = useContext(DisplayNameContext);
  let friends: FriendList = [{ username: "test_friend", isOnline: true, coveyTownID: "AN5HB2G", }, 
  { username: "test2", isOnline: false }, { username: "test3", isOnline: false }, { username: "test4", isOnline: true, coveyTownID: "RTYU43F2" }, { username: "test5", isOnline: false }];
  const [onlineFriends, setOnlineFriends] = useState<FriendList>([]);
  const [offlineFriends, setOfflineFriends] = useState<FriendList>([]);
  const [friendRequestsSent, setFriendRequestsSent] = useState<FriendList>([]);
  const [friendRequestsRecieved, setFriendRequestsRecieved] = useState<FriendList>([]);
  const [friendName, setFriendName] = useState<string>('');

  const updateDisplayName = (name: string) => {
    setDisplayName(name);
    // update database display name
  };

  const addFriend = () => {
    // check to make sure they are not already friend
    // check firebase to make sure valid username and user
    // send friend request to friendName: add friendName to friendRequestSent list, add user.username to other user's friendRequestRecieved list
  }

  const removeFriend = () => {
    // check to make sure they ARE already friend
    // remove friend from friend list
    // update other user's friend list to remove user from their friend list
  }

  const denyFriendRequest = (friend: Friend) => {
    // remove request from friendRequestRecieved list
    // remove request from other user's friendRequestSent list
  }

  const acceptFriendRequest = (friend: Friend) => {
    // remove request from friendRequestRecieved list
    // remove request from other user's friendRequestSent list

    // add friendName to friend list
    // add user.username to their friend list
  }

  const updateFriendListing = useCallback(() => {
    // get updated friend list and sort by username alphabetically
    friends = friends.sort((a, b) => {
      const usernameA = a.username.toUpperCase();
      const usernameB = b.username.toUpperCase();
      if (usernameA < usernameB) {
        return -1;
      }
      if (usernameA > usernameB) {
        return 1;
      }
      return 0;
    });

    // filter online and offline friends
    setOnlineFriends(friends.filter((friend) => friend.isOnline === true));
    setOfflineFriends(friends.filter((friend) => friend.isOnline === false));

    // get updated friendRequestsSent list (no sort)
    setFriendRequestsSent(friends);

    // get updated friendRequestsRecieved list (no sort)
    setFriendRequestsRecieved(friends);


  }, [setOnlineFriends, setOfflineFriends]);

  useEffect(() => {
    updateFriendListing();
    const timer = setInterval(updateFriendListing, 2000);
    return () => {
      clearInterval(timer)
    };
  }, [updateFriendListing]);

  const showLoggedInFeatures = () => {
    if (guest) {
      return (
      <>
        <Box>
          <CreateAccount/>
        </Box>
      </>);
    }
    return (
    <>
      <Box>
        <EditAccount />
      </Box>
      <Box>
        <HStack>
          <h3>Friends List</h3>
        </HStack>
      </Box>
      <Box maxH="240px" overflowY="scroll">
        <Table>
          <Thead><Tr><Th>Online</Th></Tr></Thead>
          <Tbody>
            {onlineFriends?.map((friend) => (
              <Tr key={friend.username}><Td role='cell'>{friend.username} - {friend.coveyTownID}</Td></Tr>))}
          </Tbody>
          <Thead><Tr><Th>Offline</Th></Tr></Thead>
          <Tbody>
            {offlineFriends?.map((friend) => (
              <Tr key={friend.username}><Td role='cell'>{friend.username}</Td></Tr>))}
          </Tbody>
        </Table>
      </Box>
      <Box>
        <h3>Friend Requests</h3>
      </Box>
      <Box maxH="240px" overflowY="scroll">
        <Table>
          <Thead><Tr><Th>Pending</Th><Th /></Tr></Thead>
          <Tbody>
            {friendRequestsRecieved?.map((friend) => (
              <Tr key={friend.username}><Td role='cell'>{friend.username}</Td>
                <Td>
                  <Button className={classes.rightJustify} colorScheme="red" size="xs" data-testid="denyRequest" value={friend.username} onClick={() => denyFriendRequest(friend)}>Deny</Button>
                  <Button className={classes.rightJustify} colorScheme="green" size="xs" data-testid="acceptRequest" value={friend.username} onClick={() => acceptFriendRequest(friend)}>Accept</Button>
                </Td>
              </Tr>))}
          </Tbody>
          <Thead><Tr><Th>Sent</Th></Tr></Thead>
          <Tbody>
            {friendRequestsSent?.map((friend) => (
              <Tr key={friend.username}><Td role='cell'>{friend.username}</Td></Tr>))}
          </Tbody>
        </Table>
      </Box>
      <Box>
        <h3>Add/Remove Friend</h3>
        <FormControl>
              <FormLabel htmlFor="friendUsername">Friend Username</FormLabel>
              <Input name="friendUsername" placeholder="Please Enter Friend Username" required
                     value={friendName}
                     onChange={event => setFriendName(event.target.value)}
              />
            </FormControl>
        <Button size="sm" data-testid="addFriend" onClick={addFriend}>Add Friend</Button>
        <Button size="sm" data-testid="removeFriend" onClick={removeFriend}>Remove Friend</Button>
      </Box>
    </>);
  }

  return(
    <>
      <form>
        <Stack>
          <Box>
            <HStack>
              <Box width="70%"><h3>Username: {username}</h3></Box>
              <Box width="30%"><Button onClick={() => firebase.auth().signOut()}>Logout</Button></Box>
            </HStack>
            <FormControl>
              <FormLabel htmlFor="name">Display Name</FormLabel>
              <Input name="name" placeholder="Please Enter Name" required
                     value={displayName}
                     onChange={event => updateDisplayName(event.target.value)}
              />
            </FormControl>
          </Box>
          {showLoggedInFeatures()}
        </Stack>
      </form>
    </>
  );
}