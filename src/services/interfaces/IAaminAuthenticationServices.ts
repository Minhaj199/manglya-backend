export interface IAdminAuthService {
  login(
    email: string,
    password: string
  ): {
    message: string;
    key?:string
    token: string;
  };
}