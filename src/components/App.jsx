import Header from './Header';
import Main from './Main';
import Login from './Login';
import Register from './Register';
import InfoTooltip from './InfoTooltip'
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import {useEffect, useState} from "react";
import ImagePopup from "./ImagePopup";
import MyApi from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";
import {Route, Routes, Navigate} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import ProtectedRouteElement from "./ProtectedRoute";
import * as auth from "../utils/Auth";

function App() {

const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
const [isInfoTooltipPopupOpen, setInfoTooltipPopupOpen] = useState(false);
const [isCardPopupOpen, setCardPopupOpen] = useState(false);
const [selectedCard, setSelectedCard] = useState({});
const [currentUser, setCurrentUser] = useState({name: '', about: '', avatar: ''});
const [cards, setCards] = useState([]);
const [loggedIn, setLoggedIn] = useState(false);
const [reg, setReg] = useState(false);
const [userEmail, setUserEmail] = useState("")

const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn) {
            Promise.all([MyApi.getProfileInfo(), MyApi.getAllCards()])
                .then(([userData, cards]) => {
                    // тут установка данных пользователя
                    setCurrentUser(userData);
                    // и тут отрисовка карточек
                    setCards([...cards])
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [loggedIn])

    useEffect(() => {
        handleTokenCheck();
    }, [])

    const handleTokenCheck = () => {
        const myJwt = localStorage.getItem("jwt");
        if (myJwt) {
            auth.checkToken(myJwt)
                .then((data) => {
                    if (data) {
                        setUserEmail(data.data.email);
                        setLoggedIn(true);
                        navigate('/main', {replace: true})
                    }
                })
                .catch(err => console.log(err));
        }
    }

    const signOut = () => {
        localStorage.removeItem("jwt");
        navigate('/signin', {replace: true});
        setUserEmail("");
    }

    const handleLogin = (password, username) => {
        setLoggedIn(true);
        auth.authorize(password, username)
            .then((data) => {
                localStorage.setItem("jwt", data.token);
                setUserEmail(username);
                setLoggedIn(true);
                navigate('/main', {replace: true})
            })
            .catch(err => console.log(err));
    }

    const handleReg = (password, username) => {
        auth.register(password, username)
            .then(() => {
                setReg(true);
                navigate('/signin', {replace: true})
            })
            .catch(() => {
                setReg(false);
            })
            .finally(() => {
                handleInfoTooltipClick();
            })
    }

    function handleEditAvatarClick() {
        setAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true)
    }

    function handleInfoTooltipClick() {
        setInfoTooltipPopupOpen(!isInfoTooltipPopupOpen)
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setCardPopupOpen(true);
    }

    function closeAllPopups() {
        setAvatarPopupOpen(false);
        setProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setInfoTooltipPopupOpen(false);
        setCardPopupOpen(false);
        setSelectedCard({});
    }

    const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || isInfoTooltipPopupOpen || selectedCard.link

    useEffect(() => {
        function closeByEscape(evt) {
            if(evt.key === 'Escape') {
                closeAllPopups();
            }
        }
        if(isOpen) { // навешиваем только при открытии
            document.addEventListener('keydown', closeByEscape);
            return () => {
                document.removeEventListener('keydown', closeByEscape);
            }
        }
    }, [isOpen])


    function handleCardLike(card) {
        // Снова проверяем, есть ли уже лайк на этой карточке
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        MyApi.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
            setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        }).catch((error) => {
            console.log(error)
        });
    }

    function handleCardDelete(card) {
        MyApi.deleteCards(card._id).then(() => {
            setCards((state) => state.filter((c) => c._id !== card._id));
    }).catch((error) => {
            console.log(error)
        });
    }

    function handleUpdateUser(onUpdateUser) {
        MyApi.setProfileInfo(onUpdateUser).then((data) => {
            setCurrentUser(data);
            closeAllPopups();
        }).catch((error) => {
            console.log(error)
        });
    }

    function handleUpdateAvatar(onUpdateAvatar) {
        MyApi.setProfileAvatar(onUpdateAvatar).then((data) => {
            setCurrentUser(data);
            closeAllPopups();
        }).catch((error) => {
            console.log(error)
        });
    }

    function handleAddPlaceSubmit(onAddPlace) {
        MyApi.createCards(onAddPlace)
                .then((newCard) => {
                    // и тут отрисовка карточек
                    setCards([newCard, ...cards]);
                    closeAllPopups();
                })
                .catch((err) => {
                    console.log(err);
                })
        }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="root">
                <Routes>
                    <Route
                        path="/*"
                        element={
                            loggedIn ?
                                <Navigate to="/" replace /> :
                                <Navigate to="/signin" replace />
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <>
                                <Header loggedIn={loggedIn} linkTitle="Войти" userEmail={userEmail} route="/signin" />
                                <Register handleReg={handleReg}/>
                            </>
                        }
                    />
                    <Route
                        path="/signin"
                        element={
                            <>
                                <Header loggedIn={loggedIn} linkTitle="Регистрация" userEmail={userEmail} route="/signup"/>
                                <Login handleLogin={handleLogin}/>
                            </>
                    }
                    />
                    <Route
                        path="/"
                        element={
                            <>
                                    <Header loggedIn={loggedIn} linkTitle="Выйти" toSignOut={signOut} userEmail={userEmail} route="/signin" />
                                    <ProtectedRouteElement element={Main}
                                                           loggedIn={loggedIn}
                                                           onEditAvatar={handleEditAvatarClick}
                                                           onEditProfile={handleEditProfileClick}
                                                           onAddPlace={handleAddPlaceClick}
                                                           onCardClick={handleCardClick}
                                                           cards={cards}
                                                           onCardLike={handleCardLike}
                                                           onCardDelete={handleCardDelete}
                                    />
                            </>
                        }
                    />
                </Routes>

                <Footer />
                <EditProfilePopup isOpen={isEditProfilePopupOpen ? "popup_opened" : ""} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
                <AddPlacePopup isOpen={isAddPlacePopupOpen ? "popup_opened" : ""} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen ? "popup_opened" : ""} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
                <InfoTooltip reg={reg} isOpen={isInfoTooltipPopupOpen ? "popup_opened" : ""} onClose={closeAllPopups} />
                <PopupWithForm name="confirm" title="Вы уверены?" text="Да" />
                <ImagePopup onClose={closeAllPopups} card={selectedCard} isOpen={isCardPopupOpen ? "popup_opened" : ""}/>
            </div>
        </CurrentUserContext.Provider>
  );
}

export default App;
