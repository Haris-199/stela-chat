export interface UserPayload {
  token: string;
  user: {
    id: number;
    username: string;
    createdAt: Date;
    updatedAt: Date;
  };

}
export interface User {
  username: string;
}

export interface Chat {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  users: {
    username: string;
  }[];
}

export interface Message {
  id: number;
  chatId: number;
  userId: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    username: string;
  };
}

export interface FriendRequest {
  id: number;
  username: string;
}

export interface APIResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface APISuccess {
  success: true;
  message: string;
}

export interface APIError {
  success: false;
  message: string;
}

export interface LoginError {
  success: false;
  errors: {
    username?: string[];
    password?: string[];
  };
}

export interface RegisterError {
  success: false;
  errors: {
    username?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
}

export interface ChatCreationError {
  success: false;
  errors: {
    name?: string[];
    users?: string[];
  };
}
