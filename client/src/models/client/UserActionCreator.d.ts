import { AnyAction as Action } from "redux";
import User from "../User";

export default interface UserActionCreator {
    login(email: string): any;
    logout(): Action;
}