import React from "react";
import { View } from "react-native";
import Button from "../components/Button";
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';

let firebaseApp;
let firebaseAuth;

let firebaseConfig = {
  apiKey: "AIzaSyC5ZxU-vcAH9y-seX1MqpzFN-u2IxIxWck",
  authDomain: "my-todolist-71b68.firebaseapp.com",
  projectId: "my-todolist-71b68",
  storageBucket: "my-todolist-71b68.appspot.com",
  messagingSenderId: "1038083395340",
  appId: "1:1038083395340:web:d8d8ad380bdc458cc04329"
};

initializeApp(firebaseConfig);

export default () => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Button
        text="Log out"
        onPress={() => {
          firebaseAuth = getAuth();
          firebaseAuth.signOut();
        }}
      />
    </View>
  );
};
