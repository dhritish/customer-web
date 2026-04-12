import type { UserType } from "../contexts/authContext/Types";

export const checkValidity_signUp = (user: UserType) => {
    if(user.username === "") return false;
    if(user.email === "") return false;
    if(user.password === "") return false;
    return true;
};

export const checkValidity_signIn = (user: UserType) => {
    if(user.email === "") return false;
    if(user.password === "") return false;
    return true;
};