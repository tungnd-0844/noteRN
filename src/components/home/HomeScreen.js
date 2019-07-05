/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

export default class HomeScreen extends Component {
  static navigationOptions = {
    title: "Notes",
    headerStyle: {
      backgroundColor: "#FDD835"
    },
    headerTintColor: "#fff",
    headerRight: (
      <View style={{ flexDirection: "row", marginRight: 8 }}>
        <MaterialIcon name="search" size={30} color="white" />
        <MaterialIcon name="more-vert" size={30} color="white" />
      </View>
    )
  };

  _handlerNavigationCreateNote = () => {
    this.props.navigation.navigate("CreateNote");
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            margin: 8,
            backgroundColor: "#E8F5E9"
          }}
        >
          <View style={{ flex: 1, margin: 8 }}>
            <View style={{ flexDirection: "row" }}>
              <Text>12/08/2018 11.20</Text>
              <MaterialIcon name="room" size={20} />
              <MaterialIcon name="settings-voice" size={20} />
            </View>

            <Text style={{ fontSize: 20, color: "black" }}>Diet</Text>
          </View>
          <Image
            source={{
              uri:
                "https://pbs.twimg.com/profile_images/486929358120964097/gNLINY67_400x400.png"
            }}
            style={{ width: 75, height: 75, margin: 8 }}
          />
        </View>

        <ActionButton
          buttonColor="#FDD835"
          style={{ alignItems: "flex-end", elevation: 4 }}
        >
          <ActionButton.Item
            buttonColor="#FDD835"
            onPress={() => console.log("notes tapped!")}
          >
            <Icon name="ios-camera" size={25} color={"white"} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor="#FDD835" onPress={() => {}}>
            <Icon name="ios-checkbox" size={25} color={"white"} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#FDD835"
            onPress={() => this._handlerNavigationCreateNote()}
          >
            <Icon name="ios-create" size={25} color={"white"} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
