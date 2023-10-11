import styles from '../../../styles/auth/style.module.scss';
import { observer } from "mobx-react-lite";

const Login = () => {
    return (
        <div className={styles.container}>
        <h2>Login</h2>
        <form>
            <input type='email' placeholder='enter email' required />
            <input type='password' placeholder='enter password' required />
            <button type='submit'>Login</button>
        </form>
        </div>
    )
}

export default Login