import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  TextInput,
  Pressable,
  Text,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function ImagePickerExample({ styles }) {
  const registerUrl = "https://chatapp-backend3.herokuapp.com/signUp";
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    pfp: "",
  });
  const [name, setName] = useState("");
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      setUserData({ ...userData, pfp: result.uri });
    }
  };

  const register = async () => {
    const formData = new FormData();
    formData.append("username", userData.username);
    formData.append("firstName", userData.firstName);
    formData.append("lastName", userData.lastName);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("pfp", userData.pfp);
    await axios
      .post(registerUrl, formData)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <View>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && (
          <Image
            source={{ uri: image }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 20,
            }}
          />
        )}
      </View>
      <TextInput
        style={styles.input}
        value={userData.username}
        placeholder="Username"
        onChangeText={(txt) => setUserData({ ...userData, username: txt })}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={userData.password}
        placeholder="password"
        onChangeText={(txt) => setUserData({ ...userData, password: txt })}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={userData.email}
        placeholder="email"
        onChangeText={(txt) => setUserData({ ...userData, email: txt })}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={userData.firstName}
        placeholder="first name"
        onChangeText={(txt) => setUserData({ ...userData, firstName: txt })}
      ></TextInput>
      <TextInput
        style={styles.input}
        value={userData.lastName}
        placeholder="last name"
        onChangeText={(txt) => setUserData({ ...userData, lastName: txt })}
      ></TextInput>
      <Pressable style={styles.button} onPress={() => register()}>
        <Text style={styles.text}>Sign Up</Text>
      </Pressable>
    </View>
  );
}
