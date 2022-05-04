import { AnyAction as Action } from "redux";
import User from "../User";

export default interface UserActionCreator {
    authenticate(): any;
    login(email: string): any;
    logout(): any;
}