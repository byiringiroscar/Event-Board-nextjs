import '@/styles/globals.css'
import { useEffect } from 'react';
import type { AppProps } from 'next/app'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userStore from './store';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
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
