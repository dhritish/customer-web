import { useEffect } from "react"
import type { useGetAccessTokenParams } from "./Types"

export const useGetAccessToken = (params: useGetAccessTokenParams) => {
    const { refresh, setAccessToken, setIsLoading } = params;
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
            } catch (error) {
                setIsLoading(false);
                console.log(error);
            }
        }
        )();
    },[])
}