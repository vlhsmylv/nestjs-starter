export interface BaseResponse<T = any> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string;
}
