import { combineReducers } from "redux";
import userState from "./user";
import memoryState from "./memory";
import redirectTask from "./redirectTask";
import translations from "./translations";
import userDictionary from "./userDictionary";
import fabActions from "./fabActions";

const reducer = combineReducers({
    userState,
    memoryState,
    redirectTask,
    translations,
    userDictionary,
    fabActions
});

export default reducer;