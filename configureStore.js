import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import app from "./src/rootReducers";
import dataSaga from "./src/sagas/noteSagas";

const sagaMiddleware = createSagaMiddleware();
export default function configureStore() {
  const store = createStore(app, applyMiddleware(sagaMiddleware));
  sagaMiddleware.run(dataSaga);
  return store;
}
