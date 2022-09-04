import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Button from "../components/Button";
import LabeledInput from "../components/LabeledInput";
import Colors from "../constants/Colors";
import validator from "validator";
import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, setDoc, doc } from 'firebase/firestore';


let firebaseApp;
let firebaseAuth;
let firestore;

let firebaseConfig = {
  apiKey: "AIzaSyC5ZxU-vcAH9y-seX1MqpzFN-u2IxIxWck",
  authDomain: "my-todolist-71b68.firebaseapp.com",
  projectId: "my-todolist-71b68",
  storageBucket: "my-todolist-71b68.appspot.com",
  messagingSenderId: "1038083395340",
  appId: "1:1038083395340:web:d8d8ad380bdc458cc04329"
};

initializeApp(firebaseConfig);
//
// // Listen for authentication state to change.
// onAuthStateChanged(auth, user => {
//   if (user != null) {
//     console.log('We are authenticated now!');
//   }
//
//   // Do other things
// });

const validateFields = (email, password) => {
  const isValid = {
    email: validator.isEmail(email),
    password: validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }),
  };

  return isValid;
};

const login = (email, password) => {
  firebaseAuth = getAuth();
  signInWithEmailAndPassword(firebaseAuth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("Logged in!");
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);
  });
};

const createAccount = (email, password) => {
  firebaseAuth = getAuth();
  firestore = getFirestore();
  createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Creating user...");

      setDoc(doc(firestore, "users", user.uid), {
      });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });
};


export default () => {
  const [isCreateMode, setCreateMode] = useState(false);
  const [emailField, setEmailField] = useState({
    text: "",
    errorMessage: "",
  });
  const [passwordField, setPasswordField] = useState({
    text: "",
    errorMessage: "",
  });
  const [passwordReentryField, setPasswordReentryField] = useState({
    text: "",
    errorMessage: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🔥 ToDo</Text>
      <View style={{ flex: 1 }}>
        <LabeledInput
          label="Email"
          text={emailField.text}
          onChangeText={(text) => {
            setEmailField({ text });
          }}
          errorMessage={emailField.errorMessage}
          labelStyle={styles.label}
          autoCompleteType="email"
        />
        <LabeledInput
          label="Password"
          text={passwordField.text}
          onChangeText={(text) => {
            setPasswordField({ text });
          }}
          secureTextEntry={true}
          errorMessage={passwordField.errorMessage}
          labelStyle={styles.label}
          autoCompleteType="password"
        />
        {isCreateMode && (
          <LabeledInput
            label="Re-enter Password"
            text={passwordReentryField.text}
            onChangeText={(text) => {
              setPasswordReentryField({ text });
            }}
            secureTextEntry={true}
            errorMessage={passwordReentryField.errorMessage}
            labelStyle={styles.label}
          />
        )}
        <TouchableOpacity
          onPress={() => {
              setCreateMode(!isCreateMode);
          }}
        >
          <Text
            style={{
              alignSelf: "center",
              color: Colors.blue,
              fontSize: 16,
              margin: 4,
            }}
          >
            {isCreateMode
              ? "Already have an account?"
              : "Create new account"}
          </Text>
        </TouchableOpacity>
      </View>

      <Button
        onPress={() => {
          const isValid = validateFields(
            emailField.text,
            passwordField.text
          );
          let isAllValid = true;
          if (!isValid.email) {
            emailField.errorMessage = "Please enter a valid email";
            setEmailField({ ...emailField });
            isAllValid = false;
          }

          if (!isValid.password) {
            passwordField.errorMessage =
              "Password must be at least 8 long w/numbers, uppercase, lowercase, and symbol characters";
            setPasswordField({ ...passwordField });
            isAllValid = false;
          }

          if (
            isCreateMode &&
            passwordReentryField.text != passwordField.text
          ) {
            passwordReentryField.errorMessage =
              "Passwords do not match";
            setPasswordReentryField({ ...passwordReentryField });
            isAllValid = false;
          }

          if (isAllValid) {
            isCreateMode
              ? createAccount(emailField.text, passwordField.text)
              : login(emailField.text, passwordField.text);
          }
        }}
        buttonStyle={{ backgroundColor: Colors.red }}
        text={isCreateMode ? "Create Account" : "Login"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.black
  },
  header: {
    fontSize: 72,
    color: Colors.red,
    alignSelf: "center"
  },
});
