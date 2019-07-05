import { put, takeEvery, takeLatest } from "redux-saga/effects";
import { START_RECORDING, RECORDING_SUCCESS } from "../rootActionType";
import { recording } from "../service/recording";

function* startRecording() {
  try {
    const results = yield recording._startRecognizing();
    console.log(results);
    yield put({ type: RECORDING_SUCCESS, results });
  } catch (e) {
    //  yield put({ type: FETCH_COMMENT_MOVIES_FAIL, e });
  }
}

function* dataSaga() {
  yield takeEvery(START_RECORDING, startRecording);
}

export default dataSaga;
