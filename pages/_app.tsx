import '@/styles/globals.css'
import { useEffect } from 'react';
import type { AppProps } from 'next/app'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PrivateRoute } from './util/PrivateRoute';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <PrivateRoute>
        <Component {...pageProps} />
      </PrivateRoute>
      <ToastContainer autoClose={3000} />
    </>
  )
}