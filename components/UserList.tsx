import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket, server } from "../socket";
import { User } from "../types";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { isTemplateElement } from "@babel/types";
const url = "https://chatapp-backend3.herokuapp.com/";

export default function UserList(props: any) {
  const logout = () => {
    props.setLoggedIn(false);
  };
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const user: User = props.user;
  const fetchUsers = () => {
    axios
      .get(url + "signUp")
      .then((res) => {
        console.log(res.data);

        const userData = res.data.filter(
          (person: User) => person.username != user.username
        );
        setAllUsers(userData);
        setFilteredUsers(userData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log("getting connected users");
    socket.on("new-user", (newUsers) => {
      console.log(
        "NEW USER MAIN: " +
          JSON.stringify(newUsers.filter((el) => el.username != user.username))
      );
      fetchUsers();

      setConnectedUsers(newUsers.filter((el) => el.username != user.username));

      console.log("CONNECTED USERS: " + JSON.stringify(newUsers));
    });
  }, []);

  useEffect(() => {
    console.log("Connecting socket");

    socket.auth = { username: user.username };
    socket.connect();
  }, []);

  useEffect(() => {
    console.log("Fetching Users");

    fetchUsers();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      const id = socket.id;
      const username = socket.auth.username;
      console.log("SOCKET USERNAME: " + username);
      const userInfo = { id: id, username: username };
      socket.emit("new-connection", userInfo);
    });
  }, []);

  return (
    <View style={styles.main}>
      <Pressable style={styles.button} onPress={() => logout()}>
        <Text style={styles.text}>Logout</Text>
      </Pressable>
      <Text style={styles.home}>Welcome {user.username}</Text>
      <FlatList
        data={allUsers}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() =>
              props.navigation.navigate("Message", {
                messageUser: item,
                user: user,
                connectedUsers: connectedUsers,
              })
            }
          >
            <View style={styles.list}>
              <Image
                source={{ uri: url + "user_pfps/" + item.pfp }}
                style={{ width: 60, height: 60 }}
              />
              <Text style={styles.heading}>{item.username}</Text>
              <Text
                style={{ color: item.status == "online" ? "green" : "red" }}
              >
                {item.status}
              </Text>
            </View>
          </Pressable>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  heading: {
    color: "black",
    fontSize: 26,
    paddingHorizontal: 22,
    textAlign: "left",
    // backgroundColor: "white",
  },

  button: {
    alignItems: "center",
    justifyContent: "center",
    // width: "30%",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: "30%",
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  main: {
    backgroundColor: "white",
    height: "100%",
  },
  list: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#ecf0f1",
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  home: {
    color: "black",
    fontSize: 35,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: "left",
  },
});
