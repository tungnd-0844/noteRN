import { createAppContainer, createStackNavigator } from "react-navigation";
import HomeScreen from "../components/home/HomeScreen";
import CreateNoteScreen from "../components/createnote/CreateNoteScreen";

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  CreateNote: CreateNoteScreen
});

export default createAppContainer(HomeStack);
