import MemoryActionCreator from "../models/client/MemoryActionCreator";
import { Dispatch, AnyAction as Action } from "redux";
import fetch from "../shared/fetch";
import actions from "./common";
import Memory from "../models/Memory";
import GetMemoriesResponse from "../models/response/GetMemoriesResponse.d";
import { getToast as toast } from "../shared/toast";
import MemoryCache from "../models/client/MemoryCache";
import { getStorage as localStorage } from "../shared/storage";

export const AUTHENTICATE_SUCCESS: string = "AUTHENTICATE_SUCCESS";
export const SAVE_MEMORY_BEGIN: string = "SAVE_MEMORY_BEGIN";
export const SAVE_MEMORY_SUCCESS: string = "SAVE_MEMORY_SUCCESS";
export const SAVE_MEMORY_FAILED: string = "SAVE_MEMORY_FAILED";
export const REMOVE_MEMORY_BEGIN: string = "REMOVE_MEMORY_BEGIN";
export const REMOVE_MEMORY_SUCCESS: string = "REMOVE_MEMORY_SUCCESS";
export const REMOVE_MEMORY_FAILED: string = "REMOVE_MEMORY_FAILED";
export const GET_MEMORY_BEGIN: string = "GET_MEMORY_BEGIN";
export const GET_MEMORY_SUCCESS: string = "GET_MEMORY_SUCCESS";
export const GET_MEMORY_FAILED: string = "GET_MEMORY_FAILED";
export const GET_MORE_MEMORY_BEGIN: string = "GET_MORE_MEMORY_BEGIN";
export const GET_MORE_MEMORY_SUCCESS: string = "GET_MORE_MEMORY_SUCCESS";
export const GET_MORE_MEMORY_FAILED: string = "GET_MORE_MEMORY_FAILED";
export const INSERT_IMAGE_BEGIN: string = "INSERT_IMAGE_BEGIN";
export const INSERT_IMAGE_SUCCESS: string = "INSERT_IMAGE_SUCCESS";
export const INSERT_IMAGE_FAILED: string = "INSERT_IMAGE_FAILED";
export const SET_EDIT_MEMORY_CACHE: string = "SET_EDIT_MEMORY_CACHE";
export const REMOVE_EDIT_MEMORY_CACHE: string = "REMOVE_EDIT_MEMORY_CACHE";
export const IGNORE_CACHE_RESTORE: string = "IGNORE_CACHE_RESTORE";
export const NEW_MEMORY_CACHE_ID: string = "NEW_MEMORY_CACHE_ID";
export const MEMORY_EDIT_CACHE_KEY_PREFIX: string = "memoryEdit/";

const removeEditCacheExec = (id: string, dispatch: Dispatch<any>): void => {
    localStorage().removeItem(MEMORY_EDIT_CACHE_KEY_PREFIX + id);
    dispatch({
        type: REMOVE_EDIT_MEMORY_CACHE,
        id: id
    });
};

const memoryActionCreator: MemoryActionCreator = {
    getMemories(): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: GET_MEMORY_BEGIN});
            fetch("/api/memory", undefined, "GET")
            .then((json: GetMemoriesResponse) => {
                if (json && json.me) {
                    dispatch({
                        type: AUTHENTICATE_SUCCESS,
                        user: json.me
                    });
                }
                if (json && json.data && json.authors) {
                    dispatch({
                        type: GET_MEMORY_SUCCESS,
                        memories: json.data,
                        authors: json.authors,
                        hasMore: json.hasMore
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "" });
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(GET_MEMORY_FAILED, error));
            });
        };
    },
    getMoreMemories(earlierThan: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: GET_MORE_MEMORY_BEGIN});
            fetch(`/api/memory?latest=${earlierThan}`, undefined, "GET")
            .then((json: GetMemoriesResponse) => {
                if (json && json.data && json.authors) {
                    dispatch({
                        type: GET_MORE_MEMORY_SUCCESS,
                        memories: json.data,
                        authors: json.authors,
                        hasMore: json.hasMore
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "" });
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(GET_MORE_MEMORY_FAILED, error));
            });
        };
    },
    addMemory(title: string, content: string, isPrivate: boolean, author: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: SAVE_MEMORY_BEGIN});
            fetch("/api/memory/create", { title, content, isPrivate, author }, "POST")
            .then((added: Memory) => {
                if (added) {
                    removeEditCacheExec(NEW_MEMORY_CACHE_ID, dispatch);
                    toast().success("toast.memory.save_successfully");
                    dispatch({
                        type: SAVE_MEMORY_SUCCESS,
                        memory: added,
                        redirectTask: {
                            redirected: false,
                            to: `/memory/${added._id}`
                        }
                    });
                } else {
                    return Promise.reject({ name: "500 Internal Server Error", message: "Broken data." });
                }
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(SAVE_MEMORY_FAILED, error));
            });
        };
    },
    editMemory(memory: Memory): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: SAVE_MEMORY_BEGIN});
            fetch("/api/memory/edit", memory, "POST")
            .then((updated: Memory) => {
                removeEditCacheExec(memory._id, dispatch);
                toast().success("toast.memory.save_successfully");
                dispatch({
                    type: SAVE_MEMORY_SUCCESS,
                    memory: updated,
                    redirectTask: {
                        redirected: false,
                        to: `/memory/${updated._id}`
                    }
                });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(SAVE_MEMORY_FAILED, error));
            });
        };
    },
    removeMemory(id: string): any {
        return (dispatch: Dispatch<any>): void => {
            dispatch({type: REMOVE_MEMORY_BEGIN});
            fetch(`/api/memory/remove/${id}`, undefined, "GET")
            .then((json: any) => {
                toast().success("toast.memory.delete_successfully");
                removeEditCacheExec(id, dispatch);
                dispatch({
                    type: REMOVE_MEMORY_SUCCESS,
                    redirectTask: {
                        redirected: false,
                        to: "/memory"
                    }
                });
            })
            .catch((error: Error) => {
                dispatch(actions.handleFetchError(REMOVE_MEMORY_FAILED, error));
            });
        };
    },
    setEditCache(id: string, cache: MemoryCache): Action {
        localStorage().setItem(MEMORY_EDIT_CACHE_KEY_PREFIX + id, JSON.stringify(cache));
        return {
            type: SET_EDIT_MEMORY_CACHE,
            id: id,
            cache: cache
        };
    },
    removeEditCache(id: string): any {
        return (dispatch: Dispatch<any>): void => {
            removeEditCacheExec(id, dispatch);
        };
    },
    restoreEditCache(): any {
        return (dispatch: Dispatch<any>): void => {
            localStorage()
            .getAllKeys()
            .then((keys: string[]) => {
                keys.forEach(key => {
                    if (!key || !key.startsWith(MEMORY_EDIT_CACHE_KEY_PREFIX)) {
                        return dispatch({
                            type: IGNORE_CACHE_RESTORE
                        });
                    }
                    localStorage().getItem(key).then((value: string | null) => {
                        if (!key || !key.startsWith(MEMORY_EDIT_CACHE_KEY_PREFIX) || !value) {
                            return dispatch({
                                type: IGNORE_CACHE_RESTORE
                            });
                        }
                        const id: string = key.slice(MEMORY_EDIT_CACHE_KEY_PREFIX.length);
                        dispatch({
                            type: SET_EDIT_MEMORY_CACHE,
                            id: id,
                            cache: JSON.parse(value) as MemoryCache
                        });
                    }).catch((reason: any) => {
                        return Promise.reject();
                    });
                });
            }).catch((reason: any) => {
                dispatch({
                    type: IGNORE_CACHE_RESTORE
                });
            });
        };
    }
};

export default memoryActionCreator;