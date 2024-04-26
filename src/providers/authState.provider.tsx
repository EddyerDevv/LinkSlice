"use client";

import { signIn, signOut } from "@/actions/auth.actions";
import { getSession, useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useReducer } from "react";

interface AuthStateProviderProps {
  children: React.ReactNode;
}

interface AuthState {
  loading: boolean;
  loggedIn: boolean;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOGGED_IN"; payload: boolean };

const initialAuthState: AuthState = {
  loading: true,
  loggedIn: false,
};

interface AuthStateContextProps {
  state: AuthState;
  setAuthLoading: (payload: boolean) => void;
  setAuthLoggedIn: (payload: boolean) => void;
  handleSignIn: () => void;
  handleSignOut: () => void;
}

const authStateReducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_LOGGED_IN":
      return { ...state, loggedIn: action.payload };
    default:
      return state;
  }
};

const AuthStateContext = createContext<AuthStateContextProps | null>(null);

export function AuthStateProvider({ children }: AuthStateProviderProps) {
  const [state, dispatch] = useReducer(authStateReducer, initialAuthState);
  const { status: authStatus } = useSession();

  const setAuthLoading = (payload: boolean) =>
    dispatch({ type: "SET_LOADING", payload });

  const setAuthLoggedIn = (payload: boolean) =>
    dispatch({ type: "SET_LOGGED_IN", payload });

  const handleSignIn = async () => {
    setAuthLoading(true);
    await signIn();
  };

  const handleSignOut = async () => {
    setAuthLoading(true);

    await signOut();
    await getSession().then(async (session) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (!session) {
        setAuthLoading(false);
        setAuthLoggedIn(false);
        return;
      }
    });
  };

  useEffect(() => {
    switch (authStatus) {
      case "authenticated":
        setAuthLoading(false);
        setAuthLoggedIn(true);
        break;
      case "unauthenticated":
        setAuthLoading(false);
        setAuthLoggedIn(false);
        break;
      case "loading":
        setAuthLoading(true);
        setAuthLoggedIn(false);
        break;
      default:
        break;
    }
  }, [authStatus]);

  const value = {
    state: state,
    setAuthLoading: setAuthLoading,
    setAuthLoggedIn: setAuthLoggedIn,
    handleSignIn: handleSignIn,
    handleSignOut: handleSignOut,
  };

  return (
    <AuthStateContext.Provider value={value}>
      {children}
    </AuthStateContext.Provider>
  );
}
export function useAuthState() {
  const context = useContext(AuthStateContext);
  if (!context)
    throw new Error("useAuthState must be used within a AuthStateProvider");
  return context;
}
