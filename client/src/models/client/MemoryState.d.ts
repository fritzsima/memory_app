import User from "../User";
import Memory from "../Memory";
import MemoryCache from "./MemoryCache";

export default interface MemoryState {
    loading: boolean;
    valid: boolean;
    data: Memory[]; // All loaded articles
    myValid: boolean;
    myData: Memory[];
    loadingMore: boolean;
    hasMore: boolean;
    editCache: {[id: string]: MemoryCache};
}