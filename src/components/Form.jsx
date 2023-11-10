// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Form.module.css";
import Button from "./Button";
import BackButton from "./BackButton";
import { useCustomUrl } from "../hooks/useCustomUrl";
import Message from "./Message";
import Spinner from "./Spinner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCities } from "../contexts/CitiesContext";
const BASE_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const navigate = useNavigate();
  const [isGeoLoading, setisGeoLoading] = useState(false);
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [latQuery, lngQuery] = useCustomUrl();
  const [emoji, setemoji] = useState("");
  const [geoCodingError, setGeoCodingError] = useState("");

  const { createCity, isLoading: isLoadingAddCity } = useCities();
  useEffect(() => {
    if (!latQuery && !lngQuery) return;

    async function fetchCityData() {
      try {
        setGeoCodingError("");
        setisGeoLoading(true);
        const response = await fetch(
          `${BASE_URL}?latitude=${latQuery}&longitude=${lngQuery}`
        );
        const data = await response.json();
        if (!data.countryCode)
          throw new Error(
            "That does not seem to be a country! Please click somewhere else"
          );
        setCityName(data.ciry || data.locality || "");
        setCountry(data.countryName);
        setemoji(data.countryCode);
        console.log(data);
      } catch (err) {
        setGeoCodingError(err.message);
        console.error(err);
      } finally {
        setisGeoLoading(false);
      }
    }
    fetchCityData();
  }, [latQuery, lngQuery]);
  if (!latQuery && !lngQuery)
    return (
      <Message message="Start by clicking somewhere on the map !🤔"></Message>
    );
  if (isGeoLoading) return <Spinner></Spinner>;
  if (geoCodingError) return <Message message={geoCodingError}></Message>;

  async function handleSubmit(e) {
    debugger;
    e.preventDefault();
    if (!cityName || !date) return;
    const newCity = {
      cityName,
      country,
      date,
      notes,
      position: { lat: latQuery, lng: lngQuery },
      emoji,
    };
    await createCity(newCity);
    navigate("/app/cities");
  }

  return (
    <form
      className={`${styles.form} ${isLoadingAddCity ? styles.loading : ""}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          id="date"
          dateFormat="dd/MM/yyyy"
          selected={date}
          onChange={(date) => setDate(date)}
        ></DatePicker>
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type="primary">Add</Button>
        <BackButton></BackButton>
      </div>
    </form>
  );
}

export default Form;
