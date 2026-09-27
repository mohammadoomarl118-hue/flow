import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContextValue";

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [checking, setChecking] =
    useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const { data } =
        await supabase.auth.getSession();

      setIsLoggedIn(!!data.session);
      setChecking(false);
    };

    checkLogin();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
        setChecking(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (checking) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}