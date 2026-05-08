import { useEffect } from "react"
import type { useGetAccessTokenParams, useGetProfileParams } from "./Types"

export const useGetAccessToken = (params: useGetAccessTokenParams) => {
    const { refresh, setAccessToken, setIsLoading, setIsAccessLoaded } = params;
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const res = await refresh();
                if(res.success === false){
                    setIsLoading(false);
                    return;
                }
                setAccessToken(res.accessToken);
                setIsLoading(false);
                setIsAccessLoaded(true);
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        }
        )();
    },[])
}

export const useGetProfile = (params: useGetProfileParams) => {
    const { accessToken, setProfile, isAccessLoaded } = params;
    useEffect(() => {
        (async () => {
            try {
                if(!isAccessLoaded){
                    return;
                }
                const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/profile`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`,
                            'Client-Type': 'web'
                        },
                        credentials: 'include'
                    }
                );
                const data = await res.json();
                if(data.success === false){
                    return;
                }
                setProfile(data.profile);
            } catch (error) {
                console.log(error);
            }
        }
        )();
    },[ isAccessLoaded, accessToken ])
}