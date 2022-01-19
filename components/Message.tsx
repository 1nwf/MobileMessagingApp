import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { socket, server } from "../socket";
import { User } from "../types";
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
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { isTemplateElement } from "@babel/types";
const url = "https://chatapp-backend3.herokuapp.com/";

export default function Message(props: any) {
  const connectedUsers = props.route.params.connectedUsers;
  const messageUser = props.route.params.messageUser;
  const user = props.route.params.user;
  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userMsg, setUserMsg] = useState("");
  const [incMessage, setIncMessage] = useState({});
  const listRef = useRef(null);
  useEffect(() => {
    console.log(messageUser);
  }, []);
  const [kbShown, setKbShown] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKbShown(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKbShown(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const sendMessage = () => {
    const data = {
      msg: userMsg,
      user_1: user.username,
      user_2: messageUser.username,
      from: user.username,
    };

    const msgData = { message: userMsg, from: user.username };
    setMsgs([msgData, ...msgs]);
    console.log("data: " + JSON.stringify(data));

    axios
      .post(url + "msg/sendMessage", data)
      .then((res) => console.log(res.data))
      .catch((e) => console.log(e));
    const userOnline = connectedUsers.filter(
      (el: String) => el.username == messageUser.username
    )[0];
    if (userOnline) {
      socket.emit("dm", {
        userMsg,
        to: userOnline.id,
      });
    }
  };

  const fetchMessages = () => {
    const userData = {
      username: user.username,
      password: user.password,
      chatUser: messageUser.username,
    };
    axios
      .post(url + "msg", userData)
      .then((res) => {
        setLoading(false);

        if (res.data.messages != undefined) {
          setMsgs(res.data.messages.reverse());
        } else {
          setMsgs([]);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.on("new-dm", (newMSG) => {
      const msgData = { message: newMSG.dm, from: newMSG.from };
      setIncMessage(msgData);
    });
  }, []);

  useEffect(() => {
    if (incMessage != {}) {
      setMsgs([incMessage, ...msgs]);
      setIncMessage({});
    }
  }, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {loading == false ? (
          <View style={styles.container}>
            <Text>{"\n"}</Text>
            <View style={styles.msgList}>
              {msgs.length > 0 ? (
                <FlatList
                  inverted
                  ref={listRef}
                  data={msgs}
                  renderItem={({ item, index }) => (
                    <View
                      style={
                        item.from == user.username
                          ? styles.fromUserMsg
                          : styles.notFromUserMsg
                      }
                    >
                      <Text style={{ color: "white" }}>{item.message}</Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              ) : (
                <Text style={styles.noMSG}>Start a {"\n"}conversations</Text>
              )}
            </View>

            <View style={styles.bottomInput}>
              <TextInput
                style={!kbShown ? styles.input : styles.inputWKB}
                onChangeText={setUserMsg}
                value={userMsg}
                placeholder="Send a message...."
              ></TextInput>
              <Button title="Send" onPress={() => sendMessage()}></Button>
            </View>
          </View>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    </KeyboardAvoidingView>
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
  },
  bottomInput: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 20,
    flex: 1,
    justifyContent: "space-between",
    borderRadius: 12,
    marginVertical: -30,
    marginHorizontal: 12,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    height: 50,
    width: "80%",
    flexDirection: "row",
    color: "black",
    marginVertical: 30,
    flex: 40,
    backgroundColor: "white",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  inputWKB: {
    height: 50,
    width: "80%",
    flexDirection: "row",
    color: "black",
    marginVertical: 100,
    flex: 40,
    backgroundColor: "white",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  fromUserMsg: {
    flex: 1,
    backgroundColor: "#1982FC",
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 20,
    width: "40%",
    borderRadius: 20,
    justifyContent: "center",
    left: "50%",
  },
  notFromUserMsg: {
    flex: 1,
    backgroundColor: "gray",
    marginHorizontal: 20,
    marginVertical: 4,
    padding: 20,
    width: "40%",
    borderRadius: 20,
    justifyContent: "center",
    right: "1%",
  },
  msgList: {
    height: "85%",
    top: -63,
    flexGrow: 0,
  },
  noMSG: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: "50%",
    justifyContent: "center",
    alignContent: "center",
    width: "100%",
    height: "100%",
  },
});
