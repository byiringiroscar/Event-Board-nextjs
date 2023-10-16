// middleware.ts
import { NextRequest, NextResponse }from 'next/server';
import useStore from './pages/store';
import next from 'next';
import Cookies from 'js-cookie';


export default async function middleware(req: NextRequest, res: NextResponse) {
    console.log('--------------done in middle------------------');
    const cookie = req.cookies.get('authTokenNew')
    // token
    const currentToken = cookie?.value;
    const token = currentToken ? JSON.parse(currentToken) : null;
    console.log(cookie, '----------------------------------ffff')
    if(!token){
        return NextResponse.redirect('http://127.0.0.1:3000/auth/login');
    }
    
    const isValidToken = await useStore.validateToken(token);
    if(isValidToken === false){
        return NextResponse.redirect('http://127.0.0.1:3000/auth/login');
    }

    return NextResponse.next();
  
}

export const config = {
    matcher:[
        '/',
    ],
}