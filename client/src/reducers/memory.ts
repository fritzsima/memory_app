import { AnyAction as Action } from "redux";
import MemoryState from "../models/client/MemoryState";
import { GET_MEMORY_SUCCESS, SAVE_MEMORY_SUCCESS, GET_MEMORY_BEGIN, SAVE_MEMORY_BEGIN, SAVE_MEMORY_FAILED, GET_MEMORY_FAILED, GET_MORE_MEMORY_SUCCESS, GET_MORE_MEMORY_BEGIN, GET_MORE_MEMORY_FAILED, SET_EDIT_MEMORY_CACHE, REMOVE_EDIT_MEMORY_CACHE, REMOVE_MEMORY_BEGIN, REMOVE_MEMORY_SUCCESS, REMOVE_MEMORY_FAILED } from "../actions/memory";
import Memory from "../models/Memory";
import MemoryCache from "../models/client/MemoryCache";
import PostType from "../models/PostType";

const initialState: MemoryState = {
    loading: false,
    valid: false,
    data: [],
    loadingMore: false,
    hasMore: false,
    editCache: {}
};

const memory = (state: MemoryState = initialState, action: Action): MemoryState => {
    switch (action.type) {
        case GET_MEMORY_BEGIN:
        case SAVE_MEMORY_BEGIN:
        case REMOVE_MEMORY_BEGIN:
            return {...state, loading: true};
        case GET_MEMORY_SUCCESS:
            return {
                ...state,
                data: action.memories,
                valid: true,
                loading: false,
                hasMore: action.hasMore
            };
        case GET_MORE_MEMORY_BEGIN:
            return {...state, loadingMore: true};
        case GET_MORE_MEMORY_SUCCESS:
            return {
                ...state,
                data: [...state.data, ...action.memories],
                loadingMore: false,
                hasMore: action.hasMore
            };
        case SAVE_MEMORY_SUCCESS:
            // merge the added/updated memory instantly, without waiting for the memory list fetching
            return {...state, valid: false, loading: false, data: [...state.data, action.memory]};
        case REMOVE_MEMORY_SUCCESS:
            return {...state, valid: false, loading: false};
        case GET_MEMORY_FAILED:
        case REMOVE_MEMORY_FAILED:
        case SAVE_MEMORY_FAILED:
            return {...state, loading: false};
        case GET_MORE_MEMORY_FAILED:
            return {
                ...state,
                loadingMore: false,
                hasMore: false
            };
        case SET_EDIT_MEMORY_CACHE: {
            const cloneCache: {[id: string]: MemoryCache} = {...state.editCache};
            cloneCache[action.id] = action.cache;
            return {...state, editCache: cloneCache};
        }
        case REMOVE_EDIT_MEMORY_CACHE: {
            const cloneCache: {[id: string]: MemoryCache} = {...state.editCache};
            delete cloneCache[action.id];
            return {...state, editCache: cloneCache};
        }
        default:
            return state;
    }
};

export default memory;