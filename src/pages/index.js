import React, { useState, useEffect } from "react";
import axios from "axios";
import CityCard from "../app/components/CityCard";
import SearchBar from "../app/components/SearchBar";
import { Container, Row, Col, Navbar, Alert } from "react-bootstrap";
import "../app/styles/main.css";

const predefinedCities = ["Paris", "New York", "Tokyo", "London", "Berlin"];

export default function Home() {
  const [cities, setCities] = useState(predefinedCities);
  const [weatherData, setWeatherData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    cities.forEach((city) => {
      fetchWeatherData(city);
    });
  }, [cities]);

  const fetchWeatherData = async (city) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      setWeatherData((prevData) => ({
        ...prevData,
        [city]: response.data,
      }));
      setError(null);
    } catch (error) {
      setError(
        `An error occurred while fetching the weather data for ${city}. Please check your network connection.`
      );
    }
  };

  const addCity = (city) => {
    setCities([...cities, city]);
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" sticky="top" className="px-3">
        <Container fluid>
          <Navbar.Brand className="fw-bold fs-3" href="#">
            Weather-App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <SearchBar addCity={addCity} setError={setError} />
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        {error && <Alert variant="danger">{error}</Alert>}
        <Row className="my-5">
          {cities.map((city) => (
            <Col key={city} xs={12} sm={6} md={4} className="mb-4">
              <CityCard city={city} weather={weatherData[city]} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
