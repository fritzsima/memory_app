import UserState from "./UserState.d";
import MemoryState from "./MemoryState.d";
import RedirectTask from "./RedirectTask.d";
import Translation from "../Translation";
import User from "../User.d";
import FabAction from "./FabAction";

export default interface AppState {
    translations: Translation;
    redirectTask: RedirectTask;
    userState: UserState;
    memoryState: MemoryState;
    userDictionary: {[id: string]: User};
    fabActions: FabAction[];
}
