export interface IAdminDashService {
  totalRevenue(): Promise<number>;
  dashCount(): Promise<{
    MonthlyRevenue: number;
    SubscriberCount: number;
    UserCount: number;
  }>;
  SubscriberCount(): Promise<number[]>;
  revenueForGraph(): Promise<{
    month: string[];
    revenue: number[];
  }>;

}