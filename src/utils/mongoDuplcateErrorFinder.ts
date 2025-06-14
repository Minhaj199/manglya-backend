import {MongoServerError} from 'mongodb'
export function isMongoDuplicateError(error: unknown): error is MongoServerError & { keyValue: Record<string, string> } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as MongoServerError).code === 11000 &&
    "keyValue" in error
  );
}