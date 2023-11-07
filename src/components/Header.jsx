import logo from '../images/logo.svg';

function Header() {
    return (
        <header className="header">
            <img className="header__logo" src={logo} alt="логотип"/>
            <a className="header__link" href="#">Регистрация</a>
        </header>
    )
}

export default Header