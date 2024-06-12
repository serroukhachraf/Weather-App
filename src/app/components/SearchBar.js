import React, { useState } from "react";
import Autosuggest from "react-autosuggest";
import { Form, InputGroup, Alert } from "react-bootstrap";
import axios from "axios";
import styles from "../styles/SearchBar.module.css";

// Utilisez 'shadowx' comme nom d'utilisateur Geonames vérifié
const USERNAME = "shadowx";

const getSuggestions = async (value) => {
  if (value.length < 3) {
    return [];
  }

  try {
    const response = await axios.get(
      `http://api.geonames.org/searchJSON?name_startsWith=${value}&maxRows=5&username=${USERNAME}`
    );

    if (response.data && response.data.geonames) {
      return response.data.geonames.map((geo) => ({
        name: geo.name,
        country: geo.countryName,
      }));
    } else {
      console.error("Invalid response structure:", response.data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    throw error;
  }
};

const SearchBar = ({ addCity }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e, { newValue }) => {
    setCity(newValue);
  };

  const onSuggestionsFetchRequested = async ({ value }) => {
    try {
      const fetchedSuggestions = await getSuggestions(value);
      setSuggestions(fetchedSuggestions);
      setError(null); // Clear any previous error
    } catch (error) {
      setError(
        "An error occurred while fetching suggestions. Please check your network connection."
      );
    }
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    addCity(suggestion.name);
    setCity("");
  };

  const renderSuggestion = (suggestion) => (
    <div className={styles.suggestion}>
      {suggestion.name}, {suggestion.country}
    </div>
  );

  const inputProps = {
    placeholder: "Add a new city",
    value: city,
    onChange: handleInputChange,
    className: "form-control", // Ajoutez la classe Bootstrap pour le champ de formulaire
  };

  return (
    <div>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
        <InputGroup>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={onSuggestionsFetchRequested}
            onSuggestionsClearRequested={onSuggestionsClearRequested}
            getSuggestionValue={(suggestion) => suggestion.name}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            onSuggestionSelected={onSuggestionSelected}
            theme={{
              container: styles.autosuggestContainer,
              containerOpen: styles.autosuggestContainerOpen,
              input: "form-control", // Appliquez la classe Bootstrap
              suggestionsContainer: styles.suggestionsContainer,
              suggestionsList: styles.suggestionsList,
              suggestion: styles.suggestionItem,
              suggestionHighlighted: styles.suggestionItemHighlighted,
            }}
          />
        </InputGroup>
      </Form>
    </div>
  );
};

export default SearchBar;
