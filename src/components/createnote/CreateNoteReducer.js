import { START_RECORDING, RECORDING_SUCCESS } from "../../rootActionType";

const initialState = {
  recognized: "",
  pitch: "",
  error: "",
  end: "",
  started: "",
  results: [],
  partialResults: []
};

const dataReducers = (state = initialState, action) => {
  switch (action.type) {
    case RECORDING_SUCCESS:
      console.log(results.value);
      return {
        ...state,
        results: results.value
      };
    default:
      return state;
  }
};

export default dataReducers;
