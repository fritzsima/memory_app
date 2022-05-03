import { UnifiedModel } from "./UnifiedModel";

export default interface Memory extends UnifiedModel {
    readonly author: string; // User._id
    title: string;
    content: string;
    isPrivate: boolean;
}
