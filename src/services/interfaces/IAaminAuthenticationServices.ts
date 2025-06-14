export interface IAdminAuthService {
  login(
    email: string,
    password: string
  ): {
    message: string;
    token: string;
  };
}