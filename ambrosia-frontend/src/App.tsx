import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MapPage } from "./MapPage";
import { Login } from "./Login";
import AdminPage from "./AdminPage";

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(true);

  useEffect(() => {
    const isLoggedInAsAdmin = localStorage.getItem("isAdmin");
    setIsAdmin(
      isLoggedInAsAdmin === "true"
        ? true
        : isLoggedInAsAdmin === "false"
          ? false
          : null,
    );
  }, []);

  const renderRoutes = () => {
    if (isAdmin === null) {
      return <Login />;
    }

    if (isAdmin === false) {
      return <MapPage isAdmin={isAdmin} />;
    }

    return (
      <Switch>
        <Route path="/map">
          <MapPage isAdmin={isAdmin} />
        </Route>
        <Route path="/admin">
          <AdminPage />
        </Route>
      </Switch>
    );
  };

  return <BrowserRouter>{renderRoutes()}</BrowserRouter>;
}

export default App;
