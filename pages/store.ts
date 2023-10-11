import { action, makeObservable, observable } from "mobx";


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
    message: string = "";
    constructor() {
        makeObservable(this, {
            user: observable,
            message: observable,
            getUser: action,
            registerUser: action,
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
        try {
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
            const newMessage = "failed"
            this.message = newMessage
        }

        }
        catch(error){
            console.error("Error while registering user:", error);
            this.message = "failed";
        }

    }

}

const store = new UserStore();

export default store;