import { computed, makeObservable, observable } from "mobx";


export interface User {
    email: string,
    username: string
    phone_number: string,
    password: string,
    password_2: string,

}



class UserStore {
    user: User = {
        email: '',
        username: '',
        phone_number: '',
        password: '',
        password_2: '',
    }
    message: string = "";
    constructor() {
        makeObservable(this, {
            user: observable,
            message: observable,
        })
    }

    getUser(email: string, username: string, phone_number: string, password: string, password_2: string) {
        this.user.email = email;
        this.user.username = username;
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
        // if  status code is 201
        if (response.status === 201) {
            const newMessage = "user created successfully"
            this.message = newMessage
        }
        else{
            const newMessage = "user not created"
            this.message = newMessage
        }

    }

}