/**
 * Sort predicates for dates.
 */
 import Memory from "../models/Memory.d";

 export const byCreatedAtLatestFirst = (first: Memory, second: Memory): number => {
     if (!first || !first.createdAt) {
         return 1;
     }
     if (!second || !second.createdAt) {
         return -1;
     }
     const firstDate: any = new Date(first.createdAt);
     const secondDate: any = new Date(second.createdAt);
     return secondDate - firstDate;
 };

 export const byCreatedAtOldestFirst = (first: Memory, second: Memory): number => {
     return byCreatedAtLatestFirst(second, first);
 };
