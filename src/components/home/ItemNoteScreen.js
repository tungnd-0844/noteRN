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
  Image,
  Alert,
  ToastAndroid,
  TouchableOpacity
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ActionButton from "react-native-action-button";
import { Tooltip } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import Swipeout from "react-native-swipeout";

export default class ItemNoteScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeRowKey: null
    };
  }

  onDeleteNote = item => {
    this.props.onPress(item);
  };

  render() {
    const { item } = this.props;
    const swipeSetting = {
      autoClose: true,
      onClose: (secId, rowId, direction) => {
        this.setState({ activeRowKey: null });
      },
      onOpen: (secId, rowId, direction) => {
        this.setState({ activeRowKey: item.id });
      },
      right: [
        {
          text: "Done",
          backgroundColor: "green",
          underlayColor: "rgba(0, 0, 0, 1, 0.6)",
          onPress: () => {
            // const deletingRow = item.complete;
            this.props.parentFlatList.onToggleNote(item);
            //  ToastAndroid.show(deletingRow, ToastAndroid.SHORT);
            // Alert.alert(
            //   "Alert",
            //   "Bạn có chắc chắn muốn xóa???",
            //   [
            //     { text: "No", style: "cancel" },
            //     {
            //       text: "Yes",
            //       onPress: () => {
            //
            //         // this.onDeleteNote(item);
            //         // this.props.parentFlatList.refreshNoteList(deletingRow);
            //       }
            //     }
            //   ],
            //   { cancelable: true }
            // );
          }
        },
        {
          text: "Delete",
          backgroundColor: "red",
          underlayColor: "rgba(0, 0, 0, 1, 0.6)",
          onPress: () => {
            const deletingRow = this.state.activeRowKey;

            this.onDeleteNote(item);
            this.props.parentFlatList.refreshNoteList(deletingRow);
          }
        }
      ],
      rowId: item.id,
      sectionId: 1
    };
    return (
      <View
        style={[
          { marginLeft: 8, marginRight: 8, marginTop: 8 },
          item.complete ? styles.completed : {}
        ]}
      >
        <Swipeout {...swipeSetting}>
          <View
            style={{
              height: 10,
              backgroundColor: item.background,
              elevation: 2
            }}
          />
          <TouchableOpacity
            onPress={() =>
              this.props.parentFlatList._handlerNavigationDetailNote(item)
            }
          >
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
                  <Tooltip
                    height={100}
                    popover={<Text style={{ flex: 1 }}>{item.address}</Text>}
                  >
                    <MaterialIcon name="room" size={20} />
                  </Tooltip>
                  <MaterialIcon name="settings-voice" size={20} />
                </View>

                <Text
                  numberOfLines={2}
                  style={[
                    { fontSize: 20, color: "black" },
                    item.complete === 1
                      ? { textDecorationLine: "line-through" }
                      : {}
                  ]}
                >
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
          </TouchableOpacity>
        </Swipeout>
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
  },
  completed: {
    opacity: 0.5
  },
  verticalLine: {
    borderBottomColor: "black",
    borderBottomWidth: 2,
    marginLeft: 10,
    //  width: "100%",
    position: "absolute",
    // marginTop: 15,
    fontWeight: "bold"
  }
});
