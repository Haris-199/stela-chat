export type UserPayload = {
  token: string;
  user: {
    id: number;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

export type APIError = {
  success: false;
  message: string;
  data: null;
};

export type APIResponse<T> = {
  success: true;
  message: string;
  data: T;
};
