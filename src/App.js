import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/layout";
import { routes } from "./routes";
import { UserContext } from "./stores/userContext";
import MainProvider from "./providers/mainProvider";
import Modal from "./components/modal/modal";

function App() {
  return (
    <UserContext>
      <MainProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              {routes}
            </Route>
          </Routes>
        </BrowserRouter>
        <Modal/>
      </MainProvider>
    </UserContext>
  );
}

export default App;