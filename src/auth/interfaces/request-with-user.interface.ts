// src/auth/interfaces/request-with-user.interface.ts
export interface JwtUser {
  userId: number;
  username: string;
  role: string;
}

export interface RequestWithUser {
  user: JwtUser;
}