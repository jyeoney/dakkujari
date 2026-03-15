import React, { Dispatch, createContext } from 'react';
import { User } from 'firebase/auth';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  setUser: Dispatch<React.SetStateAction<User | null>>;
  setNickname: Dispatch<React.SetStateAction<string | null>>;
  isSignIn: boolean;
  nickname: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);
