import { useRouter } from "next/router";
import { useEffect } from "react";
import useStore   from "../store";
import Cookies from 'js-cookie';

interface PrivateRouteProps {
    children: React.ReactNode;
}
export function PrivateRoute({ children }:PrivateRouteProps) {
    const router = useRouter();
  
    // useEffect(() => {
    //     // const token = localStorage.getItem('authTokenNew');
    //     const token = JSON.parse(Cookies.get('authTokenNew') || '{}');
    //     if (token) {
    //         useStore.startTokenRefreshTimer();
    //       }
    // }, []);
  
    return children;
  }
