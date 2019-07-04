import Voice from "react-native-voice";

_startRecognizing = async () => {
  try {
    await Voice.start("en-US");
  } catch (e) {
    //eslint-disable-next-line
    console.error(e);
  }
};

_stopRecognizing = async () => {
  try {
    await Voice.stop();
  } catch (e) {
    //eslint-disable-next-line
    console.error(e);
  }
};

export const recording = {
  _startRecognizing,
  _stopRecognizing
};
