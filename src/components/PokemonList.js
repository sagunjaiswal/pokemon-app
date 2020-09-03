import React, { useState, useEffect, useCallback } from "react";
import PokemonSingleCard from "./PokemonSingleCard";
import Heading from "./Heading";
import axios from "axios";

function PokemonList() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=500";
  const [pokemon, setPokemon] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filteredPokemon, setFilteredPokemon] = useState([]);

  const submitHandler = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
  };

  const axiosCall = useCallback(() => {
    axios
      .get(url)
      .then((res) => {
        setPokemon(res.data.results);
        if (searchInput != "") {
          let newPokeList = [];
          newPokeList = pokemon.filter((poke) => {
            if (poke.name.toLowerCase().includes(searchInput.toLowerCase())) {
              return poke;
            }
          });
          setFilteredPokemon(newPokeList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [filteredPokemon, searchInput, pokemon]);
  useEffect(() => {
    axiosCall();
  }, [axiosCall]);
  return (
    <>
      <Heading />
      <form onSubmit={(e) => submitHandler(e)}>
        <input
          className="search-bar"
          type="text"
          placeholder="Search"
          onChange={(e) => setSearchInput(e.target.value)}
          required
        />
        <button onClick={(e) => submitHandler(e)} className="search-btn">
          🔍
        </button>
      </form>
      <div className="result-container">
        {searchInput != ""
          ? filteredPokemon.map((pokemon) => (
              <PokemonSingleCard
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
              />
            ))
          : pokemon.map((pokemon) => (
              <PokemonSingleCard
                key={pokemon.name}
                name={pokemon.name}
                url={pokemon.url}
              />
            ))}
      </div>
    </>
  );
}

export default React.memo(PokemonList);
