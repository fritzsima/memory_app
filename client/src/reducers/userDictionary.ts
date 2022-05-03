import { AnyAction as Action } from "redux";
import User from "../models/User";
import { GET_MEMORY_SUCCESS, GET_MORE_MEMORY_SUCCESS } from "../actions/memory";
import { LOGIN_SUCCESS } from "../actions/user";

const initialState: {[id: string]: User} = {};

const userDictionary = (state: {[id: string]: User} = initialState, action: Action): {[id: string]: User} => {
    switch (action.type) {
        case GET_MEMORY_SUCCESS:
        case GET_MORE_MEMORY_SUCCESS:
            return {...state, ...action.authors};
        case LOGIN_SUCCESS: {
            if (action.others) {
                const cloneDic: {[id: string]: User} = {...state};
                action.others.forEach((other: User) => {
                    cloneDic[other._id] = other;
                });
                return cloneDic; // After user sign in he/she will get all of the users data
            } else {
                return state;
            }
        }
        default:
            return state;
    }
};

export default userDictionary;