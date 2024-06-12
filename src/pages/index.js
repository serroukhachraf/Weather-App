import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icons issue with React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const CityDetail = () => {
  const router = useRouter();
  const { city } = router.query;
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (city) {
      console.log(`Fetching weather data for city: ${city}`);
      fetchWeatherData(city);
    } else {
      console.log("City is undefined or null");
    }
  }, [city]);

  const fetchWeatherData = async (city) => {
    try {
      setLoading(true);
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      console.log(`Using API key: ${apiKey}`);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
      );
      console.log("Weather data fetched:", response.data);
      setWeatherData(response.data);
      setLoading(false);
      setError(null); // Clear any previous error
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(
        "An error occurred while fetching the weather data. Please check your network connection."
      );
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!weatherData) {
    return <p className="text-center my-5">Loading...</p>;
  }

  const { coord, name, weather, main } = weatherData;

  return (
    <Container>
      <Row className="my-5">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Text>
                Temperature: {main.temp}°C <br />
                Condition: {weather[0].description}
              </Card.Text>
              <MapContainer
                center={[coord.lat, coord.lon]}
                zoom={13}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[coord.lat, coord.lon]}>
                  <Popup>{name}</Popup>
                </Marker>
              </MapContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CityDetail;
