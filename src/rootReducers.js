import { combineReducers } from "redux";
import createNote from "../src/components/createnote/CreateNoteReducer";
const allReducers = combineReducers({ createNote });

export default allReducers;
