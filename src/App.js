import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Container from "./components/Container";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PokemonDetails from "./components/PokemonDescription";
import PokemonList from "./components/PokemonList";

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Switch>
            <Route exact path="/" component={PokemonList} />
            <Route
              exact
              path="/pokemon/:pokemonIndex"
              component={PokemonDetails}
            />
            <Container />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
