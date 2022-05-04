import Memory from "../Memory.d";

export default interface GetMyMemoriesResponse {
    data: Memory[];
    hasMore: boolean;
}