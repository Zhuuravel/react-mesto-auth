import Header from "./Header";

function Login() {
    return (
        <main className="content">
            <form className="login">
                <h2 className="login__title">Вход</h2>
                <label htmlFor="input-email" className="login__form-field">
                    <input type="email" className="login__input login__input_email" id="input-email" name="email" value="email"
                           placeholder="email" required/>
                    <span className="popup__input-error input-email-error"></span>
                </label>
                <label htmlFor="input-password" className="login__form-field">
                    <input type="password" className="popup__input popup__input_password" id="input-password" name="password" value="password"
                           placeholder="Пароль" minLength="2" maxLength="200"
                           required/>
                    <span className="popup__input-error input-password-error"></span>
                </label>
            </form>
        </main>
    )
}
export default Login