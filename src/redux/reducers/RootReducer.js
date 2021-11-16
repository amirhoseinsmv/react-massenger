import { combineReducers } from "redux";
import ListReducer from "./ListReducer";
import WidgetReducer from "./WidgetReducer";
import ChatReducer from "./ChatReducer"

const RootReducer = combineReducers({
  data: ListReducer,
  snackbar: WidgetReducer,
  chatData: ChatReducer
});

export default RootReducer;