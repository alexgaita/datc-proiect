import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MapPage } from "./MapPage";
import { Login } from "./Login";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/map">
          <MapPage />
        </Route>
        <Route path="">
          <MapPage />
        </Route>
        <Route path="/admin">
          <div></div>
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
