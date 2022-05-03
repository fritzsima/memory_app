import UserActionCreator from "../models/client/UserActionCreator";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "../shared/fetch";
import { ACCESS_TOKEN_KEY, INVALID_TOKEN_ERROR } from "../shared/constants";
import actions from "./common";
import { getToast as toast } from "../shared/toast";
import { getStorage as localStorage } from "../shared/storage";
import LoginResponse from "../models/response/LoginResponse";

export const USER_REQUEST_START: string = "USER_REQUEST_START";
export const LOGIN_SUCCESS: string = "LOGIN_SUCCESS";
export const LOGIN_FAILED: string = "LOGIN_FAILED";
export const LOGOUT: string = "LOGOUT";

const userActionCreator: UserActionCreator = {
    login(email: string): any {
        return (dispatch: Dispatch<any>): any => {
            return fetch("/auth/magiclogin", {destination: email}, "POST")
            .then((json: LoginResponse) => {
                if (json.success) {
                    toast().success("toast.user.verification_email_sent");
                    dispatch({
                        type: LOGIN_SUCCESS,
                        redirectTask: {
                            redirected: false,
                            to: `/waiting`
                        }
                    });
                } else {
                    return Promise.reject(new Error("toast.user.general_error"));
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(LOGIN_FAILED, error));
            });
        };
    },
    logout(): Action {
        localStorage().setItem(ACCESS_TOKEN_KEY, "");
        return {
            type: LOGOUT
        };
    },
};

export default userActionCreator;