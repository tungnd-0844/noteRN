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
  Modal,
  ToolbarAndroid
} from "react-native";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import ImagePicker from "react-native-image-picker";
import { connect } from "react-redux";
import { startRecording } from "../../components/createnote/CreateNoteAction";
import Voice from "react-native-voice";
import Geocoder from "react-native-geocoder";
import DatePicker from "react-native-datepicker";
import { openDatabase } from "react-native-sqlite-storage";
import RNSketchCanvas from "@terrylinla/react-native-sketch-canvas";

var db = openDatabase({ name: "NoteDatabase.db" });
class CreatNoteScreen extends Component {
  static navigationOptions = {
    header: null
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
      address: "",
      complete: 0,
      modalVisible: false
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
      avatarSource,
      complete
    } = this.state;
    if (results === "") {
      ToastAndroid.show("Bạn chưa điền nội dung", ToastAndroid.SHORT);
    } else {
      db.transaction(function(tx) {
        tx.executeSql(
          "INSERT INTO table_note (description, image, background, address, date, complete) VALUES (?,?,?,?,?,?)",
          [results, avatarSource, backgroundColor, address, date, complete],
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

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  async createNotificationListeners() {
    /*
     * Triggered when a particular notification has been received in foreground
     * */
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const { title, body } = notification;
        console.log("onNotification:");

        const localNotification = new firebase.notifications.Notification({
          // sound: 'sampleaudio', // <-- maybe this line
          show_in_foreground: true
        })
          // .setSound('sampleaudio.wav') // <-- and this line
          .setNotificationId(notification.notificationId)
          .setTitle(title)
          .setBody(body)
          .android.setChannelId("fcm_FirebaseNotifiction_default_channel") // e.g. the id you chose above
          // .android.setSmallIcon('@drawable/ic_launcher') // <-- Or this one
          .android.setColor("#000000") // you can set a color here
          .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase
          .notifications()
          .displayNotification(localNotification)
          .catch(err => console.error(err));
      });

    const channel = new firebase.notifications.Android.Channel(
      "fcm_FirebaseNotifiction_default_channel",
      "Demo app name",
      firebase.notifications.Android.Importance.High
    )
      .setDescription("Demo app description")
      .setSound("sampleaudio.wav");
    firebase.notifications().android.createChannel(channel);

    /*
     * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
     * */
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        const { title, body } = notificationOpen.notification;
        console.log("onNotificationOpened:");
        Alert.alert(title, body);
      });

    /*
     * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
     * */
    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      console.log("getInitialNotification:");
      Alert.alert(title, body);
    }
    /*
     * Triggered for data only payload in foreground
     * */
    this.messageListener = firebase.messaging().onMessage(message => {
      //process data message
      console.log("JSON.stringify:", JSON.stringify(message));
    });
  }

  render() {
    return (
      <View style={[styles.container]}>
        {this.state.modalVisible === false ? (
          <View
            style={{ backgroundColor: this.state.backgroundColor, flex: 1 }}
          >
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
            <View>
              <TouchableOpacity>
                <Text
                  style={[styles.textInput, { marginTop: 8 }]}
                  onPress={this.showDateTimePicker}
                >
                  {this.state.selectedDate}
                </Text>
              </TouchableOpacity>
              <DatePicker
                style={{ width: 200 }}
                date={this.state.date} //initial date from state
                mode="date" //The enum of date, datetime and time
                placeholder="select date"
                format="DD-MM-YYYY"
                minDate="01-01-2016"
                maxDate="01-01-2020"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: "absolute",
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 36
                  }
                }}
                onDateChange={date => {
                  this.setState({ date: date });
                }}
              />
            </View>

            {this.state.address === "" ? null : (
              <Text style={[styles.textInput, { marginTop: 8 }]}>
                {this.state.address}
              </Text>
            )}
            <TextInput
              placeholder="Note:"
              style={styles.textInput}
              multiline={true}
              autoFocus={true}
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
        ) : (
          <View>
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <RNSketchCanvas
                  containerStyle={{ backgroundColor: "transparent", flex: 1 }}
                  canvasStyle={{ backgroundColor: "transparent", flex: 1 }}
                  defaultStrokeIndex={0}
                  defaultStrokeWidth={5}
                  clearComponent={
                    <View style={styles.functionButton}>
                      <Text style={{ color: "white" }}>Clear</Text>
                    </View>
                  }
                  eraseComponent={
                    <View style={styles.functionButton}>
                      <Text style={{ color: "white" }}>Eraser</Text>
                    </View>
                  }
                  saveComponent={
                    <View style={styles.functionButton}>
                      <Text style={{ color: "white" }}>Save</Text>
                    </View>
                  }
                  strokeComponent={color => (
                    <View
                      style={[
                        { backgroundColor: color },
                        styles.strokeColorButton
                      ]}
                    />
                  )}
                  strokeSelectedComponent={(color, index, changed) => {
                    return (
                      <View
                        style={[
                          { backgroundColor: color, borderWidth: 2 },
                          styles.strokeColorButton
                        ]}
                      />
                    );
                  }}
                  strokeWidthComponent={w => {
                    return (
                      <View style={styles.strokeWidthButton}>
                        <View
                          style={{
                            backgroundColor: "white",
                            marginHorizontal: 2.5,
                            width: Math.sqrt(w / 3) * 10,
                            height: Math.sqrt(w / 3) * 10,
                            borderRadius: (Math.sqrt(w / 3) * 10) / 2
                          }}
                        />
                      </View>
                    );
                  }}
                  savePreference={() => {
                    return {
                      folder: "RNSketchCanvas",
                      filename: String(Math.ceil(Math.random() * 100000000)),
                      transparent: false,
                      imageType: "png"
                    };
                  }}
                  onSketchSaved={(success, filePath) => {
                    this.setState({
                      avatarSource: "file://" + filePath
                    });
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                />
              </View>
            </Modal>
          </View>
        )}

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

          <TouchableOpacity onPress={() => this.setModalVisible(true)}>
            <MaterialIcon name="edit" size={30} />
          </TouchableOpacity>

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
    flex: 1,
    justifyContent: "center"
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
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold"
  },
  strokeColorButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15
  },
  strokeWidthButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#39579A"
  },
  functionButton: {
    marginHorizontal: 2.5,
    marginVertical: 8,
    height: 30,
    width: 60,
    backgroundColor: "#39579A",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
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
