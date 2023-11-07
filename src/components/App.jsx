import Header from './Header';
import Main from './Main';
import Login from './Login';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import {useEffect, useState} from "react";
import ImagePopup from "./ImagePopup";
import MyApi from "../utils/Api";
import {CurrentUserContext} from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup";
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom'

function App() {

const [isEditAvatarPopupOpen, setAvatarPopupOpen] = useState(false);
const [isEditProfilePopupOpen, setProfilePopupOpen] = useState(false);
const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
const [isCardPopupOpen, setCardPopupOpen] = useState(false);
const [selectedCard, setSelectedCard] = useState({});
const [currentUser, setCurrentUser] = useState({name: '', about: '', avatar: ''});
const [cards, setCards] = useState([]);

    useEffect(() => {
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
    }, [])

    function handleEditAvatarClick() {
        setAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setProfilePopupOpen(true)
    }

    function handleAddPlaceClick() {
        setAddPlacePopupOpen(true)
    }

    function handleCardClick(card) {
        setSelectedCard(card);
        setCardPopupOpen(true);
    }

    function closeAllPopups() {
        setAvatarPopupOpen(false);
        setProfilePopupOpen(false);
        setAddPlacePopupOpen(false);
        setCardPopupOpen(false);
        setSelectedCard({});
    }

    const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.link

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
    <BrowserRouter>
        <CurrentUserContext.Provider value={currentUser}>
            <div className="root">
                <Header />
                <Main onEditAvatar={handleEditAvatarClick}
                                  onEditProfile={handleEditProfileClick}
                   onAddPlace={handleAddPlaceClick}
                onCardClick={handleCardClick}
                              cards={cards}
                                  onCardLike={handleCardLike}
                                  onCardDelete={handleCardDelete}
                            />
                {/*<Login />*/}
                {/*<Routes>*/}
                {/*    <Route*/}
                {/*        path="/"*/}
                {/*        element={*/}
                {/*        loggedIn ? */}
                {/*            <Main onEditAvatar={handleEditAvatarClick}*/}
                {/*                  onEditProfile={handleEditProfileClick}*/}
                {/*                  onAddPlace={handleAddPlaceClick}*/}
                {/*                  onCardClick={handleCardClick}*/}
                {/*                  cards={cards}*/}
                {/*                  onCardLike={handleCardLike}*/}
                {/*                  onCardDelete={handleCardDelete}*/}
                {/*            /> : */}
                {/*            <Navigate to="/sign-in" replace />*/}
                {/*    }*/}
                {/*    />*/}
                {/*    <Route*/}
                {/*        path="/sign-up"*/}
                {/*        element={*/}
                {/*            loggedIn ? */}
                {/*                <Register /> :*/}
                {/*                <Navigate to="/sign-in" replace />*/}
                {/*        }*/}
                {/*    />*/}
                {/*    <Route*/}
                {/*        path="/sign-in"*/}
                {/*        element={<Login />}*/}
                {/*    />*/}
                {/*</Routes>*/}

                <Footer />
                <EditProfilePopup isOpen={isEditProfilePopupOpen ? "popup_opened" : ""} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
                <AddPlacePopup isOpen={isAddPlacePopupOpen ? "popup_opened" : ""} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
                <EditAvatarPopup isOpen={isEditAvatarPopupOpen ? "popup_opened" : ""} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
                <PopupWithForm name="confirm" title="Вы уверены?" text="Да" />
                <ImagePopup onClose={closeAllPopups} card={selectedCard} isOpen={isCardPopupOpen ? "popup_opened" : ""}/>
            </div>
        </CurrentUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
