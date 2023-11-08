import React, {useState} from "react";
import { Link } from "react-router-dom";

function Register({handleReg}) {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handleChangeUsername(e) {
        setUsername(e.target.value);
    }

    function handleChangePassword(e) {
        setPassword(e.target.value);
    }

    function handleSubmit(e) {
        e.preventDefault();
        handleReg(password, username);
    }

    return (
        <main className="content">
            <form className="auth" name="info-register" onSubmit={handleSubmit}>
                <h2 className="auth__title">Регистрация</h2>
                <label htmlFor="input-email" className="auth__form-field">
                    <input type="email" className="auth__input auth__input_email" id="input-email" name="email" value={username} onChange={handleChangeUsername}
                           placeholder="Email" required/>
                    <span className="auth__input-error input-email-error"></span>
                </label>
                <label htmlFor="input-password" className="auth__form-field">
                    <input type="password" className="auth__input auth__input_password" id="input-password" name="password" value={password} onChange={handleChangePassword}
                           placeholder="Пароль" minLength="2" maxLength="200"
                           required/>
                    <span className="auth__input-error input-password-error"></span>
                </label>
                <button className="auth__submit-button" aria-label="Зарегистрироваться">Зарегистрироваться
                </button>
                <Link className="auth__link" to="/sign-in">Уже зарегистрированы? Войти</Link>
            </form>
        </main>
    )
}
export default Register