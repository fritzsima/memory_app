import User from "../User.d";
import Memory from "../Memory.d";

export default interface GetMemoriesResponse {
    data: Memory[];
    authors: {[id: string]: User};
    hasMore: boolean;
    me: User | undefined;
}