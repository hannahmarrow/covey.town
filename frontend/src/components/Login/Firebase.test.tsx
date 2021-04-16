/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import '@testing-library/jest-dom'
import { fireEvent, render, RenderResult, waitFor } from '@testing-library/react';
import { nanoid } from 'nanoid';
import { TargetElement } from '@testing-library/user-event';
import TownSettings from './TownSettings';
import TownsServiceClient from '../../classes/TownsServiceClient';
import CoveyAppContext from '../../contexts/CoveyAppContext';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";
import * as FirebaseConfig from "./FirebaseConfig"



describe('Firebase Tests', () => {
    it("Tests Firebase Database", async () => {
        
      // initialize firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(FirebaseConfig.firebaseConfig);
      }
      else {
        firebase.app();
      }

        
    firebase.database().ref('test').set("test_val")
    expect(firebase.database().ref('test').get()).resolves.not.toBeNull()

    });
})
