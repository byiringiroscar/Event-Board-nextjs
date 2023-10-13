import { useRouter } from "next/router";
import { useEffect } from "react";
import useStore   from "../store";

interface PrivateRouteProps {
    children: React.ReactNode;
}
export function PrivateRoute({ children }:PrivateRouteProps) {
    const router = useRouter();
  
    useEffect(() => {
        const token = localStorage.getItem('authTokenNew');
        if (token) {
            console.log('-----------token----yes-------')
            useStore.startTokenRefreshTimer();
            // if(!useStore.new_user){
            //     router.push('/auth/login');
            // }
          }
        else{
            console.log('-----------token----no-------')
            router.push('/auth/login');
        }
    }, [useStore.new_user]);
  
    return children;
  }
