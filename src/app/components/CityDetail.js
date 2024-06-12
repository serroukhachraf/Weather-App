import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import "leaflet/dist/leaflet.css";

// Importer Leaflet uniquement côté client
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const CityDetail = () => {
  const router = useRouter();
  const { cityId } = router.query; // Utilisez cityId au lieu de city
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Router query:", router.query);
    if (cityId) {
      console.log(`Fetching weather data for city: ${cityId}`);
      fetchWeatherData(cityId);
    } else {
      console.log("City is undefined or null");
    }
  }, [cityId, router.query]);

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
      setError(null);
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

  const { coord, name, weather, main, wind, sys } = weatherData;

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Row className="w-100">
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>{name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {sys.country}
              </Card.Subtitle>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Temperature:</strong> {main.temp}°C
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Condition:</strong> {weather[0].description}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Humidity:</strong> {main.humidity}%
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Wind Speed:</strong> {wind.speed} m/s
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Pressure:</strong> {main.pressure} hPa
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Body>
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
