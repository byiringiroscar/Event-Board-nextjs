// middleware.ts
import { NextRequest, NextResponse }from 'next/server';
import useStore from './pages/store';
import next from 'next';
import Cookies from 'js-cookie';


export default async function middleware(req: NextRequest, res: NextResponse) {
    const { pathname } = req.nextUrl
    const cookie = req.cookies.get('authTokenNew')
    // token
    const currentToken = cookie?.value;
    const token = currentToken ? JSON.parse(currentToken) : null;
    if(!token){
        return NextResponse.redirect('http://127.0.0.1:3000/auth/login');
    }
    
    const isValidToken = await useStore.verifyToken(token);
    if(isValidToken === false){
        return NextResponse.redirect('http://127.0.0.1:3000/auth/login');
    }
    if (isValidToken && pathname.endsWith('/auth/login')) {
        return NextResponse.redirect('http://127.0.0.1:3000/');
      }

    return NextResponse.next();
  
}

export const config = {
    matcher:[
        '/',
        '/auth/login',
    ],
}