import React , { useState, useLayoutEffect, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { getFirestore, getDoc, setDoc, doc, collection, onSnapshot, addDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from "firebase/auth";

let firestore;
let firebaseAuth;

const ListButton = ({title, color, onPress, onDelete, onOptions}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
    style={[styles.itemContainer, { backgroundColor: color }]}
    >
      <View>
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      <View style={{flexDirection:"row"}}>
        <TouchableOpacity
          onPress={onOptions}
        >
          <Ionicons name="options-outline" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onDelete}
        >
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const renderAddListIcon = (navigation, addItemToLists) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={{ justifyContent: "center", marginRight: 4 }}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons name="settings" size={16} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Edit", { saveChanges: addItemToLists })
        }
        style={{ justifyContent: "center", marginRight: 8 }}
      >
        <Text style={styles.icon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ({navigation}) => {
  const [lists, setLists] = useState([]);

  firebaseAuth = getAuth();
  firestore = getFirestore();
  const listsRef = collection(firestore, "users", firebaseAuth.currentUser.uid, "lists");

  useEffect(() => {
    onSnapshot(listsRef, (newLists) => {
      let items = newLists.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        console.log(data);
        return data;
      });

      setLists(items);
    });
  }, []);

  const addItemToLists = ({title, color}) => {
    const index = lists.length > 1 ? lists[lists.length - 1].index + 1 : 0;
    addDoc(listsRef, {
      title: title,
      color: color,
      index: index
    })
  }

  const removeItemFromLists = (id) => {
    deleteDoc(doc(firestore, "users", firebaseAuth.currentUser.uid, "lists", id));
  }

  const updateItemFromLists = (id, item) => {
    updateDoc(doc(firestore, "users", firebaseAuth.currentUser.uid, "lists", id), item);
  }


  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => renderAddListIcon(navigation, addItemToLists)
    })
  })

  return(
    <View style={styles.container}>
      <FlatList
        data={lists}
        renderItem={({item: {title, color, id, index}}) => {
          return (
            <ListButton
              title={title}
              color={color}
              navigation={navigation}
              onPress={() => {
                navigation.navigate("ToDo List", {
                  title,
                  color,
                  listId: id,
                });
              }}
              onOptions={() => {
                navigation.navigate("Edit", {
                  title,
                  color,
                  saveChanges: (newItem) =>
                      updateItemFromLists(id, {index, ...newItem}),
                });
              }}
              onDelete={() => removeItemFromLists(id)}
            />
          );
        }}
      >
      </FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    itemTitle: {
        fontSize: 24,
        padding: 5,
        color: "white"
    },
    itemContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: 100,
        flex: 1,
        borderRadius: 20,
        marginHorizontal: 20,
        marginVertical: 10,
        padding: 15
    },
    icon: {
        padding: 5,
        fontSize: 24,
    },
    centeredView: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 50,
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});
