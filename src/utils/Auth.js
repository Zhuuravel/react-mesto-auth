export const BASE_URL = 'https://auth.nomoreparties.co';

const getJson = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

export const register = (password, email) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({password, email})
    })
        .then(getJson);
};

export const authorize = (password, email) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({password, email})
    })
        .then(getJson)
        .then((data) => {
            if (data.token){
                localStorage.setItem('jwt', data.token);
                return data;
            }
        })
};

export const checkToken = (myJwt) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${myJwt}`
        }
    })
        .then(getJson)
        .then((res) => res)
}