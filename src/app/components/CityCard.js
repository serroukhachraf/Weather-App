import React from "react";
import Link from "next/link";
import { Card } from "react-bootstrap";
import { getWeatherIcon } from "../utils/weatherIcons";
import styles from "../styles/CityCard.module.css";

const CityCard = ({ city, weather }) => {
  if (!weather) return null;

  const weatherIcon = getWeatherIcon(weather.weather[0].icon);

  return (
    <Card className="text-center m-3" style={{ width: "18rem" }}>
      <Card.Body>
        <Card.Title>{city}</Card.Title>
        <img
          src={weatherIcon}
          alt={weather.weather[0].description}
          className={styles.weatherIcon}
        />
        <Card.Text>
          Temperature: {weather.main.temp}°C <br />
          Condition: {weather.weather[0].description}
        </Card.Text>
        <Link href={`/city/${city}`} passHref legacyBehavior>
          <a className="btn btn-primary">More details</a>
        </Link>
      </Card.Body>
    </Card>
  );
};

export default CityCard;
