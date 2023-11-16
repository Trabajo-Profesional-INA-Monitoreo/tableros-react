import { ReactKeycloakProvider } from '@react-keycloak/web';
import Keycloak from "keycloak-js";

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const _kc = new Keycloak('/keycloak.json')
const initConfig = {onLoad: 'login-required', checkLoginIframe: false}

const doLogin = _kc.login;

const doLogout = _kc.logout;

const getToken = () => _kc.token;

const getTokenParsed = () => _kc.tokenParsed;

const isLoggedIn = () => _kc.authenticated;

const updateToken = (successCallback) =>
  _kc.updateToken(5)
    .then(successCallback)
    .catch(doLogin);

const getUsername = () => _kc.tokenParsed?.preferred_username



function UserContextProvider({ children }) {
    return (
        <ReactKeycloakProvider
            initOptions={initConfig}
            authClient={_kc}
        >
            {children}
        </ ReactKeycloakProvider >
    );
}


const UserService = {
  doLogin,
  doLogout,
  isLoggedIn,
  getToken,
  getTokenParsed,
  updateToken,
  getUsername,
};

export {UserContextProvider, UserService};