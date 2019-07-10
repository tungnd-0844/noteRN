import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ToastAndroid,
  ToolbarAndroid
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";
import { startRecording } from "../../components/createnote/CreateNoteAction";
import Voice from "react-native-voice";
import DateTimePicker from "react-native-modal-datetime-picker";
import { openDatabase } from "react-native-sqlite-storage";

var db = openDatabase({ name: "NoteDatabase.db" });
class DetailNoteScreen extends Component {
  static navigationOptions = {
    header: null
    // title: "Input title",
    // headerStyle: {
    //   backgroundColor: "#FDD835"
    // },
    // headerTintColor: "#fff",
    // headerRight: (
    //   <View style={{ flexDirection: "row", marginRight: 8 }}>
    //     <MaterialIcon
    //       name="done"
    //       size={30}
    //       color="green"
    //       onPress={() => this.a()}
    //     />
    //   </View>
    // )
  };

  constructor(props) {
    super(props);
    this.state = {
      date: this.props.navigation.state.params.ITEM.date,
      avatarSource: this.props.navigation.state.params.ITEM.image,
      backgroundColor: this.props.navigation.state.params.ITEM.background,
      chooseColor: false,
      results: this.props.navigation.state.params.ITEM.description,
      voice: false,
      address: this.props.navigation.state.params.ITEM.address,
      id: this.props.navigation.state.params.ITEM.id
    };
    Voice.onSpeechResults = this.onSpeechResults;
  }

  updateNote = () => {
    var that = this;
    const { id } = this.state;
    const { results } = this.state;
    const { backgroundColor } = this.state;
    const { avatarSource } = this.state;
    if (results === null) {
      ToastAndroid.show("Bạn cần nhập mô tả", ToastAndroid.SHORT);
    } else {
      db.transaction(tx => {
        tx.executeSql(
          "UPDATE table_note set description=?, image=? , background=? where id=?",
          [results, avatarSource, backgroundColor, id],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              ToastAndroid.show(
                "Bạn đã thay đổi thành công",
                ToastAndroid.SHORT
              );
              that.props.navigation.navigate("Home");
            } else {
              ToastAndroid.show("Thay đổi thất bại", ToastAndroid.SHORT);
            }
          }
        );
      });
    }
  };

  onSpeechResults = e => {
    this.setState({
      results: e.value[0]
    });
  };

  _startRecognizing = async () => {
    try {
      await Voice.start("en-US");
      this.setState({
        voice: true
      });
    } catch (e) {
      console.error(e);
    }
  };

  _stopRecognizing = async () => {
    try {
      await Voice.stop();
      this.setState({
        voice: false
      });
    } catch (e) {
      console.error(e);
    }
  };

  _handlerChangeBackground = color => {
    this.setState({
      chooseColor: false,
      backgroundColor: color
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
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        this.setState({
          avatarSource: response.uri
        });
      }
    });
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  onDeleteNote = id => {
    Alert.alert(
      "Remove note",
      "Bạn có muốn xóa không?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () =>
            db.transaction(tx => {
              tx.executeSql(
                "DELETE FROM table_note where id=?",
                [id],
                (tx, results) => {
                  if (results.rowsAffected > 0) {
                    ToastAndroid.show(
                      "Bạn đã xóa thành công",
                      ToastAndroid.SHORT
                    );
                    this.props.navigation.navigate("Home");
                  } else {
                    ToastAndroid.show("Xoá thất bại", ToastAndroid.SHORT);
                  }
                }
              );
            })
        }
      ],
      { cancelable: false }
    );
  };

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ selectedDate: date.toString() });
    this.hideDateTimePicker();
  };

  render() {
    return (
      <View style={[styles.container]}>
        <View style={{ backgroundColor: this.state.backgroundColor, flex: 1 }}>
          <MaterialIcon.ToolbarAndroid
            style={{ height: 56, backgroundColor: "#FDD835", elevation: 4 }}
            iconColor="white"
            navIconName={"arrow-back"}
            title="Input title"
            titleColor="white"
            onIconClicked={() => this.props.navigation.goBack()}
            actions={[
              {
                title: "Done",
                icon: require("../../images/done.png"),
                show: "always"
              }
            ]}
            onActionSelected={() => this.updateNote()}
          />
          <Text style={[styles.textInput, { marginTop: 8 }]}>
            {this.state.date}
          </Text>
          {this.state.address === "" ? null : (
            <Text style={[styles.textInput, { marginTop: 8 }]}>
              {this.state.address}
            </Text>
          )}
          <TextInput
            placeholder="Note:"
            style={styles.textInput}
            multiline={true}
            onChangeText={text =>
              this.setState({
                results: text
              })
            }
            value={this.state.results}
          />
          <View style={[styles.avatarContainer, { marginBottom: 8 }]}>
            {this.state.avatarSource === null ? null : (
              <Image
                style={styles.avatar}
                source={{ uri: this.state.avatarSource }}
              />
            )}
          </View>
        </View>

        <View>
          {this.state.chooseColor === true ? (
            <FlatList
              numColumns={5}
              data={dataColor}
              columnWrapperStyle={styles.row}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => this._handlerChangeBackground(item)}
                  >
                    <View
                      style={{
                        backgroundColor: item,
                        height: 25,
                        width: 25,
                        borderRadius: 25 / 2
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
              keyExtractor={({ id }, index) => index.toString()}
            />
          ) : null}
        </View>
        <View style={styles.containerBottom}>
          <TouchableOpacity onPress={() => this.onDeleteNote(this.state.id)}>
            <MaterialIcon name="delete" size={30} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.selectPhotoTapped()}>
            <MaterialIcon name="camera-enhance" size={30} />
          </TouchableOpacity>

          <MaterialIcon name="room" size={30} />
          {this.state.voice === false ? (
            <TouchableOpacity onPress={() => this._startRecognizing()}>
              <MaterialIcon name="settings-voice" size={30} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => this._stopRecognizing()}>
              <MaterialIcon name="settings-voice" size={30} color={"red"} />
            </TouchableOpacity>
          )}
          {this.state.chooseColor === false ? (
            <TouchableOpacity
              onPress={() => this.setState({ chooseColor: true })}
            >
              <MaterialIcon name="palette" size={30} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => this.setState({ chooseColor: false })}
            >
              <MaterialIcon name="palette" size={30} color={"red"} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}

const dataColor = ["#F8BBD0", "#C8E6C9", "#FFF9C4", "#F5F5F5", "#BBDEFB"];

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  row: {
    flex: 1,
    justifyContent: "space-around",
    height: 56,
    alignItems: "center",
    elevation: 6,
    backgroundColor: "white"
  },
  textInput: {
    fontSize: 16,
    marginLeft: 16
  },
  containerBottom: {
    flexDirection: "row",
    height: 56,
    elevation: 6,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center"
  },
  avatar: {
    width: 150,
    height: 100,
    marginLeft: 8
  }
});

const mapStateToProps = state => {
  const { createNote } = state;
  return { createNote };
};

const mapDispatchToProps = dispatch => {
  return {
    startRecording: () => dispatch(startRecording())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailNoteScreen);
