import Translation from "../models/Translation";
import EnUS from "../shared/translations/en-us";
import { SET_LOCALE } from "../actions/common";
import _ from "lodash";

const initialState: Translation = EnUS;

const translations = (state: Translation = initialState, action: any): Translation => {
    switch (action.type) {
        case SET_LOCALE:
            switch (_.toLower(action.locale)) {
                case "en-us":
                default:
                    return EnUS;
            }
        default:
            return state;
    }
};

export default translations;
