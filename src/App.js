
import './App.css';
import { ReactKeycloakProvider } from '@react-keycloak/web'

import keycloak from './keycloak'


function App() {

  return (
    <ReactKeycloakProvider authClient={keycloak}>
    <div className="App">
      <header className="App-header">
        <h1>Hello</h1>
      </header>
    </div>
    </ReactKeycloakProvider>
  );
}

export default App;
