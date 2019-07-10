import React, { Component } from "react";
import { StyleSheet, Text, View, Image, Linking } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

export default class InformationScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Notes",
      headerStyle: {
        backgroundColor: "#FDD835"
      },
      headerTintColor: "#fff"
    };
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerAbout}>
          <View style={{ margin: 16 }}>
            <Text style={styles.textHeader}>ABOUT</Text>
            <View style={styles.containerIcon}>
              <Image
                source={require("../../images/note.png")}
                style={{ height: 50, width: 50 }}
              />
              <View
                style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}
              >
                <Text style={{ fontSize: 30 }}>Note</Text>
              </View>
            </View>
            <View style={styles.containerIcon}>
              <Icon name="ios-stopwatch" size={25} style={{ marginLeft: 14 }} />
              <View
                style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}
              >
                <Text style={{ fontSize: 18 }}>Version 1.0</Text>
              </View>
            </View>
            <View style={styles.containerIcon}>
              <Icon
                name="ios-star"
                size={25}
                color={"yellow"}
                style={{ marginLeft: 14 }}
              />
              <View
                style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}
              >
                <Text style={{ fontSize: 18 }}>Rate the app</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.containerAbout}>
          <View style={{ margin: 16 }}>
            <Text style={styles.textHeader}>AUTHOR</Text>
            <View style={styles.containerIcon}>
              <Icon name="logo-github" size={25} style={{ marginLeft: 14 }} />
              <View
                style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}
              >
                <Text
                  style={{ fontSize: 18 }}
                  onPress={() =>
                    Linking.openURL(
                      "https://github.com/tungct97?tab=repositories"
                    )
                  }
                >
                  Nguyễn Đăng Tùng
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.containerAbout}>
          <View style={{ margin: 16 }}>
            <Text style={styles.textHeader}>TMDb</Text>
            <View style={styles.containerIcon}>
              <Image
                source={require("../../images/note.png")}
                style={{ height: 30, width: 30 }}
              />
              <View
                style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}
              >
                <Text style={{ fontSize: 24 }}>Powered by TMDb</Text>
              </View>
            </View>
            <Text style={{ fontSize: 18 }}>
              This app uses SQLite API to fetch and show information.
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerAbout: {
    margin: 16,
    marginLeft: 16,
    elevation: 4,
    backgroundColor: "white"
  },
  textHeader: {
    fontSize: 16
  },
  containerIcon: {
    flexDirection: "row",
    marginTop: 16
  }
});
