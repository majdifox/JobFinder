export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // only used when sending/validating; never store it in browser
}

export type SessionUser = Omit<User, 'password'>;
