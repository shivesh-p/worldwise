/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";
const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

export default function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const { cityName, emoji, date, id, position } = city;
  async function handleDeleteCity(e) {
    e.preventDefault();
    await deleteCity(id);
  }
  return (
    <li>
      <NavLink
        className={`${styles.cityItem} ${
          id == currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button onClick={handleDeleteCity} className={styles.deleteBtn}>
          &times;
        </button>
      </NavLink>
    </li>
  );
}
