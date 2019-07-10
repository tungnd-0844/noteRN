import { createAppContainer, createStackNavigator } from "react-navigation";
import HomeScreen from "../components/home/HomeScreen";
import CreateNoteScreen from "../components/createnote/CreateNoteScreen";
import DetailNoteScreen from "../components/detailnote/DetailNoteScreen";
import InformationScreen from "../components/information/InformationScreen";
import SearchScreen from "../components/search/SearchScreen";

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  CreateNote: CreateNoteScreen,
  DetailNote: DetailNoteScreen,
  Information: InformationScreen,
  Search: SearchScreen
});

export default createAppContainer(HomeStack);
