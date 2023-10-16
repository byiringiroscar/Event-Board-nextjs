import { action, makeObservable, observable } from "mobx";
import jwt_decode from "jwt-decode";
import Cookies from 'js-cookie';


export interface User {
    email: string,
    username: string,
    full_name: string,
    phone_number: string,
    password: string,
    password_2: string,

}

const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds
// const expirationDate = new Date(Date.now() + oneDayInMilliseconds);
const expirationDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days




class UserStore {
    user: User = {
        email: '',
        username: '',
        full_name: '',
        phone_number: '',
        password: '',
        password_2: '',
    }
    tokenRefreshTimer: NodeJS.Timeout | null = null;
    new_user: any = "";
    message: string = "";
    constructor() {
        makeObservable(this, {
            user: observable,
            message: observable,
            getUser: action,
            registerUser: action,
            loginUser: action,
            new_user: observable,
            updateToken: action,
            startTokenRefreshTimer: action,
            clearTokenRefreshTimer: action,
        })
    }

    getUser(email: string, username: string, full_name: string, phone_number: string, password: string, password_2: string) {
        this.user.email = email;
        this.user.username = username;
        this.user.full_name = full_name;
        this.user.phone_number = phone_number;
        this.user.password = password;
        this.user.password_2 = password_2;
    }

    registerUser = async() => {
        const response = await fetch('http://127.0.0.1:8000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.user)
        })
        const data = await response.json()
        if (response.status === 201) {
            const newMessage = "success"
            this.message = newMessage
        }
        else{
            try{
                const errorMessage = data.errors.non_field_errors[0];
                const newMessage = errorMessage
                this.message = newMessage
            }
            catch(error:any){
                try{
                    const errorsObject = data.errors;
                    const error_key = Object.keys(errorsObject)[0];
                    const errorMessage = errorsObject[error_key][0];
                    this.message = errorMessage;
                }
                catch(error:any){
                    const newMessage = "try again"
                    this.message = newMessage
                }
            }
            
        }

        

    }

    loginUser = async() => {
        const response = await fetch('http://127.0.0.1:8000/auth/event/token/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: this.user.email,
            password: this.user.password,
        })
        })
        const data = await response.json()
        if (response.status === 200) {
            const newMessage = "success";
            this.message = newMessage;
            const newUpdateUser: any = jwt_decode(data.access);
            this.new_user = newUpdateUser.username
            // localStorage.setItem('authTokenNew', JSON.stringify(data));
            // save data to cookies
            Cookies.set('authTokenNew', JSON.stringify(data), { expires: expirationDate });

        }
        else{
            const newMessage = "Credential not match"
            this.message = newMessage
        }

    }

    // update token
    updateToken = async() => {
        console.log("--------------token refreshed-----------")
        try{
            if (this.tokenRefreshTimer) {
                clearTimeout(this.tokenRefreshTimer);
                this.tokenRefreshTimer = null;
            }
            // const token = JSON.parse(localStorage.getItem('authTokenNew') || '{}');
            const token = JSON.parse(Cookies.get('authTokenNew') || '{}');
            console.log('token==========================upd--', token)
            console.log('toke======refresh=============', token.refresh)
            const response = await fetch('http://127.0.0.1:8000/auth/event/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'refresh': token.refresh})
            })
            const data = await response.json()
            if (response.status === 200){
                const newUpdateUser: any = jwt_decode(data.access);
                this.new_user = newUpdateUser.username
                // localStorage.setItem('authTokenNew', JSON.stringify({ ...token, access: data.access, refresh:data.refresh }));
                // save data to cookies
                Cookies.set('authTokenNew', JSON.stringify({ ...token, access: data.access, refresh:data.refresh }), { expires: expirationDate });
                this.startTokenRefreshTimer();
            }
            else {
                // localStorage.removeItem('authTokenNew');
                Cookies.remove('authTokenNew'); // Remove the cookie
                this.clearTokenRefreshTimer();
                this.new_user = "";

            }
            this.startTokenRefreshTimer();
        }
        catch(error:any){
            // localStorage.removeItem('authTokenNew');
            Cookies.remove('authTokenNew'); // Remove the cookie
            this.clearTokenRefreshTimer();
            this.new_user = "";
        }
    }
    startTokenRefreshTimer = () => {
        this.tokenRefreshTimer = setTimeout(this.updateToken, 30000);
    }

    clearTokenRefreshTimer = () => {
        if (this.tokenRefreshTimer) {
            clearTimeout(this.tokenRefreshTimer);
            this.tokenRefreshTimer = null;
        }
    }

    // validate token
    validateToken = async (token: any): Promise<boolean> => {
        console.log('start------------------------', token.refresh);
        const response = await fetch('http://127.0.0.1:8000/auth/event/token/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({'refresh': token.refresh})
        });
        const data = await response.json();
        console.log('----result--------------validate-----', data);
      
        let tokenAccess = false;
        if (response.status === 200){
          const tokenData = JSON.parse(Cookies.get('authTokenNew') || '{}');
          tokenAccess = true;
      
          // Update the token and save it in cookies
          tokenData.access = data.access;
          tokenData.refresh = data.refresh;
          Cookies.set('authTokenNew', JSON.stringify(tokenData), { expires: expirationDate });
        //   Get authTokenNew cookies to get new updated cookies


        
        } else {
          Cookies.remove('authTokenNew'); // Remove the cookie
          this.clearTokenRefreshTimer();
          tokenAccess = false;
        }
      
        return tokenAccess;
      };

        

}

const store = new UserStore();

export default store;