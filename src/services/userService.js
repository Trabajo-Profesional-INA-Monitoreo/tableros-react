import { ReactKeycloakProvider } from '@react-keycloak/web';
// import React, { useState } from 'react'
import Keycloak from "keycloak-js";
import {jwtDecode} from 'jwt-decode';
import useUser from '../stores/useUser';

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const _kc = new Keycloak('/keycloak.json')
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

        console.log('Token: ', token)
        console.log('Name: ', decodedToken.preferred_username)
        console.log('Scope: ', decodedToken.scope)

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