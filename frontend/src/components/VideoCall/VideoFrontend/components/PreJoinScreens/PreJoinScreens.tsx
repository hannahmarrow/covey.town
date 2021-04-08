import React, { useState } from 'react';
import { Heading, HStack, Box, Text, Stack } from '@chakra-ui/react';
import DeviceSelectionScreen from './DeviceSelectionScreen/DeviceSelectionScreen';
import IntroContainer from '../IntroContainer/IntroContainer';
import UserProfileContainer from '../../../../Login/UserProfileContainer';
import { TownJoinResponse } from '../../../../../classes/TownsServiceClient';
import TownSelection from '../../../../Login/TownSelection';
import UserProfile from '../../../../Login/UserProfile';
import MainContainer from '../../../../Login/MainContainer';
import DisplayNameContext from '../../../../../contexts/DisplayNameContext';
import Video from '../../../../../classes/Video/Video';

export default function PreJoinScreens(props: { doLogin: (initData: TownJoinResponse) => Promise<boolean>; setMediaError?(error: Error): void }) {  
  // get database displayName if user is NOT guest
  const databaseDisplayName = 'l33t_h4ck3rz';
  const [displayName, setDisplayName] = useState(Video.instance()?.userName || databaseDisplayName);
  
  return (
    <IntroContainer>
      <DisplayNameContext.Provider value={{displayName, setDisplayName}}>
        <HStack align="normal">
          <Stack>
            <Box>
              <DeviceSelectionScreen setMediaError={props.setMediaError} />
            </Box>
            <UserProfileContainer>
              <UserProfile />
            </UserProfileContainer>
          </Stack>
          <MainContainer>
            <Heading as="h2" size="xl">Welcome to Covey.Town!</Heading>
            <Text p="4">
              Covey.Town is a social platform that integrates a 2D game-like metaphor with video chat.
              To get started, setup your camera and microphone, choose a username, and then create a new town
              to hang out in, or join an existing one.
            </Text>
            <TownSelection doLogin={props.doLogin} />
          </MainContainer>
        </HStack>
      </DisplayNameContext.Provider>
    </IntroContainer>
  );
}
