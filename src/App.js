import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import { routes } from "./routes";
import { UserContextProvider } from "./services/userService"
import { UserContext } from "./stores/userContext";

function App() {
  return (
    <UserContext>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {routes}
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </UserContext>
  );
}

export default App;