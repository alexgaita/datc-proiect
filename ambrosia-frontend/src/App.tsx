import { BrowserRouter, Route, Switch } from "react-router-dom";
import { MapPage } from "./MapPage";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" />
        <Route path="/map">
          <MapPage />
        </Route>
        <Route path="">
          <MapPage />
        </Route>
        <Route path="/admin" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
