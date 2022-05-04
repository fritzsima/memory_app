import { AnyAction as Action } from "redux";
import { USER_REQUEST_START, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT } from "../actions/user";
import { AUTHENTICATE_SUCCESS } from "../actions/user";
import UserState from "../models/client/UserState";

const initialState: UserState = {
    loading: false,
    currentUser: undefined,
    notifications: []
};

const userState = (state: UserState = initialState, action: Action): UserState => {
    switch (action.type) {
        case AUTHENTICATE_SUCCESS:
            return {
                ...state,
                loading: false,
                currentUser: action.user
            };
        case USER_REQUEST_START:
            return {...state, loading: true};
        case LOGOUT:
            return initialState;
        default:
            return {...state, loading: false};
    }
};

export default userState;