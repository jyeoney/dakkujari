import React, { Dispatch, createContext } from 'react';
import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: Dispatch<React.SetStateAction<User | null>>;
  setNickname: Dispatch<React.SetStateAction<string>>;
  isSignIn: boolean;
  nickname: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
