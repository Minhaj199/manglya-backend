import { Types } from "mongoose";
export function objectIdToString(id) {
    if (id instanceof Types.ObjectId) {
        return id.toString();
    }
    else {
        throw new Error('internal server error on string parse');
    }
}
