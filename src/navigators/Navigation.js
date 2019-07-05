import { createAppContainer, createStackNavigator } from "react-navigation";
import HomeScreen from "../components/home/HomeScreen";
import CreateNoteScreen from "../components/createnote/CreateNoteScreen";
import DetailNoteScreen from "../components/detailnote/DetailNoteScreen";

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  CreateNote: CreateNoteScreen,
  DetailNote: DetailNoteScreen
});

export default createAppContainer(HomeStack);
