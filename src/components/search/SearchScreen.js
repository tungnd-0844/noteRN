import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from "react-native";
import { SearchBar, Header } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import ItemNoteScreen from "../home/ItemNoteScreen";
import { openDatabase } from "react-native-sqlite-storage";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import CustomMenuIcon from "../menu/CustomMenuIcon";

var db = openDatabase({ name: "NoteDatabase.db" });

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: "",
      listNotes: []
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };

  _searchFilterFunction = async text => {
    await this.setState({ note: text });
    const { note } = this.state;
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM table_note where description = ?",
        [note],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            temp.push(results.rows.item(i));
          }
          this.setState({
            listNotes: temp
          });
        }
      );
    });
  };

  onDeleteNote = item => {
    db.transaction(tx => {
      tx.executeSql(
        "DELETE FROM table_note where id=?",
        [item.id],
        (tx, results) => {
          if (results.rowsAffected > 0) {
            this.getAllNotes();
            ToastAndroid.show("Bạn đã xóa thành công", ToastAndroid.SHORT);
          } else {
            ToastAndroid.show("Xoá thất bại", ToastAndroid.SHORT);
          }
        }
      );
    });
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

  _handlerNavigationDetailNote = item => {
    this.props.navigation.navigate("DetailNote", {
      ITEM: item
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          placeholder="Type Here..."
          lightTheme
          onChangeText={this._searchFilterFunction}
          round
          value={this.state.note}
          autoCorrect={false}
        />

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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imagPath: {
    width: 120,
    height: 150,
    position: "absolute"
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
  }
});
