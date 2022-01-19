import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket, server } from "../socket";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import UserList from "../components/UserList";
import ImagePicker from "../components/SignUp";
const signInURl = "https://chatapp-backend3.herokuapp.com/signIn";

export default function WelcomeScreen(props: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [register, setRegister] = useState(false);
  const [user, setUser] = useState({
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    pfp: "",
    status: "",
    username: "",
  });
  const [kbShown, setKbShown] = useState(false);

  useEffect(() => {
    console.log("Logged in status: " + loggedIn);
  }, [loggedIn]);
  const logout = () => {
    setUsername("");
    setPassword("");
    setLoggedIn(false);
    console.log(loggedIn);

    Alert.alert("Logged Out", "Successfully Logged out", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };
  const login = async (username: String, password: String) => {
    setLoading(true);
    console.log("username: " + username);
    console.log("password: " + password);
    await axios
      .post(signInURl, {
        username: username,
        password: password,
      })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        setUser(res.data);
        setLoggedIn(true);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e.message);
      });
  };

  const keyboardVerticalOffset = Platform.OS === "ios" ? 80 : 0;

  const onUserChange = () => {};
  return loggedIn == false ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {loading == false ? (
          <View style={styles.container}>
            <Text style={styles.heading}>
              {register ? "Register" : "Sign in"}
            </Text>
            {register ? (
              <ImagePicker styles={styles} />
            ) : (
              <View>
                <Text>{"\n"}</Text>

                <TextInput
                  style={styles.input}
                  value={username}
                  placeholder="Username"
                  onChangeText={setUsername}
                ></TextInput>
                <TextInput
                  style={styles.input}
                  value={password}
                  placeholder="password"
                  onChangeText={setPassword}
                ></TextInput>

                <Text>{"\n"}</Text>
                <Pressable
                  style={styles.button}
                  onPress={() => login(username, password)}
                >
                  <Text style={styles.text}>Sign in</Text>
                </Pressable>
              </View>
            )}
            <Pressable
              style={styles.lightBtn}
              onPress={() => setRegister(!register)}
            >
              <Text style={styles.lightTxt}>
                {register ? "Sign in" : "Register"}
              </Text>
            </Pressable>
          </View>
        ) : (
          <ActivityIndicator style={styles.loading} />
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  ) : (
    <UserList
      navigation={props.navigation}
      setLoggedIn={setLoggedIn}
      user={user}
    />
  );
}
const styles = StyleSheet.create({
  containerWithKeyboard: {
    flex: 1,
    height: "100%",
    paddingBottom: "80%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: "white",
    justifyContent: "center",
  },
  heading: {
    color: "black",
    fontSize: 33,
    textAlign: "center",
  },
  input: {
    height: 50,
    color: "black",
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
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
  loading: {
    height: "100%",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "white",
  },
  lightBtn: {
    color: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    marginHorizontal: "30%",
  },
  lightTxt: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "normal",
    letterSpacing: 0.25,
    color: "black",
  },
});
