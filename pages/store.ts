import { action, makeObservable, observable } from "mobx";
import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from 'next/router';


export interface User {
    email: string,
    username: string,
    full_name: string,
    phone_number: string,
    password: string,
    password_2: string,

}



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
            const newMessage = "success"
            this.message = newMessage
            this.new_user = jwt_decode(data.access)
            localStorage.setItem('authTokenNew', JSON.stringify(data));
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
        const token = JSON.parse(localStorage.getItem('authTokenNew') || '{}');
        const response = await fetch('http://127.0.0.1:8000/auth/event/token/refresh/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({'refresh': token.refresh})
        })
        const data = await response.json()
        if (response.status === 200){
            this.new_user = jwt_decode(data.access)
            localStorage.setItem('authTokenNew', JSON.stringify({ ...token, access: data.access }));
            this.startTokenRefreshTimer();
        }
        else {
            localStorage.removeItem('authTokenNew');
            this.clearTokenRefreshTimer();
            this.new_user = "";

        }
        this.startTokenRefreshTimer();
        }
        catch(error:any){
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

}

const store = new UserStore();

export default store;