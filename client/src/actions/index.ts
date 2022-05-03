import ActionCreator from "../models/client/ActionCreator";
import userActionCreator from "./user";
import memoryActionCreator from "./memory";
import commonActionCreator from "./common";

const actions: ActionCreator = {
    ...userActionCreator,
    ...memoryActionCreator,
    ...commonActionCreator,
};

export default actions;