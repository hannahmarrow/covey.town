import React, { useCallback, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@chakra-ui/react';
import firebase from "firebase/app";
import "firebase/auth";
import CreateAccount from './CreateAccount';
import EditAccount from './EditAccount';
import DisplayNameContext from '../../contexts/DisplayNameContext';
import firebaseConfig from './FirebaseConfig';


// initialize firebases
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
else {
  firebase.app();
}

let username = '';
let friendRequestsSentNames: string[] = [];
let friendRequestsRecievedNames: string[] = [];
let friendNames: string[] = [];


// firebase arrays are structured similarly to dicts, must isolate values from keys to properly interact
function getValuesFromFirebaseArray(dict: Record<string, string>): string[] {
  const vals: string[] = [];
  if (dict !== undefined && dict !== null) {
    Object.keys(dict).forEach((key) => {
      const val = dict[key];
      vals.push(val);
    })
  }
  return vals;
}


// returns a dictionary of data from the database for the given username
function getUserDataByUsername(dict: Record<string, Record<string, string>>, curUsername: string): Record<string, string | Record<string, string>> {
  let finalVal: Record<string, string> = {};
  Object.keys(dict).forEach((key) => {
    const val = dict[key];
    if (val.username === curUsername) {
      finalVal = val;
    }
  })
  return finalVal;
}


// returns a user key from the database for the given username
function getUserKeyByUsername(dict: Record<string, Record<string, string>>, curUsername: string): string {
  let finalKey = '';
  Object.keys(dict).forEach((key) => {
    const val = dict[key];
    if (val.username === curUsername) {
      finalKey = key;
    }
  })
  return finalKey;
}

// looks up the user the current user is friend requesting, sends a request to them when found
async function setFriendRequestReceived(givenUsername: string, curUsername: string) {
  await firebase.database().ref('users').get().then((snapshot) => {
    if (snapshot.exists()) {
      Object.keys(snapshot.val()).forEach((key) => {
        const val = snapshot.val()[key];
        if (val.username === givenUsername) {
          firebase.database().ref('users').child(key).child("friendsRequestsReceived").push(curUsername);
        }
      });
    }
  });
}



const useStyles = makeStyles(() => ({
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
  const {displayName, setDisplayName} = useContext(DisplayNameContext);
  const [onlineFriends, setOnlineFriends] = useState<FriendList>([]);
  const [offlineFriends, setOfflineFriends] = useState<FriendList>([]);
  const [friendName, setFriendName] = useState<string>('');
  const [friendRequestsSent, setFriendRequestsSent] = useState<FriendList>([]);
  const [friendRequestsRecieved, setFriendRequestsRecieved] = useState<FriendList>([]);
  const [friends] = useState<FriendList>([]);
  const toast = useToast();
  let displayname = '';

  // reads all the users data, sets
  const readUserData = useCallback(async () => {
    const user = firebase.auth().currentUser;

    let currentFriends: Record<string, string> = {};
    let currentFriendsSent: Record<string, string> = {};
    let currentFriendsReceived: Record<string, string> = {};

    

    if (user) {
      await firebase.database().ref('users').child(user.uid).get().then((snapshot) => {
        if (snapshot.exists()) {
          username = snapshot.val().username;
          displayname = snapshot.val().displayname;
          currentFriends = snapshot.val().friendsList;
          currentFriendsSent = snapshot.val().friendsRequestsSent;
          currentFriendsReceived = snapshot.val().friendsRequestsReceived;
        }
        else {
          username = 'GUEST';
          displayname = 'GUEST';
          currentFriends = {};
          currentFriendsSent = {};
          currentFriendsReceived = {};
        }
      });
    }
    else {
      username = 'GUEST';
      displayname = 'GUEST';
      currentFriends = {};
      currentFriendsSent = {};
      currentFriendsReceived = {};
    }

    // adds all friends to friendsList
    while(friends.length > 0) {
      friends.pop();
    }
    if (currentFriends !== undefined && currentFriends !== null) {
      Object.keys(currentFriends).forEach((key) => {
        const val = currentFriends[key];
        friendNames = getValuesFromFirebaseArray(currentFriends);
        if (friendNames.indexOf(val) !== -1) {
          friends.push({  username: val, isOnline: true });
        }
      });
    }

    // adds all friend requests sent to list
    while(friendRequestsRecieved.length > 0) {
      friendRequestsRecieved.pop();
    }
    if (currentFriendsReceived !== undefined && currentFriendsReceived !== null) {

      Object.keys(currentFriendsReceived).forEach((key) => {
        const val = currentFriendsReceived[key];
        friendRequestsRecievedNames = getValuesFromFirebaseArray(currentFriendsReceived);

        if (friendRequestsRecievedNames.indexOf(val) !== -1) {
          friendRequestsRecieved.push({  username: val, isOnline: true });
        }
      });
    }

    // adds all friend requests received to list
    if (currentFriendsSent !== undefined && currentFriendsSent !== null) {
      while(friendRequestsSent.length > 0) {
        friendRequestsSent.pop();
      }
      Object.keys(currentFriendsSent).forEach((key) => {
        const val = currentFriendsSent[key];
        friendRequestsSentNames = getValuesFromFirebaseArray(currentFriendsSent);
        if (friendRequestsSentNames.indexOf(val) !== -1) {
          friendRequestsSent.push({  username: val, isOnline: true });
        }
      });
    }

  }, []); 

  // handles all logging out; resets data and de-auths firebase
  function logout() {

    firebase.auth().signOut();

    username = '';
  }

  const updateDisplayName = async (name: string) => {
    setDisplayName(name);
    displayname = name;

    if (!guest) {
      const user = firebase.auth().currentUser;

      if (user) {
        await firebase.database().ref('users').child(user.uid).update({
          displayname: name
        });
      }
    }
  };

  const initializeData = useCallback(() => {
    readUserData().then(() => {
      if (!guest) {
        setDisplayName(displayname);
      }
    });
  }, [displayname, guest, readUserData, setDisplayName]);

  const updateFriendListing = useCallback(() => {
    readUserData().then(() => {
      // filter online and offline friends
      setOnlineFriends(friends.filter((friend) => friend.isOnline === true));
      setOfflineFriends(friends.filter((friend) => friend.isOnline === false));

      // get updated friendRequestsSent list (no sort)
      setFriendRequestsSent(friendRequestsSent);

      // get updated friendRequestsRecieved list (no sort)
      setFriendRequestsRecieved(friendRequestsRecieved);
    });

  }, [friendRequestsSent, friends, friendRequestsRecieved, readUserData, setOnlineFriends, setOfflineFriends, setFriendRequestsRecieved, setFriendRequestsSent]);

  // update friend list every 2 seconds
  useEffect(() => {
    initializeData();
    updateFriendListing();
    const timer = setInterval(updateFriendListing, 2000);
    return () => {
      clearInterval(timer);
    };
  }, [initializeData, updateFriendListing]);

  const addFriend = async () => {
    const user = firebase.auth().currentUser;

    let currentFriendResquestsSent: string[] = [];
    let currentFriendsList: string[] = [];
    let currentUsername = '';
    const friendToAdd = friendName;
    setFriendName('');

    if (friendToAdd !== '') {

      // creates a list of all usernames stored in database
      // used to verify that friend request is targetting an existing user
      let allUsernames: string[] = [];
      await firebase.database().ref('allUsernames').get().then((snapshot) => {
        if (snapshot.exists()) {
          allUsernames = getValuesFromFirebaseArray(snapshot.val());
        }
      });


      // if the current user exists, we pull their current friendsList as well as current friendRequestsList from the database
      if (user) {

        await firebase.database().ref('users').child(user.uid).get().then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().friendsRequestsSent !== null && snapshot.val().friendsRequestsSent !== undefined) {
              currentFriendResquestsSent = getValuesFromFirebaseArray(snapshot.val().friendsRequestsSent);
            }
            if (snapshot.val().friendsList !== null && snapshot.val().friendsList !== undefined) {
              currentFriendsList = getValuesFromFirebaseArray(snapshot.val().friendsList);
            }
            if (snapshot.val().username !== null && snapshot.val().username !== undefined) {
              currentUsername = snapshot.val().username;
            }
          }
        });
      }

      // if the friend being targetted by the request is not currently friends with the user, they haven't already been sent
      // a request, they exist, and it isn't the current users username; the request goes through
      if (currentFriendsList && user) {
        if (currentFriendsList.indexOf(friendToAdd) === -1) {
          if (currentFriendResquestsSent.indexOf(friendToAdd) === -1) {
            if (allUsernames.indexOf(friendToAdd) !== -1) {
              if (currentUsername !== friendToAdd) {
                await setFriendRequestReceived(friendToAdd, currentUsername).then(() => {
                  firebase.database().ref('users').child(user.uid).child("friendsRequestsSent").push(friendToAdd);
                  toast({
                    title: 'Add Friend',
                    description: 'Friend Request Sent!',
                    status: 'success',
                    position: 'top',
                    isClosable: true,
                  });
                  updateFriendListing();
                }).catch((error) => {
                  toast({
                    title: 'Add Friend Error',
                    description: error.message,
                    status: 'error',
                    position: 'top',
                    isClosable: true,
                  });
                });
              } else {
                toast({
                  title: 'Add Friend',
                  description: 'You cannot be friends with yourself',
                  status: 'error',
                  position: 'top',
                  isClosable: true,
                });
              }
            } else {
              toast({
                title: 'Add Friend',
                description: 'Username does not exist',
                status: 'error',
                position: 'top',
                isClosable: true,
              });
            }
          } else {
            toast({
              title: 'Add Friend',
              description: 'Already sent friend request to '.concat(friendToAdd),
              status: 'error',
              position: 'top',
              isClosable: true,
            });
          }
        } else {
          toast({
            title: 'Add Friend',
            description: 'You are already friends with '.concat(friendToAdd),
            status: 'error',
            position: 'top',
            isClosable: true,
          });
        }
      }
    } else {
      toast({
        title: 'Add Friend',
        description: 'Username empty. Please enter friend username.',
        status: 'error',
        position: 'top',
        isClosable: true,
      });
    }
  }

  const removeFriend = async () => {
    // check to make sure they ARE already friend
    // remove friend from friend list
    // update other user's friend list to remove user from their friend list

    // removes friend sent from friend database, adds user to friends list

    const user = firebase.auth().currentUser;
    const friendToRemove = friendName;
    setFriendName('');

    let currentFriendsList: string[] = []

    if (friendToRemove !== '') {
      // if the current user exists, we pull their current friendsList
      if (user) {

        await firebase.database().ref('users').child(user.uid).get().then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().friendsList !== null && snapshot.val().friendsList !== undefined) {
              currentFriendsList = getValuesFromFirebaseArray(snapshot.val().friendsList);
            }
          }
        })
      }

      // removes friend from users friend list
      if (currentFriendsList && user) {
        if (currentFriendsList.indexOf(friendToRemove) !== -1) {
          const newCurrentFriends: string[] = [];
          currentFriendsList.forEach(element => {
            if (element !== friendToRemove) {
              newCurrentFriends.push(element);
            }
          });
          await firebase.database().ref('users').child(user.uid).child("friendsList").remove();
          newCurrentFriends.forEach(element => {
            firebase.database().ref('users').child(user.uid).child("friendsList").push(element);
          });

          // removes user from friends friend list
          let friendFriendList: string[] = [];
          let friendKey = '';

          await firebase.database().ref('users').get().then((snapshot) => {
            if (snapshot.exists()) {
              const tempFriendsList = getUserDataByUsername(snapshot.val(), friendToRemove).friendsList
              friendFriendList = getValuesFromFirebaseArray(tempFriendsList as Record<string, string>);
              friendKey = getUserKeyByUsername(snapshot.val(), friendToRemove);
            }
          })
          const newFriendFriends: string[] = [];
          friendFriendList.forEach(element => {
            if (element !== username) {
              newFriendFriends.push(element);
            }
          });
          await firebase.database().ref('users').child(friendKey).child("friendsList").remove();
          newFriendFriends.forEach(element => {
            firebase.database().ref('users').child(friendKey).child("friendsList").push(element);
          });
          toast({
            title: 'Remove Friend',
            description: friendToRemove.concat(' successfully removed.'),
            status: 'success',
            position: 'top',
            isClosable: true,
          });
          updateFriendListing();
        } else {
          toast({
            title: 'Remove Friend',
            description: friendToRemove.concat(' is already not in your friend list.'),
            status: 'error',
            position: 'top',
            isClosable: true,
          });
        }
      } else {
        toast({
          title: 'Remove Friend',
          description: 'You have no friends to remove.',
          status: 'error',
          position: 'top',
          isClosable: true,
        });
      }
    } else {
      toast({
        title: 'Remove Friend',
        description: 'Username empty. Please enter friend username.',
        status: 'error',
        position: 'top',
        isClosable: true,
      });
    }
  }

  const denyFriendRequest = async (friend: Friend) => {
    // remove request from friendRequestRecieved list
    // remove request from other user's friendRequestSent list


    // removes friend sent from friend database
    let friendSent: string[] = [];
    let friendKey = '';

    await firebase.database().ref('users').get().then((snapshot) => {
      if (snapshot.exists()) {
        const tempFriendsSent = getUserDataByUsername(snapshot.val(), friend.username).friendsRequestsSent
        friendSent = getValuesFromFirebaseArray(tempFriendsSent as Record<string, string>);
        friendKey = getUserKeyByUsername(snapshot.val(), friend.username);
      }
    });

    const newFriendsSent: string[] = [];
    friendSent.forEach(element => {
      if (element !== username) {
        newFriendsSent.push(element);
      }
    });
    await firebase.database().ref('users').child(friendKey).child("friendsRequestsSent").remove();
    newFriendsSent.forEach(element => {
      firebase.database().ref('users').child(friendKey).child("friendsRequestsSent").push(element);
    });



    // removes friend request from database for user on denial
    let currentFriendsReceived: string[] = [];

    const user = firebase.auth().currentUser
    if (user) {
      await firebase.database().ref('users').child(user.uid).get().then((snapshot) => {
        if (snapshot.exists()) {
          currentFriendsReceived = getValuesFromFirebaseArray(snapshot.val().friendsRequestsReceived);
        }
      })
      const newCurrentFriendsReceived: string[] = [];
      currentFriendsReceived.forEach(element => {
        if (element !== friend.username) {
          newCurrentFriendsReceived.push(element);
        }
      });
      await firebase.database().ref('users').child(user.uid).child("friendsRequestsReceived").remove();
      newCurrentFriendsReceived.forEach(element => {
        firebase.database().ref('users').child(user.uid).child("friendsRequestsReceived").push(element);
      });

      setFriendRequestsRecieved(friendRequestsRecieved);
    }
    updateFriendListing();
  }

  const acceptFriendRequest = async (friend: Friend) => {
    // remove request from friendRequestRecieved list
    // remove request from other user's friendRequestSent list

    // add friendName to friend list
    // add user.username to their friend list

    // removes friend sent from friend database, adds user to friends list
    let friendSent: string[] = [];
    let friendKey = '';

    await firebase.database().ref('users').get().then((snapshot) => {
      if (snapshot.exists()) {
        const tempFriendsSent = getUserDataByUsername(snapshot.val(), friend.username).friendsRequestsSent
        friendSent = getValuesFromFirebaseArray(tempFriendsSent as Record<string, string>);
        friendKey = getUserKeyByUsername(snapshot.val(), friend.username);
      }
    });

    const newFriendsSent: string[] = [];
    friendSent.forEach(element => {
      if (element !== username) {
        newFriendsSent.push(element);
      }
    });
    await firebase.database().ref('users').child(friendKey).child("friendsRequestsSent").remove();
    newFriendsSent.forEach(element => {
      firebase.database().ref('users').child(friendKey).child("friendsRequestsSent").push(element);
    });
    firebase.database().ref('users').child(friendKey).child("friendsList").push(username);

    // removes friend request from database for user on denial
    let currentFriendsReceived: string[] = [];

    const user = firebase.auth().currentUser;
    if (user) {
      await firebase.database().ref('users').child(user.uid).get().then((snapshot) => {
        if (snapshot.exists()) {
          currentFriendsReceived = getValuesFromFirebaseArray(snapshot.val().friendsRequestsReceived);
        }
      });
      const newCurrentFriendsReceived: string[] = [];
      currentFriendsReceived.forEach(element => {
        if (element !== friend.username) {
          newCurrentFriendsReceived.push(element);
        }
      });
    
      await firebase.database().ref('users').child(user.uid).child("friendsRequestsReceived").remove();
      newCurrentFriendsReceived.forEach(element => {
        firebase.database().ref('users').child(user.uid).child("friendsRequestsReceived").push(element);
      });
      firebase.database().ref('users').child(user.uid).child("friendsList").push(friend.username);

      setFriendRequestsRecieved(friendRequestsRecieved);
    }
    updateFriendListing();
  }

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
              <Input name="friendUsername" placeholder="Please Enter Friend Username"
                     value={friendName}
                     onChange={event => setFriendName(event.target.value)}
              />
            </FormControl>
        <Button size="sm" data-testid="addFriend" onClick={addFriend}>Add Friend</Button>
        <Button size="sm" data-testid="removeFriend" onClick={removeFriend}>Remove Friend</Button>
      </Box>
    </>);
  };

  return(
    <>
      <form>
        <Stack>
          <Box>
            <HStack>
              <Box width="70%"><h3>Username: {username}</h3></Box>
              <Box width="30%"><Button onClick={logout}>Logout</Button></Box>
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
