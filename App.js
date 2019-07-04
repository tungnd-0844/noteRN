import React, { Component } from "react";
import { Provider } from "react-redux";
import configureStore from "./configureStore";
import Navigation from "./src/navigators/Navigation";

const store = configureStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    );
  }
}
export default App;
