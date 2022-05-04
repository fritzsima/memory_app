import { AnyAction as Action } from "redux";
import Memory from "../Memory";
import MemoryCache from "./MemoryCache";

export default interface MemoryActionCreator {
    getMemories(): any;
    getMoreMemories(earlierThan: string): any;
    getMyMemories(): any;
    getMoreMyMemories(earlierThan: string): any;
    addMemory(title: string, content: string, isPrivate: boolean, author: string): any;
    editMemory(memory: Memory): any;
    removeMemory(id: string): any;
    setEditCache(id: string, cache: MemoryCache): Action;
    removeEditCache(id: string): any;
    restoreEditCache(): any;
}