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
  TouchableOpacity,
  Image,
  Alert,
  ToastAndroid
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ActionButton from "react-native-action-button";
import ItemNoteScreen from "./ItemNoteScreen";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-picker";
import ItemGirdNoteScreen from "./ItemGirdNoteScreen";
import CustomMenuIcon from "../menu/CustomMenuIcon";
import { openDatabase } from "react-native-sqlite-storage";

var db = openDatabase({ name: "NoteDatabase.db" });
export default class HomeScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      // title: "Notes",
      // headerStyle: {
      //   backgroundColor: "#FDD835"
      // },
      // headerTintColor: "#fff",
      // headerRight: (
      //   <View style={{ flexDirection: "row", marginRight: 8 }}>
      //     <TouchableOpacity onPress={() => navigation.navigate("Search")}>
      //       <MaterialIcon name="search" size={30} color="white" />
      //     </TouchableOpacity>

      //     <CustomMenuIcon
      //       menutext="Menu"
      //       optionNavigationInformationClick={() => {
      //         navigation.navigate("Information");
      //       }}
      //       optionSortListClick={() => {
      //         ToastAndroid.show(state.avatarSource, ToastAndroid.SHORT);
      //       }}
      //     />
      //   </View>
      // )
    };
  };

  constructor(props) {
    super(props);
    db.transaction(function(txn) {
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='table_note'",
        [],
        function(tx, res) {
          if (res.rows.length == 0) {
            txn.executeSql("DROP TABLE IF EXISTS table_note", []);
            txn.executeSql(
              "CREATE TABLE IF NOT EXISTS table_note(id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, image TEXT, background TEXT, address TEXT, date TEXT, complete bool)",
              []
            );
          }
        }
      );
    });
    this.state = {
      avatarSource: "",
      listNotes: [],
      deleteRowKey: null,
      typeList: false
    };
  }

  refreshNoteList = deleteKey => {
    this.setState({
      deleteRowKey: deleteKey
    });
  };

  _handlerNavigationCreateNote = () => {
    this.props.navigation.navigate("CreateNote", {
      IMAGE: null
    });
  };

  _handlerNavigationDetailNote = item => {
    this.props.navigation.navigate("DetailNote", {
      ITEM: item
    });
  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, response => {
      this.setState({
        avatarSource: response.uri
      });
      this.props.navigation.navigate("CreateNote", {
        IMAGE: this.state.avatarSource
      });
    });
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () =>
      this.getAllNotes()
    );
  }

  getAllNotes() {
    db.transaction(tx => {
      tx.executeSql("SELECT * FROM table_note", [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        this.setState({
          listNotes: temp
        });
      });
    });
  }

  onDeleteNote = item => {
    Alert.alert(
      "Alert",
      "Bạn có chắc chắn muốn xóa???",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            db.transaction(tx => {
              tx.executeSql(
                "DELETE FROM table_note where id=?",
                [item.id],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    this.getAllNotes();
                    ToastAndroid.show(
                      "Bạn đã xóa thành công",
                      ToastAndroid.SHORT
                    );
                  } else {
                    ToastAndroid.show("Xoá thất bại", ToastAndroid.SHORT);
                  }
                }
              );
            });
          }
        }
      ],
      { cancelable: true }
    );
  };

  onToggleNote = item => {
    const { id, complete } = item;
    var a = complete;
    if (a === 1) {
      a = 0;
    } else {
      a = 1;
    }
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE table_note set complete=? where id=?",
        [a, id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            this.getAllNotes();
            ToastAndroid.show("Bạn đã thay đổi thành công", ToastAndroid.SHORT);
          } else {
            ToastAndroid.show("Thay đổi thất bại", ToastAndroid.SHORT);
          }
        }
      );
    });
  };

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    // const a = this.state.listNotes.sort((a,b) => (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0));
    // console.log(a);
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: 56,
            backgroundColor: "#FDD835",
            flexDirection: "row",
            justifyContent: "space-between",
            elevation: 4
          }}
        >
          <View>
            <Text
              style={{
                marginTop: 16,
                marginLeft: 16,
                color: "#FFF",
                fontSize: 20,
                fontWeight: "bold"
              }}
            >
              Notes
            </Text>
          </View>
          <View>
            <View
              style={{ flexDirection: "row", marginRight: 8, marginTop: 16 }}
            >
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Search")}
              >
                <MaterialIcon name="search" size={30} color="white" />
              </TouchableOpacity>

              <CustomMenuIcon
                menutext="Menu"
                optionNavigationInformationClick={() => {
                  this.props.navigation.navigate("Information");
                }}
                optionSortListClick={() => {
                  this.setState({ typeList: false });
                }}
                optionSortGirdClick={() => {
                  this.setState({ typeList: true });
                }}
              />
            </View>
          </View>
        </View>
        {this.state.typeList === false ? (
          <FlatList
            data={this.state.listNotes}
            renderItem={({ item, index }) => {
              return (
                <ItemNoteScreen
                  item={item}
                  index={index}
                  onPress={this.onDeleteNote}
                  parentFlatList={this}
                />
              );
            }}
            keyExtractor={({ id }, index) => index.toString()}
          />
        ) : (
          <FlatList
            data={this.state.listNotes}
            numColumns={2}
            renderItem={({ item, index }) => {
              return (
                <ItemGirdNoteScreen
                  item={item}
                  index={index}
                  onPress={this.onDeleteNote}
                  parentFlatList={this}
                />
              );
            }}
            key={this.state.typeList === false ? "v" : "h"}
            keyExtractor={({ id }, index) => index.toString()}
          />
        )}
        <ActionButton
          buttonColor="#FDD835"
          style={{ alignItems: "flex-end", elevation: 4 }}
        >
          <ActionButton.Item
            buttonColor="#FDD835"
            onPress={() => this.selectPhotoTapped()}
          >
            <Icon name="ios-camera" size={25} color={"white"} />
          </ActionButton.Item>
          {/* <ActionButton.Item buttonColor="#FDD835" onPress={() => {}}>
            <Icon name="ios-checkbox" size={25} color={"white"} />
          </ActionButton.Item> */}
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
