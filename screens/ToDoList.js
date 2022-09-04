import React, { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import ToDoItem from "../components/ToDoItem";
import { getFirestore, getDoc, setDoc, doc, collection, onSnapshot, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

let firestore;
let firebaseAuth;

const renderAddListIcon = (addItem) => {
  return (
    <TouchableOpacity
      onPress={() => {
        addItem()
      }}
    >
      <Text style={styles.icon}>+</Text>
    </TouchableOpacity>
  );
}


export default ({navigation, route}) => {
  let [toDoItems, setToDoItems] = useState([]);
  const [newItem, setNewItem] = useState();

  firebaseAuth = getAuth();
  firestore = getFirestore();
  const toDoItemsRef = collection(firestore, "users", firebaseAuth.currentUser.uid, "lists", route.params.listId, "todoItems");

  useEffect(() => {
    onSnapshot(toDoItemsRef, (newToDoItems) => {
      let items = newToDoItems.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
      });

      setToDoItems(items);
    });
  }, []);

  const addItemToLists = () => {
    setNewItem({ text: "", isChecked: false, new: true})
  }

  const removeToDoItem = (index) => {
    toDoItems.splice(index, 1);
    setToDoItems([...toDoItems]);
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderAddListIcon(addItemToLists),
    })
  })

  if ( newItem ) {
    toDoItems = [newItem, ...toDoItems];
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={toDoItems}
        renderItem={({item: {id, text, isChecked, ...params}, index}) => {
          return (
            <ToDoItem
              {...params}
              text={text}
              isChecked={isChecked}
              onChecked={() => {
                let data = { text, isChecked: !isChecked };
                id && updateDoc(doc(firestore, "users", firebaseAuth.currentUser.uid, "lists", route.params.listId, "todoItems", id), data);
              }}
              onChangeText={(newText) => {
                if (params.new) {
                  setNewItem({
                    text: newText,
                    isChecked,
                    new: params.new
                  });
                } else {
                  toDoItems[index].text = newText;
                  setToDoItems([...toDoItems]);
                }
              }}
              onDelete={() => {
                params.new ? setNewItem(null) : removeToDoItem(index);
                id && deleteDoc(doc(firestore, "users", firebaseAuth.currentUser.uid, "lists", route.params.listId, "todoItems", id));
              }}
              onBlur={() => {
                if ( text.length > 1 ) {
                  let data = { text, isChecked}
                  if (id) {
                    updateDoc(doc(firestore, "users", firebaseAuth.currentUser.uid, "lists", route.params.listId, "todoItems", id), data);
                  } else {
                    addDoc(toDoItemsRef, data);
                  }
                  params.new && setNewItem(null);
                } else {
                  params.new ? setNewItem(null) : removeToDoItem(index);
                }
              }}
            />
          );
        }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  icon: {
    padding: 5,
    fontSize: 24,
    color: "white",
  },
});
