import '@/styles/globals.css'
import { useEffect } from 'react';
import type { AppProps } from 'next/app'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userStore from './store';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem('authTokenNew');
    if (token) {
      userStore.startTokenRefreshTimer();
    }
    // if no token user redirect to login
    if (!token && router.pathname !== '/login' && !userStore.new_user) {
      router.push('/auth/login');
    }


    // Clear the token refresh timer on logout.
    return () => {
      userStore.clearTokenRefreshTimer();
    };
  }, []);
  
  return (
    <>
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} />
    </>
  )
}