import type { Dispatch, SetStateAction } from "react";

export type UserType = {
    username: string;
    email: string;
    password: string;
    role?: "owner" | "employee" | "customer";
    otp?: string;
}

export type ProfileType = {
    username: string;
    email: string;
    role?: "owner" | "employee" | "customer";
}

export type AuthContextType = {
    user: UserType;
    setUser: Dispatch<SetStateAction<UserType>>;
    accessToken: string | null;
    error: string | null;
    setAccessToken: Dispatch<SetStateAction<string | null>>;
    setError: Dispatch<SetStateAction<string | null>>;   
    signIn: () => Promise<any>;
    signUp: () => Promise<any>;
    submitOTP: () => Promise<any>;
    refresh: () => Promise<any>;
    signOut: () => Promise<any>;
    isLoading: boolean;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    isAccessLoaded: boolean;
    setIsAccessLoaded: Dispatch<SetStateAction<boolean>>;
    profile: ProfileType | null;
    setProfile: Dispatch<SetStateAction<ProfileType | null>>;
}

export type useGetAccessTokenParams = {
    refresh: () => Promise<any>;
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    setAccessToken: Dispatch<SetStateAction<string | null>>;
    setIsAccessLoaded: Dispatch<SetStateAction<boolean>>;
}

export type useGetProfileParams = {
    accessToken: string | null;
    setProfile: Dispatch<SetStateAction<ProfileType | null>>;
    profile: ProfileType | null;
    isAccessLoaded: boolean;
}