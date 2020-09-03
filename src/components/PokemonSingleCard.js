import React, { useState, useEffect } from "react";
import styled from "styled-components";
import spinner from "../images/spinner.gif";
import { Link } from "react-router-dom";

function PokemonSingleCard(props) {
  const [name, setName] = useState("");
  const [imageUrl, setimageUrl] = useState("");
  const [pokemonIndex, setPokemonIndex] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [tooManyRequests, setTooManyRequests] = useState(false);

  useEffect(() => {
    const { name, url } = props;
    const pokemonIndex = url.split("/")[url.split("/").length - 2];
    const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;

    setName(name);
    setimageUrl(url);
    setPokemonIndex(pokemonIndex);
    setimageUrl(imageUrl);
  }, []);

  return (
    <div className="col-md-2 col-sm-6 mb-4">
      <StyledLink to={`pokemon/${pokemonIndex}`}>
        <Card className="card">
          {imageLoading ? (
            <img
              src={spinner}
              style={{ width: "5em", height: "5em" }}
              className="card-img-top rounded mx-auto d-block mt-2"
            />
          ) : null}
          <Avatar
            className="card-img-top rounded mx-auto mt-2"
            onLoad={() => setImageLoading(false)}
            src={imageUrl}
            style={
              tooManyRequests
                ? { display: "none" }
                : imageLoading
                ? null
                : { display: "block" }
            }
          />
          {tooManyRequests ? (
            <h6 className="mx-auto">
              <span className="badge badge-danger mt-2">Too Many requests</span>
            </h6>
          ) : null}
          <div className="card-body mx-auto">
            <h6 className="card-title">
              {name
                .toLowerCase()
                .split(" ")
                .map(
                  (letter) =>
                    letter.charAt(0).toUpperCase() + letter.substring(1)
                )
                .join(" ")}
            </h6>
          </div>
        </Card>
      </StyledLink>
    </div>
  );
}

const Avatar = styled.img`
  width: 5em;
  height: 5em;
  display: none;
`;

const Card = styled.div`
  opacity: 0.95;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
  -moz-user-select: none;
  -website-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -o-user-select: none;
  border: 5px solid red;
  background-color: #f7e8e8;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

export default React.memo(PokemonSingleCard);
