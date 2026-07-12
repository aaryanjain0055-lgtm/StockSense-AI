import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getAccessToken,
  getProfile,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "../services/authService";


type AuthUser = {
  id: number;
  email: string;
  role: string;
};


type AuthContextValue = {
  user: AuthUser | null;

  loading: boolean;

  authenticated: boolean;

  login: (
    email: string,
    password: string,
  ) => Promise<void>;

  register: (
    fullName: string,
    email: string,
    password: string,
  ) => Promise<void>;

  logout: () => void;

  refreshSession: () => Promise<void>;
};


const AuthContext =
  createContext<AuthContextValue | null>(
    null,
  );


type AuthProviderProps = {
  children: ReactNode;
};


export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    user,
    setUser,
  ] = useState<AuthUser | null>(
    null,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);


  const refreshSession =
    useCallback(async () => {
      const token =
        getAccessToken();

      if (!token) {
        setUser(null);
        setLoading(false);

        return;
      }

      try {
        const profile =
          await getProfile();

        setUser({
          id: Number(
            profile.user.sub,
          ),

          email:
            profile.user.email,

          role:
            profile.user.role,
        });
      } catch {
        logoutRequest();

        setUser(null);
      } finally {
        setLoading(false);
      }
    }, []);


  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);


  async function login(
    email: string,
    password: string,
  ) {
    await loginRequest(
      email,
      password,
    );

    await refreshSession();
  }


  async function register(
    fullName: string,
    email: string,
    password: string,
  ) {
    await registerRequest(
      fullName,
      email,
      password,
    );

    await login(
      email,
      password,
    );
  }


  function logout() {
    logoutRequest();

    setUser(null);
  }


  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,

        loading,

        authenticated:
          user !== null,

        login,

        register,

        logout,

        refreshSession,
      }),
      [
        user,
        loading,
        refreshSession,
      ],
    );


  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth():
AuthContextValue {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider.",
    );
  }

  return context;
}