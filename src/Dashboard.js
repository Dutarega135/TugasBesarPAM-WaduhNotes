import {
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  Switch,
  Pressable,
  Keyboard,
  TextInput,
  FlatList,
  Button,
  StatusBar,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { firebase } from "../config";
import { Feather, FontAwesome, Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import themeContext from "../config2/themeconteks";
import { EventRegister } from "react-native-event-listeners";

const Dashboard = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState([]);
  const todoRef = firebase.firestore().collection("users");
  const [addData, setAddData] = useState("");
  const navigation = useNavigation();
  const theme = useContext(themeContext);
  const [mode, setMode] = useState(false);

  useEffect(() => {
    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setName(snapshot.data());
        } else {
          console.log("user does not exist");
        }
      });
  }, []);

  useEffect(() => {
    todoRef.orderBy("createdAt", "desc").onSnapshot((querySnapshot) => {
      const email = [];
      querySnapshot.forEach((doc) => {
        const { heading, createdAt } = doc.data();
        email.push({
          id: doc.id,
          heading,
          createdAt,
        });
      });
      setEmail(email);
    });
  }, []);

  //delete a todo from firestore db
  const deleteTodo = (email) => {
    todoRef
      .doc(email.id)
      .delete()
      .then(() => {
        //pemberitahuan berhasil menghapus
        alert("berhasil menghapus");
      })
      .catch((error) => {
        alert(error);
      });
  };
  //add todo
  const addTodo = async () => {
    // console.log(email);

    // mengecek jika kita punya todo
    if (addData && addData.length > 0) {
      //get the timestamp
      const timestamp = await firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        heading: addData,
        createdAt: timestamp,
      };
      await todoRef
        .add(data)
        .then(() => {
          setAddData("");
          //release keyboard
          Keyboard.dismiss();
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const getRouteName = () => {
    const routeName =
      navigation.getState().routeNames[navigation.getState().index];
    return routeName;
  };

  return (
    <View style={[{ flex: 1, backgroundColor: theme.background }]}>
      <Image
        source={require("../assets/noto5.png")}
        style={styles.imageLogin}
      />
      <View style={styles.container}>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={styles.input}
            placeholder="Isi kegiatan"
            placeholderTextColor="#aaaaaa"
            onChangeText={(heading) => setAddData(heading)}
            value={addData}
            underlineColorAndroid="transparent"
          />
          <TouchableOpacity style={styles.button} onPress={addTodo}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
        </View>
        {/* date picker */}
      </View>
      <FlatList
        data={email}
        numColumns={1}
        renderItem={({ item }) => (
          <View>
            <Pressable style={styles.container}>
              <Feather
                name="edit-3"
                color="green"
                onPress={() => navigation.navigate("Edit", { item })}
                style={styles.todoIcon2}
              />
              <FontAwesome
                name="trash-o"
                color="red"
                onPress={() => deleteTodo(item)}
                style={styles.todoIcon}
              />
              <View style={styles.innerContainer}>
                <Text style={styles.itemHeading}>
                  {item?.heading[0]?.toUpperCase() + item.heading.slice(1)}
                </Text>
                <Text>{item?.createdAt?.toDate().toLocaleString()}</Text>
              </View>
            </Pressable>
          </View>
        )}
      />
      {/* Create navigation */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity style={styles.button2}>
          <Feather
            name="home"
            size={24}
            onPress={() => {
              console.log(navigation.getState());
            }}
            color="#62ccb7"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button2}
          onPress={() => navigation.navigate("Profile")}
        >
          <Feather
            name="user"
            size={24}
            color={navigation.getState().index === 2 ? "#62ccb7" : "#b8b9ba"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dashboard;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    margin: 5,
    elevation: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  container3: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginHorizontal: 10,
    margin: 5,
    elevation: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  container2: {
    backgroundColor: "white",
    flex: 1,
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    margin: 1,
    elevation: 10,
    marginHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  con: {
    backgroundColor: "white",
    elevation: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "flex-start",
    flexDirection: "column",
    marginLeft: 10,
  },
  itemHeading: {
    fontWeight: "bold",
    fontSize: 18,
  },
  formContainer: {
    flexDirection: "row",
    height: 80,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 100,
  },
  input: {
    height: 48,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    paddingLeft: 16,
    flex: 1,
    marginRight: 5,
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: "#788eec",
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  todoIcon: {
    marginTop: 5,
    fontSize: 20,
    marginLeft: 10,
  },
  todoIcon2: {
    marginTop: 5,
    fontSize: 20,
  },
  imageLogin: {
    alignSelf: "center",
    width: 150,
    height: 150,
  },
  switch: {
    alignSelf: "center",
    left: "175%",
  },
  todoIcon4: {
    alignSelf: "center",
    fontSize: 30,
    left: "240%",
  },
  todoIcon5: {
    fontSize: 30,
    left: "450%",
  },
  logout: {
    fontSize: 30,
    left: "600%",
  },
});
