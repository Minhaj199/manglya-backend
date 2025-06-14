export interface ICronServiceInterface {
  checkExpiration(): Promise<void>;
}
