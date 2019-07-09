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
import Geocoder from "react-native-geocoder";
import { openDatabase } from "react-native-sqlite-storage";

var db = openDatabase({ name: "NoteDatabase.db" });
class CreatNoteScreen extends Component {
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
      date: "",
      avatarSource: this.props.navigation.state.params.IMAGE,
      backgroundColor: "#EEEEEE",
      chooseColor: false,
      results: "",
      latitude: 0,
      longitude: 0,
      voice: false,
      address: ""
    };
    Voice.onSpeechResults = this.onSpeechResults;
  }

  addNewNote = () => {
    const that = this;
    const {
      results,
      date,
      backgroundColor,
      address,
      avatarSource
    } = this.state;
    console.log(avatarSource);
    if (results === "") {
      ToastAndroid.show("Bạn chưa điền nội dung", ToastAndroid.SHORT);
    } else {
      db.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO table_note (description, image, background, address, date) VALUES (?,?,?,?,?)",
          [results, avatarSource, backgroundColor, address, date],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              ToastAndroid.show("Bạn đã tạo thành công", ToastAndroid.SHORT);
              that.props.navigation.goBack();
            } else {
              alert("Tạo mới thất bại");
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

  componentDidMount() {
    var that = this;
    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var hours = new Date().getHours();
    var min = new Date().getMinutes();
    that.setState({
      date: date + "/" + month + "/" + year + " " + hours + ":" + min
    });
    navigator.geolocation
      .getCurrentPosition(position => {
        that.setState(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          () => {
            var NY = {
              lat: this.state.latitude,
              lng: this.state.longitude
            };
            Geocoder.geocodePosition(NY)
              .then(res => {
                this.setState({
                  address: res[0].formattedAddress
                });
              })
              .catch(err => ToastAndroid.show(err, ToastAndroid.SHORT));
          }
        );
      })
      .catch(err => ToastAndroid.show(err, ToastAndroid.SHORT));
  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners);
  }

  _removeNote = () => {
    Alert.alert(
      "Remove note",
      "Bạn có muốn xóa không?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "OK", onPress: () => this.props.navigation.goBack() }
      ],
      { cancelable: false }
    );
  };

  render() {
    console.log(this.state.avatarSource);
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
            onActionSelected={() => this.addNewNote()}
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
          <TouchableOpacity onPress={() => this._removeNote()}>
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
)(CreatNoteScreen);