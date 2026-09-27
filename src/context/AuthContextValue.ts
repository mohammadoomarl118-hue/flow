import { createContext } from "react";

export type AuthContextType = {
  isLoggedIn: boolean;
};

export const AuthContext =
  createContext<AuthContextType | null>(null);