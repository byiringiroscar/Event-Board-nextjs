import styles from '../../../styles/auth/style.module.scss';
import { observer } from "mobx-react-lite";
import React, { useState, useEffect } from "react";
import userStore from "../../store"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';
import Link from 'next/link';
const Login = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: "",
        username: "",
        full_name: "",
        phone_number: "",
        password: "",
        password_2: "",
      });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = async(e: any) => {
        e.preventDefault();
        const { email, username, full_name, phone_number, password, password_2 } = formData;
        userStore.getUser(email, username, full_name, phone_number, password, password_2);
        await userStore.loginUser();
        if (userStore.message === "success"){
            toast.success(userStore.message, { position: 'top-right' });
            setFormData({
                email: "",
                username: "",
                full_name: "",
                phone_number: "",
                password: "",
                password_2: "",
              });
                router.push('/');
                // Start the token refresh timer after successful login
                userStore.startTokenRefreshTimer();
        }
        else{
            toast.error(userStore.message, { position: 'top-right' });
        }
    }
    const handleLogout = () => {
        // Perform logout actions here
        userStore.clearTokenRefreshTimer(); // Clear the token refresh timer on logout.
    }

    return (
        <div className={styles.container}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <input type='email' placeholder='enter email' name='email' value={formData.email} onChange={handleChange}  required />
            <input type='password' placeholder='enter password' name="password" value={formData.password} onChange={handleChange} required />
            <button type='submit'>Login</button>
        </form>
        <p>Dont have an account? <Link href='/auth/register' className='text-[blue] font-[bold]'>Register</Link></p>
        </div>
    )
}

export default Login