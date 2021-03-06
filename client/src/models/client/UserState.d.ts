import User from "../User.d";
import Notification from "../Notification.d";

export default interface UserState {
    currentUser: User | undefined;
    loading: boolean;
    notifications: Notification[];
}