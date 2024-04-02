export interface ServerHttpResponse<T> {
   success: boolean;
   error: boolean;
   data: T;
   msg: string;
   status: number;
}
