import { useEffect, useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MapPage } from "./MapPage";
import { Login } from "./Login";
import AdminPage from "./AdminPage";
import useNewMap from "../src/MapPage/newMap";

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(true);
  const {handleMapLoad} = useNewMap();

  useEffect(() => {
    const isLoggedInAsAdmin = localStorage.getItem("isAdmin");
    setIsAdmin(isLoggedInAsAdmin === "true" ? true : isLoggedInAsAdmin === "false" ? false : null);

    const intervalId = setInterval(() => {
      const mapContainer = document.getElementById("map");
      if (mapContainer) {
        // Container with id "map" is rendered
        clearInterval(intervalId);
        // Perform any actions you need here

        handleMapLoad();
      }
    }, 3000); // Check every 3 seconds

    return () => {
      clearInterval(intervalId); // Clean up the interval on component unmount
    };
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
        <Route path="/map2">
          <div id="map" style={{ height: "100vh", width: "100vw" }}></div>
        </Route>
      </Switch>
    );
  };

  return (
    <BrowserRouter>
      {renderRoutes()}
    </BrowserRouter>
  );
}

export default App;
