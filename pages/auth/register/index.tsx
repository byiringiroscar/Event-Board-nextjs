import styles from '../../../styles/auth/style.module.scss';

const Register = () => {
    return (
        <div className={styles.container}>
        <h2>Register</h2>
        <form>
            <input type='email' placeholder='enter email' required />
            <input type='text' placeholder='enter username' required />
            <input type='text' placeholder='enter full_name' required />
            <input type='tel' placeholder='enter phone number' required />
            <input type='password' placeholder='enter password' required />
            <input type='password' placeholder='confirm password' required />
            <button type='submit'>Register</button>
        </form>
        </div>
    )
}


export default Register;