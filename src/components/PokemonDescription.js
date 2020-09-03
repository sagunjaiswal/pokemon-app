import React, { useState, useEffect } from "react";
import { TYPE_COLORS } from "./TypeColors";
import axios from "axios";

export default function Pokemon(props) {
  const [name, setName] = useState("");
  const [pokemonIndex, setPokemonIndex] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [types, setTypes] = useState([]);
  const [description, setDescription] = useState("");
  const [statTitleWidth, setStatTitleWidth] = useState(3);
  const [statBarWidth, setStatBarWidth] = useState(9);
  const [stats, setStats] = useState({
    hp: "",
    attack: "",
    defense: "",
    speed: "",
    specialAttack: "",
    specialDefense: "",
  });
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [eggGroups, setEggGroups] = useState("");
  const [catchRate, setCatchRate] = useState("");
  const [abilities, setAbilities] = useState("");
  const [genderRatioMale, setGenderRationMale] = useState("");
  const [genderRatioFemale, setGenderRatioFemale] = useState("");
  const [evs, setEvs] = useState("");
  const [hatchSteps, setHatchSteps] = useState("");
  const [themeColor, setThemeColor] = useState("#EF5350");

  useEffect(() => {
    const { pokemonIndex } = props.match.params;

    // Urls for pokemon information
    const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
    const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

    axios.get(pokemonUrl).then((pokemonRes) => {
      const name = pokemonRes.data.name;
      const imageUrl = pokemonRes.data.sprites.front_default;

      let { hp, attack, defense, speed, specialAttack, specialDefense } = "";

      pokemonRes.data.stats.map((stat) => {
        switch (stat.stat.name) {
          case "hp":
            hp = stat["base_stat"];
            break;
          case "attack":
            attack = stat["base_stat"];
            break;
          case "defense":
            defense = stat["base_stat"];
            break;
          case "speed":
            speed = stat["base_stat"];
            break;
          case "special-attack":
            specialAttack = stat["base_stat"];
            break;
          case "special-defense":
            specialDefense = stat["base_stat"];
            break;
          default:
            break;
        }
      });
      // Convert Decimeters to Feet... The + 0.0001 * 100 ) / 100 is for rounding to two decimal places :)
      const height =
        Math.round((pokemonRes.data.height * 0.328084 + 0.00001) * 100) / 100;

      const weight =
        Math.round((pokemonRes.data.weight * 0.220462 + 0.00001) * 100) / 100;

      const types = pokemonRes.data.types.map((type) => type.type.name);

      const themeColor = `${TYPE_COLORS[types[types.length - 1]]}`;

      const abilities = pokemonRes.data.abilities
        .map((ability) => {
          return ability.ability.name
            .toLowerCase()
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ");
        })
        .join(", ");

      const evs = pokemonRes.data.stats
        .filter((stat) => {
          if (stat.effort > 0) {
            return true;
          }
          return false;
        })
        .map((stat) => {
          return `${stat.effort} ${stat.stat.name
            .toLowerCase()
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(" ")}`;
        })
        .join(", ");

      // Get Pokemon Description .... Is from a different end point uggh
      axios.get(pokemonSpeciesUrl).then((res) => {
        let description = "";
        res.data.flavor_text_entries.some((flavor) => {
          if (flavor.language.name === "en") {
            description = flavor.flavor_text;
            return;
          }
        });
        const femaleRate = res.data["gender_rate"];
        const genderRatioFemale = 12.5 * femaleRate;
        const genderRatioMale = 12.5 * (8 - femaleRate);

        const catchRate = Math.round((100 / 255) * res.data["capture_rate"]);

        const eggGroups = res.data["egg_groups"]
          .map((group) => {
            return group.name
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ");
          })
          .join(", ");

        const hatchSteps = 255 * (res.data["hatch_counter"] + 1);
        setDescription(description);
        setGenderRatioFemale(genderRatioFemale);
        setGenderRationMale(genderRatioMale);
        setCatchRate(catchRate);
        setEggGroups(eggGroups);
        setHatchSteps(hatchSteps);
      });
      setImageUrl(imageUrl);
      setPokemonIndex(pokemonIndex);
      setName(name);
      setTypes(types);
      setStats({
        hp,
        attack,
        defense,
        speed,
        specialAttack,
        specialDefense,
      });
      setThemeColor(themeColor);
      setHeight(height);
      setWeight(weight);
      setAbilities(abilities);
      setEvs(evs);
    }, []);
  });
  return (
    <div className="col">
      <div
        className="card"
        style={{
          border: "5px solid red",
          backgroundColor: "#f7e8e8",
        }}
      >
        <div className="card-header">
          <h4 className="mx-auto" style={{ textAlign: "center" }}>
            {name
              .toLowerCase()
              .split(" ")
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(" ")}
          </h4>
        </div>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="row mt-1">
              <div className="col">
                <p className="">{description}</p>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-6">
                      <h6 className="float-right">Catch Rate:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{catchRate}%</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Height:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{height} ft.</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Weight:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{weight} lbs</h6>
                    </div>

                    <div className="col-6">
                      <h6 className="float-right">Gender Ratio:</h6>
                    </div>
                    <div className="col-6">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${genderRatioFemale}%`,
                            backgroundColor: "#c2185b",
                          }}
                          aria-valuenow="15"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{genderRatioFemale}</small>
                        </div>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${genderRatioMale}%`,
                            backgroundColor: "#1976d2",
                          }}
                          aria-valuenow="30"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        >
                          <small>{genderRatioMale}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-6">
                      <h6 className="float-right">Abilities:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{abilities}</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Hatch Steps:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{hatchSteps}</h6>
                    </div>

                    <div className="col-6">
                      <h6 className="float-right">EVs:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{evs}</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-right">Egg Groups:</h6>
                    </div>
                    <div className="col-6">
                      <h6 className="float-left">{eggGroups} </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" col-md-3 ">
              <div className="float-right">
                {types.map((type) => (
                  <span
                    key={type}
                    className="badge badge-pill mr-1"
                    style={{
                      backgroundColor: `#${TYPE_COLORS[type]}`,
                      color: "white",
                    }}
                  >
                    {type
                      .toLowerCase()
                      .split(" ")
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(" ")}
                  </span>
                ))}
              </div>
              <img
                src={imageUrl}
                className="card-img-top rounded mx-auto mt-2"
              />
            </div>
            <div className="col-md-9">
              <div className="row align-items-center">
                <div className={`col-12 col-md-${statTitleWidth}`}>Attack</div>
                <div className={`col-12 col-md-${statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${stats.attack}%`,
                        backgroundColor: `#${themeColor}`,
                      }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{stats.attack}</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row align-items-center">
                <div className={`col-12 col-md-${statTitleWidth}`}>Defense</div>
                <div className={`col-12 col-md-${statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar "
                      role="progressbar"
                      style={{
                        width: `${stats.defense}%`,
                        backgroundColor: `#${themeColor}`,
                      }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{stats.defense}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${statTitleWidth}`}>Speed</div>
                <div className={`col-12 col-md-${statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar"
                      role="progressbar"
                      style={{
                        width: `${stats.speed}%`,
                        backgroundColor: `#${themeColor}`,
                      }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{stats.speed}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${statTitleWidth}`}>HP</div>
                <div className={`col-12 col-md-${statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar "
                      role="progressbar"
                      style={{
                        width: `${stats.hp}%`,
                        backgroundColor: `#${themeColor}`,
                      }}
                      aria-valuenow="25"
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{stats.hp}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${statTitleWidth}`}>Sp Atk</div>
                <div className={`col-12 col-md-${statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar "
                      role="progressbar"
                      style={{
                        width: `${stats.specialAttack}%`,
                        backgroundColor: `#${themeColor}`,
                      }}
                      aria-valuenow={stats.specialAttack}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{stats.specialAttack}</small>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className={`col-12 col-md-${statTitleWidth}`}>Sp Def</div>
                <div className={`col-12 col-md-${statBarWidth}`}>
                  <div className="progress">
                    <div
                      className="progress-bar "
                      role="progressbar"
                      style={{
                        width: `${stats.specialDefense}%`,
                        backgroundColor: `#${themeColor}`,
                      }}
                      aria-valuenow={stats.specialDefense}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      <small>{stats.specialDefense}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
