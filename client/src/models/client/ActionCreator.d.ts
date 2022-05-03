import UserActionCreator from "./UserActionCreator";
import CommonActionCreator from "./CommonActionCreator.d";
import MemoryActionCreator from "./MemoryActionCreator.d";

export default interface ActionCreator extends
    UserActionCreator,
    CommonActionCreator,
    MemoryActionCreator {}