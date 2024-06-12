import React, { useState, useEffect } from "react";
import axios from "axios";
import CityCard from "../app/components/CityCard";
import SearchBar from "../app/components/SearchBar";
import { Container, Row, Col, Navbar } from "react-bootstrap";
import "../app/styles/main.css";

const predefinedCities = ["Paris", "New York", "Tokyo", "London", "Berlin"];

export default function Home() {
  const [cities, setCities] = useState(predefinedCities);
  const [weatherData, setWeatherData] = useState({});

  useEffect(() => {
    cities.forEach((city) => {
      fetchWeatherData(city);
    });
  }, [cities]);

  const fetchWeatherData = async (city) => {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    setWeatherData((prevData) => ({
      ...prevData,
      [city]: response.data,
    }));
  };

  const addCity = (city) => {
    setCities([...cities, city]);
  };

  return (
    <div>
      <Navbar bg="light" expand="lg" className="mb-4 w-100">
        <Container fluid>
          <Navbar.Brand className="fw-bold fs-3">Weather-App</Navbar.Brand>
          <SearchBar addCity={addCity} />
        </Container>
      </Navbar>
      <Container>
        <Row>
          {cities.map((city) => (
            <Col key={city} md={4}>
              <CityCard city={city} weather={weatherData[city]} />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}
