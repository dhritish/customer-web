import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { AuthContextType, UserType } from "./Types";
import { useGetAccessToken } from "./hooks";

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>({
    username: "",
    email: "",
    password: "",
    role: "customer",
    otp: "",
  });
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signIn`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Type": "web",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });
    const data = await res.json();
    return data;
  }, [user]);

  const signUp = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Type": "web",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    console.log(data);
    return data;
  }, [user]);

  const submitOTP = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/submitOTP`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Type": "web",
      },
      body: JSON.stringify(user),
    });
    const data = await res.json();
    return data;
  }, [user]);

  const refresh = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Type": "web",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signOut`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Type": "web",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  }, []);

  useGetAccessToken({ refresh, setAccessToken, setIsLoading });

  const value: AuthContextType = {
    user,
    setUser,
    signIn,
    signUp,
    submitOTP,
    accessToken,
    setAccessToken,
    error,
    setError,
    refresh,
    signOut,
    isLoading,
    setIsLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// async function signIn(user: UserType) {
//   const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signIn`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Client-Type": "web",
//     },
//     credentials: "include",
//     body: JSON.stringify(user),
//   });
//   const data = await res.json();
//   return data;
// }

// async function signUp(user: UserType) {
//   console.log(user);
//   const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signUp`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   });
//   const data = await res.json();
//   console.log(data);
//   return data;
// }

// async function submitOTP(user: UserType, otp: string) {
//   setUser({ ...user, otp });
//   const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/submitOTP`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(user),
//   });
//   const data = await res.json();
//   return data;
// }

// async function refresh() {
//   const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Client-Type": "web",
//     },
//     credentials: "include",
//   });
//   const data = await res.json();
//   return data;
// }

// async function signOut() {
//   const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/signOut`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Client-Type": "web",
//     },
//     credentials: "include",
//   });
//   const data = await res.json();
//   return data;
// }
