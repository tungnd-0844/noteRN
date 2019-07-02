/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { useState } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";

export default function App() {
  const [name, setName] = useState("Tung");

  return (
    <View>
      <Text>{name}</Text>
      <Button title="text" onPress={() => setName("Tung dep trai")} />
    </View>
  );
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
