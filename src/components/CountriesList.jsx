/* eslint-disable react/prop-types */
import CountryItem from "./CountryItem";
import styles from "./CountryList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
export default function CountriesList({ cities, isLoading }) {
  if (isLoading) return <Spinner />;
  if (!cities.length) {
    return (
      <Message message="Add your cities by clicking on a city on the map !" />
    );
  }

  const countries = cities.reduce((arr, city) => {
    if (!arr.map((el) => el.country).includes(city.country))
      return [...arr, { country: city.country, emoji: city.emoji }];
    else return arr;
  }, []);

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => {
        return <CountryItem country={country} key={country.country} />;
      })}
    </ul>
  );
}