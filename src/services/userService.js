import { ReactKeycloakProvider } from '@react-keycloak/web';
// import React, { useState } from 'react'
import { KC_REALM,KC_URL,KC_CLIENT } from '../utils/service';
import Keycloak from "keycloak-js";
import {jwtDecode} from 'jwt-decode';
import useUser from '../stores/useUser';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const configKc = {
    realm: KC_REALM,
    url: KC_URL,
    clientId: KC_CLIENT
}

const _kc = new Keycloak(configKc)
const initConfig = {onLoad: 'login-required', checkLoginIframe: false}

function UserLogout() {
    _kc.logout();
}

function UserContextProvider({ children }) {
    const { setUserInfo } = useUser();

    const onKeycloakTokens = tokens => {
        const token = tokens.token;
        const idToken = tokens.idToken;
        const refreshToken = tokens.refreshToken;
        const decodedToken = jwtDecode(token);
        const loaded = token && idToken && refreshToken ? true : false

        setUserInfo({
            token: token,
            idToken: idToken,
            refreshToken: refreshToken,
            userName: decodedToken.preferred_username,
            roles: decodedToken.scope,
            isLoaded: loaded
        })
    };

    return (
        <ReactKeycloakProvider
            initOptions={initConfig}
            authClient={_kc}
            onTokens={onKeycloakTokens}
        >
            {children}
        </ ReactKeycloakProvider >
    );
}

export {UserContextProvider, UserLogout};