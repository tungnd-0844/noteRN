/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Image } from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ActionButton from "react-native-action-button";
import Icon from "react-native-vector-icons/Ionicons";

export default class HomeScreen extends Component {
  render() {
    const { item } = this.props;
    return (
      <View style={{ marginLeft: 8, marginRight: 8, marginTop: 8 }}>
        <View
          style={{ height: 10, backgroundColor: item.background, elevation: 2 }}
        />
        <View
          style={{
            flexDirection: "row",
            backgroundColor: item.background,
            elevation: 1
          }}
        >
          <View style={{ flex: 1, margin: 8 }}>
            <View style={{ flexDirection: "row" }}>
              <Text>{item.date}</Text>
              <MaterialIcon name="room" size={20} />
              <MaterialIcon name="settings-voice" size={20} />
            </View>

            <Text style={{ fontSize: 20, color: "black" }}>
              {item.description}
            </Text>
          </View>
          <Image
            source={{
              uri: item.image
            }}
            style={{ width: 75, height: 75, margin: 8 }}
          />
        </View>
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
