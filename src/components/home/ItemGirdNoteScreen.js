import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";

export default class ItemGirdNoteScreen extends Component {
  onDeleteNote = item => {
    this.props.onPress(item);
  };

  render() {
    const { item } = this.props;
    var icon =
      item.image === null
        ? require("../../images/default.jpg")
        : { uri: item.image };
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: item.background },
          item.complete ? styles.completed : {}
        ]}
      >
        <TouchableOpacity
          onPress={() =>
            this.props.parentFlatList._handlerNavigationDetailNote(item)
          }
          onLongPress={() => this.onDeleteNote(item)}
        >
          <View
            style={{
              height: 10,
              backgroundColor: item.background,
              elevation: 2
            }}
          />
          <View style={{ elevation: 1 }}>
            <View style={{ flexDirection: "row", marginTop: 4 }}>
              <Text>{item.date}</Text>
              <MaterialIcon name="room" size={20} />
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
            <Image source={icon} style={styles.imagPath} />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 200,
    flex: 1,
    margin: 8
  },
  imagPath: {
    width: "100%",
    height: 150
  },
  textName: {
    color: "white",
    fontSize: 14,
    marginLeft: 6
  },
  textJob: {
    color: "white",
    fontSize: 12,
    margin: 6
  },
  completed: {
    opacity: 0.5
  }
});
