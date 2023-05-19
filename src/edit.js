import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState, useContext } from "react";
import { firebase } from "../config";
import themeContext from "../config2/themeconteks";
import DateTimePicker from "@react-native-community/datetimepicker";

const Edit = ({ route, navigation }) => {
  const todoRef = firebase.firestore().collection("users");
  const [textHeading, onChangeHeadingText] = useState(route.params.item);
  const theme = useContext(themeContext);
  const [date, setDate] = useState(textHeading.createdAt?.toDate());

  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false);
    const currentDate = selectedDate || date;
    // setShow(Platform.OS === "ios");
    setDate(currentDate);

    setDate(new Date(currentDate));
  };

  const updateTodo = () => {
    if (textHeading) {
      todoRef
        .doc(route.params.item.id)
        .update({
          heading: textHeading.heading,
          createdAt: date,
        })
        .then(() => {
          navigation.navigate("Dashboard");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <View style={[{ flex: 1, backgroundColor: theme.background }]}>
      <View style={{ marginTop: 50 }}>
        <View style={styles.container}>
          <TextInput
            style={styles.textField}
            onChangeText={(value) => {
              onChangeHeadingText({ ...textHeading, heading: value });
            }}
            value={textHeading.heading}
            placeholder="Isi Kegiatan Baru"
          />

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              display="default"
              onChange={onChange}
              on
            />
          )}

          <Pressable
            onPress={() => {
              setShow(true);
            }}
          >
            <Text style={{ fontSize: 20, color: "#000000" }}>
              {date.toLocaleDateString()}
            </Text>
          </Pressable>

          <Pressable
            style={styles.buttonUpdate}
            onPress={() => {
              updateTodo();
            }}
          >
            <Text style={styles.teksUpdateKata}>UPDATE KATA</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default Edit;
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    marginLeft: 15,
    marginRight: 15,
  },
  textField: {
    marginBottom: 10,
    padding: 10,
    fontSize: 15,
    color: "#000000",
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  buttonUpdate: {
    marginTop: 25,
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 10,
    backgroundColor: "#9acd32",
  },
  teksUpdateKata: {
    fontSize: 14,
    left: "32%",
  },
});
