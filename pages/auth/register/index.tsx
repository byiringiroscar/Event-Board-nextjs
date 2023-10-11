import styles from '../../../styles/auth/style.module.scss';
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import userStore from "../../store"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
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
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const { email, username, full_name, phone_number, password, password_2 } = formData;
        userStore.getUser(email, username, full_name, phone_number, password, password_2);
        await userStore.registerUser();
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
        }
        else{
            toast.error(userStore.message, { position: 'top-right' });
        }

    };

    return (
        <div className={styles.container}>
        <h2>Register</h2>
        <form method='POST' onSubmit={handleSubmit}>
            <input type='email' placeholder='enter email' name='email' value={formData.email} onChange={handleChange}  required />
            <input type='text' placeholder='enter username' name="username" value={formData.username} onChange={handleChange} required />
            <input type='text' placeholder='enter full_name' name="full_name" value={formData.full_name} onChange={handleChange} required />
            <input type='tel' placeholder='enter phone number' name="phone_number" value={formData.phone_number} onChange={handleChange} required />
            <input type='password' placeholder='enter password' name="password" value={formData.password} onChange={handleChange} required />
            <input type='password' placeholder='confirm password' name="password_2" value={formData.password_2} onChange={handleChange} required />
            <button type='submit'>Register</button>
        </form>
        </div>
    )
}


export default observer(Register);